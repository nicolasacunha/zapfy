import { describe, it, expect } from 'vitest'
import { dayKey, daysBetween, isYesterday, nextStreak } from './calendar'

// Datas derivadas via dayKey para robustez ao fuso do runner de testes.
const now        = new Date('2026-07-12T12:00:00')
const today      = dayKey(now)
const yesterday  = dayKey(new Date('2026-07-11T12:00:00'))
const twoDaysAgo = dayKey(new Date('2026-07-10T12:00:00'))

describe('dayKey', () => {
  it('devolve YYYY-MM-DD', () => {
    expect(dayKey(now)).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('a hora do dia não muda o dia (o cerne do fix de fuso)', () => {
    const manha = dayKey(new Date('2026-07-12T08:00:00'))
    const noite = dayKey(new Date('2026-07-12T22:00:00'))
    expect(manha).toBe(noite)
  })
})

describe('isYesterday', () => {
  it('reconhece o dia anterior', () => {
    expect(isYesterday(yesterday, now)).toBe(true)
  })

  it('hoje e anteontem não são ontem', () => {
    expect(isYesterday(today, now)).toBe(false)
    expect(isYesterday(twoDaysAgo, now)).toBe(false)
  })

  it('sem lastKey é falso', () => {
    expect(isYesterday(null, now)).toBe(false)
  })
})

describe('daysBetween', () => {
  it('conta os dias entre duas datas', () => {
    expect(daysBetween(new Date('2026-07-10T00:00:00'), new Date('2026-07-12T00:00:00'))).toBe(2)
  })

  it('sem origem devolve 0', () => {
    expect(daysBetween(null)).toBe(0)
  })
})

describe('nextStreak', () => {
  it('mantém o streak se já jogou hoje', () => {
    expect(nextStreak({ current: 5, lastKey: today, now })).toBe(5)
  })

  it('começa em 1 na primeira vez', () => {
    expect(nextStreak({ current: 0, lastKey: null, now })).toBe(1)
  })

  it('incrementa se jogou ontem', () => {
    expect(nextStreak({ current: 5, lastKey: yesterday, now })).toBe(6)
  })

  it('reinicia se pulou mais de um dia sem freeze', () => {
    expect(nextStreak({ current: 5, lastKey: twoDaysAgo, freezeActive: false, now })).toBe(1)
  })

  it('freeze ativo segura o streak mesmo pulando dias', () => {
    expect(nextStreak({ current: 5, lastKey: twoDaysAgo, freezeActive: true, now })).toBe(6)
  })
})
