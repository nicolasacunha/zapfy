import { Camera, Check, Flame, Lock } from 'lucide-react'

/**
 * SEÇÃO 4 — O QUE O PAI GANHA
 * Painel do responsável (modo pai com PIN) + o argumento do tempo de tela.
 * Mock do dashboard montado com os tokens reais do sistema.
 */

const GANHOS = [
  {
    icone: Lock,
    titulo: 'Modo pai com PIN',
    texto:
      'Relatórios e configurações ficam atrás de um PIN que só você tem. A criança joga; o controle é seu.',
  },
  {
    icone: Camera,
    titulo: 'Progresso sem interrogatório',
    texto:
      'Você vê as missões concluídas, a sequência de dias e as provas em foto — sem precisar perguntar "e aí, fez?".',
  },
  {
    icone: Flame,
    titulo: 'Tempo de tela que rende assunto',
    texto:
      'A missão de hoje vira conversa de negócio no jantar — o app é a menor parte, o resto acontece fora da tela.',
  },
]

function MockPainel() {
  const linhas = [
    { dia: 'Seg', missao: 'Escolheu o nome da empresa', prova: true },
    { dia: 'Ter', missao: 'Definiu o primeiro produto', prova: true },
    { dia: 'Qua', missao: 'Listou 3 possíveis clientes', prova: false },
  ]
  return (
    <div className="w-full max-w-sm rounded-card border border-line bg-white p-5 shadow-key-neutral">
      <div className="flex items-center justify-between">
        <p className="font-display text-lg font-extrabold text-ink">
          Semana do seu filho
        </p>
        <span className="flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent-dark">
          <Flame size={13} aria-hidden="true" />7 dias
        </span>
      </div>
      <div className="mt-4 flex flex-col gap-2.5">
        {linhas.map((linha) => (
          <div
            key={linha.dia}
            className="flex items-center gap-3 rounded-btn bg-app-bg px-3 py-2.5"
          >
            <span className="w-8 text-xs font-bold text-ink-soft">
              {linha.dia}
            </span>
            <span className="flex-1 text-sm font-semibold text-ink">
              {linha.missao}
            </span>
            {/* check = missão feita; câmera = tem foto de prova anexada */}
            {linha.prova && (
              <Camera size={15} className="text-primary" aria-hidden="true" />
            )}
            <Check size={15} className="text-success" aria-hidden="true" />
          </div>
        ))}
      </div>
      <p className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-ink-soft">
        <Lock size={12} aria-hidden="true" />
        Visível só no modo pai, protegido por PIN
      </p>
    </div>
  )
}

export default function PainelPai() {
  return (
    <section className="bg-app-bg">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:px-8 md:py-24">
        <div>
          <h2 className="text-3xl font-extrabold leading-tight text-ink md:text-4xl">
            E o que você ganha vendo de fora
          </h2>
          <div className="mt-8 flex flex-col gap-6">
            {GANHOS.map((ganho) => (
              <div key={ganho.titulo} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-btn bg-primary text-white shadow-key-primary">
                  <ganho.icone size={20} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-display text-lg font-extrabold text-ink">
                    {ganho.titulo}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft md:text-base">
                    {ganho.texto}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center">
          <MockPainel />
        </div>
      </div>
    </section>
  )
}
