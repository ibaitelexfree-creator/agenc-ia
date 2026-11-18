/**
 * Migration 001: V3 Execution Outbox
 * Creates schema_migrations table and execution_outbox table.
 * Executes atomically in a single transaction with foreign keys enabled.
 */

export const version = 1;
export const name = '001_v3_execution_outbox';

export function up(db) {
    db.pragma('foreign_keys = ON');

    const runMigration = db.transaction(() => {
        // 1. Create schema_migrations table
        db.exec(`
            CREATE TABLE IF NOT EXISTS schema_migrations (
                version INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                applied_at DATETIME DEFAULT (STRFTIME('%Y-%m-%dT%H:%M:%f', 'NOW'))
            );
        `);

        // Check if already applied
        const existing = db.prepare('SELECT version FROM schema_migrations WHERE version = ?').get(version);
        if (existing) {
            return { applied: false, reason: 'Already applied' };
        }

        // 2. Create execution_outbox table
        db.exec(`
            CREATE TABLE IF NOT EXISTS execution_outbox (
                execution_attempt_id TEXT PRIMARY KEY,
                mission_id TEXT NOT NULL,
                status TEXT NOT NULL CHECK(status IN ('PENDING', 'DISPATCHED', 'ACKNOWLEDGED', 'INDETERMINATE', 'TERMINAL')),
                payload_json TEXT NOT NULL,
                payload_hash TEXT NOT NULL,
                policy_version TEXT NOT NULL,
                attempt_number INTEGER NOT NULL DEFAULT 1,
                created_at DATETIME DEFAULT (STRFTIME('%Y-%m-%dT%H:%M:%f', 'NOW')),
                updated_at DATETIME DEFAULT (STRFTIME('%Y-%m-%dT%H:%M:%f', 'NOW')),
                dispatched_at DATETIME,
                terminal_at DATETIME,
                error_details TEXT,
                FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE RESTRICT
            );

            CREATE INDEX IF NOT EXISTS idx_execution_outbox_mission_id ON execution_outbox (mission_id);
            CREATE INDEX IF NOT EXISTS idx_execution_outbox_status ON execution_outbox (status);
        `);

        // 3. Record migration version
        db.prepare('INSERT INTO schema_migrations (version, name) VALUES (?, ?)').run(version, name);

        // 4. Validate schema structure post-migration
        const outboxCols = db.prepare("PRAGMA table_info(execution_outbox)").all().map(c => c.name);
        const requiredCols = [
            'execution_attempt_id', 'mission_id', 'status', 'payload_json',
            'payload_hash', 'policy_version', 'attempt_number', 'created_at',
            'updated_at', 'dispatched_at', 'terminal_at', 'error_details'
        ];

        for (const col of requiredCols) {
            if (!outboxCols.includes(col)) {
                throw new Error(`Migration validation failed: missing column ${col} in execution_outbox`);
            }
        }

        return { applied: true, version, name };
    });

    return runMigration();
}
