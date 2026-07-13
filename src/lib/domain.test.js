import { describe, it, expect } from 'vitest'
import { inferCompanyType, skillsFromProgress } from './domain'

describe('inferCompanyType', () => {
  it('produto físico → loja', () => {
    expect(inferCompanyType({ 'm2-nome': ['Produto físico caseiro'] })).toBe('loja')
  })

  it('digital (por m2-nome ou por tecnologia em m1) → digital', () => {
    expect(inferCompanyType({ 'm2-nome': ['Digital / app'] })).toBe('digital')
    expect(inferCompanyType({ 'm1-ideia': ['Tecnologia e games'] })).toBe('digital')
  })

  it('serviço (por m2 ou desenho/estudos em m1) → servico', () => {
    expect(inferCompanyType({ 'm2-nome': ['Serviço sob demanda'] })).toBe('servico')
    expect(inferCompanyType({ 'm1-ideia': ['Desenho e arte'] })).toBe('servico')
    expect(inferCompanyType({ 'm1-ideia': ['Estudos e reforço'] })).toBe('servico')
  })

  it('sem escolhas → null', () => {
    expect(inferCompanyType(null)).toBeNull()
    expect(inferCompanyType({})).toBeNull()
  })
})

describe('skillsFromProgress', () => {
  it('sem unidades: só a habilidade com base começa acima de 0', () => {
    expect(skillsFromProgress(0).map(s => s.pct)).toEqual([20, 0, 0, 0])
  })

  it('escala por unidade concluída', () => {
    // base 20 + 3*10 = 50; 3*8=24; 3*5=15; 3*4=12
    expect(skillsFromProgress(3).map(s => s.pct)).toEqual([50, 24, 15, 12])
  })

  it('faz clamp em 100', () => {
    expect(skillsFromProgress(100).every(s => s.pct === 100)).toBe(true)
  })

  it('preserva os nomes de domínio', () => {
    expect(skillsFromProgress(1)[0].name).toBe('Identificar oportunidades')
  })
})
