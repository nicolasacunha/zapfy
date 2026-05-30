import { useRef } from 'react'
import { C } from '../tokens'
import { useZapfy } from '../context/ZapfyContext'
import Zappy from '../components/Zappy'
import Btn from '../components/Btn'
import { getCopy } from '../lib/copy'

export default function LevelUpScreen({ onNav, level }) {
  const { state, dispatch } = useZapfy()

  const palette  = ['#F97316','#1E40AF','#22C55E','#FACC15','#A855F7']
  const confetti = useRef(
    Array.from({ length: 35 }, (_, i) => ({
      id: i, color: palette[i % palette.length],
      left: Math.random() * 100, delay: Math.random() * 1.4,
      size: 6 + Math.random() * 10, dur: 2 + Math.random() * 2,
      shape: i % 3 === 0 ? '50%' : i % 3 === 1 ? '4px' : '0%',
    }))
  ).current

  return (
    <div className="min-h-screen flex flex-col items-center" style={{ background: C.bg }}>

      {/* Confetti */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
        {confetti.map(c => (
          <div key={c.id} className="absolute" style={{
            left: `${c.left}%`, top: -20, width: c.size, height: c.size,
            background: c.color, borderRadius: c.shape,
            animation: `confetti-fall ${c.dur}s ${c.delay}s ease-in forwards`,
          }} />
        ))}
      </div>

      <div className="flex flex-col items-center px-6 pt-14 pb-8 gap-6 w-full z-20">

        <div className="bounce-in">
          <Zappy mood="cheer" size={130} />
        </div>

        <div className="text-center slide-up" style={{ animationDelay: '80ms' }}>
          <p className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{ color: C.primary }}>
            Subiu de nível!
          </p>
          <div className="text-7xl font-black pop-in" style={{ color: C.ink, animationDelay: '150ms' }}>
            {level}
          </div>
          <p className="text-2xl font-extrabold mt-1" style={{ color: C.ink }}>
            Nível {level}
          </p>
          <p className="text-base font-semibold mt-2" style={{ color: C.inkSoft }}>
            {getCopy('levelUp', { company: state.company, level })}
          </p>
        </div>

        <div className="w-full flex flex-col gap-3 card-rise" style={{ animationDelay: '300ms' }}>
          <Btn onClick={() => { dispatch({ type: 'DISMISS_LEVEL_UP' }); onNav('pathway') }} variant="primary" size="lg" full>
            Continuar missões
          </Btn>
        </div>
      </div>
    </div>
  )
}
