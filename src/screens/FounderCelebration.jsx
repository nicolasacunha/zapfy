import { C } from '../tokens'
import { useZapfy } from '../context/ZapfyContext'
import Zappy from '../components/Zappy'
import Btn from '../components/Btn'

export default function FounderCelebration({ onNav }) {
  const { state, dispatch } = useZapfy()
  const company = state.company

  const handleClaim = () => {
    dispatch({ type: 'UNLOCK_FOUNDER' })
    onNav('profile')
  }

  const confetti = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    color: ['#FACC15','#F97316','#1E40AF','#22C55E','#A855F7','#EC4899','white'][i % 7],
    left: Math.random() * 100, delay: Math.random() * 2,
    size: 8 + Math.random() * 12, dur: 2.5 + Math.random() * 2,
    shape: i % 3 === 0 ? '50%' : '4px',
  }))

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-6 pt-10 pb-10"
      style={{ background: `linear-gradient(160deg, #0F172A 0%, #1E3A8A 50%, #7C3AED 100%)` }}>

      {/* Confetti */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {confetti.map(c => (
          <div key={c.id} className="absolute" style={{
            left: `${c.left}%`, top: -20, width: c.size, height: c.size,
            background: c.color, borderRadius: c.shape,
            animation: `confetti-fall ${c.dur}s ${c.delay}s ease-in forwards`,
          }} />
        ))}
      </div>

      <div className="z-10 flex flex-col items-center w-full gap-6">
        <div className="bounce-in">
          <Zappy mood="cheer" size={120} />
        </div>

        <div className="text-center">
          <p className="text-6xl mb-2">⚡</p>
          <h1 className="text-4xl font-black text-white leading-tight">Founder<br/>Oficial.</h1>
          <p className="text-white/70 font-semibold mt-3 text-base">
            Você realizou sua primeira venda. Isso é real.
          </p>
        </div>

        {/* Badge */}
        <div className="w-full rounded-3xl p-6 text-center"
          style={{ background: 'rgba(250,204,21,0.12)', border: '2px solid rgba(250,204,21,0.4)' }}>
          <p className="text-xs font-extrabold uppercase tracking-widest mb-3" style={{ color: '#FACC15' }}>Badge exclusivo</p>
          <p className="text-5xl mb-3">⚡</p>
          <p className="text-2xl font-black text-white">{company?.name}</p>
          <p className="font-bold mt-1" style={{ color: '#FACC15' }}>Founder Oficial · Zapfy</p>
          <div className="w-full h-px my-4" style={{ background: 'rgba(250,204,21,0.2)' }} />
          <p className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()}
          </p>
        </div>

        <div className="w-full rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <p className="text-white/90 font-bold text-sm text-center leading-relaxed">
            +200 XP · +5 Gemas · Badge permanente no seu perfil ⚡
          </p>
        </div>
      </div>

      <div className="z-10 w-full flex flex-col gap-3 mt-6">
        <Btn onClick={handleClaim} size="lg" full cls="bg-yellow-400 text-gray-900 border-0" variant="secondary">
          Resgatar badge 🏆
        </Btn>
        <button onClick={() => onNav('pathway')} className="text-white/60 font-semibold text-sm text-center">
          Continuar jogando
        </button>
      </div>
    </div>
  )
}
