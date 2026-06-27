import { useState } from 'react'
import { C } from '../tokens'
import { useZapfy } from '../context/ZapfyContext'
import Zappy from '../components/Zappy'
import Btn from '../components/Btn'
import FounderCard from '../components/FounderCard'

const CONFETTI = Array.from({ length: 56 }, (_, i) => ({
  id: i,
  color: ['#FACC15','#F97316','#A855F7','#22C55E','#EC4899','#60A5FA','white'][i % 7],
  left: (i * 1.8 + 3) % 100,
  delay: (i * 0.037) % 2,
  size: 8 + (i % 5) * 2.5,
  dur: 2.5 + (i % 4) * 0.5,
  shape: i % 3 === 0 ? '50%' : '4px',
}))

export default function FounderCelebration({ onNav }) {
  const { state, dispatch } = useZapfy()
  const company     = state.company
  const founderName = state.childProfile?.name ?? ''
  const isGold      = company?.isGold ?? false
  const [showCard, setShowCard] = useState(false)

  const handleClaim = () => {
    dispatch({ type: 'UNLOCK_FOUNDER' })
    onNav('profile')
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center',
        background: 'linear-gradient(160deg, #0F172A 0%, #1E1A38 50%, #4C1D95 100%)',
        overflowY: 'auto',
        paddingBottom: 40,
      }}
    >
      {/* Confetti */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        {CONFETTI.map(c => (
          <div key={c.id} style={{
            position: 'absolute',
            left: `${c.left}%`, top: -20,
            width: c.size, height: c.size,
            background: c.color,
            borderRadius: c.shape,
            animation: `confetti-fall ${c.dur}s ${c.delay}s ease-in forwards`,
          }} />
        ))}
      </div>

      {/* ── Header ── */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '48px 24px 0',
        gap: 16,
        animation: 'screen-enter 0.5s var(--ease-expo) both',
      }}>
        <Zappy mood="cheer" size={112} skin="astronaut" />

        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 44, marginBottom: 6 }}>⚡</p>
          <h1 style={{
            fontFamily: 'Grandstander, cursive',
            fontSize: 40, fontWeight: 900,
            color: 'white',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            margin: 0,
          }}>
            Founder<br />Oficial.
          </h1>
          <p style={{
            fontFamily: 'Figtree, system-ui, sans-serif',
            fontSize: 15, fontWeight: 600,
            color: 'rgba(255,255,255,0.65)',
            marginTop: 10,
          }}>
            {company?.name
              ? `${company.name} existe. E você fundou.`
              : 'Você fundou sua primeira empresa.'}
          </p>
        </div>

        {/* XP pill */}
        <div style={{
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 100,
          padding: '8px 20px',
          fontFamily: 'Figtree, system-ui, sans-serif',
          fontSize: 13, fontWeight: 700,
          color: 'rgba(255,255,255,0.85)',
        }}>
          +200 XP · +5 Gemas · Badge permanente ⚡
        </div>
      </div>

      {/* ── Card section ── */}
      <div style={{
        position: 'relative', zIndex: 2,
        width: '100%', padding: '28px 24px 0',
        animation: 'screen-enter 0.6s 0.15s var(--ease-expo) both',
      }}>
        {!showCard ? (
          /* Teaser — toque para revelar o card */
          <button
            onClick={() => setShowCard(true)}
            style={{
              width: '100%',
              background: 'rgba(124,58,237,0.18)',
              border: '1.5px solid rgba(124,58,237,0.45)',
              borderRadius: 20,
              padding: '20px 24px',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 16,
              textAlign: 'left',
            }}
          >
            <div style={{
              width: 52, height: 52,
              background: 'rgba(124,58,237,0.25)',
              borderRadius: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, flexShrink: 0,
            }}>
              🎴
            </div>
            <div>
              <p style={{
                fontFamily: 'Grandstander, cursive',
                fontSize: 15, fontWeight: 900,
                color: '#E6EDFF', margin: '0 0 4px',
              }}>
                Cartão de Fundador
              </p>
              <p style={{
                fontFamily: 'Figtree, system-ui, sans-serif',
                fontSize: 12, fontWeight: 600,
                color: '#A57DFF', margin: 0,
              }}>
                Toque para gerar e compartilhar ›
              </p>
            </div>
          </button>
        ) : (
          /* Card expandido */
          <div style={{ animation: 'screen-enter 0.35s var(--ease-expo) both' }}>
            <FounderCard
              company={company}
              founderName={founderName}
              isGold={isGold}
            />
          </div>
        )}
      </div>

      {/* ── Actions ── */}
      <div style={{
        position: 'relative', zIndex: 2,
        width: '100%', padding: '24px 24px 0',
        display: 'flex', flexDirection: 'column', gap: 12,
        animation: 'screen-enter 0.6s 0.25s var(--ease-expo) both',
      }}>
        <Btn onClick={handleClaim} size="lg" full variant="secondary"
          cls="bg-yellow-400 text-gray-900 border-0"
        >
          Resgatar badge 🏆
        </Btn>
        <button
          onClick={() => onNav('pathway')}
          style={{
            background: 'none', border: 'none',
            fontFamily: 'Figtree, system-ui, sans-serif',
            fontSize: 13, fontWeight: 600,
            color: 'rgba(255,255,255,0.45)',
            cursor: 'pointer', padding: '6px 0',
            textAlign: 'center',
          }}
        >
          Continuar jogando
        </button>
      </div>
    </div>
  )
}
