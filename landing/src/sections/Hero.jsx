import { Flame, Zap } from 'lucide-react'
import Button from '../components/Button.jsx'

/**
 * SEÇÃO 1 — HERO
 * Promessa para o pai, sobre o shell escuro (#0C1222) do sistema.
 * Zappy sempre em PNG real (regra do design system — nunca SVG em código).
 */
export default function Hero() {
  return (
    <header className="bg-shell pt-[76px] text-white">
      {/* nav fixa: mantém logo + CTA visíveis na página inteira (desktop) */}
      <nav className="fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-shell">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <a href="#" className="flex items-center gap-2">
          <img src="/zappy/logo-mark.svg" alt="" className="h-8 w-8" />
          <span className="font-display text-2xl font-extrabold text-white">
            Zapfy
          </span>
        </a>
        <Button
          as="a"
          href="#acesso"
          size="md"
          variant="accent"
          className="hidden whitespace-nowrap sm:inline-flex"
        >
          Acesso antecipado
        </Button>
        </div>
      </nav>

      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-8 md:grid-cols-[1.1fr_0.9fr] md:px-8 md:pb-24 md:pt-14">
        <div>
          <p className="rise rise-1 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/90">
            <Zap size={13} className="text-coin" aria-hidden="true" />
            Para pais empreendedores com filhos de 8 a 14 anos
          </p>
          <h1 className="rise rise-2 mt-5 text-4xl font-extrabold leading-[1.08] md:text-6xl">
            Seu filho no comando da{' '}
            <span className="text-coin">própria empresa</span>
          </h1>
          <p className="rise rise-3 mt-5 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
            No Zapfy, a criança funda uma empresa de verdade: missões de 5
            minutos por dia no app e desafios no mundo real — da primeira ideia
            à primeira venda.
          </p>
          <div className="rise rise-4 mt-8 flex flex-col items-start gap-3">
            <Button as="a" href="#acesso" variant="accent">
              Quero acesso antecipado
            </Button>
            <p className="text-sm text-white/60">
              Lista de espera aberta · iPhone e iPad
            </p>
          </div>
        </div>

        {/* Zappy em pose Hero + chips flutuantes de mecânica do jogo */}
        <div className="rise rise-3 relative mx-auto w-full max-w-sm">
          <img
            src="/zappy/hero.png"
            alt="Zappy, o mascote do Zapfy, comemorando"
            className="float mx-auto w-64 md:w-80"
          />
          <div className="absolute left-0 top-6 flex -rotate-3 items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-sm font-bold text-ink shadow-key-neutral">
            <Flame size={16} className="text-accent" aria-hidden="true" />7 dias
            seguidos
          </div>
          <div className="absolute bottom-10 right-0 flex rotate-2 items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-sm font-bold text-ink shadow-key-neutral">
            <span
              className="inline-block h-4 w-4 rounded-full border-2 border-coin-dark bg-coin"
              aria-hidden="true"
            />
            +10 moedas
          </div>
        </div>
      </div>
    </header>
  )
}
