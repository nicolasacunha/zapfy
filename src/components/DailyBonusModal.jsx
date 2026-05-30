import { useState } from 'react'
import { Coins, Gem, X } from 'lucide-react'
import { C } from '../tokens'
import Zappy from './Zappy'
import { getDayRewards } from '../lib/dailyBonus'

export default function DailyBonusModal({ bonus, onClaim }) {
  const [claimed, setClaimed] = useState(false)
  const rewards = getDayRewards()

  const handle = () => {
    setClaimed(true)
    setTimeout(onClaim, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.55)' }}>
      <div className="w-full max-w-[420px] rounded-t-3xl px-5 pt-6 pb-8 pop-in"
        style={{ background: C.card }}>

        {/* Header */}
        <div className="flex flex-col items-center gap-2 mb-5">
          <div className="zappy-float"><Zappy mood="cheer" size={72} /></div>
          <h2 className="text-2xl font-black text-center" style={{ color: C.ink }}>
            {claimed ? 'Recompensa recebida!' : 'Recompensa diária!'}
          </h2>
          <p className="text-sm font-semibold text-center" style={{ color: C.inkSoft }}>
            {bonus.streak >= 7 ? 'Sequência semanal completa! 🌟' : `Volte amanhã para o Dia ${Math.min(bonus.streak + 1, 7)}`}
          </p>
        </div>

        {/* Day dots */}
        <div className="flex justify-between mb-5 px-1">
          {rewards.map((r, i) => {
            const past    = i < bonus.dayIdx
            const current = i === bonus.dayIdx
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${current ? 'pop-in' : ''}`}
                  style={{
                    background: past ? C.success : current ? (r.special ? C.warning : C.primary) : C.border,
                    boxShadow:  current ? `0 3px 0 ${r.special ? '#D97706' : C.primaryDk}` : 'none',
                  }}>
                  {past
                    ? <span style={{ fontSize: 14 }}>✓</span>
                    : current
                      ? (r.special ? <Gem size={16} color="white" /> : <Coins size={16} color="white" />)
                      : <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 800 }}>{i + 1}</span>}
                </div>
                <span className="text-[9px] font-extrabold" style={{ color: current ? C.ink : '#94A3B8' }}>
                  {r.special ? '🌟' : `D${i + 1}`}
                </span>
              </div>
            )
          })}
        </div>

        {/* Reward highlight */}
        <div className="rounded-2xl p-4 mb-5 flex items-center justify-center gap-4"
          style={{ background: bonus.special ? `${C.warning}15` : `${C.primary}12`, border: `2px solid ${bonus.special ? C.warning : C.primary}30` }}>
          {bonus.zapcoins > 0 && (
            <div className="flex items-center gap-2">
              <Coins size={28} fill={C.warning} color={C.warning} />
              <span className="text-3xl font-black" style={{ color: C.ink }}>+{bonus.zapcoins}</span>
            </div>
          )}
          {bonus.gems > 0 && (
            <div className="flex items-center gap-2">
              <Gem size={28} color="#A855F7" />
              <span className="text-3xl font-black" style={{ color: C.ink }}>+{bonus.gems}</span>
            </div>
          )}
        </div>

        <button
          onClick={handle}
          disabled={claimed}
          className="w-full py-4 rounded-2xl font-extrabold text-white uppercase tracking-wide text-base transition-all active:scale-95"
          style={{
            background: claimed ? C.success : bonus.special ? C.warning : C.primary,
            boxShadow:  claimed ? 'none' : `0 4px 0 ${bonus.special ? '#D97706' : C.primaryDk}`,
            color:      claimed || bonus.special ? 'white' : 'white',
          }}>
          {claimed ? '✓ Recebido!' : 'Coletar recompensa'}
        </button>
      </div>
    </div>
  )
}
