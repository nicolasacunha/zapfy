-- Eventos do piloto (Link School, ~12 crianças).
-- Espelho central dos eventos logados no app (D1–D7 + engajamento).
-- O app também guarda tudo em localStorage e exporta JSON; esta tabela
-- dá visão centralizada das 12 crianças sem depender de cada família exportar.

create table if not exists pilot_events (
  id               uuid primary key default gen_random_uuid(),
  child_profile_id uuid not null references profiles(id) on delete cascade,
  event            text not null,
  params           jsonb not null default '{}',
  day_index        integer,            -- D0 = instalação, D1 = dia seguinte...
  client_ts        timestamptz,        -- timestamp do dispositivo
  created_at       timestamptz not null default now()
);

create index if not exists pilot_events_child_idx on pilot_events (child_profile_id);
create index if not exists pilot_events_event_idx on pilot_events (event);

-- RLS
alter table pilot_events enable row level security;

-- Filho escreve/lê apenas os próprios eventos
create policy "child_own" on pilot_events
  for all using (child_profile_id = auth.uid());

-- Pai lê eventos dos filhos (via join em profiles.parent_id)
create policy "parent_read" on pilot_events
  for select using (
    child_profile_id in (
      select id from profiles where parent_id = auth.uid()
    )
  );
