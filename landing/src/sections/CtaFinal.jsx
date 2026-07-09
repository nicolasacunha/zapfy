import { useState } from 'react'
import Button from '../components/Button.jsx'

/**
 * SEÇÃO 7 — CTA FINAL
 * Única meta de conversão da página: e-mail para a lista de espera.
 * Estados: idle → enviando → enviado | erro (com tentar de novo e
 * trocar de e-mail). TODO: trocar enviarParaListaDeEspera() por
 * integração real (Formspree ou tabela no Supabase) antes de publicar —
 * hoje ela só simula o envio, sem gravar o e-mail em lugar nenhum.
 */

function enviarParaListaDeEspera() {
  // TODO integração real. A simulação preserva o contrato: resolve = entrou
  // na lista, reject = falha de rede/servidor (o estado de erro já existe).
  return new Promise((resolve) => setTimeout(resolve, 600))
}

export default function CtaFinal() {
  const [estado, setEstado] = useState('idle') // idle | enviando | enviado | erro
  const [email, setEmail] = useState('')

  async function aoEnviar(evento) {
    evento.preventDefault()
    const emailLimpo = email.trim()
    setEmail(emailLimpo)
    setEstado('enviando')
    try {
      await enviarParaListaDeEspera(emailLimpo)
      setEstado('enviado')
    } catch {
      setEstado('erro')
    }
  }

  function trocarEmail() {
    setEstado('idle')
  }

  return (
    <section id="acesso" className="bg-shell text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-5 pb-16 text-center md:px-8 md:pb-24">
        {/* Zappy vaza a divisa entre a seção clara anterior e o shell escuro */}
        <img
          src="/zappy/surpreso.png"
          alt=""
          className="float -mt-16 w-32 md:-mt-20 md:w-40"
        />
        <h2 className="mt-4 max-w-2xl text-3xl font-extrabold leading-tight md:text-5xl">
          Quantas ideias de negócio seu filho já teve?
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
          Entre na lista de espera e receba o acesso antecipado do Zapfy para
          iPhone e iPad. A primeira missão começa no dia em que ele entrar.
        </p>

        {estado === 'enviado' ? (
          <div className="mt-8" role="status">
            <p className="max-w-md rounded-btn bg-success/15 px-6 py-4 text-base font-bold text-success">
              Pronto! <span className="break-all">{email}</span> está na lista
              de espera — a gente avisa quando o acesso abrir.
            </p>
            <button
              type="button"
              onClick={trocarEmail}
              className="mt-3 text-sm font-semibold text-white/60 underline underline-offset-4 hover:text-white"
            >
              Digitei errado — usar outro e-mail
            </button>
          </div>
        ) : (
          <>
            <form
              onSubmit={aoEnviar}
              className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="email" className="sr-only">
                Seu melhor e-mail
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(evento) => setEmail(evento.target.value)}
                placeholder="Seu melhor e-mail"
                disabled={estado === 'enviando'}
                className="w-full rounded-btn border-2 border-white/20 bg-white px-5 py-4 text-base font-semibold text-ink placeholder:text-ink-soft/60 focus:border-accent focus:outline-none disabled:opacity-60"
              />
              <Button
                type="submit"
                variant="accent"
                className="shrink-0"
                disabled={estado === 'enviando'}
              >
                {estado === 'enviando' ? 'Enviando…' : 'Quero acesso antecipado'}
              </Button>
            </form>
            {estado === 'erro' ? (
              <p className="mt-3 text-sm font-semibold text-danger" role="alert">
                Não conseguimos registrar seu e-mail agora. Tenta de novo em
                instantes?
              </p>
            ) : (
              <p className="mt-3 text-sm text-white/50">
                Sem spam: a gente só escreve para avisar quando o acesso abrir.
              </p>
            )}
          </>
        )}
      </div>
    </section>
  )
}
