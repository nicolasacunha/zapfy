import { useState, useEffect, useRef } from 'react'
import zappyHappy    from '../assets/intro-zappy-happy.png'
import zappySurprise from '../assets/intro-zappy-surprise.png'
import zappyCheer    from '../assets/intro-zappy-cheer.png'

const HERO = { happy: zappyHappy, surprise: zappySurprise, cheer: zappyCheer }

// Intro animada "isto é o que você vai fazer aqui" — toca UMA vez, antes do
// onboarding. Sem IA/vídeo: motion em código com os PNGs do Zappy. Pulável.
// Voz do Zappy: irmão mais velho fundador, nunca professor. Não é escola.

const BEATS = [
  {
    mood: 'happy',
    glow: '#4D7FFF',
    lines: [{ t: 'Oi. Eu sou o Zappy.', big: true }],
  },
  {
    mood: 'surprise',
    glow: '#FF8C42',
    lines: [
      { t: 'Agora você tem uma' },
      { t: 'empresa pra tocar.', big: true },
    ],
  },
  {
    mood: 'cheer',
    glow: '#7C3AED',
    lines: [
      { t: 'Primeiro passo:' },
      { t: 'dar um nome pra ela.', big: true, hi: true },
    ],
  },
]

const AUTO_MS = 3600

export default function IntroSequence({ onDone, userName }) {
  const [beat, setBeat]       = useState(0)
  const [visible, setVisible] = useState(true)
  const timerRef              = useRef(null)
  const isLast = beat === BEATS.length - 1
  const b      = BEATS[beat]

  // Auto-avança, menos no último beat (espera o toque em "Começar")
  useEffect(() => {
    clearTimeout(timerRef.current)
    if (!isLast) timerRef.current = setTimeout(() => go(1), AUTO_MS)
    return () => clearTimeout(timerRef.current)
  }, [beat]) // eslint-disable-line

  const go = (dir) => {
    const next = beat + dir
    if (next < 0) return
    if (next >= BEATS.length) return
    clearTimeout(timerRef.current)
    setVisible(false)
    setTimeout(() => { setBeat(next); setVisible(true) }, 170)
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 300, overflow: 'hidden',
        background: '#090F1C', userSelect: 'none',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Glow de fundo que muda de cor por beat */}
      <div style={{
        position: 'absolute', inset: 0, transition: 'background 0.5s ease',
        background: `radial-gradient(ellipse 80% 55% at 50% 38%, ${b.glow}38 0%, transparent 60%)`,
      }} />
      {/* Sparks flutuantes */}
      <span className="ist-spark" style={{ top: '20%', left: '12%', color: b.glow }}>✦</span>
      <span className="ist-spark ist-spark-2" style={{ top: '16%', right: '13%', color: b.glow }}>⚡</span>
      <span className="ist-spark ist-spark-3" style={{ bottom: '24%', left: '16%', color: b.glow }}>✦</span>

      {/* Barra de progresso (beats) */}
      <div style={{ display: 'flex', gap: 5, padding: '16px 16px 0', position: 'relative', zIndex: 2 }}>
        {BEATS.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= beat ? b.glow : 'rgba(255,255,255,0.16)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      {/* Skip */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 18px 0', position: 'relative', zIndex: 2 }}>
        <button onClick={onDone} style={{
          background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 20,
          color: 'rgba(255,255,255,0.65)', fontSize: 11, fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase', padding: '6px 14px', cursor: 'pointer',
        }}>
          Pular
        </button>
      </div>

      {/* Conteúdo do beat */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '0 34px', gap: 26, position: 'relative', zIndex: 2,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(14px)',
        transition: 'opacity 0.18s, transform 0.18s',
      }}>
        <div key={beat} className="ist-zappy" style={{ filter: `drop-shadow(0 16px 48px ${b.glow}99)` }}>
          <img src={HERO[b.mood]} alt="Zappy" style={{ width: 240, height: 240, objectFit: 'contain', display: 'block' }} />
        </div>

        <div style={{ textAlign: 'center', maxWidth: 330 }}>
          {b.lines.map((ln, i) => (
            <p
              key={i}
              className="ist-line"
              style={{
                margin: '0 0 4px',
                fontWeight: ln.big ? 900 : 700,
                fontSize: ln.small ? 15 : ln.big ? 30 : 19,
                lineHeight: ln.small ? 1.5 : 1.18,
                color: ln.small ? 'rgba(255,255,255,0.62)' : ln.hi ? b.glow : 'white',
                animationDelay: `${0.12 + i * 0.13}s`,
              }}
            >
              {ln.t}
            </p>
          ))}
        </div>
      </div>

      {/* CTA final / dica de toque */}
      <div style={{ padding: '0 24px 40px', position: 'relative', zIndex: 2 }}>
        {isLast ? (
          <button
            onClick={onDone}
            className="ist-cta"
            style={{
              width: '100%', padding: '17px 0', borderRadius: 16, border: 'none',
              background: `linear-gradient(135deg, ${b.glow}, #6D28D9)`,
              color: 'white', fontWeight: 900, fontSize: 16,
              letterSpacing: '0.04em', cursor: 'pointer',
              boxShadow: `0 5px 0 ${b.glow}99, 0 10px 34px ${b.glow}55`,
            }}
          >
            {userName ? `Bora, ${userName}` : 'Bora começar'}
          </button>
        ) : (
          <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.1em', margin: 0 }}>
            toque para avançar
          </p>
        )}
      </div>

      {/* Zonas de toque (esquerda volta / direita avança) — abaixo do CTA */}
      {!isLast && (
        <div style={{ position: 'absolute', inset: 0, top: 70, bottom: 90, display: 'flex', zIndex: 1 }}>
          <div style={{ flex: 1 }} onClick={() => go(-1)} />
          <div style={{ flex: 2 }} onClick={() => go(1)} />
        </div>
      )}

      <style>{`
        .ist-spark {
          position: absolute; z-index: 1; font-size: 18px; opacity: 0.5;
          animation: ist-float 3.2s ease-in-out infinite;
          pointer-events: none;
        }
        .ist-spark-2 { font-size: 22px; animation-duration: 3.8s; animation-delay: .4s; }
        .ist-spark-3 { font-size: 15px; animation-duration: 4.2s; animation-delay: .8s; }
        .ist-zappy { animation: ist-pop .5s cubic-bezier(.2,1.2,.3,1) forwards, ist-bob 3s ease-in-out infinite .5s; }
        .ist-line { animation: ist-rise .42s ease forwards; }
        .ist-cta { animation: ist-pop .45s cubic-bezier(.2,1.2,.3,1) forwards; }
        @keyframes ist-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
        @keyframes ist-bob   { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
        @keyframes ist-pop   { from { opacity: 0; transform: scale(.82) } to { opacity: 1; transform: scale(1) } }
        @keyframes ist-rise  { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  )
}
