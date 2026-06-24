import { useState, useRef, useEffect } from 'react'
import { C } from '../tokens'
import { useZapfy } from '../context/ZapfyContext'
import Zappy from './Zappy'
import { moodFromEnergy } from '../lib/zappyState'

// Frase de status por humor — voz da marca, calorosa, anti-vergonha
const STATUS = {
  radiante:   'tá radiante! Você tá voando. 🔥',
  animado:    'tá animado. Bora pra missão de hoje?',
  quietinho:  'ficou quietinho. Que tal uma lição rapidinha?',
  saudade:    'tava com saudade. Que bom que você voltou.',
  cochilando: 'cochilou te esperando. Bora acordar ele?',
}

export default function ZappyCompanion() {
  const { state } = useZapfy()
  const energy = state.zappyEnergy ?? 80
  const mood = moodFromEnergy(energy)

  // Cutucar o Zappy => reação rápida e volta pro humor
  const [poke, setPoke] = useState(null)
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])

  const handlePoke = () => {
    clearTimeout(timer.current)
    setPoke('radiante')
    timer.current = setTimeout(() => setPoke(null), 1300)
  }

  const shown = poke || mood

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
          O Zappy {poke ? 'adorou! 😄' : STATUS[mood]}
        </p>
        <p style={{ fontSize: 10.5, fontWeight: 600, color: C.inkSoft, margin: '2px 0 0' }}>
          toca pra fazer carinho
        </p>
      </div>
    </button>
  )
}
