// ── Máquina de estados de relacionamento do Zappy (v2) ─────────────
// Lógica PURA — sem imports de asset. Mapeia energia/dias → humor e
// define as reações momentâneas. Doc: docs/zappy-v2-state-machine.md
//
// Camada 1 (lenta): Humor de Vínculo = bucket de `zappyEnergy` (0–100).
// Camada 2 (rápida): Reação momentânea = asset transitório por evento.

export const ENERGY_MAX = 100
export const ENERGY_MIN = 0
export const ENERGY_DEFAULT = 80

export function clampEnergy(e) {
  if (typeof e !== 'number' || Number.isNaN(e)) return ENERGY_DEFAULT
  return Math.max(ENERGY_MIN, Math.min(ENERGY_MAX, Math.round(e)))
}

// Faixas de humor (Camada 1)
export const MOODS = [
  { key: 'radiante',   min: 90, label: 'Radiante',   hint: 'Ofensiva ativa, brilhando' },
  { key: 'animado',    min: 60, label: 'Animado',    hint: 'Saudável, uso regular' },
  { key: 'quietinho',  min: 30, label: 'Quietinho',  hint: '1–2 dias fora' },
  { key: 'saudade',    min: 1,  label: 'Saudade',    hint: '3+ dias fora' },
  { key: 'cochilando', min: 0,  label: 'Cochilando', hint: 'Sumiço longo' },
]

export function moodFromEnergy(energy) {
  const e = clampEnergy(energy)
  return (MOODS.find(m => e >= m.min) || MOODS[MOODS.length - 1]).key
}

export function moodMeta(energy) {
  const key = moodFromEnergy(energy)
  return MOODS.find(m => m.key === key)
}

// ── Decaimento (ponto de partida — ajustar com dado real) ──────────
export const DECAY_PER_DAY = 15
export const GRACE_DAYS = 1        // 1º dia de carência (não cai)
export const ACTIVITY_BUMP = 40    // aparecer/atividade sobe forte
export const RETURN_BUMP = 35      // salto extra se estava baixo (reencontro gostoso)

export function toDateStr(d = new Date()) {
  const x = new Date(d); x.setHours(12, 0, 0, 0)
  return x.toISOString().slice(0, 10)
}

export function daysBetween(fromStr, now = new Date()) {
  if (!fromStr) return 0
  const MS = 24 * 60 * 60 * 1000
  const a = new Date(fromStr); a.setHours(0, 0, 0, 0)
  const b = new Date(now);     b.setHours(0, 0, 0, 0)
  return Math.max(0, Math.round((b - a) / MS))
}

// Recalcula a energia a partir do último dia ativo (chamar no app-open)
export function decayEnergy(energy, lastActiveDate, now = new Date()) {
  if (!lastActiveDate) return clampEnergy(energy)
  const effective = Math.max(0, daysBetween(lastActiveDate, now) - GRACE_DAYS)
  return clampEnergy(clampEnergy(energy) - effective * DECAY_PER_DAY)
}

// Bump ao aparecer/atividade — volta forte pra que voltar valha a pena
export function registerActivity(energy, now = new Date()) {
  const wasLow = clampEnergy(energy) < 30
  return {
    energy: clampEnergy(clampEnergy(energy) + ACTIVITY_BUMP + (wasLow ? RETURN_BUMP : 0)),
    lastActiveDate: toDateStr(now),
  }
}

// Energia "se ficasse N dias sumido começando do topo" — útil pra demo
export function energyAfterAbsence(days) {
  return decayEnergy(ENERGY_MAX, toDateStr(new Date(Date.now() - days * 86400000)))
}

// ── Evolução (Tamagotchi) — a FORMA do Zappy muda com o nível ──────
// Eixo separado do humor: humor = expressão do dia; evolução = identidade.
export const EVOLUTIONS = [
  { key: 'brotinho', label: 'Brotinho', minLevel: 1 },
  { key: 'heroi',    label: 'Herói',    minLevel: 2 },
  { key: 'lenda',    label: 'Lenda',    minLevel: 5 },
]

export function levelFromXp(xp) {
  return Math.floor((xp || 0) / 500) + 1
}

// Estágio atual a partir do nível
export function evolutionStage(level) {
  let stage = EVOLUTIONS[0]
  for (const e of EVOLUTIONS) if (level >= e.minLevel) stage = e
  return stage
}

// Próximo estágio (pra mostrar "evolui no Nível X") — null se já é o último
export function nextEvolution(level) {
  return EVOLUTIONS.find(e => e.minLevel > level) || null
}

// ── Camada 2 — Reações momentâneas (evento → humor transitório) ────
export const REACTIONS = {
  acerto:     { mood: 'radiante',    ms: 1400, label: 'Acerto' },
  erro:       { mood: 'ops',         ms: 1600, label: 'Erro (ops)' },
  licao:      { mood: 'comemoracao', ms: 2200, label: 'Lição concluída' },
  missaoReal: { mood: 'comemoracao', ms: 3200, label: 'Missão real!' },
  orgulho:    { mood: 'orgulhoso',   ms: 2200, label: 'Orgulho' },
  surpresa:   { mood: 'surprise',    ms: 1600, label: 'Surpresa' },
}
