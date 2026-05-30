-- Tabela para registros de missões do mundo real
create table if not exists mission_completions (
  id               uuid primary key default gen_random_uuid(),
  child_profile_id uuid not null references profiles(id) on delete cascade,
  module_id        integer not null,
  report           jsonb not null default '{}',
  completed_at     timestamptz not null default now(),
  unique(child_profile_id, module_id)
);

-- RLS
alter table mission_completions enable row level security;

-- Filho lê/escreve apenas os próprios registros
create policy "child_own" on mission_completions
  for all using (child_profile_id = auth.uid());

-- Pai lê registros dos filhos (via join em profiles.parent_id)
create policy "parent_read" on mission_completions
  for select using (
    child_profile_id in (
      select id from profiles where parent_id = auth.uid()
    )
  );
