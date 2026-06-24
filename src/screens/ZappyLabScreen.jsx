import { useState, useRef, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { C } from '../tokens'
import { useZapfy } from '../context/ZapfyContext'
import Zappy from '../components/Zappy'
import {
  MOODS, REACTIONS, moodMeta, moodFromEnergy, energyAfterAbsence,
} from '../lib/zappyState'

// Botões de "pulo" direto pra cada humor (energia no meio da faixa)
const MOOD_JUMP = [
  { key: 'radiante',   energy: 95 },
  { key: 'animado',    energy: 75 },
  { key: 'quietinho',  energy: 45 },
  { key: 'saudade',    energy: 15 },
  { key: 'cochilando', energy: 0  },
]

const ABSENCE = [
  { label: '1 dia fora',  days: 2 },
  { label: '3 dias fora', days: 4 },
  { label: '5 dias fora', days: 6 },
  { label: '8 dias fora', days: 9 },
]

export default function ZappyLabScreen({ onNav }) {
  const { state, dispatch } = useZapfy()
  const energy = state.zappyEnergy ?? 80
  const mood = moodFromEnergy(energy)
  const meta = moodMeta(energy)

  // Reação momentânea (Camada 2) — sobrepõe o humor por alguns segundos
  const [reaction, setReaction] = useState(null)
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])

  const fireReaction = (key) => {
    const r = REACTIONS[key]
    if (!r) return
    clearTimeout(timer.current)
    setReaction(r.mood)
    timer.current = setTimeout(() => setReaction(null), r.ms)
  }

  const shownMood = reaction || mood

  return (
    <div style={{ minHeight: '100vh', background: C.bg, paddingBottom: 40 }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pb-4"
        style={{ background: C.primary, paddingTop: 'max(16px, env(safe-area-inset-top, 16px))' }}>
        <button onClick={() => onNav('profile')} className="w-10 h-10 rounded-xl flex items-center justify-center">
          <ArrowLeft size={22} color="white" />
        </button>
        <div>
          <p className="font-extrabold text-white text-lg">Zappy Lab</p>
          <p className="text-white/70 text-xs font-semibold">Demonstração da máquina de estados</p>
        </div>
      </div>

      {/* Palco */}
      <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', padding: '24px 16px 8px' }}>
        <div style={{
          width: 230, height: 230, borderRadius: 28, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: 'radial-gradient(circle at 50% 40%, rgba(124,58,237,0.18), transparent 70%)',
        }}>
          <Zappy mood={shownMood} size={180} float />
        </div>
        <p style={{ marginTop: 8, fontSize: 13, fontWeight: 700, color: C.inkSoft }}>
          {reaction
            ? <span style={{ color: C.primary }}>reação: {reaction}</span>
            : <>Humor: <span style={{ color: C.primary }}>{meta?.label}</span> · {meta?.hint}</>}
        </p>
      </div>

      <div className="px-4" style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>

        {/* Energia */}
        <Card title={`Energia de vínculo: ${energy}/100`}>
          <input
            type="range" min="0" max="100" value={energy}
            onChange={(e) => dispatch({ type: 'ZAPPY_SET_ENERGY', value: Number(e.target.value) })}
            style={{ width: '100%', accentColor: C.primary }}
          />
          <Row>
            {MOOD_JUMP.map((b) => (
              <Chip key={b.key} active={mood === b.key}
                onClick={() => dispatch({ type: 'ZAPPY_SET_ENERGY', value: b.energy })}>
                {MOODS.find(m => m.key === b.key)?.label}
              </Chip>
            ))}
          </Row>
        </Card>

        {/* Decaimento / ausência */}
        <Card title="Simular sumiço (decaimento)">
          <Row>
            {ABSENCE.map((a) => (
              <Chip key={a.days}
                onClick={() => dispatch({ type: 'ZAPPY_SET_ENERGY', value: energyAfterAbsence(a.days) })}>
                {a.label}
              </Chip>
            ))}
            <Chip primary onClick={() => dispatch({ type: 'ZAPPY_ACTIVITY' })}>
              ▲ Voltei e joguei
            </Chip>
          </Row>
        </Card>

        {/* Reações momentâneas */}
        <Card title="Reações (evento → volta pro humor)">
          <Row>
            {Object.entries(REACTIONS).map(([key, r]) => (
              <Chip key={key} onClick={() => fireReaction(key)}>{r.label}</Chip>
            ))}
          </Row>
        </Card>

        {/* Referência: todos os estados */}
        <Card title="Todos os estados (referência)">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {['radiante','animado','quietinho','cochilando','saudade','orgulhoso','ops','comemoracao','chama','acenando','surprise','think'].map((mk) => (
              <div key={mk} style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ background: C.bg, borderRadius: 14, padding: 6 }}>
                  <Zappy mood={mk} size={64} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: C.inkSoft }}>{mk}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

function Card({ title, children }) {
  return (
    <div className="rounded-3xl border p-4" style={{ background: C.card, borderColor: C.border }}>
      <p className="font-extrabold mb-3" style={{ color: C.ink, fontSize: 14 }}>{title}</p>
      {children}
    </div>
  )
}

function Row({ children }) {
  return <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{children}</div>
}

function Chip({ children, onClick, active, primary }) {
  return (
    <button onClick={onClick}
      style={{
        padding: '8px 12px', borderRadius: 12, fontSize: 12, fontWeight: 800,
        border: `1.5px solid ${active || primary ? C.primary : C.border}`,
        background: primary ? C.primary : active ? `${C.primary}22` : C.bg,
        color: primary ? 'white' : active ? C.primary : C.ink,
        cursor: 'pointer',
      }}>
      {children}
    </button>
  )
}
