import { useEffect, useRef } from 'react'
import { C } from '../tokens'
import { useZapfy } from '../context/ZapfyContext'
import Zappy from '../components/Zappy'
import Btn from '../components/Btn'
import { hapticSuccess } from '../lib/haptic'

const MILESTONE_DATA = {
  7:   { title: '7 dias seguidos 🔥', sub: '7 dias sem parar. É o começo de um hábito que fica.', gems: 2, emoji: '🔥' },
  30:  { title: '30 dias imparável ⚡', sub: 'Um mês inteiro. Você está entre os 5% mais consistentes.', gems: 5, emoji: '⚡' },
  100: { title: '100 dias. Lenda. ⚡', sub: 'Três meses de consistência. Seu negócio também cresceu.', gems: 15, emoji: '⚡' },
  365: { title: '365 dias. ⚡', sub: 'Um ano completo. Disciplina bate talento — sempre.', gems: 50, emoji: '⚡' },
}

export default function StreakMilestoneScreen({ onNav, streak }) {
  const { dispatch } = useZapfy()
  const data = MILESTONE_DATA[streak] || MILESTONE_DATA[7]
  const confettiRef = useRef(
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      color: ['#F97316','#FACC15','#22C55E','#A855F7','#1E40AF'][i % 5],
      left: Math.random() * 100,
      delay: Math.random() * 1.5,
      size: 7 + Math.random() * 10,
      dur: 2.5 + Math.random() * 2,
      shape: i % 3 === 0 ? '50%' : '4px',
    }))
  ).current

  useEffect(() => {
    dispatch({ type: 'DAILY_BONUS', gems: data.gems })
    hapticSuccess()
  }, [])

  const handleDismiss = () => {
    dispatch({ type: 'DISMISS_STREAK_MILESTONE' })
    onNav('pathway')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 gap-6"
      style={{ background: `linear-gradient(160deg, ${C.primary} 0%, #7C3AED 100%)` }}>

      {/* Confetti */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {confettiRef.map(c => (
          <div key={c.id} className="absolute" style={{
            left: `${c.left}%`, top: -20, width: c.size, height: c.size,
            background: c.color, borderRadius: c.shape,
            animation: `confetti-fall ${c.dur}s ${c.delay}s ease-in forwards`,
          }} />
        ))}
      </div>

      <div className="text-8xl animate-bounce">{data.emoji}</div>

      <div className="zappy-float">
        <Zappy mood="comemoracao" size={140} />
      </div>

      <div className="text-center">
        <p className="text-5xl font-black text-white mb-2">{streak}</p>
        <p className="text-xl font-extrabold text-white/90">dias de sequência</p>
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-black text-white mb-3">{data.title}</h1>
        <p className="text-white/80 font-semibold leading-relaxed">{data.sub}</p>
      </div>

      {/* Reward */}
      <div className="rounded-3xl px-8 py-4 flex items-center gap-3"
        style={{ background: 'rgba(255,255,255,.18)', border: '2px solid rgba(255,255,255,.35)' }}>
        <span style={{ fontSize: 32 }}>💎</span>
        <div>
          <p className="font-extrabold text-white text-lg">+{data.gems} Gemas</p>
          <p className="text-white/70 text-xs font-semibold">Recompensa de marco</p>
        </div>
      </div>

      <button
        onClick={handleDismiss}
        className="w-full py-4 rounded-2xl font-extrabold text-xl uppercase"
        style={{ background: 'rgba(255,255,255,.25)', border: '2px solid rgba(255,255,255,.5)', color: 'white' }}>
        Continuar 🚀
      </button>
    </div>
  )
}
