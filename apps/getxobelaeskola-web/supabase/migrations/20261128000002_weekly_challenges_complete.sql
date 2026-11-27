-- Migration: 20261128000002_weekly_challenges_complete.sql
-- Description: Complete, idempotent deployment of Weekly Challenges system for Supabase
-- Safety: Non-destructive, uses IF NOT EXISTS, handles concurrency with ON CONFLICT / unique constraints.

-- 1. Create Weekly Challenge Templates Table
CREATE TABLE IF NOT EXISTS public.weekly_challenge_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('lesson_count', 'quiz_score', 'logbook_entry')),
    target_count INTEGER DEFAULT 1,
    target_score INTEGER,
    description_es TEXT NOT NULL,
    description_eu TEXT NOT NULL,
    xp_reward INTEGER DEFAULT 50,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Weekly Challenges Table (The active instance for a week)
CREATE TABLE IF NOT EXISTS public.weekly_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES public.weekly_challenge_templates(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_weekly_challenges_week UNIQUE(start_date, end_date)
);

-- 3. Create User Weekly Challenge Progress Table
CREATE TABLE IF NOT EXISTS public.user_weekly_challenge_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    challenge_id UUID REFERENCES public.weekly_challenges(id) ON DELETE CASCADE,
    current_value INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    reward_claimed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_user_weekly_challenge UNIQUE(user_id, challenge_id)
);

-- 4. RLS Configuration
ALTER TABLE public.weekly_challenge_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_weekly_challenge_progress ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'weekly_challenge_templates' AND policyname = 'Public view templates') THEN
        CREATE POLICY "Public view templates" ON public.weekly_challenge_templates FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'weekly_challenges' AND policyname = 'Public view challenges') THEN
        CREATE POLICY "Public view challenges" ON public.weekly_challenges FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_weekly_challenge_progress' AND policyname = 'User view own progress') THEN
        CREATE POLICY "User view own progress" ON public.user_weekly_challenge_progress FOR SELECT USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_weekly_challenge_progress' AND policyname = 'User insert own progress') THEN
        CREATE POLICY "User insert own progress" ON public.user_weekly_challenge_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- 5. Seed templates if table is empty
INSERT INTO public.weekly_challenge_templates (type, target_count, description_es, description_eu, xp_reward)
SELECT 'lesson_count', 3, 'Completa 3 lecciones esta semana', 'Osatu 3 ikasgai aste honetan', 50
WHERE NOT EXISTS (SELECT 1 FROM public.weekly_challenge_templates WHERE type = 'lesson_count');

INSERT INTO public.weekly_challenge_templates (type, target_count, description_es, description_eu, xp_reward)
SELECT 'logbook_entry', 2, 'Registra 2 salidas en tu bitácora', 'Erregistratu 2 irteera zure bitakoran', 50
WHERE NOT EXISTS (SELECT 1 FROM public.weekly_challenge_templates WHERE type = 'logbook_entry');

INSERT INTO public.weekly_challenge_templates (type, target_score, description_es, description_eu, xp_reward, metadata)
SELECT 'quiz_score', 90, 'Obtén más del 90% en un quiz', 'Lortu %90 baino gehiago galdetegi batean', 100, '{"min_score": 90}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.weekly_challenge_templates WHERE type = 'quiz_score');

-- 6. Concurrency-safe Function: get_or_create_weekly_challenge
-- Hardened with explicit immutable search_path to prevent search_path hijacking in SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.get_or_create_weekly_challenge()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
    v_start_date DATE;
    v_end_date DATE;
    v_challenge_id UUID;
    v_template_id UUID;
    v_result JSONB;
BEGIN
    -- Calculate start of current week (Monday UTC)
    v_start_date := date_trunc('week', current_date)::date;
    v_end_date := v_start_date + 6;

    -- Concurrency Protection: Attempt insertion or handle unique conflict gracefully
    SELECT id INTO v_challenge_id
    FROM public.weekly_challenges
    WHERE start_date = v_start_date;

    IF v_challenge_id IS NULL THEN
        -- Select random template
        SELECT id INTO v_template_id
        FROM public.weekly_challenge_templates
        ORDER BY random()
        LIMIT 1;

        IF v_template_id IS NOT NULL THEN
            INSERT INTO public.weekly_challenges (template_id, start_date, end_date)
            VALUES (v_template_id, v_start_date, v_end_date)
            ON CONFLICT (start_date, end_date) DO NOTHING
            RETURNING id INTO v_challenge_id;

            -- If race condition occurred, retrieve the id that won
            IF v_challenge_id IS NULL THEN
                SELECT id INTO v_challenge_id
                FROM public.weekly_challenges
                WHERE start_date = v_start_date;
            END IF;
        END IF;
    END IF;

    -- Return the challenge with template details (no private user data exposed)
    SELECT jsonb_build_object(
        'id', c.id,
        'start_date', c.start_date,
        'end_date', c.end_date,
        'template', jsonb_build_object(
            'type', t.type,
            'target_count', t.target_count,
            'target_score', t.target_score,
            'description_es', t.description_es,
            'description_eu', t.description_eu,
            'xp_reward', t.xp_reward
        )
    ) INTO v_result
    FROM public.weekly_challenges c
    JOIN public.weekly_challenge_templates t ON c.template_id = t.id
    WHERE c.id = v_challenge_id;

    RETURN v_result;
END;
$$;

-- 7. Grant execute ONLY to authenticated users and service_role (Revoke anon execution)
REVOKE ALL ON FUNCTION public.get_or_create_weekly_challenge() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_or_create_weekly_challenge() TO authenticated, service_role;