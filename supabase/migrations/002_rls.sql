-- ============================================================
-- Zapfy MVP — Row Level Security
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- ── PROFILES ──────────────────────────────────────────────────

-- Leitura: próprio perfil OU filho do usuário logado
CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT USING (
    id = auth.uid()
    OR parent_id = auth.uid()
  );

-- Escrita: apenas o próprio perfil
CREATE POLICY "profiles_insert" ON public.profiles
  FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_update" ON public.profiles
  FOR UPDATE USING (id = auth.uid());

-- ── PROGRESS ──────────────────────────────────────────────────

-- O próprio usuário gerencia o próprio progress
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

-- ── COMPANIES ─────────────────────────────────────────────────

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
