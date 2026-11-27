-- Migration: 20261128000000_cron_weather_alerts_dedup.sql
-- Description: Table for weather alerts deduplication and idempotency
-- Safety: Additive only, IF NOT EXISTS, compatible with existing production database.

CREATE TABLE IF NOT EXISTS public.processed_weather_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_hash TEXT NOT NULL,
    severity TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'pending')),
    expires_at TIMESTAMPTZ NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_processed_weather_alerts_hash UNIQUE (alert_hash)
);

CREATE INDEX IF NOT EXISTS idx_processed_weather_alerts_hash 
    ON public.processed_weather_alerts (alert_hash);

CREATE INDEX IF NOT EXISTS idx_processed_weather_alerts_expires 
    ON public.processed_weather_alerts (expires_at);

-- RLS: Enable Row Level Security and restrict access to service_role only
ALTER TABLE public.processed_weather_alerts ENABLE ROW LEVEL SECURITY;

-- Deny all public / anon / authenticated access; allow service_role only
DROP POLICY IF EXISTS "Service role full access on processed_weather_alerts" ON public.processed_weather_alerts;
CREATE POLICY "Service role full access on processed_weather_alerts" 
    ON public.processed_weather_alerts 
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Revoke all permissions on table from public, anon, authenticated
REVOKE ALL ON TABLE public.processed_weather_alerts FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE public.processed_weather_alerts TO service_role;