const FALLBACKS = [
  'Conheça seus clientes antes de criar qualquer coisa! Pergunte o que eles precisam.',
  'Todo negócio começa com um problema real. Qual problema você resolve?',
  'Preço justo = o que cobre seus custos + seu lucro. Nunca venda abaixo do custo!',
  'Boca a boca é o marketing mais poderoso. Faça um cliente feliz por vez! 😊',
  'Teste sua ideia com poucas pessoas antes de escalar. Melhor errar pequeno!',
]

export async function getAITip(company, lastLesson) {
  const cacheKey = `zapfy_ai_${lastLesson}`
  const cached = sessionStorage.getItem(cacheKey)
  if (cached) return cached

  const apiKey = import.meta.env.VITE_ANTHROPIC_KEY
  if (!apiKey) return FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)]

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 120,
        system: 'Você é Zappy, mascote de empreendedorismo para crianças brasileiras de 8-14 anos. Seja animado, encorajador, linguagem simples. Máximo 75 palavras. Sem markdown.',
        messages: [{
          role: 'user',
          content: `Empresa: "${company?.name || 'minha empresa'}", tipo: ${company?.type || 'negócio'}, produto: "${company?.product || 'serviço'}". Lição aprendida: "${lastLesson}". Dê UMA dica prática relacionando a lição com a empresa desta criança. Seja específico e animado!`,
        }],
      }),
    })
    if (!res.ok) throw new Error(res.status)
    const data = await res.json()
    const tip = data.content?.[0]?.text?.trim() || FALLBACKS[0]
    sessionStorage.setItem(cacheKey, tip)
    return tip
  } catch {
    return FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)]
  }
}
