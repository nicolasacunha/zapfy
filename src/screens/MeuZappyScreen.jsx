import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Flame, Heart } from 'lucide-react'
import { C } from '../tokens'
import { useZapfy } from '../context/ZapfyContext'
import Zappy from '../components/Zappy'
import { playTap, playReward } from '../lib/sound'
import { hapticSuccess } from '../lib/haptic'
import {
  moodFromEnergy, moodMeta, evolutionStage, nextEvolution, levelFromXp, EVOLUTIONS,
} from '../lib/zappyState'

export default function MeuZappyScreen({ onNav }) {
  const { state } = useZapfy()
  const energy = state.zappyEnergy ?? 80
  const level  = levelFromXp(state.xp)
  const stage  = evolutionStage(level)
  const nextEvo = nextEvolution(level)
  const meta = moodMeta(energy)

  // Carinho — bounce + coração flutuante + som
  const [hearts, setHearts] = useState([])
  const [bounce, setBounce] = useState(false)
  const idRef = useRef(0)
  const tRef = useRef(null)
  useEffect(() => () => clearTimeout(tRef.current), [])

  const pet = () => {
    const id = ++idRef.current
    setHearts(h => [...h, id])
    setBounce(true)
    playTap()
    if (id % 4 === 0) { playReward(); hapticSuccess() }
    clearTimeout(tRef.current)
    tRef.current = setTimeout(() => setBounce(false), 320)
    setTimeout(() => setHearts(h => h.filter(x => x !== id)), 1100)
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, paddingBottom: 40 }}>
      <div className="flex items-center gap-3 px-4 pb-4"
        style={{ flexShrink: 0, background: C.primary, paddingTop: 'max(16px, env(safe-area-inset-top, 16px))' }}>
        <button onClick={() => onNav('profile')} className="w-10 h-10 rounded-xl flex items-center justify-center">
          <ArrowLeft size={22} color="white" />
        </button>
        <p className="font-extrabold text-white text-lg">Meu Zappy</p>
      </div>

      {/* Palco — toca pra fazer carinho */}
      <button onClick={pet} style={{
        position: 'relative', width: '100%', border: 'none', cursor: 'pointer',
        background: 'radial-gradient(circle at 50% 38%, rgba(124,58,237,0.16), transparent 70%)',
        padding: '28px 0 8px', display: 'flex', justifyContent: 'center',
      }}>
        <div style={{ transform: bounce ? 'scale(0.94)' : 'scale(1)', transition: 'transform .16s var(--ease-spring)' }}>
          <Zappy mood={stage.key} size={210} float />
        </div>
        {hearts.map(id => (
          <Heart key={id} size={26} fill={C.crisis || '#FB7185'} color={C.crisis || '#FB7185'}
            style={{
              position: 'absolute', left: '50%', top: 70, marginLeft: (id % 3 - 1) * 30,
              animation: 'xp-float .9s cubic-bezier(0.16,1,0.3,1) forwards', pointerEvents: 'none',
            }} />
        ))}
      </button>
      <p style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: C.inkSoft, marginTop: 2 }}>
        toca nele pra fazer carinho
      </p>

      <div className="px-4" style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>

        {/* Identidade + energia */}
        <div className="rounded-3xl border p-4" style={{ background: C.card, borderColor: C.border }}>
          <div className="flex items-center justify-between mb-1">
            <p className="font-extrabold" style={{ color: C.ink, fontSize: 18 }}>Zappy {stage.label}</p>
            <span className="text-xs font-bold" style={{ color: C.primary }}>{meta?.label}</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: C.border }}>
            <div className="h-full rounded-full" style={{ width: `${energy}%`, background: C.primary, transition: 'width .3s' }} />
          </div>
          <p className="text-xs font-semibold mt-1.5" style={{ color: C.inkSoft }}>
            Energia {energy}/100 · {meta?.hint}
          </p>
        </div>

        {/* Trilha de evolução */}
        <div className="rounded-3xl border p-4" style={{ background: C.card, borderColor: C.border }}>
          <p className="font-extrabold mb-3" style={{ color: C.ink }}>Evolução</p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', justifyContent: 'space-around' }}>
            {EVOLUTIONS.map(evo => {
              const active = evo.key === stage.key
              const unlocked = level >= evo.minLevel
              return (
                <div key={evo.key} style={{ textAlign: 'center', opacity: unlocked ? 1 : 0.4, flex: 1 }}>
                  <div style={{
                    background: active ? `${C.primary}22` : C.bg, borderRadius: 16, padding: 6,
                    border: active ? `2px solid ${C.primary}` : `1px solid ${C.border}`,
                  }}>
                    <Zappy mood={evo.key} size={56} />
                  </div>
                  <p style={{ fontSize: 11, fontWeight: 800, color: active ? C.primary : C.inkSoft, marginTop: 4 }}>{evo.label}</p>
                  <p style={{ fontSize: 9, fontWeight: 600, color: C.inkSoft }}>Nv {evo.minLevel}</p>
                </div>
              )
            })}
          </div>
          <p className="text-xs font-semibold mt-3 text-center" style={{ color: C.inkSoft }}>
            {nextEvo
              ? <>Próxima forma: <span style={{ color: C.primary, fontWeight: 800 }}>{nextEvo.label}</span> no Nível {nextEvo.minLevel}</>
              : 'Forma máxima alcançada. Lenda. ⚡'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border p-3" style={{ background: C.card, borderColor: C.border }}>
            <div className="flex items-center gap-2 mb-1"><Flame size={16} fill={C.accent} color={C.accent} /><span className="text-xs font-bold" style={{ color: C.inkSoft }}>Ofensiva</span></div>
            <p className="text-2xl font-black" style={{ color: C.accent }}>{state.streak} dias</p>
          </div>
          <div className="rounded-2xl border p-3" style={{ background: C.card, borderColor: C.border }}>
            <div className="flex items-center gap-2 mb-1"><Heart size={16} fill={C.primary} color={C.primary} /><span className="text-xs font-bold" style={{ color: C.inkSoft }}>Nível</span></div>
            <p className="text-2xl font-black" style={{ color: C.primary }}>{level}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
