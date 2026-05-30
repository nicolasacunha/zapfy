const TYPE_LABEL = { loja: 'loja', servico: 'negócio de serviços', digital: 'negócio digital' }

const CORRECT = [
  (n, t) => `Isso! Uma ${t} como a ${n} precisa saber disso.`,
  (n) => `Exato! Esse conhecimento vai impulsionar a ${n}.`,
  (n) => `Perfeito. É assim que a ${n} vai crescer.`,
]
const WRONG = [
  (n) => `Quase! Pensa no que faria sentido pra ${n} e tenta de novo.`,
  () => `Todo empreendedor erra antes de acertar. Mais uma tentativa.`,
  (n) => `A ${n} precisa de você. Tenta de novo.`,
]

export function getCopy(key, { company, user, streak = 0, level = 1 } = {}) {
  const name = company?.name || 'sua empresa'
  const type = TYPE_LABEL[company?.type] || 'negócio'

  switch (key) {
    case 'lessonCorrect': {
      const fn = CORRECT[Math.floor(Math.random() * CORRECT.length)]
      return fn(name, type)
    }
    case 'lessonWrong': {
      const fn = WRONG[Math.floor(Math.random() * WRONG.length)]
      return fn(name)
    }
    case 'lessonComplete':
      return company ? `A ${name} tá orgulhosa de você.` : 'Arrasou.'
    case 'streakMessage':
      return company ? `${streak} dias estudando pra ${name}! 🔥` : `${streak} dias de streak! 🔥`
    case 'levelUp':
      return company
        ? `Nível ${level}! A ${name} tá crescendo junto com você! ⚡`
        : `Nível ${level} desbloqueado. ⚡`
    case 'pathwayGreeting':
      return company ? `A ${name} te espera hoje.` : 'Pronto para avançar hoje?'
    case 'missionComplete':
      return company ? `Missão cumprida. A ${name} avança.` : 'Missão cumprida.'
    default:
      return key
  }
}
