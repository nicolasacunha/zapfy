export const MODULES = [
  {
    id: 1,
    name: 'O que é empreendedorismo',
    tag: 'Mentalidade',
    color: '#1E40AF',
    videoUrl: null,
    mission: {
      type: 'real-world',
      title: 'Caçador de Problemas',
      subtitle: 'Primeira missão de campo',
      instruction: 'Vai até a escola, seu bairro ou fica em casa. Observe por 15 minutos. Encontre 1 problema real que as pessoas têm e ninguém resolve bem. Volte e registre aqui.',
      timeEstimate: '~15 min',
      xp: 50,
      zappyMessage: 'Empreendedores veem o que os outros ignoram. Você consegue!',
      fields: [
        { id: 'problem', type: 'textarea', label: 'Que problema você encontrou?', placeholder: 'Ex: Na fila do lanche, todo mundo espera 10 min...', maxLength: 200 },
        { id: 'where', type: 'radio', label: 'Onde você estava?', options: ['Escola', 'Bairro', 'Casa', 'Outro'] },
      ],
    },
    units: [
      { id: 'm1-u1', title: 'Por que negócio existe',       lessonId: 'm1-oportunidade'  },
      { id: 'm1-u2', title: 'Quem cria valor',              lessonId: 'm1-valor'          },
      { id: 'm1-u3', title: 'Encontrando uma oportunidade', lessonId: 'm1-oportunidade2'  },
      { id: 'm1-u4', title: 'Sua primeira ideia',           lessonId: 'm1-ideia'          },
    ],
  },
  {
    id: 2,
    name: 'Cria sua empresa',
    tag: 'Identidade',
    color: '#7C3AED',
    isCompanyCreation: true,
    videoUrl: null,
    mission: {
      type: 'canvas',
      xp: 100,
    },
    units: [
      { id: 'm2-u1', title: 'Nome do negócio',     lessonId: 'm2-nome'        },
      { id: 'm2-u2', title: 'Identidade da marca',  lessonId: 'm2-identidade'  },
      { id: 'm2-u3', title: 'Seu diferencial',      lessonId: 'm2-diferencial' },
    ],
  },
  {
    id: 3,
    name: 'Seu primeiro cliente',
    tag: 'Mercado',
    color: '#0891B2',
    videoUrl: null,
    mission: {
      type: 'real-world',
      title: 'Primeira Conversa',
      subtitle: 'Pesquisa de mercado de verdade',
      instruction: 'Escolha 1 pessoa que poderia ser cliente do seu produto. Pergunte se ela tem o problema que você resolve. Não tente vender — só pergunte e ouça. 5 minutos.',
      timeEstimate: '~5 min',
      xp: 75,
      zappyMessage: 'Conversa real vale mais que qualquer pesquisa de internet!',
      fields: [
        { id: 'who', type: 'radio', label: 'Com quem você conversou?', options: ['Familiar', 'Amigo', 'Vizinho', 'Colega'] },
        { id: 'response', type: 'textarea', label: 'O que essa pessoa disse?', placeholder: 'Conta como foi a conversa...', maxLength: 200 },
        { id: 'hasProb', type: 'radio', label: 'Essa pessoa tem o problema?', options: ['Sim, claramente', 'Talvez', 'Não'] },
      ],
    },
    units: [
      { id: 'm3-u1', title: 'Quem compraria de você',     lessonId: 'm3-cliente'    },
      { id: 'm3-u2', title: 'Por que pagar por isso',     lessonId: 'm3-motivo'     },
      { id: 'm3-u3', title: 'Onde encontrar seu cliente', lessonId: 'm3-canais'     },
      { id: 'm3-u4', title: 'Como chegar até ele',        lessonId: 'm3-abordagem'  },
    ],
  },
  {
    id: 4,
    name: 'Criando e entregando valor',
    tag: 'Valor',
    color: '#059669',
    videoUrl: null,
    mission: {
      type: 'real-world',
      title: 'Define o Preço',
      subtitle: 'Precificação + prática de objeção',
      instruction: 'Duas etapas: 1) Decida o preço do seu produto — não o mais barato, o que o cliente pagaria com prazer. 2) Peça pra alguém em casa dizer "tá caro" e pratique responder sem baixar o preço.',
      timeEstimate: '~10 min',
      xp: 75,
      zappyMessage: 'Quem aprende a defender o preço nunca mais precisa fazer desconto!',
      fields: [
        { id: 'price', type: 'number', label: 'Que preço você definiu?', prefix: 'R$', placeholder: '0' },
        { id: 'objectionResponse', type: 'textarea', label: 'O que você respondeu ao "tá caro"?', placeholder: 'Escreve sua resposta aqui...', maxLength: 200 },
        { id: 'difficulty', type: 'radio', label: 'Como foi?', options: ['Fui bem!', 'Travei um pouco', 'Foi difícil'] },
      ],
    },
    units: [
      { id: 'm4-u1', title: 'Custo vs. valor',               lessonId: 'm4-custo'       },
      { id: 'm4-u2', title: 'Como precificar',               lessonId: 'm4-preco'       },
      { id: 'm4-u3', title: 'Simulação de negociação',       lessonId: 'm4-negociacao'  },
      { id: 'm4-u4', title: 'Entregar com responsabilidade', lessonId: 'm4-entrega'     },
    ],
  },
  {
    id: 5,
    name: 'Sua primeira venda',
    tag: 'Marco',
    color: '#B45309',
    videoUrl: null,
    mission: {
      type: 'real-world',
      title: 'Tentativa de Venda Real',
      subtitle: 'O momento que muda tudo',
      instruction: 'Escolha 1 pessoa que você conhece. Apresente seu produto e tente vender. Pode ser pelo preço real ou qualquer valor. O que importa é tentar de verdade.',
      timeEstimate: '~15 min',
      xp: 150,
      zappyMessage: 'Não importa o resultado — quem tenta já está na frente de 90% das pessoas!',
      isFounderMission: true,
      fields: [
        { id: 'target', type: 'radio', label: 'Para quem você tentou?', options: ['Familiar', 'Amigo', 'Vizinho', 'Colega de escola'] },
        { id: 'outcome', type: 'radio', label: 'O que aconteceu?', options: ['Vendeu! 🎉', 'Ficou de pensar 🔄', 'Disse não por agora ❌'] },
        { id: 'learning', type: 'textarea', label: 'O que você aprendeu?', placeholder: 'Qualquer resultado é aprendizado...', maxLength: 300 },
      ],
    },
    units: [
      { id: 'm5-u1', title: 'Preparando a venda',   lessonId: 'm5-prep'       },
      { id: 'm5-u2', title: 'Simulação completa',    lessonId: 'm5-simulacao'  },
      { id: 'm5-u3', title: 'Desafio: venda real',   lessonId: 'm5-real', isFounder: true },
    ],
  },
  {
    id: 6,
    name: 'Marketing e Divulgação',
    tag: 'Divulgação',
    color: '#0891B2',
    videoUrl: null,
    mission: {
      type: 'real-world',
      title: 'Primeira Divulgação',
      subtitle: 'Conta para quem ainda não sabe',
      instruction: 'Escolha 3 pessoas que ainda não sabem do seu negócio. Pode ser colega, familiar ou vizinho. Conte o que você faz em até 1 minuto — o nome, o produto, o problema que resolve. Não tente vender. Só conta.',
      timeEstimate: '~20 min',
      xp: 75,
      zappyMessage: 'Quem não sabe que você existe não pode comprar de você.',
      fields: [
        { id: 'reactions', type: 'radio', label: 'Como as pessoas reagiram?', options: ['Curiosidade e interesse', 'Indiferença', 'Misturado'] },
        { id: 'feedback', type: 'textarea', label: 'O que você aprendeu sobre como explicar seu negócio?', placeholder: 'O que funcionou? O que travou?', maxLength: 200 },
      ],
    },
    units: [
      { id: 'm6-u1', title: 'O que é marketing de verdade', lessonId: 'm6-marketing'  },
      { id: 'm6-u2', title: 'Sua história como ferramenta', lessonId: 'm6-historia'   },
      { id: 'm6-u3', title: 'Onde divulgar seu negócio',    lessonId: 'm6-canais2'    },
      { id: 'm6-u4', title: 'Clientes que voltam',          lessonId: 'm6-retencao'   },
    ],
  },
  {
    id: 7,
    name: 'Finanças do Negócio',
    tag: 'Dinheiro',
    color: '#D97706',
    videoUrl: null,
    mission: {
      type: 'real-world',
      title: 'Seu Primeiro Balanço',
      subtitle: 'Quanto você realmente lucrou?',
      instruction: 'Pegue papel e caneta. Liste tudo que vendeu até hoje e some. Depois liste todos os gastos que teve com o negócio. Subtraia. O que sobrou é seu lucro real.',
      timeEstimate: '~15 min',
      xp: 100,
      zappyMessage: 'Saber o lucro real é o que separa quem tem negócio de quem tem hobby.',
      fields: [
        { id: 'revenue', type: 'number', label: 'Total vendido (R$)', prefix: 'R$', placeholder: '0' },
        { id: 'costs',   type: 'number', label: 'Total de custos (R$)', prefix: 'R$', placeholder: '0' },
        { id: 'surprise', type: 'radio', label: 'O resultado te surpreendeu?', options: ['Lucrei mais do que pensava', 'Lucrei menos do que pensava', 'Era o que eu esperava'] },
      ],
    },
    units: [
      { id: 'm7-u1', title: 'Receita não é lucro',      lessonId: 'm7-receita'        },
      { id: 'm7-u2', title: 'Seus custos reais',         lessonId: 'm7-custos'         },
      { id: 'm7-u3', title: 'O que fazer com o lucro',   lessonId: 'm7-reinvestimento' },
    ],
  },
  {
    id: 8,
    name: 'Crescimento',
    tag: 'Escala',
    color: '#9333EA',
    videoUrl: null,
    mission: {
      type: 'real-world',
      title: 'Meta de 30 Dias',
      subtitle: 'Com número, não com vontade',
      instruction: 'Defina uma meta para os próximos 30 dias. Precisa ter número, prazo e uma ação concreta para cada semana. Escreva aqui e cole num lugar visível.',
      timeEstimate: '~10 min',
      xp: 100,
      zappyMessage: 'Meta sem número é desejo. Com número, é compromisso.',
      fields: [
        { id: 'goal',   type: 'textarea', label: 'Qual é sua meta de 30 dias?', placeholder: 'Ex: Vender 20 unidades por semana, 4 semanas seguidas', maxLength: 200 },
        { id: 'week1',  type: 'textarea', label: 'O que você vai fazer na semana 1?', placeholder: 'Ação específica...', maxLength: 150 },
        { id: 'track',  type: 'radio',    label: 'Como vai acompanhar?', options: ['Caderno', 'Celular', 'Planilha'] },
      ],
    },
    units: [
      { id: 'm8-u1', title: 'Crescer sem perder qualidade', lessonId: 'm8-qualidade' },
      { id: 'm8-u2', title: 'Trabalhar com alguém',         lessonId: 'm8-parceria'  },
      { id: 'm8-u3', title: 'Meta com número',              lessonId: 'm8-meta'      },
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

export function isLastUnitOfModule(unitId) {
  for (const mod of MODULES) {
    const lastUnit = mod.units[mod.units.length - 1]
    if (lastUnit?.id === unitId) return mod
  }
  return null
}

export function isFirstUnitOfModule(unitId) {
  for (const mod of MODULES) {
    if (mod.units[0]?.id === unitId) return mod
  }
  return null
}
