import { useState } from 'react'
import { Flame, Coins, Gem, ArrowLeft, Volume2, VolumeX } from 'lucide-react'
import { C } from '../tokens'
import Hearts from './Hearts'
import { isMuted, setMuted } from '../lib/sound'

function formatRegen(secs) {
  if (secs <= 0) return ''
  return secs < 60 ? `${secs}s` : `${Math.floor(secs / 60)}m`
}

const PILL = {
  display: 'flex', alignItems: 'center', gap: 5,
  padding: '5px 10px', borderRadius: 12,
  fontWeight: 700, fontSize: 13,
}

export default function Header({ state, onBack, nextRegenIn = 0 }) {
  const [muted, setMutedState] = useState(() => isMuted())

  const toggleMute = () => {
    const next = !muted
    setMuted(next)
    setMutedState(next)
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 12px 10px',
      gap: 6,
      borderBottom: `1px solid ${C.border}`,
    }}>
      {onBack ? (
        <button onClick={onBack}
          style={{
            width: 34, height: 34, borderRadius: 10, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,255,255,0.06)', border: `1px solid ${C.border}`,
            transition: 'background .15s',
          }}>
          <ArrowLeft size={18} color={C.inkSoft} />
        </button>
      ) : (
        <div style={{ width: 34 }} />
      )}

      {/* Streak */}
      <div style={{
        ...PILL,
        background: state.streakFreezeActive ? '#E0F2FE' : C.accentLt,
        color: state.streakFreezeActive ? '#0284C7' : C.accent,
      }}>
        <span className="fire-pulse" style={{ display: 'inline-flex' }}>
          {state.streakFreezeActive
            ? <span style={{ fontSize: 13 }}>🧊</span>
            : <Flame size={15} fill={C.accent} color={C.accent} />}
        </span>
        <span key={state.streak} className="pop-in" style={{ fontWeight: 800 }}>
          {state.streak}
        </span>
      </div>

      {/* Hearts */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Hearts count={state.hearts} />
        {state.hearts < 5 && nextRegenIn > 0 && (
          <span style={{ fontSize: 9, fontWeight: 700, color: C.inkSoft }}>
            ⏱ +1 em {formatRegen(nextRegenIn)}
          </span>
        )}
      </div>

      {/* Zapcoins */}
      <div style={{ ...PILL, background: C.warningLt, color: C.ink }}>
        <Coins size={14} fill={C.warning} color={C.warning} />
        <span key={state.zapcoins} className="pop-in" style={{ fontWeight: 800 }}>
          {state.zapcoins}
        </span>
      </div>

      {/* Gems */}
      <div style={{ ...PILL, background: C.purpleLt, color: C.purple }}>
        <Gem size={14} color={C.purple} />
        <span key={state.gems} className="pop-in" style={{ fontWeight: 800 }}>
          {state.gems}
        </span>
      </div>

      {/* Mute */}
      <button onClick={toggleMute}
        style={{
          width: 34, height: 34, borderRadius: 10, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: muted ? C.dangerLt : 'rgba(255,255,255,0.06)',
          border: `1px solid ${muted ? C.danger + '40' : C.border}`,
          transition: 'background .15s, border-color .15s',
        }}>
        {muted
          ? <VolumeX size={15} color={C.danger} />
          : <Volume2 size={15} color={C.inkSoft} />}
      </button>
    </div>
  )
}
