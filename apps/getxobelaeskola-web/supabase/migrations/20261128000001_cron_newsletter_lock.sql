-- Migration: 20261128000001_cron_newsletter_lock.sql
-- Description: Add worker lease columns and performance indexing to newsletters table
-- Safety: Additive only, non-destructive, compatible with existing production database.

-- 1. Add worker tracking columns if they do not exist
ALTER TABLE public.newsletters 
    ADD COLUMN IF NOT EXISTS locked_by TEXT,
    ADD COLUMN IF NOT EXISTS lease_expires_at TIMESTAMPTZ;

-- 2. Add performance index on status and lease expiration for fast atomic claim locking
CREATE INDEX IF NOT EXISTS idx_newsletters_status_lease 
    ON public.newsletters (status, lease_expires_at);

CREATE INDEX IF NOT EXISTS idx_newsletters_status_scheduled 
    ON public.newsletters (status, scheduled_for);

-- 3. Document columns
COMMENT ON COLUMN public.newsletters.locked_by IS 'Unique worker ID holding the current processing lease';
COMMENT ON COLUMN public.newsletters.lease_expires_at IS 'Timestamp when the worker lease expires; past this, other workers may reclaim';