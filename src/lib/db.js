import { supabase } from './supabase'

// ── Mapeamento de campos (fonte única, bidirecional) ───────────────────────────
// Antes o de↔para snake_case (colunas Supabase) ↔ camelCase (state) vivia escrito
// duas vezes — uma na leitura (loadUserState) e outra na escrita (syncProgress).
// Adicionar um campo exigia tocar os dois lados e era fácil divergir. Agora o mapa
// é declarativo e as duas direções derivam dele.
const PROGRESS_MAP = [
  { col: 'xp',                key: 'xp',               fallback: 0 },
  { col: 'streak',            key: 'streak',           fallback: 0 },
  { col: 'hearts',            key: 'hearts',           fallback: 5 },
  { col: 'zapcoins',          key: 'zapcoins',         fallback: 0 },
  { col: 'gems',              key: 'gems',             fallback: 0 },
  { col: 'league',            key: 'league',           fallback: 'Bronze' },
  { col: 'league_position',   key: 'leaguePosition',   fallback: 1 },
  { col: 'completed_units',   key: 'completedUnits',   fallback: [] },
  { col: 'completed_modules', key: 'completedModules', fallback: [] },
  { col: 'current_module',    key: 'currentModule',    fallback: 1 },
]

const COMPANY_MAP = [
  { col: 'name',       key: 'name',      fallback: null },
  { col: 'type',       key: 'type',      fallback: null },
  { col: 'product',    key: 'product',   fallback: null },
  { col: 'is_founder', key: 'isFounder', fallback: false },
]

// linha do banco → recorte do state (com defaults de leitura)
function rowToState(map, row) {
  const out = {}
  for (const { col, key, fallback } of map) {
    const v = row?.[col]
    out[key] = v ?? (Array.isArray(fallback) ? [...fallback] : fallback)
  }
  return out
}

// state → linha do banco (só as colunas do mapa)
function stateToRow(map, state) {
  const row = {}
  for (const { col, key, fallback } of map) {
    const v = state?.[key]
    row[col] = v ?? (Array.isArray(fallback) ? [...fallback] : fallback)
  }
  return row
}

export const progressToState = (progress) => rowToState(PROGRESS_MAP, progress)
export const stateToProgress = (state) => stateToRow(PROGRESS_MAP, state)
export const companyToState  = (company) => rowToState(COMPANY_MAP, company)
export const stateToCompany  = (company) => stateToRow(COMPANY_MAP, company)

// ── I/O Supabase ───────────────────────────────────────────────────────────────
export async function getMissionReports(childId) {
  const { data, error } = await supabase
    .from('mission_completions')
    .select('module_id, report, completed_at')
    .eq('child_profile_id', childId)
  if (error) return {}
  return Object.fromEntries((data ?? []).map(r => [r.module_id, r.report]))
}

export async function loadUserState(childId) {
  const [{ data: profile }, { data: progress }, { data: company }, missionReports] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', childId).single(),
    supabase.from('progress').select('*').eq('user_id', childId).maybeSingle(),
    supabase.from('companies').select('*').eq('user_id', childId).maybeSingle(),
    getMissionReports(childId),
  ])

  if (!profile) return null

  // O streak é devolvido cru; a autoridade que avança/reinicia é o reducer
  // (nextStreak em lib/calendar), no próximo COMPLETE_UNIT.
  return {
    user:      { name: profile.name, age: profile.age },
    parentPin: profile.parent_pin_hash ?? null,
    missionReports,
    ...progressToState(progress),
    company: company ? companyToState(company) : null,
  }
}

export async function syncProgress(childId, state) {
  const { error } = await supabase.from('progress').upsert({
    user_id:        childId,
    ...stateToProgress(state),
    last_played_at: new Date().toISOString(),
    updated_at:     new Date().toISOString(),
  })
  if (error) console.error('[Zapfy] sync error:', error)
}

export async function saveCompany(childId, company) {
  const { error } = await supabase.from('companies').upsert({
    user_id: childId,
    ...stateToCompany(company),
  })
  if (error) console.error('[Zapfy] company sync error:', error)
}

export async function getChildProfiles(parentId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, age, invite_code')
    .eq('parent_id', parentId)
    .eq('role', 'child')
  if (error) throw error
  return data ?? []
}

export async function saveMissionReport(childId, moduleId, report) {
  const { error } = await supabase.from('mission_completions').upsert({
    child_profile_id: childId,
    module_id:        moduleId,
    report,
    completed_at:     new Date().toISOString(),
  }, { onConflict: 'child_profile_id,module_id' })
  if (error) console.error('[Zapfy] mission sync error:', error)
}
