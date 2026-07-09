import { ChevronDown } from 'lucide-react'

/**
 * SEÇÃO 6 — PERGUNTAS QUE OS PAIS FAZEM
 * Só respostas que o produto sustenta hoje. Sem preço (indefinido),
 * sem promessas de plataforma. Accordion nativo (<details>), sem modal.
 */

const PERGUNTAS = [
  {
    pergunta: 'Para que idade é o Zapfy?',
    resposta:
      'Crianças e pré-adolescentes de 8 a 14 anos. O conteúdo é o mesmo para todos; o ritmo é o de cada criança.',
  },
  {
    pergunta: 'Funciona em Android?',
    resposta:
      'Por enquanto o Zapfy é para iPhone e iPad. Se isso mudar, quem está na lista de espera fica sabendo primeiro.',
  },
  {
    pergunta: 'Quanto tempo por dia meu filho vai passar na tela?',
    resposta:
      'A missão diária leva uns 5 minutos. Os desafios maiores acontecem fora do app — na cozinha, na feira, no seu negócio.',
  },
  {
    pergunta: 'Meu filho vai vender de verdade?',
    resposta:
      'Vai — do tamanho dele e com você por perto. Limonada, brigadeiro, adesivo: o produto é da criança, a supervisão é sua.',
  },
  {
    pergunta: 'Quanto custa?',
    resposta:
      'O acesso antecipado é gratuito. Os planos serão anunciados antes do lançamento — e quem está na lista de espera fica sabendo primeiro.',
  },
]

export default function Faq() {
  return (
    <section className="bg-app-bg">
      <div className="mx-auto max-w-6xl gap-14 px-5 py-16 md:grid md:grid-cols-[0.8fr_1.2fr] md:px-8 md:py-24">
        <h2 className="text-3xl font-extrabold leading-tight text-ink md:text-4xl">
          Perguntas que os pais fazem
        </h2>
        <div className="mt-8 md:mt-0">
          {PERGUNTAS.map((item, i) => (
            <details
              key={item.pergunta}
              className={[
                'group py-4',
                i > 0 ? 'border-t border-line' : 'md:pt-1',
              ].join(' ')}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-extrabold text-ink [&::-webkit-details-marker]:hidden">
                {item.pergunta}
                <ChevronDown
                  size={20}
                  className="shrink-0 text-ink-soft transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="mt-2 max-w-xl text-base leading-relaxed text-ink-soft">
                {item.resposta}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
