export const MISSION_DEFS = [
  { id: 'complete_lessons', emoji: '⚡', title: 'Conclua 1 missão',          target: 1, type: 'lessons', reward: { xp: 50, zapcoins: 20 } },
  { id: 'correct_answers',  emoji: '🎯', title: 'Acerte 1 questão hoje',      target: 1, type: 'correct', reward: { xp: 40, zapcoins: 15 } },
  { id: 'streak_goal',      emoji: '🔥', title: 'Jogue 1 dia seguido',        target: 1, type: 'streak',  reward: { xp: 60, zapcoins: 25 } },
]

const LS_KEY = 'zapfy_missions'
const today = () => new Date().toISOString().slice(0, 10)

function load() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    const d = raw ? JSON.parse(raw) : null
    if (!d || d.date !== today()) {
      const fresh = { date: today(), progress: {}, completed: [] }
      localStorage.setItem(LS_KEY, JSON.stringify(fresh))
      return fresh
    }
    return d
  } catch {
    return { date: today(), progress: {}, completed: [] }
  }
}

function save(s) {
  localStorage.setItem(LS_KEY, JSON.stringify(s))
}

export function getMissions(streak = 0) {
  const { progress, completed } = load()
  return MISSION_DEFS.map(m => ({
    ...m,
    current: Math.min(m.type === 'streak' ? streak : (progress[m.id] || 0), m.target),
    done: completed.includes(m.id),
  }))
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

export function hasPendingMissions(streak = 0) {
  return getMissions(streak).some(m => !m.done)
}

export function allMissionsDone(streak = 0) {
  return getMissions(streak).every(m => m.done)
}
