import { Eye, Heart, Shield, Users } from 'lucide-react'

/**
 * SEÇÃO 5 — CONFIANÇA E SEGURANÇA
 * Bloco decisivo para a conversão do pai. Só afirmações verificáveis
 * no produto real — sem selos, números ou certificações inventadas.
 * Painel único sobre o shell escuro, com linhas assimétricas.
 */

const PILARES = [
  {
    icone: Users,
    titulo: 'Sem conversa com estranhos',
    texto:
      'Quem fala com seu filho é o Zappy, o mascote do app. A liga semanal mostra um placar — não há chat nem rede social.',
  },
  {
    icone: Eye,
    titulo: 'Você vê tudo',
    texto:
      'O modo pai mostra o que a criança fez no app e as fotos das missões cumpridas fora dele — no seu ritmo, sem olhar por cima do ombro.',
  },
  {
    icone: Shield,
    titulo: 'Mundo real com a família',
    texto:
      'Os desafios fora do app envolvem a casa, a vizinhança e o seu negócio. A primeira venda acontece com você por perto.',
  },
  {
    icone: Heart,
    titulo: 'Erro sem bronca',
    texto:
      'Quando a criança erra, tenta de novo na hora — sem culpa e sem vergonha. Errar faz parte de empreender, e o app trata assim.',
  },
]

export default function Confianca() {
  return (
    <section className="border-t border-line bg-white">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="rounded-card bg-shell p-6 text-white md:p-12">
          <div className="md:grid md:grid-cols-[0.9fr_1.1fr] md:gap-12">
            {/* cabeçalho à esquerda, lista à direita — nada de grid de cards */}
            <div>
              <h2 className="text-3xl font-extrabold leading-tight md:text-4xl">
                Seguro para a criança, transparente para você
              </h2>
              <p className="mt-3 text-base leading-relaxed text-white/70">
                Antes de colocar o Zapfy na mão do seu filho, você merece saber
                exatamente o que ele faz — e o que não faz.
              </p>
            </div>
            <ul className="mt-8 md:mt-0">
              {PILARES.map((pilar, i) => (
                <li
                  key={pilar.titulo}
                  className={[
                    'flex gap-4 py-5',
                    i > 0 ? 'border-t border-white/10' : 'md:pt-0',
                  ].join(' ')}
                >
                  <pilar.icone
                    size={22}
                    className="mt-0.5 shrink-0 text-success"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-display text-lg font-extrabold">
                      {pilar.titulo}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-white/70 md:text-base">
                      {pilar.texto}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
