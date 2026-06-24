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
    lines: [{ t: 'Oi. Eu sou o Zappy.', big: true }],
  },
  {
    mood: 'cheer',
    lines: [
      { t: 'Tô do seu lado em cada missão —' },
      { t: 'e cresço junto com você.', big: true, hi: true },
    ],
  },
  {
    mood: 'surprise',
    lines: [
      { t: 'Agora você tem uma' },
      { t: 'empresa pra tocar.', big: true },
    ],
  },
  {
    mood: 'cheer',
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
  const [pressed, setPressed] = useState(false)
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

  const ctaBg     = isLast ? '#2EDF74' : '#4D7FFF'
  const ctaShadow = isLast ? '#1AB85A' : '#3566E8'

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 300, overflow: 'hidden',
        background: '#0C1222', userSelect: 'none',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Barra de progresso + skip — TOP */}
      <div style={{
        paddingTop: 'max(16px, env(safe-area-inset-top, 16px))',
        padding: '0 16px',
        paddingTop: 'max(16px, env(safe-area-inset-top, 16px))',
        position: 'relative', zIndex: 2,
      }}>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          {BEATS.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: 2,
              background: i <= beat ? '#4D7FFF' : 'rgba(255,255,255,0.14)',
              transition: 'background 0.3s',
            }} />
          ))}
          <button
            onClick={onDone}
            style={{
              marginLeft: 10,
              background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 20,
              color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              padding: '6px 14px', cursor: 'pointer', flexShrink: 0,
            }}
          >
            Pular
          </button>
        </div>
      </div>

      {/* Centro — speech bubble + mascote */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '0 32px', position: 'relative', zIndex: 2,
      }}>
        {/* Glow suave atrás do mascote */}
        <div style={{
          position: 'absolute',
          width: 280, height: 280, borderRadius: '50%',
          background: 'rgba(77,127,255,0.07)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }} />

        {/* Speech bubble */}
        <div style={{
          position: 'relative',
          marginBottom: 20,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.18s, transform 0.18s',
          width: '100%', maxWidth: 320,
        }}>
          <div style={{
            background: '#1A2640',
            borderRadius: 20,
            padding: '20px 24px',
          }}>
            {b.lines.map((ln, i) => (
              <p
                key={i}
                className="ist-line"
                style={{
                  margin: '0 0 4px',
                  fontFamily: ln.big ? 'var(--font-display)' : 'Figtree, sans-serif',
                  fontWeight: ln.big ? 900 : 600,
                  fontSize: ln.big ? 26 : 16,
                  lineHeight: ln.big ? 1.2 : 1.4,
                  color: ln.hi ? '#2EDF74' : ln.big ? '#E6EDFF' : '#7C90B5',
                  textAlign: 'center',
                  animationDelay: `${0.12 + i * 0.13}s`,
                }}
              >
                {ln.t}
              </p>
            ))}
          </div>
          {/* Triângulo apontando para baixo (em direção ao mascote) */}
          <div style={{
            position: 'absolute',
            bottom: -14, left: '50%',
            transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '14px solid transparent',
            borderRight: '14px solid transparent',
            borderTop: '14px solid #1A2640',
          }} />
        </div>

        {/* Mascote */}
        <div
          key={beat}
          className="ist-zappy"
          style={{
            filter: 'drop-shadow(0 12px 40px rgba(77,127,255,0.25))',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.18s',
          }}
        >
          <img
            src={HERO[b.mood]}
            alt="Zappy"
            style={{ width: 200, height: 200, objectFit: 'contain', display: 'block' }}
          />
        </div>
      </div>

      {/* CTA — BOTTOM */}
      <div style={{
        padding: '0 24px',
        paddingBottom: 'max(40px, env(safe-area-inset-bottom, 40px))',
        position: 'relative', zIndex: 2,
      }}>
        {isLast ? (
          <button
            onClick={onDone}
            className="ist-cta"
            onPointerDown={() => setPressed(true)}
            onPointerUp={() => setPressed(false)}
            onPointerLeave={() => setPressed(false)}
            style={{
              width: '100%', padding: '18px 0', borderRadius: 16, border: 'none',
              background: ctaBg,
              boxShadow: pressed ? 'none' : `0 5px 0 ${ctaShadow}`,
              transform: pressed ? 'translateY(3px)' : 'translateY(0)',
              color: 'white',
              fontFamily: 'var(--font-display)',
              fontWeight: 800, fontSize: 16,
              textTransform: 'uppercase', letterSpacing: '0.05em',
              cursor: 'pointer', transition: 'transform 0.08s, box-shadow 0.08s',
            }}
          >
            {userName ? `BORA, ${userName.toUpperCase()}!` : 'BORA COMEÇAR!'}
          </button>
        ) : (
          <button
            onClick={() => go(1)}
            className="ist-cta"
            onPointerDown={() => setPressed(true)}
            onPointerUp={() => setPressed(false)}
            onPointerLeave={() => setPressed(false)}
            style={{
              width: '100%', padding: '18px 0', borderRadius: 16, border: 'none',
              background: ctaBg,
              boxShadow: pressed ? 'none' : `0 5px 0 ${ctaShadow}`,
              transform: pressed ? 'translateY(3px)' : 'translateY(0)',
              color: 'white',
              fontFamily: 'var(--font-display)',
              fontWeight: 800, fontSize: 16,
              textTransform: 'uppercase', letterSpacing: '0.05em',
              cursor: 'pointer', transition: 'transform 0.08s, box-shadow 0.08s',
            }}
          >
            CONTINUAR
          </button>
        )}
      </div>

      {/* Zonas de toque (esquerda volta / direita avança) */}
      {!isLast && (
        <div style={{ position: 'absolute', inset: 0, top: 70, bottom: 90, display: 'flex', zIndex: 1 }}>
          <div style={{ flex: 1 }} onClick={() => go(-1)} />
          <div style={{ flex: 2 }} onClick={() => go(1)} />
        </div>
      )}

      <style>{`
        .ist-zappy { animation: ist-pop .5s cubic-bezier(.2,1.2,.3,1) forwards, ist-bob 3s ease-in-out infinite .5s; }
        .ist-line  { animation: ist-rise .42s ease forwards; }
        .ist-cta   { animation: ist-pop .45s cubic-bezier(.2,1.2,.3,1) forwards; }
        @keyframes ist-bob  { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
        @keyframes ist-pop  { from { transform: scale(.82) } to { transform: scale(1) } }
        @keyframes ist-rise { from { transform: translateY(10px) } to { transform: translateY(0) } }
      `}</style>
    </div>
  )
}
