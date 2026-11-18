import { computePayloadHash } from './canonical.js';
import { LocalResearchAgent } from './local-research-agent.js';

export class OutboxDispatcher {
    constructor(db, options = {}) {
        this.db = db;
        this.gatewayUrl = options.gatewayUrl || 'http://127.0.0.1:4000';
        this.internalPsk = options.internalPsk || process.env.INTERNAL_SERVICE_PSK;
        this.maxRetries = options.maxRetries || 3;
        this.agent = new LocalResearchAgent({
            gatewayUrl: this.gatewayUrl,
            internalPsk: this.internalPsk,
            model: options.model || 'local-model'
        });
    }

    async dispatchAttempt(executionAttemptId) {
        const row = this.db.prepare('SELECT * FROM execution_outbox WHERE execution_attempt_id = ?').get(executionAttemptId);
        if (!row) {
            const err = new Error('Outbox record ' + executionAttemptId + ' not found');
            err.code = 'NOT_FOUND';
            throw err;
        }

        if (row.status !== 'PENDING') {
            const err = new Error('Outbox record ' + executionAttemptId + ' is in status ' + row.status + ', cannot dispatch');
            err.code = 'INVALID_STATE';
            err.currentStatus = row.status;
            throw err;
        }

        const calculatedHash = computePayloadHash(row.payload_json);
        if (calculatedHash !== row.payload_hash) {
            const termSql = 'UPDATE execution_outbox SET status = \'TERMINAL\', error_details = \'PayloadHashMismatch\', terminal_at = (STRFTIME(\'%Y-%m-%dT%H:%M:%f\', \'NOW\')), updated_at = (STRFTIME(\'%Y-%m-%dT%H:%M:%f\', \'NOW\')) WHERE execution_attempt_id = ?';
            this.db.prepare(termSql).run(executionAttemptId);

            const misSql = 'UPDATE missions SET status = \'TAMPER_DETECTED\', error_message = \'Outbox payload hash mismatch detected before dispatch\', updated_at = (STRFTIME(\'%Y-%m-%dT%H:%M:%f\', \'NOW\')) WHERE id = ?';
            this.db.prepare(misSql).run(row.mission_id);

            const err = new Error('SecurityException: Outbox payload hash mismatch detected');
            err.code = 'HASH_MISMATCH';
            throw err;
        }

        const payload = JSON.parse(row.payload_json);
        const missionId = row.mission_id;

        const dispatchSql = 'UPDATE execution_outbox SET status = \'DISPATCHED\', dispatched_at = (STRFTIME(\'%Y-%m-%dT%H:%M:%f\', \'NOW\')), updated_at = (STRFTIME(\'%Y-%m-%dT%H:%M:%f\', \'NOW\')) WHERE execution_attempt_id = ? AND status = \'PENDING\'';
        const result = this.db.prepare(dispatchSql).run(executionAttemptId);
        if (result.changes !== 1) {
            const err = new Error('Concurrent modification conflict on outbox ' + executionAttemptId);
            err.code = 'CONFLICT';
            throw err;
        }

        try {
            const mission = this.db.prepare('SELECT prompt FROM missions WHERE id = ?').get(missionId);
            const prompt = mission ? mission.prompt : (payload.prompt || 'ping');

            const agentTask = {
                execution_attempt_id: executionAttemptId,
                mission_id: missionId,
                prompt: prompt
            };

            const agentResult = await this.agent.executeTask(agentTask);

            const finalizeTransaction = this.db.transaction(() => {
                const ackSql = 'UPDATE execution_outbox SET status = \'ACKNOWLEDGED\', updated_at = (STRFTIME(\'%Y-%m-%dT%H:%M:%f\', \'NOW\')) WHERE execution_attempt_id = ?';
                this.db.prepare(ackSql).run(executionAttemptId);

                const compSql = 'UPDATE missions SET status = \'COMPLETED\', error_message = NULL, execution_time_ms = ?, updated_at = (STRFTIME(\'%Y-%m-%dT%H:%M:%f\', \'NOW\')) WHERE id = ?';
                this.db.prepare(compSql).run(agentResult.timing.total_ms, missionId);

                const logSql = 'INSERT INTO semantic_logs (job_id, event_type, details) VALUES (?, \'OUTBOX_DISPATCH_COMPLETED\', ?)';
                this.db.prepare(logSql).run(missionId, JSON.stringify({
                    attempt_id: executionAttemptId,
                    model: agentResult.model,
                    finish_reason: agentResult.finish_reason,
                    inference_ms: agentResult.timing.inference_ms
                }));
            });

            finalizeTransaction();

            return {
                status: 'COMPLETED',
                execution_attempt_id: executionAttemptId,
                mission_id: missionId,
                result: agentResult
            };

        } catch (err) {
            const currentAttempt = row.attempt_number;
            const isTerminal = currentAttempt >= this.maxRetries;
            const newStatus = isTerminal ? 'TERMINAL' : 'PENDING';

            const failTx = this.db.transaction(() => {
                const retrySql = 'UPDATE execution_outbox SET status = ?, attempt_number = attempt_number + 1, error_details = ?, terminal_at = CASE WHEN ? = \'TERMINAL\' THEN (STRFTIME(\'%Y-%m-%dT%H:%M:%f\', \'NOW\')) ELSE terminal_at END, updated_at = (STRFTIME(\'%Y-%m-%dT%H:%M:%f\', \'NOW\')) WHERE execution_attempt_id = ?';
                this.db.prepare(retrySql).run(newStatus, err.message, newStatus, executionAttemptId);

                if (isTerminal) {
                    const failMisSql = 'UPDATE missions SET status = \'FAILED_DISPATCH\', error_message = ?, updated_at = (STRFTIME(\'%Y-%m-%dT%H:%M:%f\', \'NOW\')) WHERE id = ?';
                    this.db.prepare(failMisSql).run(err.message, missionId);
                }

                const failLogSql = 'INSERT INTO semantic_logs (job_id, event_type, details) VALUES (?, \'OUTBOX_DISPATCH_FAILED\', ?)';
                this.db.prepare(failLogSql).run(missionId, JSON.stringify({
                    attempt_id: executionAttemptId,
                    attempt_number: currentAttempt,
                    is_terminal: isTerminal,
                    error: err.message
                }));
            });

            failTx();

            return {
                status: isTerminal ? 'TERMINAL' : 'RETRY_SCHEDULED',
                execution_attempt_id: executionAttemptId,
                mission_id: missionId,
                attempt_number: currentAttempt + 1,
                error: err.message
            };
        }
    }

    async dispatchAllPending() {
        const selSql = 'SELECT execution_attempt_id FROM execution_outbox WHERE status = \'PENDING\' ORDER BY created_at ASC';
        const pending = this.db.prepare(selSql).all();
        const results = [];
        for (const row of pending) {
            const res = await this.dispatchAttempt(row.execution_attempt_id);
            results.push(res);
        }
        return results;
    }
}
