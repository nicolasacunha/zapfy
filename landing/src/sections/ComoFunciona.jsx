import { Camera, Check, Flame, Heart, Lock, Zap } from 'lucide-react'
import PhoneMock from '../components/PhoneMock.jsx'

/**
 * SEÇÃO 3 — COMO FUNCIONA PARA A CRIANÇA
 * 3 passos, cada um com um mockup do app montado com os tokens reais
 * (trilha, missão e celebração). Nomes de módulo vêm do produto real.
 */

function CoinDot({ size = 'h-4 w-4' }) {
  return (
    <span
      className={`inline-block ${size} rounded-full border-2 border-coin-dark bg-coin`}
      aria-hidden="true"
    />
  )
}

/* Mockup 1 — trilha de módulos, com header de streak/vidas/moedas */
function MockTrilha() {
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-bold text-ink">
        <span className="flex items-center gap-1">
          <Flame size={14} className="text-accent" aria-hidden="true" />7
        </span>
        <span className="flex items-center gap-1">
          <Heart size={14} className="fill-danger text-danger" aria-hidden="true" />5
        </span>
        <span className="flex items-center gap-1">
          <CoinDot size="h-3.5 w-3.5" />
          120
        </span>
      </div>
      <p className="mt-3 rounded-btn bg-primary px-3 py-2 text-center text-[11px] font-extrabold uppercase tracking-wide text-white">
        Módulo 1 · O que é empreendedorismo
      </p>
      <div className="mt-3 flex flex-col items-center gap-2.5">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-success text-white shadow-key-success">
          <Check size={20} aria-hidden="true" />
        </span>
        <span className="ml-10 flex h-11 w-11 items-center justify-center rounded-full bg-success text-white shadow-key-success">
          <Check size={20} aria-hidden="true" />
        </span>
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-key-accent ring-4 ring-accent/25">
          <Zap size={22} aria-hidden="true" />
        </span>
        <span className="mr-10 flex h-11 w-11 items-center justify-center rounded-full bg-line text-ink-soft">
          <Lock size={18} aria-hidden="true" />
        </span>
      </div>
      <img
        src="/zappy/feliz.png"
        alt=""
        className="mx-auto -mb-1 mt-1 w-16"
      />
    </div>
  )
}

/* Mockup 2 — missão de múltipla escolha com barra de XP */
function MockMissao() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-line">
          <div className="h-full w-3/5 rounded-full bg-success" />
        </div>
        <span className="flex items-center gap-1 text-xs font-bold text-ink">
          <Heart size={13} className="fill-danger text-danger" aria-hidden="true" />5
        </span>
      </div>
      <p className="mt-4 text-base font-bold leading-snug text-ink">
        Sua banca de limonada vende mais em que dia?
      </p>
      <div className="mt-3 flex flex-col gap-2 text-sm font-semibold text-ink">
        <span className="rounded-btn border-2 border-success bg-success/10 px-3 py-2.5">
          Dia de sol na feira
        </span>
        <span className="rounded-btn border-2 border-line px-3 py-2.5">
          Dia de chuva
        </span>
        <span className="rounded-btn border-2 border-line px-3 py-2.5">
          Segunda bem cedo
        </span>
      </div>
      <p className="mt-3 rounded-btn bg-primary py-2.5 text-center text-xs font-extrabold uppercase tracking-wide text-white shadow-key-primary">
        Confirmar
      </p>
    </div>
  )
}

/* Mockup 3 — missão do mundo real com prova em foto (o diferencial da página) */
function MockMundoReal() {
  return (
    <div>
      <p className="rounded-btn bg-accent px-3 py-2 text-center text-[11px] font-extrabold uppercase tracking-wide text-white">
        Missão do mundo real
      </p>
      <p className="mt-3 text-base font-bold leading-snug text-ink">
        Faça sua primeira venda e registre a prova
      </p>
      <div className="mt-3 flex h-20 flex-col items-center justify-center gap-1 rounded-btn border-2 border-dashed border-line bg-white text-ink-soft">
        <Camera size={18} aria-hidden="true" />
        <span className="text-xs font-semibold">foto da venda anexada</span>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-btn bg-success/10 px-3 py-2">
        <img src="/zappy/celebrando.png" alt="" className="w-9" />
        <p className="text-sm font-bold leading-tight text-ink">
          Primeira venda registrada! 🎉
        </p>
      </div>
      <p className="mt-3 rounded-btn bg-accent py-2.5 text-center text-xs font-extrabold uppercase tracking-wide text-white shadow-key-accent">
        Enviar para o painel do pai
      </p>
    </div>
  )
}

const PASSOS = [
  {
    numero: '1',
    titulo: 'Funda a empresa',
    texto:
      'Escolhe a ideia, dá nome ao negócio e ganha o Zappy de sócio — um fundador mais experiente que acompanha cada passo.',
    mock: <MockTrilha />,
  },
  {
    numero: '2',
    titulo: 'Cumpre missões de 5 minutos',
    texto:
      'Uma missão por dia: decisões de produto, preço e cliente — com a mesma mecânica de jogo do Duolingo, aplicada ao negócio dele. São 8 módulos, da primeira ideia ao crescimento.',
    mock: <MockMissao />,
  },
  {
    numero: '3',
    titulo: 'Vende no mundo real',
    texto:
      'As missões saem da tela: seu filho registra em foto cada desafio cumprido fora do app — até a primeira venda de verdade.',
    mock: <MockMundoReal />,
  },
]

export default function ComoFunciona() {
  return (
    <section className="border-t border-line bg-white">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <h2 className="text-3xl font-extrabold leading-tight text-ink md:text-4xl">
          O que seu filho faz no Zapfy
        </h2>
        <p className="mt-3 max-w-2xl text-base text-ink-soft md:text-lg">
          Para a criança, é jogo. Para você, é ela praticando as decisões que
          você toma na sua empresa todos os dias.
        </p>

        <div className="mt-12 grid gap-12 md:grid-cols-3 md:gap-8">
          {PASSOS.map((passo) => (
            <div key={passo.numero} className="flex flex-col items-center">
              {/* altura fixa para as legendas dos 3 passos alinharem */}
              <div className="flex h-[420px] items-center">
                <PhoneMock>{passo.mock}</PhoneMock>
              </div>
              <div className="mt-6 w-full max-w-[280px]">
                <p className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-display text-base font-extrabold text-white shadow-key-primary">
                    {passo.numero}
                  </span>
                  <span className="font-display text-lg font-extrabold text-ink">
                    {passo.titulo}
                  </span>
                </p>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">
                  {passo.texto}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
