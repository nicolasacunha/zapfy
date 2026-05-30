const KEY = 'zapfy_screen_time'

function today() {
  return new Date().toISOString().slice(0, 10)
}

export function recordSession(ms) {
  if (ms < 5000) return
  const data = JSON.parse(localStorage.getItem(KEY) || '{}')
  const d = today()
  data[d] = (data[d] || 0) + Math.round(ms / 60000)
  const keys = Object.keys(data).sort().slice(-30)
  const trimmed = {}
  keys.forEach(k => { trimmed[k] = data[k] })
  localStorage.setItem(KEY, JSON.stringify(trimmed))
}

export function getLast7Days() {
  const data = JSON.parse(localStorage.getItem(KEY) || '{}')
  const result = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    result.push({ date: key, minutes: data[key] || 0 })
  }
  return result
}

export function getWeekTotal() {
  return getLast7Days().reduce((s, d) => s + d.minutes, 0)
}
