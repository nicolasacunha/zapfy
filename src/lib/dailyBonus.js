import { dayKey, isYesterday } from './calendar'

const KEY = 'zapfy_daily_bonus'

const REWARDS = [
  { zapcoins: 5,  gems: 0, label: 'Dia 1' },
  { zapcoins: 10, gems: 0, label: 'Dia 2' },
  { zapcoins: 15, gems: 0, label: 'Dia 3' },
  { zapcoins: 20, gems: 0, label: 'Dia 4' },
  { zapcoins: 25, gems: 0, label: 'Dia 5' },
  { zapcoins: 30, gems: 0, label: 'Dia 6' },
  { zapcoins: 0,  gems: 3, label: 'Dia 7 🌟', special: true },
]

export function getDailyBonusState() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}')
  } catch {
    return {}
  }
}

export function shouldShowBonus() {
  const s = getDailyBonusState()
  return s.lastClaimed !== dayKey()
}

export function claimBonus() {
  const s = getDailyBonusState()
  const t = dayKey()
  if (s.lastClaimed === t) return null

  const streak = isYesterday(s.lastClaimed) ? (s.streak || 0) + 1 : 1
  const dayIdx = Math.min(streak - 1, REWARDS.length - 1)
  const reward = REWARDS[dayIdx]

  localStorage.setItem(KEY, JSON.stringify({ lastClaimed: t, streak }))
  return { ...reward, streak, dayIdx }
}

export function getDayRewards() {
  return REWARDS
}
