import { useState } from 'react'
import { C } from '../tokens'
import Zappy from '../components/Zappy'
import { useZapfy } from '../context/ZapfyContext'

export default function OnboardingScreen({ onNav, userName }) {
  const { dispatch } = useZapfy()
  const [slide, setSlide] = useState(0)
  const [companyDraft, setCompanyDraft] = useState('')
  const slides = [
    { mood: 'happy', title: 'Você é o chefe.',                  sub: 'Você vai criar uma empresa real — com seu nome e suas decisões. Não tem resposta certa. Só a sua.',       bg: C.primary },
    { mood: 'cheer', title: '5 minutos. Uma decisão. Seu negócio avança.', sub: 'Missões rápidas, conquistas reais. O Zappy tá do seu lado em cada uma.',      bg: C.accent },
    { mood: 'think', title: 'Quem chega na primeira venda nunca esquece.', sub: 'Outros founders de 8 a 14 anos já estão construindo o negócio deles. Você entra agora.',  bg: '#7C3AED' },
    { mood: 'cheer', title: userName ? `Pronto, ${userName}.` : 'Pronto.', sub: 'Sua primeira missão te espera. O Zappy também.', bg: '#059669' },
  ]
  const s = slides[slide]
  const isLast = slide === slides.length - 1

  const finish = () => {
    if (companyDraft.trim()) {
      dispatch({ type: 'SET_COMPANY_DRAFT', name: companyDraft.trim() })
    }
    localStorage.setItem('zapfy_onboarded', '1')
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission()
    }
    onNav('pathway')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-6 py-10 transition-colors duration-500"
      style={{ background: s.bg }}>
      <div className="flex gap-2 mt-2">
        {slides.map((_, i) => (
          <div key={i} className="h-1.5 rounded-full transition-all duration-300"
            style={{ width: i === slide ? 32 : 10, background: i <= slide ? 'white' : 'rgba(255,255,255,.3)' }} />
        ))}
      </div>
      <div className="flex flex-col items-center text-center gap-6">
        <div className="zappy-float"><Zappy mood={s.mood} size={160} /></div>
        <h1 className="text-3xl font-black text-white leading-tight">{s.title}</h1>
        <p className="text-white/80 text-lg font-semibold max-w-xs">{s.sub}</p>
        {isLast && (
          <div className="w-full max-w-xs">
            <p className="text-white/70 text-sm font-bold mb-2 text-left">Como vai se chamar sua empresa?</p>
            <input
              type="text"
              maxLength={24}
              placeholder="Qualquer nome. Muda depois."
              value={companyDraft}
              onChange={e => setCompanyDraft(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-base font-bold outline-none"
              style={{ background: 'rgba(255,255,255,.18)', color: 'white', border: '2px solid rgba(255,255,255,.4)', caretColor: 'white' }}
            />
          </div>
        )}
      </div>
      <div className="w-full flex flex-col gap-3">
        {!isLast
          ? <button onClick={() => setSlide(v => v + 1)}
              className="w-full h-14 rounded-2xl font-extrabold uppercase text-base text-white"
              style={{ background: 'rgba(255,255,255,.22)', border: '2px solid rgba(255,255,255,.45)' }}>
              Próximo →
            </button>
          : <button onClick={finish}
              className="w-full h-14 rounded-2xl font-extrabold uppercase text-base text-white"
              style={{ background: 'rgba(255,255,255,.28)', border: '2px solid rgba(255,255,255,.6)' }}>
              Abrir meu negócio →
            </button>
        }
        {slide > 0 && (
          <button onClick={() => setSlide(v => v - 1)} className="text-white/60 font-semibold text-sm text-center">
            Voltar
          </button>
        )}
      </div>
    </div>
  )
}
