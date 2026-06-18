import { useState } from 'react'
import { useZapfy } from '../context/ZapfyContext'
import IntroSequence from './IntroSequence'
import zappyHero    from '../assets/zappy-hero.png'
import zappyNeutral from '../assets/zappy-neutral.png'
import zappyFace    from '../assets/zappy-face.png'

const SLIDES = [
  {
    img: zappyHero, imgH: 260,
    title: 'Você é o chefe.',
    sub: 'Sua empresa. Suas decisões.\nSem resposta certa — só a sua.',
    glow: 'oklch(0.55 0.19 264 / 0.42)',
    btnFrom: '#4D7FFF', btnTo: '#3566E8',
    btnShadow: 'rgba(77,127,255,.45)',
    btnDark: false,
    sparks: [
      { v: '⚡', top: '24%', left: '10%' },
      { v: '✦', top: '18%', right: '11%' },
    ],
  },
  {
    img: zappyNeutral, imgH: 240,
    title: '5 minutos.\nUm negócio avança.',
    sub: 'Missões rápidas, conquistas reais.\nO Zappy tá do seu lado em cada uma.',
    glow: 'oklch(0.72 0.16 47 / 0.36)',
    btnFrom: '#FF8C42', btnTo: '#E06820',
    btnShadow: 'rgba(255,140,66,.45)',
    btnDark: false,
    sparks: [
      { v: '⚡', top: '22%', left: '9%',  color: '#FF8C42' },
      { v: '✦', top: '16%', right: '10%', color: '#FF8C42' },
    ],
  },
  {
    img: zappyHero, imgH: 255,
    title: 'Quem chega na\nprimeira venda\nnunca esquece.',
    sub: 'Outros founders de 8 a 14 anos\njá estão construindo o negócio deles.',
    glow: 'oklch(0.46 0.26 296 / 0.42)',
    btnFrom: '#7C3AED', btnTo: '#6D28D9',
    btnShadow: 'rgba(124,58,237,.45)',
    btnDark: false,
    chip: 'Founders 8–14 anos',
    sparks: [
      { v: '✦', top: '22%', left: '9%',  color: '#A57DFF' },
      { v: '⚡', top: '17%', right: '11%', color: '#A57DFF' },
    ],
  },
  {
    img: zappyFace, imgH: 140,
    title: 'Pronto.\nAgora nomeie\nsua empresa.',
    sub: 'Qualquer nome. Você muda depois.',
    glow: 'oklch(0.80 0.19 150 / 0.30)',
    btnFrom: '#2EDF74', btnTo: '#22C55E',
    btnShadow: 'rgba(46,223,116,.32)',
    btnDark: true,
    sparks: [],
  },
]

export default function OnboardingScreen({ onNav, userName }) {
  const { dispatch } = useZapfy()
  const [slide, setSlide]           = useState(0)
  const [companyDraft, setCompanyDraft] = useState('')
  const [animKey, setAnimKey]       = useState(0)
  const [showIntro, setShowIntro]   = useState(() => {
    try { return !localStorage.getItem('zapfy_intro_seen') } catch { return false }
  })

  // Intro animada toca uma vez, antes da criança começar
  if (showIntro) {
    return (
      <IntroSequence
        userName={userName}
        onDone={() => {
          try { localStorage.setItem('zapfy_intro_seen', '1') } catch { /* ignore */ }
          setShowIntro(false)
        }}
      />
    )
  }

  const s      = SLIDES[slide]
  const isLast = slide === SLIDES.length - 1

  const advance = () => {
    if (isLast) { finish(); return }
    setSlide(v => v + 1)
    setAnimKey(k => k + 1)
  }

  const back = () => {
    setSlide(v => v - 1)
    setAnimKey(k => k + 1)
  }

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

  const titleText = s.title

  return (
    <div className="min-h-screen flex flex-col overflow-hidden" style={{ background: '#090F1C' }}>

      {/* ── Progress bars ── */}
      <div className="flex gap-2 justify-center pt-10 pb-2 px-6">
        {SLIDES.map((_, i) => (
          <div key={i} className="h-[3px] rounded-full transition-all duration-300"
            style={{
              width: i === slide ? 28 : 8,
              background: i < slide
                ? 'rgba(255,255,255,.55)'
                : i === slide ? 'white'
                : 'rgba(255,255,255,.16)',
            }} />
        ))}
      </div>

      {/* ── Mascot area ── */}
      <div className="flex-1 relative flex items-end justify-center pb-2 min-h-0">
        {/* Ambient glow */}
        <div className="absolute inset-x-0 top-0 pointer-events-none"
          style={{
            height: 340,
            background: `radial-gradient(ellipse 65% 55% at 50% 20%, ${s.glow}, transparent 70%)`,
            transition: 'background 0.55s ease',
          }} />

        {/* Sparkles */}
        {s.sparks.map((sp, i) => (
          <span key={i} className="absolute z-10 pointer-events-none select-none"
            style={{ top: sp.top, left: sp.left, right: sp.right, fontSize: 15, opacity: 0.6, color: sp.color || 'rgba(255,255,255,.7)' }}>
            {sp.v}
          </span>
        ))}

        {/* Zappy PNG — re-mount on slide change for entrance animation */}
        <img
          key={`z-${slide}`}
          src={s.img}
          alt="Zappy"
          className="ob-mascot relative z-10"
          style={{
            height: s.imgH,
            width: 'auto',
            filter: `drop-shadow(0 0 28px ${s.glow})`,
          }}
        />
      </div>

      {/* ── Copy + CTA ── */}
      <div key={animKey} className="ob-copy px-6 pb-10 flex flex-col gap-3">

        {s.chip && (
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold tracking-wide"
              style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.13)', color: '#E6EDFF' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#2EDF74' }} />
              {s.chip}
            </span>
          </div>
        )}

        <div className="text-center">
          <h1 className="font-black text-white leading-tight"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(24px, 7.5vw, 34px)',
              whiteSpace: 'pre-line',
            }}>
            {titleText}
          </h1>
          <p className="mt-2 leading-relaxed"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              color: 'rgba(230,237,255,.62)',
              whiteSpace: 'pre-line',
            }}>
            {s.sub}
          </p>
        </div>

        {isLast && (
          <div>
            <p className="text-xs font-semibold mb-2 text-left"
              style={{ color: 'rgba(230,237,255,.5)' }}>
              Como vai se chamar sua empresa?
            </p>
            <input
              type="text"
              maxLength={24}
              placeholder="Ex: Brigadeiros da Ana..."
              value={companyDraft}
              onChange={e => setCompanyDraft(e.target.value)}
              className="w-full rounded-xl px-4 py-3 font-bold outline-none ob-input"
              style={{
                fontSize: 16, // mínimo 16px para evitar zoom automático no iOS
                background: 'rgba(255,255,255,.07)',
                border: '1.5px solid rgba(255,255,255,.18)',
                color: 'white',
                caretColor: 'white',
              }}
            />
          </div>
        )}

        <button
          onClick={advance}
          className="w-full h-14 rounded-2xl font-black uppercase tracking-[.07em] text-sm transition-transform active:scale-[.97]"
          style={{
            background: `linear-gradient(90deg, ${s.btnFrom}, ${s.btnTo})`,
            boxShadow: `0 6px 24px ${s.btnShadow}`,
            color: s.btnDark ? '#052010' : 'white',
          }}>
          {isLast ? 'Abrir meu negócio →' : 'Próximo →'}
        </button>

        {slide > 0 && (
          <button onClick={back}
            className="text-center text-[13px] font-semibold py-1"
            style={{ color: 'rgba(230,237,255,.36)' }}>
            Voltar
          </button>
        )}
      </div>
    </div>
  )
}
