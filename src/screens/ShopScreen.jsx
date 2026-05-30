import { useState } from 'react'
import { Coins, Gem } from 'lucide-react'
import { C } from '../tokens'
import { useZapfy } from '../context/ZapfyContext'

export default function ShopScreen() {
  const { state, dispatch } = useZapfy()
  const [bought, setBought] = useState([])

  const items = [
    { id: 1, e: '❤️', n: 'Refil de Vidas',    d: '5 vidas instantâneas',            price: 50,  cur: 'zap', stock: true  },
    { id: 2, e: '🧊', n: 'Congelar Streak',   d: 'Protege streak por 24h',          price: 10,  cur: 'gem', stock: true  },
    { id: 3, e: '🎰', n: 'Aposta de Streak',  d: 'Mantém 7 dias? Triplica 50 🪙',   price: 50,  cur: 'zap', stock: true  },
    { id: 4, e: '⚡', n: 'Dobro de XP',        d: '2× XP por 15 minutos',            price: 200, cur: 'zap', stock: true  },
    { id: 5, e: '✨', n: 'Zappy Dourado',      d: 'Visual premium do mascote',       price: 3,   cur: 'gem', stock: true  },
    { id: 6, e: '🚀', n: 'Zappy Astronauta',   d: 'Skin exclusiva do espaço',        price: 5,   cur: 'gem', stock: false },
  ]

  const canAfford = (it) => it.cur === 'zap' ? state.zapcoins >= it.price : state.gems >= it.price

  const handleBuy = (it) => {
    if (bought.includes(it.id) || !canAfford(it) || !it.stock) return
    setBought(b => [...b, it.id])
    if (it.id === 1) dispatch({ type: 'RESTORE_HEARTS' })
    else if (it.id === 2) dispatch({ type: 'BUY_STREAK_FREEZE' })
    else if (it.id === 3) dispatch({ type: 'START_WAGER', amount: it.price })
    else if (it.id === 5) dispatch({ type: 'SET_SKIN', skin: 'golden' })
    else if (it.cur === 'zap') dispatch({ type: 'SPEND_ZAPCOIN', amount: it.price })
    else dispatch({ type: 'SPEND_GEM', amount: it.price })
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: C.bg }}>
      <div className="px-4 pt-4 pb-3">
        <h1 className="text-2xl font-black" style={{ color: C.ink }}>Loja Zapfy</h1>
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

      <div className="px-4 grid grid-cols-2 gap-3">
        {items.map(it => {
          const isBought = bought.includes(it.id)
          const afford   = canAfford(it)
          return (
            <div key={it.id} className="rounded-3xl border-2 p-4 flex flex-col gap-2 relative overflow-hidden"
              style={{ borderColor: isBought ? C.success : C.border, background: C.card }}>
              {!it.stock && (
                <div className="absolute inset-0 flex items-center justify-center z-10" style={{ background: 'rgba(255,255,255,.85)' }}>
                  <span className="text-xs font-extrabold px-3 py-1 rounded-xl" style={{ background: `${C.warning}30`, color: C.warning }}>EM BREVE</span>
                </div>
              )}
              <span className="text-4xl">{it.e}</span>
              <p className="font-extrabold text-sm leading-tight" style={{ color: C.ink }}>{it.n}</p>
              <p className="text-xs font-semibold flex-1" style={{ color: C.inkSoft }}>{it.d}</p>
              <button
                onClick={() => handleBuy(it)}
                className="py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wide"
                style={{
                  background:  isBought ? C.success : afford ? (it.cur === 'gem' ? '#A855F7' : C.warning) : C.border,
                  color:       isBought ? 'white' : afford ? (it.cur === 'gem' ? 'white' : C.ink) : C.inkSoft,
                  boxShadow:   afford && !isBought ? `0 3px 0 ${it.cur === 'gem' ? '#7C3AED' : '#D97706'}` : 'none',
                }}>
                {isBought ? '✓ Comprado' : `${it.price} ${it.cur === 'zap' ? '🪙' : '💎'}`}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
