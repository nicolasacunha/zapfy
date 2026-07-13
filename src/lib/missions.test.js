import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  getMissions,
  trackMission,
  claimDailyMission,
  hasPendingMissions,
  allMissionsDone,
} from './missions'

// localStorage em memória — sem jsdom. Cada teste começa limpo.
beforeEach(() => {
  let store = {}
  vi.stubGlobal('localStorage', {
    getItem: k => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v) },
    removeItem: k => { delete store[k] },
    clear: () => { store = {} },
  })
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-07-12T10:00:00Z'))
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

const byId = (id) => getMissions().find(m => m.id === id)

describe('missões diárias — resgate', () => {
  it('missão não concluída não é resgatável e claim devolve null', () => {
    expect(byId('complete_lessons').claimable).toBe(false)
    expect(claimDailyMission('complete_lessons')).toBeNull()
  })

  it('paga a recompensa uma única vez (idempotência)', () => {
    trackMission('lessons')
    expect(byId('complete_lessons').claimable).toBe(true)

    expect(claimDailyMission('complete_lessons')).toEqual({ xp: 50, zapcoins: 20 })
    // segundo resgate no mesmo dia não paga de novo — este era o bug
    expect(claimDailyMission('complete_lessons')).toBeNull()
    expect(byId('complete_lessons').claimed).toBe(true)
    expect(byId('complete_lessons').claimable).toBe(false)
  })

  it('duas diárias distintas resgatam sem colidir', () => {
    trackMission('lessons')
    trackMission('correct')
    expect(claimDailyMission('complete_lessons')).toEqual({ xp: 50, zapcoins: 20 })
    expect(claimDailyMission('correct_answers')).toEqual({ xp: 40, zapcoins: 15 })
  })

  it('id inexistente devolve null', () => {
    expect(claimDailyMission('nao_existe')).toBeNull()
  })
})

describe('missões diárias — ciclo do dia', () => {
  it('reset na virada de dia zera concluídas e resgatadas', () => {
    trackMission('lessons')
    claimDailyMission('complete_lessons')
    expect(byId('complete_lessons').claimed).toBe(true)

    vi.setSystemTime(new Date('2026-07-13T00:05:00Z')) // dia seguinte
    const m = byId('complete_lessons')
    expect(m.done).toBe(false)
    expect(m.claimed).toBe(false)
    expect(m.claimable).toBe(false)
  })

  it('streak_goal fica resgatável quando o streak alcança o alvo', () => {
    trackMission('streak', 1)
    expect(byId('streak_goal').done).toBe(true)
    expect(claimDailyMission('streak_goal')).toEqual({ xp: 60, zapcoins: 25 })
  })
})

describe('agregados usados pela UI e pelo TabBar', () => {
  it('hasPendingMissions só some quando tudo foi resgatado', () => {
    trackMission('lessons')
    trackMission('correct')
    trackMission('streak', 1)
    // concluídas mas não resgatadas → ainda pendente
    expect(hasPendingMissions(1)).toBe(true)

    claimDailyMission('complete_lessons')
    claimDailyMission('correct_answers')
    claimDailyMission('streak_goal')
    expect(hasPendingMissions(1)).toBe(false)
    expect(allMissionsDone(1)).toBe(true)
  })
})
