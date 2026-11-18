import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import winston from 'winston';
import { spawn } from 'child_process';
import { createInternalAuthMiddleware } from './middleware/internal-auth.js';
const requireInternalAuth = createInternalAuthMiddleware();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/builder.log' })
    ]
});

const app = express();
app.use(bodyParser.json({ limit: '100kb' }));

const PORT = 8082;
const ARTIFACTS_ROOT = path.resolve(__dirname, 'artifacts');

if (!fs.existsSync(ARTIFACTS_ROOT)) fs.mkdirSync(ARTIFACTS_ROOT);

/**
 * 5️⃣ Normalización de JSON para Hash Estable
 */
function normalizeJson(obj) {
    if (Array.isArray(obj)) {
        return obj.map(normalizeJson);
    } else if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj)
            .sort()
            .reduce((res, key) => {
                res[key] = normalizeJson(obj[key]);
                return res;
            }, {});
    }
    return obj;
}

function getHash(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * 2️⃣ Protección contra Path Traversal y Verificación de Límites
 * Accounts for Windows drive case, rejects traversal outside designated workspace,
 * and detects existing symlinks/junctions where observable.
 *
 * Remaining limitation: In userland Node.js on Windows without native C++ Win32 APIs,
 * a residual TOCTOU race exists if an adversary concurrently replaces a directory component
 * with an NTFS junction or reparse point. Confining operations to ARTIFACTS_ROOT mitigates this.
 */
function safeJoin(root, ...parts) {
    const canonicalRoot = path.normalize(path.resolve(root));
    const target = path.normalize(path.resolve(canonicalRoot, ...parts));

    // Case-insensitive check on Windows drive / prefix
    const lowerRoot = canonicalRoot.toLowerCase();
    const lowerTarget = target.toLowerCase();

    if (lowerTarget !== lowerRoot && !lowerTarget.startsWith(lowerRoot + path.sep)) {
        throw new Error(`Security Violation: Path traversal attempt outside workspace: ${target}`);
    }

    // Inspect existing path segments for symlinks/junctions
    let current = canonicalRoot;
    const relParts = path.relative(canonicalRoot, target).split(path.sep);
    for (const part of relParts) {
        if (!part || part === '.') continue;
        current = path.join(current, part);
        if (fs.existsSync(current)) {
            try {
                const stat = fs.lstatSync(current);
                if (stat.isSymbolicLink()) {
                    throw new Error(`Security Violation: Symbolic link or junction detected: ${current}`);
                }
            } catch (err) {
                if (err.message.includes('Security Violation')) throw err;
            }
        }
    }

    return target;
}

/**
 * 3️⃣ Validación de Tipos de Step
 */
const ALLOWED_STEP_TYPES = ['file_write', 'mkdir', 'mock_exec'];

async function runStep(step, targetDir, timeoutMs = 5000) {
    if (!ALLOWED_STEP_TYPES.includes(step.type)) {
        throw new Error(`Security Violation: Unsupported step type: ${step.type}`);
    }

    // Lógica por tipo
    switch (step.type) {
        case 'file_write':
            const safeFile = safeJoin(targetDir, step.params.filename);
            fs.writeFileSync(safeFile, step.params.content || '');
            return { success: true };

        case 'mkdir':
            const safeDir = safeJoin(targetDir, step.params.dirname);
            fs.mkdirSync(safeDir, { recursive: true });
            return { success: true };

        case 'mock_exec':
            // 1️⃣ Sandbox Simulado (Limitado a no-net y timeouts reales)
            return new Promise((resolve, reject) => {
                const worker = spawn('node', ['-e', 'process.exit(0)'], {
                    timeout: timeoutMs,
                    env: { NETWORK_ACCESS: 'false' }, // Bandera informativa
                    stdio: 'ignore'
                });
                worker.on('close', (code) => code === 0 ? resolve({ success: true }) : reject(new Error('Exec failed')));
            });
    }
}

app.post('/build', requireInternalAuth, async (req, res) => {
    const { plan: planWrapper, plan_hash } = req.body;
    const correlationId = crypto.randomUUID();

    if (!planWrapper?.plan || !plan_hash) {
        return res.status(400).json({ error: 'Contract violation' });
    }

    const plan = planWrapper.plan;
    const artifactDir = safeJoin(ARTIFACTS_ROOT, plan.id);

    // 6️⃣ Idempotencia
    if (fs.existsSync(artifactDir)) {
        return res.json({ status: 'SUCCESS', idempotent: true, artifacts_path: artifactDir });
    }

    // 4️⃣ Timeout Global (2 minutos)
    const globalTimeout = setTimeout(() => {
        logger.error('Global build timeout reached', { correlationId, planId: plan.id });
        // Aquí podrías implementar una limpieza
    }, 120000);

    const startTime = Date.now();
    const manifest = {
        plan_id: plan.id,
        plan_hash: plan_hash,
        generated_at: new Date().toISOString(),
        files: []
    };

    try {
        fs.mkdirSync(artifactDir, { recursive: true });

        for (const step of plan.steps) {
            await runStep(step, artifactDir);
        }

        // Registrar archivos reales generados
        const files = fs.readdirSync(artifactDir);
        for (const file of files) {
            if (file === 'manifest.json') continue;
            const content = fs.readFileSync(path.join(artifactDir, file));
            manifest.files.push({
                file,
                hash: getHash(content)
            });
        }

        const manifestPath = path.join(artifactDir, 'manifest.json');
        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

        clearTimeout(globalTimeout);
        return res.json({
            status: 'SUCCESS',
            artifacts_path: artifactDir,
            manifest
        });

    } catch (error) {
        clearTimeout(globalTimeout);
        logger.error('Build Error', { error: error.message });
        return res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, '127.0.0.1', () => {
    logger.info(`[Builder Hardened V2] Running on 127.0.0.1:${PORT}`);
});
