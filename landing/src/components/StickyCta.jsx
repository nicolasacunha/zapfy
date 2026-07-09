import { useEffect, useState } from 'react'
import Button from './Button.jsx'

/**
 * CTA persistente no mobile: aparece depois que o usuário passa do hero
 * e some quando o formulário final (#acesso) entra na tela.
 * No desktop o CTA da nav cumpre esse papel — aqui é só até sm.
 */
export default function StickyCta() {
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    const aoRolar = () => {
      const form = document.getElementById('acesso')
      const passouHero = window.scrollY > window.innerHeight * 0.9
      const formNaTela =
        form && form.getBoundingClientRect().top < window.innerHeight
      setVisivel(passouHero && !formNaTela)
    }
    window.addEventListener('scroll', aoRolar, { passive: true })
    aoRolar()
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  if (!visivel) return null

  return (
    <div className="rise fixed inset-x-4 bottom-4 z-50 sm:hidden">
      <Button
        as="a"
        href="#acesso"
        variant="accent"
        size="md"
        full
        className="whitespace-nowrap py-3.5"
      >
        Quero acesso antecipado
      </Button>
    </div>
  )
}
