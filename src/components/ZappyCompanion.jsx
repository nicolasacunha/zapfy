import { useState, useRef, useEffect } from 'react'
import { C } from '../tokens'
import { useZapfy } from '../context/ZapfyContext'
import Zappy from './Zappy'
import { moodFromEnergy } from '../lib/zappyState'
import { playTap } from '../lib/sound'

// Falas variadas por humor — voz da marca, calorosa, anti-vergonha
const STATUS = {
  radiante: [
    'tá radiante! Você tá voando. 🔥',
    'tá brilhando — esse ritmo é raro.',
    'nunca te viu tão constante. 🔥',
  ],
  animado: [
    'tá animado. Bora pra missão de hoje?',
    'tá de boa, pronto pra mais uma.',
    'tá te esperando pra começar.',
  ],
  quietinho: [
    'ficou quietinho. Que tal uma lição rapidinha?',
    'deu uma esfriada. Uma missão resolve.',
    'tá meio de boa hoje. Bora animar ele?',
  ],
  saudade: [
    'tava com saudade. Que bom que você voltou.',
    'sentiu sua falta — e tá feliz que você chegou.',
    'guardou seu lugar esse tempo todo.',
  ],
  cochilando: [
    'cochilou te esperando. Bora acordar ele?',
    'tirou um cochilo. Um oi e ele acorda.',
    'tá dormindo de leve. Chega junto.',
  ],
}

const POKES = ['adorou! 😄', 'fez cosquinha! 😆', 'pediu de novo. 🥰', 'ganhou o dia. ✨', 'ficou todo bobo. 😌']
const SUBS  = ['toca pra fazer carinho', 'cutuca ele', 'dá um oi']

const pick = (arr, seed) => arr[seed % arr.length]

export default function ZappyCompanion() {
  const { state } = useZapfy()
  const energy = state.zappyEnergy ?? 80
  const mood = moodFromEnergy(energy)

  // Semente estável por sessão (varia entre aberturas, não pisca no render)
  const [seed] = useState(() => Math.floor(Math.random() * 997))
  const statusLine = pick(STATUS[mood] || STATUS.animado, seed)
  const subLine = pick(SUBS, seed)

  // Cutucar => reação rápida + fala aleatória + volta pro humor
  const [poke, setPoke] = useState(null)
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])

  const handlePoke = () => {
    clearTimeout(timer.current)
    setPoke(POKES[Math.floor(Math.random() * POKES.length)])
    playTap()
    timer.current = setTimeout(() => setPoke(null), 1300)
  }

  const shown = poke ? 'radiante' : mood

  return (
    <button
      onClick={handlePoke}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        margin: '0 16px 12px', width: 'calc(100% - 32px)',
        background: '#131D33', borderRadius: 18, padding: '10px 14px',
        textAlign: 'left', cursor: 'pointer',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.35)',
        border: '1.5px solid rgba(255,255,255,0.08)',
      }}>
      <div style={{ width: 52, height: 52, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Zappy mood={shown} size={52} float />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13.5, fontWeight: 800, color: C.ink, margin: 0, lineHeight: 1.3 }}>
          O Zappy {poke || statusLine}
        </p>
        <p style={{ fontSize: 10.5, fontWeight: 600, color: C.inkSoft, margin: '2px 0 0' }}>
          {subLine}
        </p>
      </div>
    </button>
  )
}
