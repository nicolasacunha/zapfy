import { useState, useEffect, useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { C } from '../tokens'
import Zappy from '../components/Zappy'
import { MODULES } from '../data/modules'
import { useZapfy } from '../context/ZapfyContext'

const ZAPPY_MOODS = ['happy', 'think', 'cheer', 'happy']

export default function ModuleStoryScreen({ onNav, moduleId, lessonId, unitId }) {
  const { dispatch } = useZapfy()
  const mod = MODULES.find(m => m.id === moduleId)
  const slides = mod?.intro || []
  const color = mod?.color || C.primary

  const [idx, setIdx]         = useState(0)
  const [visible, setVisible] = useState(true)
  const timerRef = useRef(null)

  const total = slides.length
  const isLast = idx === total - 1

  useEffect(() => {
    // Auto-advance every 5s (user can tap to go faster)
    timerRef.current = setTimeout(() => {
      if (!isLast) advance()
    }, 5000)
    return () => clearTimeout(timerRef.current)
  }, [idx])

  const advance = () => {
    if (isLast) return finish()
    clearTimeout(timerRef.current)
    setVisible(false)
    setTimeout(() => { setIdx(i => i + 1); setVisible(true) }, 180)
  }

  const back = () => {
    if (idx === 0) return
    clearTimeout(timerRef.current)
    setVisible(false)
    setTimeout(() => { setIdx(i => i - 1); setVisible(true) }, 180)
  }

  const finish = () => {
    dispatch({ type: 'MARK_MODULE_INTRO_SEEN', moduleId })
    onNav('lesson', { unitId, lessonId })
  }

  const skip = () => finish()

  if (!slides.length) {
    onNav('lesson', { unitId, lessonId })
    return null
  }

  const slide = slides[idx]
  const mood  = ZAPPY_MOODS[idx % ZAPPY_MOODS.length]

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: `linear-gradient(160deg, ${color}22 0%, ${C.bg} 100%)`,
        display: 'flex', flexDirection: 'column',
        userSelect: 'none',
      }}
    >
      {/* Progress bar */}
      <div style={{ display: 'flex', gap: 4, padding: '16px 16px 0' }}>
        {slides.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= idx ? color : 'rgba(255,255,255,0.18)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      {/* Skip */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 20px 0' }}>
        <button
          onClick={skip}
          style={{
            background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 20,
            color: C.inkSoft, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', padding: '6px 14px', cursor: 'pointer',
          }}
        >
          Pular
        </button>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '0 32px', gap: 32,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.18s, transform 0.18s',
        }}
      >
        {/* Zappy */}
        <div style={{
          filter: `drop-shadow(0 12px 40px ${color}60)`,
          animation: 'zappy-float 3s ease-in-out infinite',
        }}>
          <Zappy mood={mood} size={130} />
        </div>

        {/* Module tag */}
        <div style={{
          fontSize: 10, fontWeight: 800, letterSpacing: '0.2em',
          textTransform: 'uppercase', color: color,
          background: `${color}18`, border: `1px solid ${color}40`,
          borderRadius: 100, padding: '5px 14px',
        }}>
          {mod?.name}
        </div>

        {/* Slide text */}
        <div style={{ textAlign: 'center', maxWidth: 320 }}>
          {slide.title && (
            <p style={{
              fontSize: 22, fontWeight: 900, color: C.ink,
              lineHeight: 1.3, marginBottom: 12,
            }}>
              {slide.title}
            </p>
          )}
          <p style={{
            fontSize: 15, color: C.inkSoft, lineHeight: 1.7,
            fontWeight: 500,
          }}>
            {slide.body}
          </p>
        </div>
      </div>

      {/* Tap zones */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', top: 80 }}>
        <div style={{ flex: 1 }} onClick={back} />
        <div style={{ flex: 2 }} onClick={advance} />
      </div>

      {/* Bottom CTA (last slide only) */}
      {isLast && (
        <div style={{ padding: '0 24px 40px', position: 'relative', zIndex: 10 }}>
          <button
            onClick={finish}
            style={{
              width: '100%', padding: '16px 0', borderRadius: 16, border: 'none',
              background: color, color: 'white', fontWeight: 900, fontSize: 15,
              letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
              boxShadow: `0 4px 0 ${color}88, 0 8px 32px ${color}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}
          >
            Começar missão
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* Bottom dots hint (non-last slides) */}
      {!isLast && (
        <div style={{
          padding: '0 0 36px', textAlign: 'center',
          fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em',
        }}>
          toque para avançar
        </div>
      )}

      <style>{`
        @keyframes zappy-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  )
}
