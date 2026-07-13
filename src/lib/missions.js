export const MISSION_DEFS = [
  { id: 'complete_lessons', emoji: '⚡', title: 'Conclua 1 missão',          target: 1, type: 'lessons', reward: { xp: 50, zapcoins: 20 } },
  { id: 'correct_answers',  emoji: '🎯', title: 'Acerte 1 questão hoje',      target: 1, type: 'correct', reward: { xp: 40, zapcoins: 15 } },
  { id: 'streak_goal',      emoji: '🔥', title: 'Jogue 1 dia seguido',        target: 1, type: 'streak',  reward: { xp: 60, zapcoins: 25 } },
]

import { dayKey } from './calendar'

const LS_KEY = 'zapfy_missions'

// Dono do ciclo diário das missões: progresso + concluídas + resgatadas, com reset
// automático na virada de dia (comparação por `date`). O reducer é dono da carteira;
// aqui vive tudo que reseta à meia-noite.
function blank() {
  return { date: dayKey(), progress: {}, completed: [], claimed: [] }
}

function load() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    const d = raw ? JSON.parse(raw) : null
    if (!d || d.date !== dayKey()) {
      const fresh = blank()
      localStorage.setItem(LS_KEY, JSON.stringify(fresh))
      return fresh
    }
    if (!Array.isArray(d.claimed)) d.claimed = [] // tolera estados salvos antes do resgate
    return d
  } catch {
    return blank()
  }
}

function save(s) {
  localStorage.setItem(LS_KEY, JSON.stringify(s))
}

export function getMissions(streak = 0) {
  const { progress, completed, claimed } = load()
  return MISSION_DEFS.map(m => {
    const done = completed.includes(m.id)
    return {
      ...m,
      current:   Math.min(m.type === 'streak' ? streak : (progress[m.id] || 0), m.target),
      done,
      claimed:   claimed.includes(m.id),
      claimable: done && !claimed.includes(m.id),
    }
  })
}

export function trackMission(type, streak = 0) {
  const state = load()
  const newlyDone = []

  MISSION_DEFS.forEach(m => {
    if (state.completed.includes(m.id)) return
    if (m.type === 'streak') {
      if (streak >= m.target) {
        state.completed.push(m.id)
        newlyDone.push(m)
      }
    } else if (m.type === type) {
      state.progress[m.id] = (state.progress[m.id] || 0) + 1
      if (state.progress[m.id] >= m.target) {
        state.completed.push(m.id)
        newlyDone.push(m)
      }
    }
  })

  save(state)
  return newlyDone
}

// Único juiz do "já resgatou?": devolve a recompensa exatamente uma vez, ou null se a
// missão não está concluída ou já foi resgatada. O caller credita a carteira só quando
// recebe uma recompensa não-nula.
export function claimDailyMission(id) {
  const state = load()
  const def = MISSION_DEFS.find(m => m.id === id)
  if (!def) return null
  if (!state.completed.includes(id)) return null // ainda não concluída
  if (state.claimed.includes(id)) return null     // já resgatada
  state.claimed.push(id)
  save(state)
  return def.reward
}

export function hasPendingMissions(streak = 0) {
  return getMissions(streak).some(m => !m.claimed)
}

export function allMissionsDone(streak = 0) {
  return getMissions(streak).every(m => m.claimed)
}
