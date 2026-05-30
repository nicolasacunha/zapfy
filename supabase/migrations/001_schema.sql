-- ============================================================
-- Zapfy MVP — Schema
-- ============================================================

-- Profiles (pai/responsável e crianças)
CREATE TABLE IF NOT EXISTS public.profiles (
  id            uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name          text NOT NULL,
  age           int,
  role          text NOT NULL CHECK (role IN ('parent', 'child')),
  parent_id     uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_pin_hash text,          -- SHA-256 hex do PIN (apenas em perfis pai)
  invite_code   text UNIQUE,     -- 6 chars, apenas em perfis child
  auth_email    text,            -- email interno gerado para crianças
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Progresso do jogador
CREATE TABLE IF NOT EXISTS public.progress (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  xp                int NOT NULL DEFAULT 0,
  streak            int NOT NULL DEFAULT 0,
  hearts            int NOT NULL DEFAULT 5,
  zapcoins          int NOT NULL DEFAULT 0,
  gems              int NOT NULL DEFAULT 0,
  league            text NOT NULL DEFAULT 'Bronze',
  league_position   int NOT NULL DEFAULT 1,
  completed_units   text[]  NOT NULL DEFAULT '{}',
  completed_modules int[]   NOT NULL DEFAULT '{}',
  current_module    int NOT NULL DEFAULT 1,
  last_played_at    timestamptz,
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- Empresa criada pela criança
CREATE TABLE IF NOT EXISTS public.companies (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  name       text NOT NULL,
  type       text NOT NULL CHECK (type IN ('loja', 'servico', 'digital')),
  product    text NOT NULL,
  is_founder boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Trigger: ao criar usuário pai, cria perfil + progress automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_parent_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  -- Não criar perfil auto para contas internas de crianças
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
