import { useState, useEffect } from 'react'
import { Trophy, Coins, Settings } from 'lucide-react'
import { C } from '../tokens'
import { playTap } from '../lib/sound'
import { useZapfy } from '../context/ZapfyContext'
import { hasPendingMissions } from '../lib/missions'

export default function TabBar({ screen, onNav }) {
  const { state } = useZapfy()
  const pendingMissions = hasPendingMissions(state.streak)
  const [prevActive, setPrevActive] = useState(null)

  const tabs = [
    {
      id: 'pathway', label: 'Trilha',
      icon: (a) => (
        <svg viewBox="0 0 24 24" width={22} height={22} fill="none"
          stroke={a ? C.primary : C.inkSoft} strokeWidth={2.5} strokeLinecap="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      id: 'league', label: 'Liga',
      icon: (a) => <Trophy size={22} color={a ? C.primary : C.inkSoft} fill={a ? C.primary : 'none'} strokeWidth={2} />,
    },
    {
      id: 'shop', label: 'Loja',
      icon: (a) => <Coins size={22} color={a ? C.primary : C.inkSoft} fill={a ? C.primary : 'none'} strokeWidth={2} />,
    },
    {
      id: 'profile', label: 'Perfil',
      icon: (a) => (
        <svg viewBox="0 0 24 24" width={22} height={22} fill="none"
          stroke={a ? C.primary : C.inkSoft} strokeWidth={2.5} strokeLinecap="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
      ),
    },
    {
      id: 'parentsLock', label: 'Pais',
      icon: (a) => <Settings size={22} color={a ? C.primary : C.inkSoft} />,
    },
  ]

  const activeIdx = tabs.findIndex(t => t.id === screen || (t.id === 'parentsLock' && screen === 'parents'))
  const safeIdx   = activeIdx >= 0 ? activeIdx : 0

  useEffect(() => {
    if (activeIdx >= 0) setPrevActive(activeIdx)
  }, [activeIdx])

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] z-50"
      style={{
        background: C.card,
        borderTop: `1px solid ${C.border}`,
        boxShadow: '0 -8px 32px rgba(0,0,0,0.5)',
      }}>
      <div className="flex px-2 pt-2 pb-2" style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom, 8px))' }}>
        {tabs.map((t, i) => {
          const active    = i === safeIdx
          const justActed = active && prevActive !== i

          return (
            <button
              key={t.id}
              onClick={() => { playTap(); onNav(t.id) }}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 4, padding: '6px 4px',
                background: 'none', border: 'none', cursor: 'pointer',
              }}
            >
              {/* Icon — no pill background, just color shift */}
              <div style={{
                position: 'relative',
                transition: 'transform 0.15s var(--ease-expo)',
              }}>
                <span
                  className={justActed ? 'tab-bounce' : ''}
                  key={`${t.id}-${active}`}
                  style={{ display: 'block', position: 'relative' }}
                >
                  {t.icon(active)}
                  {t.id === 'pathway' && pendingMissions && (
                    <span className="absolute -top-0.5 -right-1 w-2.5 h-2.5 rounded-full pop-in"
                      style={{ background: C.danger, border: '1.5px solid white' }} />
                  )}
                </span>
              </div>

              <span style={{
                fontSize: 10,
                fontWeight: active ? 800 : 600,
                color: active ? C.primary : C.inkSoft,
                transition: 'color 0.2s',
              }}>
                {t.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
