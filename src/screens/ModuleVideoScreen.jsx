import { useState, useEffect, useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { C } from '../tokens'
import Zappy from '../components/Zappy'
import { MODULES } from '../data/modules'
import { useZapfy } from '../context/ZapfyContext'

const ZAPPY_MOODS = ['happy', 'think', 'cheer', 'happy']

export default function ModuleVideoScreen({ onNav, moduleId, lessonId, unitId }) {
  const { dispatch } = useZapfy()
  const mod   = MODULES.find(m => m.id === moduleId)
  const color = mod?.color || C.primary
  const slides = mod?.intro || []

  const [showSkip, setShowSkip] = useState(false)
  const skipTimerRef = useRef(null)

  // Se não tiver vídeo nem slides, ir direto para a lição
  if (!mod?.videoUrl && !slides.length) {
    dispatch({ type: 'MARK_MODULE_INTRO_SEEN', moduleId })
    onNav('lesson', { unitId, lessonId })
    return null
  }

  const finish = () => {
    dispatch({ type: 'MARK_MODULE_INTRO_SEEN', moduleId })
    onNav('lesson', { unitId, lessonId })
  }

  // ── Vídeo MP4 ──────────────────────────────────────────────
  if (mod.videoUrl) {
    return (
      <VideoPlayer
        mod={mod}
        color={color}
        onFinish={finish}
        showSkip={showSkip}
        setShowSkip={setShowSkip}
        skipTimerRef={skipTimerRef}
      />
    )
  }

  // ── Fallback: slides (ModuleStoryScreen logic) ─────────────
  return (
    <SlidesPlayer
      mod={mod}
      color={color}
      slides={slides}
      onFinish={finish}
    />
  )
}

// ── Sub-componente: player de vídeo ────────────────────────
function VideoPlayer({ mod, color, onFinish, showSkip, setShowSkip, skipTimerRef }) {
  useEffect(() => {
    skipTimerRef.current = setTimeout(() => setShowSkip(true), 15000)
    return () => clearTimeout(skipTimerRef.current)
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: '#000',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Barra de progresso simulada (indeterminate durante o vídeo) */}
      <div style={{ height: 3, background: `${color}55`, position: 'relative' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: color,
          animation: 'video-progress 90s linear forwards',
        }} />
      </div>

      {/* Skip */}
      {showSkip && (
        <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
          <button
            onClick={onFinish}
            style={{
              background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 20,
              color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              padding: '6px 14px', cursor: 'pointer',
            }}
          >
            Pular
          </button>
        </div>
      )}

      {/* Vídeo */}
      <video
        src={mod.videoUrl}
        autoPlay
        playsInline
        onEnded={onFinish}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />

      {/* Zappy overlay no canto inferior esquerdo */}
      <div style={{
        position: 'absolute', bottom: 24, left: 16, zIndex: 10,
        filter: `drop-shadow(0 4px 12px ${color}80)`,
        animation: 'zappy-float 3s ease-in-out infinite',
      }}>
        <Zappy mood="cheer" size={50} />
      </div>

      <style>{`
        @keyframes video-progress {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @keyframes zappy-float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  )
}

// ── Sub-componente: slides (fallback quando sem vídeo) ─────
function SlidesPlayer({ mod, color, slides, onFinish }) {
  const [idx, setIdx]         = useState(0)
  const [visible, setVisible] = useState(true)
  const timerRef              = useRef(null)

  const total  = slides.length
  const isLast = idx === total - 1
  const slide  = slides[idx]
  const mood   = ZAPPY_MOODS[idx % ZAPPY_MOODS.length]

  useEffect(() => {
    timerRef.current = setTimeout(() => { if (!isLast) advance() }, 5000)
    return () => clearTimeout(timerRef.current)
  }, [idx])

  const advance = () => {
    if (isLast) return onFinish()
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

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: `linear-gradient(160deg, ${color}22 0%, ${C.bg} 100%)`,
      display: 'flex', flexDirection: 'column',
      userSelect: 'none',
    }}>
      <div style={{ display: 'flex', gap: 4, padding: '16px 16px 0' }}>
        {slides.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= idx ? color : 'rgba(255,255,255,0.18)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 20px 0' }}>
        <button
          onClick={onFinish}
          style={{
            background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 20,
            color: C.inkSoft, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', padding: '6px 14px', cursor: 'pointer',
          }}
        >
          Pular
        </button>
      </div>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 32px', gap: 32,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.18s, transform 0.18s',
      }}>
        <div style={{
          filter: `drop-shadow(0 12px 40px ${color}60)`,
          animation: 'zappy-float 3s ease-in-out infinite',
        }}>
          <Zappy mood={mood} size={130} />
        </div>

        <div style={{
          fontSize: 10, fontWeight: 800, letterSpacing: '0.2em',
          textTransform: 'uppercase', color: color,
          background: `${color}18`, border: `1px solid ${color}40`,
          borderRadius: 100, padding: '5px 14px',
        }}>
          {mod?.name}
        </div>

        <div style={{ textAlign: 'center', maxWidth: 320 }}>
          {slide.title && (
            <p style={{ fontSize: 22, fontWeight: 900, color: C.ink, lineHeight: 1.3, marginBottom: 12 }}>
              {slide.title}
            </p>
          )}
          <p style={{ fontSize: 15, color: C.inkSoft, lineHeight: 1.7, fontWeight: 500 }}>
            {slide.body}
          </p>
        </div>
      </div>

      <div style={{ position: 'absolute', inset: 0, display: 'flex', top: 80 }}>
        <div style={{ flex: 1 }} onClick={back} />
        <div style={{ flex: 2 }} onClick={advance} />
      </div>

      {isLast && (
        <div style={{ padding: '0 24px 40px', position: 'relative', zIndex: 10 }}>
          <button
            onClick={onFinish}
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
          50%       { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  )
}
