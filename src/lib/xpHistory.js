const KEY = 'zapfy_xp_history'

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export function recordXP(amount) {
  const hist = JSON.parse(localStorage.getItem(KEY) || '{}')
  const today = todayKey()
  hist[today] = (hist[today] || 0) + amount
  // mantém apenas 30 dias para não crescer indefinidamente
  const keys = Object.keys(hist).sort().slice(-30)
  const trimmed = Object.fromEntries(keys.map(k => [k, hist[k]]))
  localStorage.setItem(KEY, JSON.stringify(trimmed))
}

// Retorna [Seg, Ter, Qua, Qui, Sex, Sáb, Dom] da semana atual
export function getWeekXP() {
  const hist = JSON.parse(localStorage.getItem(KEY) || '{}')
  const now  = new Date()
  // JS: 0=Dom, 1=Seg ... ajusta para Seg=0
  const jsDay = now.getDay()
  const mondayDelta = jsDay === 0 ? -6 : 1 - jsDay
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now)
    d.setDate(now.getDate() + mondayDelta + i)
    return hist[d.toISOString().slice(0, 10)] || 0
  })
}
