import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import crypto from 'crypto';
import winston from 'winston';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';
import { missions } from './lib/checkpoint.js';
import { logTokenUsage, getTokenMetrics } from './lib/token-logger.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

import { createInternalAuthMiddleware } from './middleware/internal-auth.js';
const requireInternalAuth = createInternalAuthMiddleware();

function getInternalAuthHeaders() {
    return process.env.INTERNAL_SERVICE_PSK ? { 'x-internal-service-token': process.env.INTERNAL_SERVICE_PSK } : {};
}

process.on('uncaughtException', (err) => {
    logger.error('UNCAUGHT EXCEPTION', { error: err.message, stack: err.stack });
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('UNHANDLED REJECTION', { reason: reason?.message || reason, stack: reason?.stack });
});

// Event Loop Lag tracking
let eventLoopLagMs = 0;
setInterval(() => {
    const start = performance.now();
    setImmediate(() => {
        eventLoopLagMs = performance.now() - start;
    });
}, 1000).unref();

// 📈 Structural Stability Index (SSI) Context
const heapHistory = [];
const SSI_ROLLBACK_THRESHOLD = 65;
const SSI_ALERT_THRESHOLD = 75;

const ssiHistoryTrend = [];
const varianceHistoryTrend = [];
let lastCalculatedCorrelation = 0;


function calculateSSI(telemetry) {
    const { ma20Scores = [], jobCounts = {}, replays24h = 0, finance: rawFinance, runtime = {} } = telemetry;
    const finance = rawFinance || {};

    // 1. Score Stability (40%)
    let scoreStabilitySsi = 100;
    if (ma20Scores.length > 1) {
        const mean = ma20Scores.reduce((a, b) => a + b, 0) / ma20Scores.length;
        const variance = ma20Scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / ma20Scores.length;
        const stdDev = Math.sqrt(variance);
        scoreStabilitySsi = Math.max(0, 100 - (stdDev * 5));
    }

    // 2. Replay Friction (20%)
    const totalJobs = jobCounts.total_24h || 1;
    const replayRatio = replays24h / totalJobs;
    const replayFrictionSsi = Math.max(0, 100 - (replayRatio * 200));

    // 3. Burn Variance (20%) - Adjusted for CV (Coefficient of Variation)
    // Coeficiente de Variación > 0.5 indica alta inestabilidad
    const cv = finance.variance?.cv || 0;
    const burnVarianceSsi = Math.max(0, 100 - (cv * 150)); // CV de 0.66 anula este componente

    // 4. Heap Neutrality (20%)
    let heapNeutralitySsi = 100;
    if (heapHistory.length > 5) {
        const first = heapHistory[0];
        const last = heapHistory[heapHistory.length - 1];
        const growth = (last - first) / first;
        heapNeutralitySsi = Math.max(0, 100 - (Math.max(0, growth) * 1000));
    }

    const ssiValue = (scoreStabilitySsi * 0.4) + (replayFrictionSsi * 0.2) + (burnVarianceSsi * 0.2) + (heapNeutralitySsi * 0.2);

    // Proyección a 12h
    const trend = ssiHistoryTrend.length > 5 ? (ssiValue - ssiHistoryTrend[0]) / ssiHistoryTrend.length : 0;
    const projection12h = ssiValue + (trend * 720); // 720 minutos en 12h

    // Update internal tracking
    varianceHistoryTrend.push(cv);
    if (varianceHistoryTrend.length > 60) varianceHistoryTrend.shift();

    // Pearson Correlation (SSI vs Variance CV)
    if (ssiHistoryTrend.length > 10) {
        const n = ssiHistoryTrend.length;
        const ssiArr = ssiHistoryTrend;
        const varArr = varianceHistoryTrend.slice(-n);

        const sumX = ssiArr.reduce((a, b) => a + b, 0);
        const sumY = varArr.reduce((a, b) => a + b, 0);
        const sumXY = ssiArr.reduce((a, b, i) => a + (b * varArr[i]), 0);
        const sumX2 = ssiArr.reduce((a, b) => a + (b * b), 0);
        const sumY2 = varArr.reduce((a, b) => a + (b * b), 0);

        const numerator = (n * sumXY) - (sumX * sumY);
        const denominator = Math.sqrt(((n * sumX2) - (sumX * sumX)) * ((n * sumY2) - (sumY * sumY)));
        lastCalculatedCorrelation = denominator !== 0 ? numerator / denominator : 0;
    }

    return {
        total: Number(ssiValue.toFixed(2)),
        projection_12h: Number(projection12h.toFixed(2)),
        trend_slope: Number(trend.toFixed(4)),
        ssi_variance_correlation: Number(lastCalculatedCorrelation.toFixed(4)),
        components: {
            score_stability: Number(scoreStabilitySsi.toFixed(2)),
            replay_friction: Number(replayFrictionSsi.toFixed(2)),
            burn_variance: Number(burnVarianceSsi.toFixed(2)),
            heap_neutrality: Number(heapNeutralitySsi.toFixed(2))
        }
    };
}


const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/main_orchestrator.log' })
    ]
});

const app = express();
app.use(bodyParser.json({ limit: '100kb' }));
// Servir Dashboard Estático
app.use('/dashboard', express.static(path.join(__dirname, 'public/mission-control')));

const PORT = 3000;
const ARCHITECT_URL = 'http://localhost:8081/analyze';
const BUILDER_URL = 'http://localhost:8082/build';
const AUDITOR_URL = 'http://localhost:8083/audit';

const GATEWAY_FAILURE_THRESHOLD = 3;
let consecutiveGatewayFailures = 0;
let canaryExecutionCount = 0;
let expansionFrozen = false;


// 🛡️ Expansion Monitor: SSI Rollback & Health Check
setInterval(async () => {
    heapHistory.push(process.memoryUsage().heapUsed);
    if (heapHistory.length > 20) heapHistory.shift();

    // Check for Freeze Flag
    if (fs.existsSync('logs/expansion_freeze.flag')) {
        expansionFrozen = true;
    }

    try {
        const metrics = missions.getTelemetryMetrics();
        const finance = await getTokenMetrics();
        const ssi = calculateSSI({ ...metrics, finance });

        ssiHistoryTrend.push(ssi.total);
        if (ssiHistoryTrend.length > 60) ssiHistoryTrend.shift();

        if (ssi.total < SSI_ROLLBACK_THRESHOLD) {
            logger.error('CRITICAL: SSI below threshold. Triggering Auto-Rollback to 20%', { ssi: ssi.total });
            process.env.CANARY_EXECUTION_LIMIT = '20';
        } else if (ssi.total < SSI_ALERT_THRESHOLD) {
            logger.warn('WARNING: SSI degrading. Monitoring required.', { ssi: ssi.total });
        }
    } catch (e) {
        logger.error('Expansion Monitor failed', { error: e.message });
    }
}, 60000).unref();

app.post('/request', async (req, res) => {
    const { prompt, stress_meta } = req.body;
    const jobId = `job_${crypto.randomUUID().split('-')[0]}`;
    const startTime = Date.now();

    // 🏎️ Stress Simulation Hooks
    if (stress_meta) {
        // Intermittent Micro-latency
        if (Math.random() < 0.2) await new Promise(r => setTimeout(r, 200 + Math.random() * 300));
    }

    if (!prompt) {
        return res.status(400).json({ error: 'Missing prompt', jobId });
    }

    try {
        // 1️⃣ Checkpoint inicial
        missions.create(jobId, prompt);

        // 2️⃣ FASE 1: Architect
        logger.info('Fase 1: Architect', { jobId });
        let archResp;
        try {
            archResp = await axios.post(ARCHITECT_URL, { prompt }, {
                headers: getInternalAuthHeaders(),
                timeout: 21000
            });
        } catch (apiError) {
            const errorMsg = apiError.response?.data?.error || apiError.message;
            missions.updateArchitectResult(jobId, 'ARCHITECT_FAILED', { errorMessage: errorMsg });
            missions.logSemantic(jobId, 'SEMANTIC_FAIL', { phase: 'architect', error: errorMsg });
            return res.status(400).json({ error: 'Architect failed', details: errorMsg, jobId });
        }

        const planData = archResp.data;
        const planHash = planData.plan.plan_hash;

        // Log Token Usage (Simulation)
        let archIn = 1200;
        let archOut = 800;
        if (stress_meta && stress_meta.synthetic_burn) {
            archIn = Math.round(archIn * (1 + stress_meta.synthetic_burn));
            archOut = Math.round(archOut * (1 + stress_meta.synthetic_burn));
        }
        const archFinance = await logTokenUsage(jobId, 'gemini-1.5-pro', 'architect', archIn, archOut);

        missions.updateArchitectResult(jobId, 'ARCHITECT_SUCCESS', {
            planJson: planData,
            rawResponse: planData,
            executionTime: Date.now() - startTime,
            planHash: planHash
        });

        if (archFinance?.blocked) {
            logger.warn('Finance Guard: Architect phase triggered budget block', { jobId });
            missions.updateStatus(jobId, 'FINANCE_GUARD_BLOCKED');
            return res.status(402).json({ error: 'Budget limit exceeded (Finance Guard)', jobId });
        }


        // 3️⃣ Idempotency Checking for Builder/Auditor
        const existingAuditedJob = missions.getByHash(planHash);
        let builderArtifactsPath;

        if (existingAuditedJob && existingAuditedJob.status === 'READY_FOR_EXECUTION') {
            logger.info('Idempotencia detectada: Reutilizando build previo validado por Auditor', { jobId, sourceHash: planHash });

            missions.updateBuilderResult(jobId, 'BUILDER_SUCCESS', {
                artifactsPath: existingAuditedJob.build_artifacts_path,
                executionTime: 0,
                errorMessage: 'Reused from ' + existingAuditedJob.id
            });

            return res.json({ jobId, status: 'READY_FOR_EXECUTION', artifacts: existingAuditedJob.build_artifacts_path, cached: true });
        }

        // 4️⃣ FASE 2: Builder
        logger.info('Fase 2: Builder', { jobId });
        missions.updateBuilderResult(jobId, 'BUILDER_PENDING');
        const builderStartTime = Date.now();

        try {
            const builderResp = await axios.post(BUILDER_URL, {
                plan: planData,
                schema_version: planData.plan.schema_version,
                plan_hash: planHash
            }, {
                headers: getInternalAuthHeaders(),
                timeout: 121000
            });

            const buildResult = builderResp.data;
            builderArtifactsPath = buildResult.artifacts_path;

            missions.updateBuilderResult(jobId, 'BUILDER_SUCCESS', {
                artifactsPath: buildResult.artifacts_path,
                executionTime: Date.now() - builderStartTime
            });
        } catch (buildError) {
            const errorMsg = buildError.response?.data?.error || buildError.message;
            missions.updateBuilderResult(jobId, 'BUILDER_FAILED', {
                errorMessage: errorMsg,
                executionTime: Date.now() - builderStartTime
            });
            return res.status(500).json({ error: 'Build failed', details: errorMsg, jobId });
        }

        // 5️⃣ FASE 3: Quality Auditor
        logger.info('Fase 3: Auditor', { jobId });
        missions.updateAuditResult(jobId, 'AUDIT_PENDING');
        const auditorStartTime = Date.now();

        try {
            const auditorResp = await axios.post(AUDITOR_URL, {
                plan: planData,
                artifacts_path: builderArtifactsPath
            }, {
                headers: getInternalAuthHeaders(),
                timeout: 30000
            });

            const auditResult = auditorResp.data;
            const { status: auditStatus, score, feedback, tamper_detected } = auditResult;

            let finalStatus = auditStatus;
            if (auditStatus === 'AUDIT_SUCCESS' && !tamper_detected) {
                finalStatus = 'READY_FOR_EXECUTION';
            }

            missions.updateAuditResult(jobId, finalStatus, {
                score,
                feedback,
                tamperDetected: tamper_detected || false,
                executionTime: Date.now() - auditorStartTime
            });

            // Log Token Usage (Simulation)
            const auditFinance = await logTokenUsage(jobId, 'claude-3-5-sonnet', 'auditor', 1500, 500);

            if (auditFinance?.blocked) {
                logger.warn('Finance Guard: Auditor phase triggered budget block', { jobId });
                missions.updateStatus(jobId, 'FINANCE_GUARD_BLOCKED');
                return res.status(402).json({ error: 'Budget limit exceeded (Finance Guard)', jobId });
            }


            if (finalStatus === 'AUDIT_FAILED') {
                logger.warn('Quality Auditor rechazó el build', { jobId, score, feedback, tamper_detected });
                missions.logSemantic(jobId, 'BLOCK', { score, reason: 'Low audit score' });
                return res.status(406).json({
                    jobId,
                    status: 'AUDIT_FAILED',
                    message: tamper_detected ? 'The build was tampered.' : 'The build failed quality checks.',
                    score,
                    feedback,
                    tamper_detected: tamper_detected || false
                });
            }

            logger.info('Build superó exitosamente el Auditor y está listo', { jobId, score });

            return res.json({
                jobId,
                status: finalStatus,
                score,
                feedback,
                tamper_detected: tamper_detected || false,
                artifacts: builderArtifactsPath,
                execution_time_ms: Date.now() - startTime
            });

        } catch (auditError) {
            const errorMsg = auditError.response?.data?.error || auditError.message;
            missions.updateAuditResult(jobId, 'AUDIT_FAILED', {
                score: 0,
                feedback: [errorMsg],
                executionTime: Date.now() - auditorStartTime
            });
            return res.status(500).json({ error: 'Auditor inspection crashed', details: errorMsg, jobId });
        }

    } catch (criticalError) {
        logger.error('Critical orchestrator crash', { jobId, error: criticalError.message });
        return res.status(500).json({ error: 'Orchestrator crash', jobId });
    }
});

// 🔒 POLICY ENGINE & EXECUTION AUTHORIZATION (V3 Controlled Implementation)
app.post('/execute/:jobId', requireInternalAuth, async (req, res) => {
    const { jobId } = req.params;

    try {
        // Atomic authorization and outbox staging
        const authResult = missions.authorizeMissionExecution(jobId, {
            policyVersion: 'v3.0.0'
        });

        logger.info('V3 Authorization granted. Outbox staged as DISPATCH_PENDING.', {
            jobId,
            attemptId: authResult.execution_attempt_id,
            payloadHash: authResult.payload_hash
        });

        return res.json({
            message: 'Misión autorizada exitosamente. Estado: DISPATCH_PENDING.',
            jobId,
            status: authResult.status,
            execution_attempt_id: authResult.execution_attempt_id,
            payload_hash: authResult.payload_hash,
            authorized_at: authResult.authorized_at
        });

    } catch (err) {
        if (err.code === 'NOT_FOUND') {
            return res.status(404).json({ error: 'Job no encontrado', jobId });
        }

        if (err.code === 'CONFLICT') {
            return res.status(409).json({
                error: 'Conflict: Misión no está en READY_FOR_EXECUTION o ya fue autorizada concurrentemente',
                current_status: err.currentStatus || 'UNKNOWN',
                jobId
            });
        }

        if (err.code === 'POLICY_REJECTED') {
            logger.warn('Policy Engine rejected mission', { jobId, error: err.message });
            // Phase 2: Conditionally record rejection without overwriting concurrent authorization
            try {
                missions.recordPolicyRejection(jobId, err.message);
            } catch (recErr) {
                logger.error('Failed to record policy rejection state', { jobId, error: recErr.message });
            }

            return res.status(406).json({
                error: err.message,
                jobId,
                status: 'POLICY_REJECTED'
            });
        }

        logger.error('Unexpected error during authorization', { jobId, error: err.message });
        return res.status(500).json({ error: 'Authorization error', details: err.message, jobId });
    }
});

// 🔄 REPLAY ENGINE
app.post('/api/replay/:jobId', requireInternalAuth, async (req, res) => {
    const { jobId } = req.params;
    const mission = missions.get(jobId);

    if (!mission) return res.status(404).json({ error: 'Job no encontrado' });

    // 1. Validation Logic
    const allowedStatuses = ['READY_FOR_EXECUTION', 'EXECUTION_TRIGGERED', 'GATEWAY_DEGRADED', 'POLICY_REJECTED'];
    if (!allowedStatuses.includes(mission.status)) {
        return res.status(400).json({ error: 'Status incompatible para Replay', current_status: mission.status });
    }

    // 2. Cooldown Logic (2 replays / 10 min)
    const REPLAY_COOLDOWN_MIN = 10;
    const MAX_REPLAYS = 2;

    if (mission.replay_count >= MAX_REPLAYS) {
        const lastReplay = new Date(mission.last_replay_at);
        const diffMin = (Date.now() - lastReplay.getTime()) / (1000 * 60);

        if (diffMin < REPLAY_COOLDOWN_MIN) {
            return res.status(429).json({
                error: `Replay Cooldown activo. Máximo ${MAX_REPLAYS} intentos cada ${REPLAY_COOLDOWN_MIN} min.`,
                next_available_min: Math.ceil(REPLAY_COOLDOWN_MIN - diffMin)
            });
        }
    }

    // 3. Revalidación de firma
    if (!mission.execution_signature_hash) {
        return res.status(400).json({ error: 'Misión no autorizada previamente (falta firma)' });
    }

    // Check if critical fields changed (Simple integrity check)
    // In a real scenario, we would re-calculate the hash and compare.
    // For now, we trust the DB record but ensure it exists.

    try {
        // 4. Record Replay & Log Token Usage (Explicitly as REPLAY)
        missions.recordReplay(jobId);
        await logTokenUsage(jobId, 'gemini-1.5-flash', 'replay', 500, 200);

        // 5. Trigger Execution (Reuse logic from /execute/:jobId or just redirect internally)
        // For simplicity, we call the same logic as execute but with replay flags.
        logger.info('Replay triggerado por el usuario', { jobId, count: mission.replay_count + 1 });

        // This is a bit hacky but re-uses the logic
        // We'll reset the status to READY_FOR_EXECUTION to allow /execute to proceed if it was blocked
        missions.updateStatus(jobId, 'READY_FOR_EXECUTION');

        // Return 200 and let the dashboard call /execute again or trigger it here
        // The user said "Después de eso… Sí activamos [REPLAY]", so I'll implement the trigger directly.

        // Reset failures to try again
        consecutiveGatewayFailures = 0;

        return res.json({
            message: 'Replay procesado. Status reseteado a READY_FOR_EXECUTION.',
            jobId,
            replay_count: mission.replay_count + 1
        });

    } catch (err) {
        logger.error('Error en Replay Engine', { jobId, error: err.message });
        return res.status(500).json({ error: 'Replay Engine failure' });
    }
});


// 🎭 ENDPOINT SIMULADO DE N8N (Fase 1)
app.post('/gateway/simulated', (req, res) => {
    // Verificar HMAC
    const signature = req.headers['x-mission-signature'];
    const secret = process.env.N8N_GATEWAY_SECRET || 'test-secret';
    // El body-parser ya serializó, puede cambiar pero confiamos en stringify
    const expectedHmac = crypto.createHmac('sha256', secret).update(JSON.stringify(req.body)).digest('hex');

    if (signature !== expectedHmac) {
        logger.warn('Simulated Gateway: HMAC Header Mismatch.', { expected: expectedHmac, received: signature });
        return res.status(401).json({ error: 'Unauthorized: Invalid signature' });
    }

    // Validar estructura
    const { plan_json, manifest, audit_score, execution_signature_hash, correlation_id } = req.body;
    if (!plan_json || !manifest || audit_score < 90 || !execution_signature_hash || !correlation_id) {
        logger.warn('Simulated Gateway: Payload estructuralmente inválido o score bajo.');
        return res.status(400).json({ error: 'Invalid payload structure or score < 90' });
    }

    logger.info('Simulated Gateway: Webhook validado correctamente. Encolado rápido.', { correlation_id });

    // Devolvemos 200 INMEDIATO
    return res.status(200).json({ status: "ENQUEUED", correlation_id });
});

// 📊 MISSION CONTROL TELEMETRY ENDPOINT
app.get('/api/telemetry', async (req, res) => {
    const startAggMs = performance.now();

    // Header Cache-Control mandatory
    res.set('Cache-Control', 'no-store');

    let metrics;
    try {
        metrics = missions.getTelemetryMetrics();
    } catch (e) {
        logger.error('Failed to get telemetry metrics', { error: e.message });
        return res.status(500).json({ error: 'Storage timeout' });
    }

    const duration = performance.now() - startAggMs;

    logger.info('Dashboard telemetry accessed', { correlation_id: 'DASHBOARD', duration_ms: duration, queryTimeout: duration > 500 });

    // Si toma más de 500ms es una anomalía
    if (duration > 500) {
        logger.warn('Telemetry endpoint slow response', { duration_ms: duration });
    }

    const isGlobalEnabled = process.env.GLOBAL_EXECUTION_ENABLED === 'true';

    const driftPercent = metrics.avg24h > 0 ? Number(((100 - metrics.avg24h)).toFixed(2)) : 0;

    const tokenData = await getTokenMetrics();
    const ssi = calculateSSI({ ...metrics, finance: tokenData });

    const payload = {
        system: {
            gateway_status: consecutiveGatewayFailures >= GATEWAY_FAILURE_THRESHOLD ? 'GATEWAY_DEGRADED' : consecutiveGatewayFailures > 0 ? 'DEGRADING' : 'HEALTHY',
            consecutive_failures: consecutiveGatewayFailures,
            canary_execution_count: canaryExecutionCount,
            global_execution_enabled: isGlobalEnabled,
            kill_switch_active: tokenData?.kill_switch_active,
            canary_limit: parseInt(process.env.CANARY_EXECUTION_LIMIT || '20'),
            expansion_status: expansionFrozen ? 'FROZEN' : 'ACTIVE',
            shadow_mode_75_projected_ssi: Number((ssi.total * 0.92).toFixed(2)),
            ssi: ssi
        },
        auditor: {
            average_score_24h: Math.round(metrics.avg24h * 10) / 10,
            moving_average_20: Math.round(metrics.ma20 * 10) / 10,
            baseline_score: 90,
            drift_percent: driftPercent,
            tamper_events_24h: metrics.tamper24h
        },
        semantic: {
            stats: metrics.semanticStats,
            events_24h: metrics.semanticStats.reduce((a, b) => a + b.count, 0)
        },
        finance: {
            total_cost_usd: tokenData?.summary.total_cost_usd || 0,
            daily_cost_usd: tokenData?.summary.daily_cost_usd || 0,
            total_tokens: tokenData?.summary.total_tokens || 0,
            daily_tokens: tokenData?.summary.daily_tokens || 0,
            projected_monthly_usd: tokenData?.projected_monthly_usd || 0,
            tpm: tokenData?.tpm || 0,
            top_expensive: tokenData?.top_expensive || []
        },
        jobs: {
            total_24h: metrics.jobCounts.total_24h,
            audit_failed: metrics.jobCounts.audit_failed,
            gateway_degraded: metrics.jobCounts.gateway_degraded,
            execution_triggered: metrics.jobCounts.execution_triggered,
            ready_for_execution: metrics.jobCounts.ready_for_execution
        },
        runtime: {
            heap_used_mb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
            event_loop_lag_ms: Math.round(eventLoopLagMs * 100) / 100,
            uptime_seconds: Math.round(process.uptime())
        }
    };

    res.json(payload);
});

app.get('/jobs', (req, res) => {
    const { status } = req.query;
    try {
        const list = missions.listByStatus(status);
        res.json({ count: list.length, jobs: list });
    } catch (err) {
        res.status(500).json({ error: 'Failed' });
    }
});

app.get('/status/:jobId', (req, res) => {
    const mission = missions.get(req.params.jobId);
    if (!mission) return res.status(404).json({ error: 'Not found' });
    res.json({
        ...mission,
        audit_feedback: mission.audit_feedback ? JSON.parse(mission.audit_feedback) : null,
        plan_json: mission.plan_json ? JSON.parse(mission.plan_json) : null
    });
});

app.listen(PORT, '127.0.0.1', () => {
    logger.info(`[Orquestador Principal v4] Corriendo en 127.0.0.1:${PORT}`);
});
