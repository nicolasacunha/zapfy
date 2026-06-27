import { useState } from 'react'
import { Flame, Coins, Gem, ArrowLeft, Volume2, VolumeX } from 'lucide-react'
import { C } from '../tokens'
import Hearts from './Hearts'
import { isMuted, setMuted } from '../lib/sound'

function formatRegen(secs) {
  if (secs <= 0) return ''
  return secs < 60 ? `${secs}s` : `${Math.floor(secs / 60)}m`
}

const statLabel = {
  fontFamily: 'Figtree, sans-serif',
  fontWeight: 800,
  fontSize: 15,
  color: C.ink,
  lineHeight: 1,
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
      paddingTop: 'max(10px, env(safe-area-inset-top, 10px))',
      paddingBottom: 10,
      paddingLeft: 16,
      paddingRight: 16,
      gap: 8,
      background: C.bg,
      borderBottom: `1px solid ${C.border}`,
    }}>

      {/* Left: back button or spacer */}
      {onBack ? (
        <button onClick={onBack} style={{
          width: 28, height: 28, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'none', border: 'none', padding: 0, cursor: 'pointer',
        }}>
          <ArrowLeft size={20} color={C.inkSoft} />
        </button>
      ) : (
        <div style={{ width: 28, flexShrink: 0 }} />
      )}

      {/* Center: stats row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 18,
        flex: 1, justifyContent: 'center',
      }}>

        {/* Streak */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {state.streakFreezeActive
            ? <span style={{ fontSize: 15, lineHeight: 1 }}>🧊</span>
            : <Flame size={15} fill={C.accent} color={C.accent} />}
          <span key={state.streak} className="pop-in" style={statLabel}>
            {state.streak}
          </span>
        </div>

        {/* Hearts */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Hearts count={state.hearts} />
          {state.hearts < 5 && nextRegenIn > 0 && (
            <span style={{ fontSize: 9, fontWeight: 700, color: C.inkSoft, lineHeight: 1 }}>
              ⏱ +1 em {formatRegen(nextRegenIn)}
            </span>
          )}
        </div>

        {/* Zapcoins */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Coins size={15} fill={C.warning} color={C.warning} />
          <span key={state.zapcoins} className="pop-in" style={statLabel}>
            {state.zapcoins}
          </span>
        </div>

        {/* Gems */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Gem size={15} color={C.purple} />
          <span key={state.gems} className="pop-in" style={statLabel}>
            {state.gems}
          </span>
        </div>
      </div>

      {/* Right: mute button */}
      <button onClick={toggleMute} style={{
        width: 28, height: 28, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'none', border: 'none', padding: 0, cursor: 'pointer',
      }}>
        {muted
          ? <VolumeX size={18} color={C.inkSoft} />
          : <Volume2 size={18} color={C.inkSoft} />}
      </button>
    </div>
  )
}
