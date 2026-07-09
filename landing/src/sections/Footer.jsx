/**
 * RODAPÉ
 * TODO: apontar "Política de privacidade" para a URL pública quando ela
 * existir (hoje é um blocker de lançamento em aberto).
 */
export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-shell text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 py-10 text-center md:flex-row md:justify-between md:px-8 md:text-left">
        <div className="flex items-center gap-2">
          <img src="/zappy/logo-mark.svg" alt="" className="h-6 w-6" />
          <span className="font-display text-lg font-extrabold">Zapfy</span>
          <span className="ml-2 text-sm text-white/60">
            Empreendedorismo para crianças de 8 a 14 anos
          </span>
        </div>
        <div className="flex flex-col items-center gap-2 text-sm text-white/60 md:items-end">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <a
              href="mailto:nicolas@zapfy.app"
              className="underline-offset-4 hover:text-white hover:underline"
            >
              nicolas@zapfy.app
            </a>
            <a
              href="https://wa.me/5519992929886"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 hover:text-white hover:underline"
            >
              WhatsApp (19) 99292-9886
            </a>
          </div>
          <div className="flex items-center gap-6">
            {/* TODO: virar <a> quando a URL pública da política existir */}
            <span className="cursor-default text-white/40">
              Política de privacidade — em breve
            </span>
            <span>© 2026 Zapfy</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
