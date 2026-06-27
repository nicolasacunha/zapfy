-- ============================================================
-- Zapfy MVP — Schema Completo
-- Rodar no SQL Editor do Supabase
-- ============================================================

-- TABELAS

CREATE TABLE IF NOT EXISTS public.profiles (
  id              uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name            text NOT NULL,
  age             int,
  role            text NOT NULL CHECK (role IN ('parent', 'child')),
  parent_id       uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_pin_hash text,
  invite_code     text UNIQUE,
  auth_email      text,
  is_premium         boolean NOT NULL DEFAULT false,
  premium_expires_at timestamptz,
  revenuecat_user_id text,
  coppa_consent_at   timestamptz,
  lgpd_consent_at    timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.progress (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  xp                    int NOT NULL DEFAULT 0,
  streak                int NOT NULL DEFAULT 0,
  hearts                int NOT NULL DEFAULT 5,
  zapcoins              int NOT NULL DEFAULT 0,
  gems                  int NOT NULL DEFAULT 0,
  league                text NOT NULL DEFAULT 'Bronze',
  league_position       int NOT NULL DEFAULT 1,
  completed_units       text[]  NOT NULL DEFAULT '{}',
  completed_modules     int[]   NOT NULL DEFAULT '{}',
  current_module        int NOT NULL DEFAULT 1,
  streak_freeze_active  boolean NOT NULL DEFAULT false,
  streak_freeze_expiry  timestamptz,
  streak_wager          jsonb,
  zappy_skin            text NOT NULL DEFAULT 'default',
  perfect_lessons       int NOT NULL DEFAULT 0,
  daily_xp_goal         int NOT NULL DEFAULT 20,
  missions_done_today   int NOT NULL DEFAULT 0,
  last_mission_reset_at date,
  last_played_at        timestamptz,
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.companies (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  name       text NOT NULL,
  type       text NOT NULL CHECK (type IN ('loja', 'servico', 'digital')),
  product    text NOT NULL,
  is_founder boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.company_revenue (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount      numeric(10,2) NOT NULL,
  description text,
  recorded_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_company_revenue_user
  ON public.company_revenue(user_id, recorded_at DESC);

CREATE TABLE IF NOT EXISTS public.mission_completions (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  module_id        integer NOT NULL,
  report           jsonb NOT NULL DEFAULT '{}',
  completed_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE(child_profile_id, module_id)
);

-- ============================================================
-- TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_parent_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  IF NEW.email LIKE 'child\_%@zapfy.internal' ESCAPE '\' THEN
    RETURN NEW;
  END IF;
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'parent'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_parent_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.profiles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_revenue     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_completions ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT USING (id = auth.uid() OR parent_id = auth.uid());
CREATE POLICY "profiles_insert" ON public.profiles
  FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_update" ON public.profiles
  FOR UPDATE USING (id = auth.uid());

-- progress
CREATE POLICY "progress_select" ON public.progress
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = user_id AND p.parent_id = auth.uid()
    )
  );
CREATE POLICY "progress_insert" ON public.progress
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "progress_upsert" ON public.progress
  FOR UPDATE USING (user_id = auth.uid());

-- companies
CREATE POLICY "companies_select" ON public.companies
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = user_id AND p.parent_id = auth.uid()
    )
  );
CREATE POLICY "companies_insert" ON public.companies
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "companies_upsert" ON public.companies
  FOR UPDATE USING (user_id = auth.uid());

-- company_revenue
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

-- mission_completions
CREATE POLICY "child_own" ON public.mission_completions
  FOR ALL USING (child_profile_id = auth.uid());
CREATE POLICY "parent_read" ON public.mission_completions
  FOR SELECT USING (
    child_profile_id IN (
      SELECT id FROM public.profiles WHERE parent_id = auth.uid()
    )
  );
