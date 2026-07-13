import { supabase } from './supabase'

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

  // Calcular streak real
  let streak = progress?.streak ?? 0
  if (progress?.last_played_at) {
    const diffMs   = Date.now() - new Date(progress.last_played_at).getTime()
    const diffDays = Math.floor(diffMs / 86_400_000)
    if (diffDays > 1) streak = 0 // streak quebrado
  }

  return {
    user:              { name: profile.name, age: profile.age },
    streak,
    xp:                progress?.xp            ?? 0,
    hearts:            progress?.hearts         ?? 5,
    zapcoins:          progress?.zapcoins       ?? 0,
    gems:              progress?.gems           ?? 0,
    league:            progress?.league         ?? 'Bronze',
    leaguePosition:    progress?.league_position ?? 1,
    completedUnits:    progress?.completed_units  ?? [],
    completedModules:  progress?.completed_modules ?? [],
    currentModule:     progress?.current_module  ?? 1,
    parentPin:         profile.parent_pin_hash ?? null,
    missionReports,
    company: company ? {
      name:      company.name,
      type:      company.type,
      product:   company.product,
      isFounder: company.is_founder,
    } : null,
  }
}

export async function syncProgress(childId, state) {
  const { error } = await supabase.from('progress').upsert({
    user_id:           childId,
    xp:                state.xp,
    streak:            state.streak,
    hearts:            state.hearts,
    zapcoins:          state.zapcoins,
    gems:              state.gems,
    league:            state.league,
    league_position:   state.leaguePosition,
    completed_units:   state.completedUnits,
    completed_modules: state.completedModules,
    current_module:    state.currentModule,
    last_played_at:    new Date().toISOString(),
    updated_at:        new Date().toISOString(),
  })
  if (error) console.error('[Zapfy] sync error:', error)
}

export async function saveCompany(childId, company) {
  const { error } = await supabase.from('companies').upsert({
    user_id:    childId,
    name:       company.name,
    type:       company.type,
    product:    company.product,
    is_founder: company.isFounder ?? false,
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
