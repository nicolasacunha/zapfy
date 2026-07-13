// Regras de domínio derivadas do progresso da criança — puras e testáveis.
// Antes viviam embutidas em componentes de tela (inferência dentro do render,
// sem teste possível pela interface atual).

// Tipo de empresa sugerido a partir das escolhas dos exercícios (m1-ideia, m2-nome).
// Devolve 'loja' | 'servico' | 'digital' | null.
export function inferCompanyType(lessonChoices) {
  const m2 = lessonChoices?.['m2-nome']?.[0] || ''
  const m1 = lessonChoices?.['m1-ideia']?.[0] || ''
  if (m2.includes('Produto físico')) return 'loja'
  if (m2.includes('Digital') || m1.includes('Tecnologia')) return 'digital'
  if (m2.includes('Serviço') || m1.includes('Desenho') || m1.includes('Estudos')) return 'servico'
  return null
}

// Projeção das "habilidades de empreendedor" que o painel do pai mostra, a partir
// das unidades concluídas. Pesos por habilidade, teto em 100. Só domínio (nome + %);
// a cor de cada barra é decisão de apresentação da tela.
const SKILL_DEFS = [
  { name: 'Identificar oportunidades', base: 20, perUnit: 10 },
  { name: 'Pensar como cliente',       base: 0,  perUnit: 8 },
  { name: 'Matemática de negócio',     base: 0,  perUnit: 5 },
  { name: 'Comunicação e pitch',       base: 0,  perUnit: 4 },
]

export function skillsFromProgress(doneUnits = 0) {
  return SKILL_DEFS.map(s => ({
    name: s.name,
    pct:  Math.min(100, s.base + doneUnits * s.perUnit),
  }))
}
