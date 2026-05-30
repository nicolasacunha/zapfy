export const MODULES = [
  {
    id: 1,
    name: 'O que é empreendedorismo',
    tag: 'Mentalidade · Gratuito',
    color: '#1E40AF',
    units: [
      { id: 'm1-u1', title: 'Por que negócio existe',      lessonId: 'm1-oportunidade' },
      { id: 'm1-u2', title: 'Quem cria valor',             lessonId: 'm1-valor' },
      { id: 'm1-u3', title: 'Encontrando uma oportunidade', lessonId: 'm1-oportunidade2' },
      { id: 'm1-u4', title: 'Sua primeira ideia',          lessonId: 'm1-ideia' },
    ],
  },
  {
    id: 2,
    name: 'Cria sua empresa',
    tag: 'Identidade · Pago',
    color: '#7C3AED',
    isCompanyCreation: true,
    units: [
      { id: 'm2-u1', title: 'Nome do negócio',    lessonId: 'm2-nome'        },
      { id: 'm2-u2', title: 'Identidade da marca', lessonId: 'm2-identidade'  },
      { id: 'm2-u3', title: 'Seu diferencial',     lessonId: 'm2-diferencial' },
    ],
  },
  {
    id: 3,
    name: 'Seu primeiro cliente',
    tag: 'Mercado · Pago',
    color: '#0891B2',
    units: [
      { id: 'm3-u1', title: 'Quem compraria de você',      lessonId: 'm3-cliente' },
      { id: 'm3-u2', title: 'Por que pagar por isso',      lessonId: 'm3-motivo' },
      { id: 'm3-u3', title: 'Onde encontrar seu cliente',  lessonId: 'm3-canais' },
      { id: 'm3-u4', title: 'Como chegar até ele',         lessonId: 'm3-abordagem' },
    ],
  },
  {
    id: 4,
    name: 'Criando e entregando valor',
    tag: 'Valor · Pago',
    color: '#059669',
    units: [
      { id: 'm4-u1', title: 'Custo vs. valor',             lessonId: 'm4-custo' },
      { id: 'm4-u2', title: 'Como precificar',             lessonId: 'm4-preco' },
      { id: 'm4-u3', title: 'Simulação de negociação',     lessonId: 'm4-negociacao' },
      { id: 'm4-u4', title: 'Entregar com responsabilidade', lessonId: 'm4-entrega' },
    ],
  },
  {
    id: 5,
    name: 'Sua primeira venda',
    tag: 'Marco · Anual',
    color: '#B45309',
    units: [
      { id: 'm5-u1', title: 'Preparando a venda',          lessonId: 'm5-prep' },
      { id: 'm5-u2', title: 'Simulação completa',          lessonId: 'm5-simulacao' },
      { id: 'm5-u3', title: 'Desafio: venda real',         lessonId: 'm5-real', isFounder: true },
    ],
  },
]

export function getModule(id) {
  return MODULES.find(m => m.id === id)
}

export function getUnit(unitId) {
  for (const mod of MODULES) {
    const unit = mod.units.find(u => u.id === unitId)
    if (unit) return { unit, module: mod }
  }
  return null
}
