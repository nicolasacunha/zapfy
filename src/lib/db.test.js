import { describe, it, expect } from 'vitest'
import { progressToState, stateToProgress, companyToState, stateToCompany } from './db'

const fullRow = {
  xp: 100, streak: 5, hearts: 3, zapcoins: 40, gems: 2,
  league: 'Prata', league_position: 4,
  completed_units: [1, 2], completed_modules: [1], current_module: 2,
}
const fullState = {
  xp: 100, streak: 5, hearts: 3, zapcoins: 40, gems: 2,
  league: 'Prata', leaguePosition: 4,
  completedUnits: [1, 2], completedModules: [1], currentModule: 2,
}

describe('mapa de progress', () => {
  it('linha do banco → state (snake → camel)', () => {
    expect(progressToState(fullRow)).toEqual(fullState)
  })

  it('state → linha do banco (camel → snake)', () => {
    expect(stateToProgress(fullState)).toEqual(fullRow)
  })

  it('round-trip banco → state → banco preserva os campos', () => {
    expect(stateToProgress(progressToState(fullRow))).toEqual(fullRow)
  })

  it('aplica os defaults de leitura quando a linha é null', () => {
    expect(progressToState(null)).toEqual({
      xp: 0, streak: 0, hearts: 5, zapcoins: 0, gems: 0,
      league: 'Bronze', leaguePosition: 1,
      completedUnits: [], completedModules: [], currentModule: 1,
    })
  })

  it('não vaza o mesmo array de default entre chamadas', () => {
    const a = progressToState(null)
    a.completedUnits.push(99)
    expect(progressToState(null).completedUnits).toEqual([])
  })
})

describe('mapa de company', () => {
  it('banco → state', () => {
    expect(companyToState({ name: 'TechKids', type: 'digital', product: 'App', is_founder: true }))
      .toEqual({ name: 'TechKids', type: 'digital', product: 'App', isFounder: true })
  })

  it('state → banco', () => {
    expect(stateToCompany({ name: 'TechKids', type: 'digital', product: 'App', isFounder: true }))
      .toEqual({ name: 'TechKids', type: 'digital', product: 'App', is_founder: true })
  })

  it('isFounder assume false quando ausente', () => {
    expect(stateToCompany({ name: 'X', type: 'loja', product: 'Y' }).is_founder).toBe(false)
  })
})
