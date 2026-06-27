import { X, Check } from 'lucide-react'
import { C } from '../tokens'
import { useZapfy } from '../context/ZapfyContext'
import { getMissions } from '../lib/missions'
import { getCopy } from '../lib/copy'

export default function DailyMissionsScreen({ onNav }) {
  const { state, dispatch } = useZapfy()
  const missions = getMissions(state.streak)
  const allDone  = missions.every(m => m.done)

  const claimMission = (m) => {
    if (!m.done || m.claimed) return
    dispatch({ type: 'COMPLETE_MISSION', xp: m.reward.xp, zapcoins: m.reward.zapcoins })
  }

  return (
    <div className="min-h-screen flex flex-col screen-enter" style={{ background: C.bg }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-4 pb-3" style={{ paddingTop: 'max(16px, env(safe-area-inset-top, 16px))' }}>
        <button onClick={() => onNav('pathway')}
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: '#F1F5F9' }}>
          <X size={20} color={C.inkSoft} />
        </button>
        <div>
          <h1 className="text-xl font-black" style={{ color: C.ink }}>Missões do Dia</h1>
          <p className="text-xs font-semibold" style={{ color: C.inkSoft }}>
            Resetam à meia-noite
          </p>
        </div>
      </div>

      {allDone && (
        <div className="mx-4 mb-3 p-3 rounded-2xl pop-in"
          style={{ background: `${C.success}14`, border: `2px solid ${C.success}` }}>
          <p className="text-sm font-extrabold text-center" style={{ color: C.success }}>
            {getCopy('missionComplete', { company: state.company, user: state.user })}
          </p>
        </div>
      )}

      {/* Missions list */}
      <div className="px-4 flex flex-col gap-3 flex-1">
        {missions.map((m, i) => {
          const pct = Math.round((m.current / m.target) * 100)
          return (
            <div key={m.id}
              className="rounded-2xl border-2 p-4 card-rise stagger"
              style={{
                '--i': i,
                borderColor: m.done ? C.success : C.border,
                background:  m.done ? `${C.success}10` : C.card,
              }}>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{m.emoji}</span>
                  <div>
                    <p className="font-extrabold text-sm" style={{ color: C.ink }}>{m.title}</p>
                    <p className="text-xs font-semibold" style={{ color: C.inkSoft }}>
                      Recompensa: +{m.reward.xp} XP · +{m.reward.zapcoins} 🪙
                    </p>
                  </div>
                </div>
                {m.done
                  ? (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center pop-in"
                      style={{ background: C.success }}>
                      <Check size={16} color="white" strokeWidth={3} />
                    </div>
                  )
                  : (
                    <span className="text-xs font-extrabold px-2 py-1 rounded-lg"
                      style={{ background: C.bg, color: C.inkSoft }}>
                      {m.current}/{m.target}
                    </span>
                  )}
              </div>

              {/* Progress bar */}
              <div className="h-2.5 rounded-full overflow-hidden" style={{ background: C.border }}>
                <div
                  className="h-full rounded-full transition-all duration-700 relative overflow-hidden"
                  style={{
                    width: `${pct}%`,
                    background: m.done
                      ? C.success
                      : `linear-gradient(90deg, ${C.primary} 0%, #3B82F6 100%)`,
                  }}>
                  {pct > 0 && (
                    <div className="absolute inset-0 opacity-30"
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,.6) 50%, transparent 100%)',
                        animation: 'shimmer 2s ease-in-out infinite',
                      }} />
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tips */}
      <div className="mx-4 mt-4 mb-6 p-4 rounded-2xl" style={{ background: `${C.primary}10` }}>
        <p className="text-xs font-bold" style={{ color: C.primary }}>
          💡 Complete lições na Trilha para avançar nas missões. Seu streak atual é {state.streak} dias!
        </p>
      </div>
    </div>
  )
}
