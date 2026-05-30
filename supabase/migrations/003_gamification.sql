-- ============================================================
-- Zapfy MVP — Gamification fields (migration 003)
-- ============================================================

-- Novos campos de gamificação no progress
ALTER TABLE public.progress
  ADD COLUMN IF NOT EXISTS streak_freeze_active  boolean      NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS streak_freeze_expiry  timestamptz,
  ADD COLUMN IF NOT EXISTS streak_wager          jsonb,
  ADD COLUMN IF NOT EXISTS zappy_skin            text         NOT NULL DEFAULT 'default',
  ADD COLUMN IF NOT EXISTS perfect_lessons       int          NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS daily_xp_goal         int          NOT NULL DEFAULT 20,
  ADD COLUMN IF NOT EXISTS missions_done_today   int          NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_mission_reset_at date;

-- Premium status na profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_premium         boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS premium_expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS revenuecat_user_id text,
  ADD COLUMN IF NOT EXISTS coppa_consent_at   timestamptz,  -- quando pai deu consentimento
  ADD COLUMN IF NOT EXISTS lgpd_consent_at    timestamptz;

-- Histórico de receita simulada da empresa da criança
CREATE TABLE IF NOT EXISTS public.company_revenue (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount      numeric(10,2) NOT NULL,
  description text,
  recorded_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.company_revenue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "company_revenue_select" ON public.company_revenue
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = user_id AND p.parent_id = auth.uid()
    )
  );

CREATE POLICY "company_revenue_insert" ON public.company_revenue
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Índice para consultas por usuário
CREATE INDEX IF NOT EXISTS idx_company_revenue_user ON public.company_revenue(user_id, recorded_at DESC);
