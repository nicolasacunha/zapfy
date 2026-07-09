/**
 * SEÇÃO 2 — O PROBLEMA
 * Fala com o pai empreendedor: empreender se aprende fazendo,
 * e a escola não cobre isso. O dado "7 de 10" é apresentado como
 * escuta da comunidade (autorizado pelo dono em 08/jul/2026) —
 * nunca como pesquisa formal/verificada.
 */
export default function Problema() {
  return (
    <section className="bg-app-bg">
      <div className="mx-auto max-w-6xl items-center gap-14 px-5 py-16 md:grid md:grid-cols-[1.1fr_0.9fr] md:px-8 md:py-24">
        <div>
          <h2 className="text-3xl font-extrabold leading-tight text-ink md:text-4xl">
            Criar, vender e atender cliente — isso a escola não ensina
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft md:text-lg">
            A escola prepara seu filho para a prova. Ter uma ideia, transformar
            em produto e fechar a primeira venda, ele aprende do mesmo jeito
            que você aprendeu: fazendo.
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft md:text-lg">
            A diferença é que ele pode começar aos 8 anos, com você por perto —
            em vez de descobrir tudo sozinho aos 30, pagando caro por cada
            erro.
          </p>
        </div>

        {/* dado da comunidade — card levemente rotacionado, Zappy vazando a borda */}
        <figure className="relative mx-auto mt-12 w-full max-w-sm rotate-1 rounded-card border border-line bg-white p-7 shadow-key-neutral md:mt-0 md:p-8">
          <img
            src="/zappy/educativo.png"
            alt=""
            className="absolute -top-12 right-4 w-20 -rotate-3 md:-top-14 md:w-24"
          />
          <p className="font-display text-5xl font-extrabold leading-none text-primary md:text-6xl">
            7 de 10
          </p>
          <figcaption className="mt-3 text-base leading-relaxed text-ink-soft">
            filhos de empreendedores crescem sem entender o negócio dos pais —
            foi o que ouvimos das famílias da nossa comunidade.
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
