import { describe, it, expect } from 'vitest'
import {
  rewardForLesson,
  levelFromXp,
  xpInLevel,
  xpPct,
  titleForLevel,
  XP_PER_LESSON,
  ZAPCOINS_PER_LESSON,
  LEVEL_TITLES,
} from './economy'

describe('rewardForLesson', () => {
  it('paga o valor base sem 2x', () => {
    expect(rewardForLesson({ xp2xActive: false })).toEqual({ xp: 25, zapcoins: 10 })
  })

  it('dobra o XP com 2x ativo, zapcoins não dobra', () => {
    expect(rewardForLesson({ xp2xActive: true })).toEqual({ xp: 50, zapcoins: 10 })
  })

  it('sem argumento assume sem 2x', () => {
    expect(rewardForLesson()).toEqual({ xp: XP_PER_LESSON, zapcoins: ZAPCOINS_PER_LESSON })
  })
})

describe('levelFromXp (1-based)', () => {
  it('começa no nível 1', () => {
    expect(levelFromXp(0)).toBe(1)
    expect(levelFromXp(499)).toBe(1)
  })

  it('cruza para o nível 2 em 500 XP', () => {
    expect(levelFromXp(500)).toBe(2)
    expect(levelFromXp(999)).toBe(2)
  })

  it('escala linear a cada 500', () => {
    expect(levelFromXp(1000)).toBe(3)
    expect(levelFromXp(1250)).toBe(3)
  })

  it('trata xp indefinido como 0', () => {
    expect(levelFromXp(undefined)).toBe(1)
  })
})

describe('xpInLevel e xpPct', () => {
  it('xpInLevel é o resto dentro do nível', () => {
    expect(xpInLevel(1250)).toBe(250)
    expect(xpInLevel(500)).toBe(0)
  })

  it('xpPct é o percentual do nível', () => {
    expect(xpPct(1250)).toBe(50)
    expect(xpPct(500)).toBe(0)
    expect(xpPct(1375)).toBe(75)
  })
})

describe('titleForLevel', () => {
  it('mapeia nível para título', () => {
    expect(titleForLevel(1)).toBe('Curioso')
    expect(titleForLevel(3)).toBe('Empreendedor')
  })

  it('faz clamp no último título quando o nível passa da lista', () => {
    expect(titleForLevel(99)).toBe(LEVEL_TITLES[LEVEL_TITLES.length - 1])
  })
})
