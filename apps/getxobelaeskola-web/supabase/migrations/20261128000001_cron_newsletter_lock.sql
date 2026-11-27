-- Migration: 20261128000001_cron_newsletter_lock.sql
-- Description: Ensure newsletters table supports processing/failed status and concurrency indexing
-- Safety: Additive only, compatible with existing production database.

-- Add index on status and scheduled_for for fast atomic claim locking
CREATE INDEX IF NOT EXISTS idx_newsletters_status_scheduled 
    ON public.newsletters (status, scheduled_for);

-- Optional comment on statuses: 'draft', 'scheduled', 'processing', 'sent', 'failed'
COMMENT ON COLUMN public.newsletters.status IS 'Status lifecycle: draft -> scheduled -> processing -> sent (or back to scheduled if partial failure)';