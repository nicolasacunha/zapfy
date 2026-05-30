import { useState } from 'react'
import { Coins, Gem, Crown, ChevronRight, Sparkles } from 'lucide-react'
import { C } from '../tokens'
import Zappy from '../components/Zappy'
import { useZapfy } from '../context/ZapfyContext'

const IN_GAME_ITEMS = [
  { id: 'hearts',  e: '❤️', n: 'Refil de Vidas',   d: '5 vidas instantâneas',          price: 50,  cur: 'zap' },
  { id: 'freeze',  e: '🧊', n: 'Congelar Streak',  d: 'Protege streak por 24h',         price: 10,  cur: 'gem' },
  { id: 'wager',   e: '🎰', n: 'Aposta de Streak', d: 'Mantém 7 dias? Triplica 50 🪙', price: 50,  cur: 'zap' },
  { id: 'xp2x',   e: '⚡', n: 'Dobro de XP',       d: '2× XP por 15 minutos',           price: 200, cur: 'zap' },
]

const SKINS = [
  { id: 'golden',    e: '✨', n: 'Zappy Dourado',    d: 'Visual dourado exclusivo',   price: 'R$7,90', skin: 'golden',    available: true  },
  { id: 'astronaut', e: '🚀', n: 'Zappy Astronauta', d: 'Skin espacial do Zappy',     price: 'R$7,90', skin: 'astronaut', available: false },
  { id: 'ninja',     e: '🥷', n: 'Zappy Ninja',      d: 'Velocidade e furtividade',   price: 'R$7,90', skin: 'ninja',     available: false },
]

export default function ShopScreen({ onNav }) {
  const { state, dispatch } = useZapfy()
  const [boughtInGame, setBoughtInGame] = useState([])

  const canAfford = (it) => it.cur === 'zap' ? state.zapcoins >= it.price : state.gems >= it.price

  const handleBuyInGame = (it) => {
    if (boughtInGame.includes(it.id) || !canAfford(it)) return
    setBoughtInGame(b => [...b, it.id])
    if (it.id === 'hearts') dispatch({ type: 'RESTORE_HEARTS' })
    else if (it.id === 'freeze') dispatch({ type: 'BUY_STREAK_FREEZE' })
    else if (it.id === 'wager') dispatch({ type: 'START_WAGER', amount: it.price })
    else if (it.cur === 'zap') dispatch({ type: 'SPEND_ZAPCOIN', amount: it.price })
    else dispatch({ type: 'SPEND_GEM', amount: it.price })
  }

  const handleBuySkin = (skin) => {
    // Opens Founder/cosmetic purchase flow
    if (onNav) onNav('paywall')
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: C.bg }}>

      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <h1 className="text-2xl font-black" style={{ color: C.ink }}>Loja</h1>
        <div className="flex gap-3 mt-2">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-sm" style={{ background: `${C.warning}20` }}>
            <Coins size={16} fill={C.warning} color={C.warning} />
            <span style={{ color: C.ink }}>{state.zapcoins} Zapcoins</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-sm" style={{ background: '#A855F720' }}>
            <Gem size={16} color="#A855F7" />
            <span style={{ color: C.ink }}>{state.gems} Gemas</span>
          </div>
        </div>
      </div>

      <div className="px-4 flex flex-col gap-6">

        {/* Zapfy Founder CTA */}
        <button
          onClick={() => onNav && onNav('paywall')}
          style={{
            background: 'linear-gradient(135deg, #1E40AF 0%, #7C3AED 100%)',
            borderRadius: 20, padding: '16px 20px',
            display: 'flex', alignItems: 'center', gap: 14,
            border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
            boxShadow: '0 4px 0 #1E3A8A',
          }}
        >
          <div style={{
            width: 52, height: 52, borderRadius: 16,
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Crown size={24} fill="#F97316" color="#F97316" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 15, fontWeight: 900, color: 'white', margin: 0 }}>
              Zapfy Founder
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: '3px 0 0' }}>
              Streak ilimitado · missões bônus · relatório do pai
            </p>
            <p style={{ fontSize: 13, fontWeight: 800, color: '#F97316', margin: '4px 0 0' }}>
              R$19,90/mês
            </p>
          </div>
          <ChevronRight size={20} color="rgba(255,255,255,0.6)" />
        </button>

        {/* Skins do Zappy */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Sparkles size={16} color={C.purple} />
            <p style={{ fontSize: 13, fontWeight: 800, color: C.ink, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Skins do Zappy
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {SKINS.map(skin => {
              const owned = state.zapfySkin === skin.skin
              return (
                <button
                  key={skin.id}
                  onClick={() => {
                    if (owned) {
                      dispatch({ type: 'SET_SKIN', skin: skin.skin })
                    } else if (skin.available) {
                      handleBuySkin(skin)
                    }
                  }}
                  style={{
                    background: owned ? `${C.purple}22` : C.card,
                    border: `2px solid ${owned ? C.purple : C.border}`,
                    borderRadius: 16, padding: '14px 10px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                    cursor: skin.available || owned ? 'pointer' : 'default',
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  {!skin.available && !owned && (
                    <div style={{
                      position: 'absolute', inset: 0, background: 'rgba(12,18,34,0.7)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: 14,
                    }}>
                      <span style={{ fontSize: 9, fontWeight: 800, color: C.warning, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Em breve</span>
                    </div>
                  )}
                  <span style={{ fontSize: 28 }}>{skin.e}</span>
                  <p style={{ fontSize: 10, fontWeight: 800, color: owned ? C.purple : C.ink, textAlign: 'center', lineHeight: 1.3 }}>
                    {skin.n}
                  </p>
                  <p style={{ fontSize: 11, fontWeight: 800, color: owned ? C.success : C.inkSoft }}>
                    {owned ? '✓ Ativo' : skin.price}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Loja de Zapcoins */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Coins size={16} fill={C.warning} color={C.warning} />
            <p style={{ fontSize: 13, fontWeight: 800, color: C.ink, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Loja de Zapcoins
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {IN_GAME_ITEMS.map(it => {
              const isBought = boughtInGame.includes(it.id)
              const afford   = canAfford(it)
              return (
                <div key={it.id} style={{
                  background: C.card,
                  border: `2px solid ${isBought ? C.success : C.border}`,
                  borderRadius: 16, padding: '14px 12px',
                  display: 'flex', flexDirection: 'column', gap: 6,
                }}>
                  <span style={{ fontSize: 30 }}>{it.e}</span>
                  <p style={{ fontSize: 12, fontWeight: 800, color: C.ink, lineHeight: 1.3 }}>{it.n}</p>
                  <p style={{ fontSize: 11, fontWeight: 600, color: C.inkSoft, flex: 1 }}>{it.d}</p>
                  <button
                    onClick={() => handleBuyInGame(it)}
                    style={{
                      background: isBought ? C.success : afford ? (it.cur === 'gem' ? '#A855F7' : C.warning) : C.border,
                      color: isBought ? 'white' : afford ? (it.cur === 'gem' ? 'white' : C.ink) : C.inkSoft,
                      boxShadow: afford && !isBought ? `0 3px 0 ${it.cur === 'gem' ? '#7C3AED' : '#D97706'}` : 'none',
                      border: 'none', borderRadius: 10, padding: '9px 0',
                      fontSize: 11, fontWeight: 800, letterSpacing: '0.06em',
                      textTransform: 'uppercase', cursor: afford ? 'pointer' : 'default',
                    }}
                  >
                    {isBought ? '✓ Comprado' : `${it.price} ${it.cur === 'zap' ? '🪙' : '💎'}`}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
