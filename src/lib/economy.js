// Fonte única da economia do jogo: quanto vale uma lição, como o XP vira nível e
// título. Antes essas magnitudes e fórmulas viviam redigitadas no reducer e em
// várias telas (o 2x chegava a divergir entre crédito e animação). Reducer e telas
// consomem daqui.

export const XP_PER_LESSON      = 25
export const XP_2X_MULTIPLIER   = 2
export const ZAPCOINS_PER_LESSON = 10
export const XP_PER_LEVEL       = 500

export const LEVEL_TITLES = [
  'Curioso', 'Aprendiz', 'Empreendedor', 'Estrategista', 'Visionário', 'Fundador', 'Lenda',
]

// Recompensa de uma lição concluída. Recebe o mesmo input que o reducer usa para
// creditar, então a tela de resultado anima exatamente o que foi ganho.
export function rewardForLesson({ xp2xActive = false } = {}) {
  return {
    xp:       xp2xActive ? XP_PER_LESSON * XP_2X_MULTIPLIER : XP_PER_LESSON,
    zapcoins: ZAPCOINS_PER_LESSON,
  }
}

// Nível 1-based — a convenção única do app (display e level-up).
export function levelFromXp(xp) {
  return Math.floor((xp || 0) / XP_PER_LEVEL) + 1
}

// XP acumulado dentro do nível atual (0..XP_PER_LEVEL-1) e seu percentual.
export function xpInLevel(xp) {
  return (xp || 0) % XP_PER_LEVEL
}

export function xpPct(xp) {
  return Math.round((xpInLevel(xp) / XP_PER_LEVEL) * 100)
}

// Título do nível, com clamp no último quando o nível passa da lista.
export function titleForLevel(level) {
  return LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)]
}
