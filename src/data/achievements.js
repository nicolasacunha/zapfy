export const ACHIEVEMENTS = [
  { id: 'primeira_licao', emoji: '🚀', name: 'Primeiro Voo',       desc: 'Completou a primeira lição',    check: s => s.completedUnits.length >= 1 },
  { id: 'streak_3',       emoji: '🔥', name: 'Pegando Fogo',       desc: '3 dias seguidos',               check: s => s.streak >= 3 },
  { id: 'streak_7',       emoji: '🌋', name: 'Semana Quente',      desc: '7 dias de streak',              check: s => s.streak >= 7 },
  { id: 'streak_30',      emoji: '💎', name: 'Imparável',          desc: '30 dias de streak',             check: s => s.streak >= 30 },
  { id: 'xp_500',         emoji: '⚡', name: 'Energizado',         desc: '500 XP acumulados',             check: s => s.xp >= 500 },
  { id: 'empresa_criada', emoji: '🏢', name: 'Fundador',           desc: 'Criou sua primeira empresa',    check: s => s.company !== null },
  { id: 'fundador_real',  emoji: '👑', name: 'Founder de Verdade', desc: 'Completou o desafio real',      check: s => s.company?.isFounder === true },
  { id: 'colecionador',   emoji: '🏅', name: 'Colecionador',       desc: '5 unidades completas',          check: s => s.completedUnits.length >= 5 },
  { id: 'modulo_1',       emoji: '💡', name: 'Visionário',         desc: 'Módulo 1 completo',             check: s => s.completedModules.includes(1) },
  { id: 'rico',           emoji: '🪙', name: 'Tesoureiro',         desc: '100 Zapcoins acumulados',       check: s => s.zapcoins >= 100 },
  { id: 'perfeccionista', emoji: '🎯', name: 'Perfeccionista',     desc: 'Lição sem nenhum erro',         check: s => s.perfectLessons >= 1 },
  { id: 'missao',         emoji: '📋', name: 'Em Missão',          desc: 'Completou missão do dia',       check: s => s.missionsDoneToday >= 1 },
]

export function getAchievement(id) {
  return ACHIEVEMENTS.find(a => a.id === id)
}

export function checkNewAchievements(prevUnlocked, nextState) {
  return ACHIEVEMENTS
    .filter(a => !prevUnlocked.includes(a.id) && a.check(nextState))
    .map(a => a.id)
}
