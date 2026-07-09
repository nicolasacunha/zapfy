/**
 * SEÇÃO 6 — PROVA SOCIAL
 * Nenhum depoimento real foi fornecido: os cards abaixo são placeholders
 * explícitos, marcados para substituição. Nunca inventar nome ou número.
 */

const DEPOIMENTOS = [
  {
    texto: '[DEPOIMENTO A SUBSTITUIR]',
    autor: '[NOME A SUBSTITUIR], pai/mãe de uma criança de [IDADE] anos',
  },
  {
    texto: '[DEPOIMENTO A SUBSTITUIR]',
    autor: '[NOME A SUBSTITUIR], pai/mãe de uma criança de [IDADE] anos',
  },
]

export default function Depoimentos() {
  return (
    <section className="bg-app-bg">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <h2 className="text-center text-2xl font-extrabold text-ink md:text-3xl">
          O que outros pais dizem
        </h2>
        <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2">
          {DEPOIMENTOS.map((depoimento, i) => (
            <figure
              key={i}
              className="rounded-card border border-line bg-white p-6 shadow-key-neutral"
            >
              <p
                className="font-display text-3xl font-extrabold leading-none text-accent"
                aria-hidden="true"
              >
                “
              </p>
              <blockquote className="mt-1 text-base leading-relaxed text-ink">
                {depoimento.texto}
              </blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-ink-soft">
                — {depoimento.autor}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
