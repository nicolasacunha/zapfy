// Instrumentação do piloto (Link School, ~12 crianças).
// Objetivo: medir D1–D7 por criança sem depender do GA4 (ilegível pra n=12).
// Estratégia: log local em localStorage (offline-safe, sempre funciona) +
// espelho best-effort no Supabase (tabela pilot_events) pra visão central.
// Export JSON pelo Parent Dashboard → família manda no WhatsApp.

import { supabase, IS_CONFIGURED } from './supabase'

const BUFFER_KEY   = 'zapfy_pilot_events'
const INSTALL_KEY  = 'zapfy_pilot_install_at'
const SESSION_KEY  = 'zapfy_pilot_last_session_day'
const MAX_BUFFER   = 3000

// ── Datas / day index ──────────────────────────────────────────
function installDate() {
  let d = localStorage.getItem(INSTALL_KEY)
  if (!d) { d = new Date().toISOString(); localStorage.setItem(INSTALL_KEY, d) }
  return d
}

// D0 = dia da instalação, D1 = dia seguinte, etc. (base pra retenção D7)
export function dayIndex(at = Date.now()) {
  const start = new Date(installDate()); start.setHours(0, 0, 0, 0)
  const today = new Date(at);            today.setHours(0, 0, 0, 0)
  return Math.round((today - start) / 86_400_000)
}

// ── Buffer local ───────────────────────────────────────────────
function readBuffer() {
  try { return JSON.parse(localStorage.getItem(BUFFER_KEY) || '[]') } catch { return [] }
}
function writeBuffer(arr) {
  try { localStorage.setItem(BUFFER_KEY, JSON.stringify(arr.slice(-MAX_BUFFER))) } catch { /* quota */ }
}

// ── Log de evento ──────────────────────────────────────────────
export function logPilotEvent(event, params = {}, childId = null) {
  const evt = {
    event,
    params,
    child_id:   childId || null,
    day_index:  dayIndex(),
    install_at: installDate(),
    client_ts:  new Date().toISOString(),
  }
  const buf = readBuffer(); buf.push(evt); writeBuffer(buf)

  // Espelho remoto (best-effort, nunca quebra o app). Pula mock/sem-config.
  if (IS_CONFIGURED && supabase && childId && childId !== 'mock-child') {
    supabase.from('pilot_events').insert({
      child_profile_id: childId,
      event,
      params,
      day_index: evt.day_index,
      client_ts: evt.client_ts,
    }).then(({ error }) => {
      if (error) console.warn('[Zapfy] pilot_events insert:', error.message)
    }, () => {})
  }
  return evt
}

// session_open no máx. 1x por dia-calendário (base da retenção diária)
export function logSessionOpen(childId = null) {
  const todayKey = new Date().toISOString().slice(0, 10)
  if (localStorage.getItem(SESSION_KEY) === todayKey) return
  localStorage.setItem(SESSION_KEY, todayKey)
  logPilotEvent('session_open', { d: dayIndex() }, childId)
}

// ── Resumo / export ────────────────────────────────────────────
export function getPilotEvents() { return readBuffer() }

export function pilotSummary() {
  const buf        = readBuffer()
  const activeDays = [...new Set(buf.filter(e => e.event === 'session_open').map(e => e.day_index))].sort((a, b) => a - b)
  return {
    install_at:          installDate(),
    total_events:        buf.length,
    active_days:         activeDays,
    returned_d1:         activeDays.includes(1),
    returned_d7:         activeDays.some(d => d >= 7),
    lessons_completed:   buf.filter(e => e.event === 'lesson_complete').length,
    missions_completed:  buf.filter(e => e.event === 'mission_complete').length,
    missions_with_proof: buf.filter(e => e.event === 'mission_complete' && e.params?.withProof).length,
    company_created:     buf.some(e => e.event === 'company_created'),
  }
}

export function exportPilotData(childName = '') {
  const payload = {
    app:        'zapfy',
    kind:       'pilot_export',
    version:    1,
    exported_at: new Date().toISOString(),
    child_name:  childName || null,
    summary:     pilotSummary(),
    events:      getPilotEvents(),
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url  = URL.createObjectURL(blob)
  const slug = (childName || 'piloto').toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'piloto'
  const a    = document.createElement('a')
  a.href     = url
  a.download = `zapfy-piloto-${slug}-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a); a.click(); a.remove()
  URL.revokeObjectURL(url)
}
