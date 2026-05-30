import { useState } from 'react'
import { Coins, Gem } from 'lucide-react'
import { C } from '../tokens'

const REWARDS = [
  { type: 'zapcoins', amount: 15, label: '+15', emoji: '🪙' },
  { type: 'zapcoins', amount: 25, label: '+25', emoji: '🪙' },
  { type: 'zapcoins', amount: 10, label: '+10', emoji: '🪙' },
  { type: 'gems',     amount: 1,  label: '+1',  emoji: '💎' },
  { type: 'zapcoins', amount: 20, label: '+20', emoji: '🪙' },
  { type: 'xp',       amount: 15, label: '+15 XP', emoji: '⚡' },
]

export function pickChestReward() {
  return REWARDS[Math.floor(Math.random() * REWARDS.length)]
}

export default function TreasureChest({ reward, onCollect }) {
  const [phase, setPhase] = useState('closed') // closed → opening → open

  const handleTap = () => {
    if (phase !== 'closed') return
    setPhase('opening')
    setTimeout(() => setPhase('open'), 500)
  }

  const isGem = reward?.type === 'gems'

  return (
    <div className="w-full rounded-2xl border-2 p-4 flex flex-col items-center gap-3 card-rise stagger"
      style={{ '--i': 4, borderColor: C.warning, background: `${C.warning}10` }}>

      <p className="text-xs font-extrabold uppercase tracking-wide" style={{ color: C.warning }}>
        🎁 Baú de recompensa
      </p>

      {phase === 'closed' && (
        <button
          onClick={handleTap}
          className="flex flex-col items-center gap-2 active:scale-90 transition-transform"
          style={{ background: 'none', border: 'none' }}>
          <span style={{ fontSize: 52 }} className="drop-shadow-lg">🎁</span>
          <span className="text-xs font-extrabold" style={{ color: C.inkSoft }}>Toque para abrir</span>
        </button>
      )}

      {phase === 'opening' && (
        <span style={{ fontSize: 52 }} className="animate-bounce">✨</span>
      )}

      {phase === 'open' && reward && (
        <div className="flex flex-col items-center gap-3 pop-in w-full">
          <span style={{ fontSize: 44 }}>🏆</span>
          <div className="flex items-center gap-2">
            {isGem
              ? <Gem size={24} color="#A855F7" />
              : <Coins size={24} fill={C.warning} color={C.warning} />}
            <span className="text-2xl font-black" style={{ color: C.ink }}>
              {reward.label} {reward.type === 'xp' ? 'XP' : reward.type === 'gems' ? 'Gemas' : 'Zapcoins'}
            </span>
          </div>
          <button
            onClick={onCollect}
            className="w-full py-2.5 rounded-xl font-extrabold text-white text-sm uppercase"
            style={{ background: C.success, boxShadow: '0 3px 0 #16A34A' }}>
            Coletar! ✓
          </button>
        </div>
      )}
    </div>
  )
}
