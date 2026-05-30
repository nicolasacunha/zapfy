import { X, Lock } from 'lucide-react'
import { C } from '../tokens'
import { useZapfy } from '../context/ZapfyContext'
import { ACHIEVEMENTS } from '../data/achievements'

export default function AchievementsScreen({ onNav }) {
  const { state } = useZapfy()
  const unlocked = state.unlockedAchievements || []
  const total    = ACHIEVEMENTS.length
  const count    = unlocked.length

  return (
    <div className="min-h-screen flex flex-col screen-enter" style={{ background: C.bg }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <button onClick={() => onNav('profile')}
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: '#F1F5F9' }}>
          <X size={20} color={C.inkSoft} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-black" style={{ color: C.ink }}>Conquistas</h1>
          <p className="text-xs font-semibold" style={{ color: C.inkSoft }}>
            {count}/{total} desbloqueadas
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-xl font-extrabold text-sm"
          style={{ background: `${C.warning}22`, color: C.warning }}>
          {count}/{total}
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 mb-4">
        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: C.border }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.round((count / total) * 100)}%`,
              background: `linear-gradient(90deg, ${C.warning} 0%, #F59E0B 100%)`,
            }} />
        </div>
      </div>

      {/* Grid */}
      <div className="px-4 grid grid-cols-2 gap-3 pb-8">
        {ACHIEVEMENTS.map((a, i) => {
          const isUnlocked = unlocked.includes(a.id)
          return (
            <div key={a.id}
              className="rounded-2xl border-2 p-4 flex flex-col items-center gap-2 text-center card-rise stagger"
              style={{
                '--i': i % 6,
                borderColor: isUnlocked ? C.warning : C.border,
                background:  isUnlocked ? `${C.warning}10` : C.card,
                opacity:     isUnlocked ? 1 : 0.55,
              }}>
              <div className="text-4xl" style={{ filter: isUnlocked ? 'none' : 'grayscale(100%)' }}>
                {isUnlocked ? a.emoji : '🔒'}
              </div>
              <div>
                <p className="font-extrabold text-xs" style={{ color: isUnlocked ? C.ink : C.inkSoft }}>
                  {a.name}
                </p>
                <p className="text-[10px] font-semibold mt-0.5" style={{ color: C.inkSoft }}>
                  {a.desc}
                </p>
              </div>
              {isUnlocked && (
                <div className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full"
                  style={{ background: `${C.warning}30`, color: C.warning }}>
                  DESBLOQUEADA ✓
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
