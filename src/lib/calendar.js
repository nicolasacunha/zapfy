// Dia-calendário do usuário (LOCAL). `new Date().toISOString().slice(0,10)` devolve
// o dia em UTC — para quem está fora de UTC (Brasil = UTC-3) o dia "vira" às 21h
// locais, adiantando streak e resets diários. Fixar o horário em meio-dia local antes
// do slice garante o dia-calendário correto do usuário. Fonte única de "que dia é hoje".

export function dayKey(d = new Date()) {
  const x = new Date(d)
  x.setHours(12, 0, 0, 0)
  return x.toISOString().slice(0, 10)
}

// Dias inteiros entre uma data (string 'YYYY-MM-DD' ou Date) e agora, nunca negativo.
export function daysBetween(from, now = new Date()) {
  if (!from) return 0
  const MS = 24 * 60 * 60 * 1000
  const a = new Date(from); a.setHours(0, 0, 0, 0)
  const b = new Date(now);  b.setHours(0, 0, 0, 0)
  return Math.max(0, Math.round((b - a) / MS))
}

// lastKey é o dia-calendário imediatamente anterior a `now`?
export function isYesterday(lastKey, now = new Date()) {
  if (!lastKey) return false
  const y = new Date(now)
  y.setDate(y.getDate() - 1)
  return lastKey === dayKey(y)
}

// Regra única do streak de jogo — pura e testável. Autoridade sobre avançar/reiniciar.
//   jogou hoje de novo        → mantém
//   primeira vez              → 1
//   jogou ontem OU freeze on   → +1
//   pulou >1 dia sem freeze    → reinicia em 1
export function nextStreak({ current = 0, lastKey, freezeActive = false, now = new Date() }) {
  const today = dayKey(now)
  if (lastKey === today) return current
  if (!lastKey) return 1
  if (isYesterday(lastKey, now) || freezeActive) return current + 1
  return 1
}
