import { useEffect } from 'react'
import { C } from '../tokens'
import Zappy from './Zappy'

export default function ToastAchievement({ achievement, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500)
    return () => clearTimeout(t)
  }, [onDismiss])

  if (!achievement) return null

  return (
    <div
      className="fixed bottom-24 inset-x-0 mx-auto z-50 slide-up"
      style={{ width: 'min(360px, calc(100vw - 32px))' }}
      onClick={onDismiss}>
      <div className="flex items-center gap-3 p-4 rounded-2xl shadow-lg"
        style={{
          background:  C.card,
          border:      `2px solid ${C.warning}`,
          boxShadow:   `0 8px 32px ${C.warning}30`,
        }}>

        <div className="flex-shrink-0">
          <Zappy mood="cheer" size={44} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: C.warning }}>
            Conquista desbloqueada! 🏆
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xl">{achievement.emoji}</span>
            <p className="font-extrabold text-sm truncate" style={{ color: C.ink }}>
              {achievement.name}
            </p>
          </div>
          <p className="text-[11px] font-semibold" style={{ color: C.inkSoft }}>
            {achievement.desc}
          </p>
        </div>
      </div>
    </div>
  )
}
