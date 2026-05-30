import { useState, useEffect, useRef } from 'react'
import { Star, Flame, Coins } from 'lucide-react'
import { C } from '../tokens'
import { useZapfy } from '../context/ZapfyContext'
import Zappy from '../components/Zappy'
import Btn from '../components/Btn'
import { playComplete } from '../lib/sound'
import { getAITip } from '../lib/aiTips'
import { getCopy } from '../lib/copy'
import TreasureChest, { pickChestReward } from '../components/TreasureChest'
import { isLastUnitOfModule } from '../data/modules'

// ── CountUp: rola um número do zero até `target` ─────────────
function CountUp({ target, duration = 900, prefix = '', suffix = '', className = '', style = {} }) {
  const [val, setVal] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    const start = performance.now()
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - t, 3) // ease-out cubic
      setVal(Math.round(ease * target))
      if (t < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration])

  return (
    <span className={className} style={style}>
      {prefix}{val.toLocaleString('pt-BR')}{suffix}
    </span>
  )
}

export default function LessonResultScreen({ onNav, unitId, perfect }) {
  const { state, dispatch } = useZapfy()
  const [tip,        setTip]        = useState('')
  const [tipLoading, setTipLoading] = useState(true)
  const [chestReward]               = useState(() => pickChestReward())
  const [chestCollected, setChestCollected] = useState(false)

  const palette  = ['#F97316','#1E40AF','#22C55E','#FACC15','#A855F7','#EC4899']
  const confetti = useRef(
    Array.from({ length: 40 }, (_, i) => ({
      id: i, color: palette[i % palette.length],
      left: Math.random() * 100, delay: Math.random() * 1.8,
      size: 6 + Math.random() * 11, dur: 2 + Math.random() * 2.2,
      shape: i % 3 === 0 ? '50%' : i % 3 === 1 ? '4px' : '0%',
    }))
  ).current

  useEffect(() => {
    const t = setTimeout(playComplete, 300)
    getAITip(state.company, unitId).then(t => { setTip(t); setTipLoading(false) })
    return () => clearTimeout(t)
  }, [])

  const handleChestCollect = () => {
    setChestCollected(true)
    if (chestReward.type === 'zapcoins') dispatch({ type: 'CHEST_REWARD', zapcoins: chestReward.amount })
    else if (chestReward.type === 'gems') dispatch({ type: 'CHEST_REWARD', gems: chestReward.amount })
  }

  const handleContinue = () => {
    if (unitId) dispatch({ type: 'COMPLETE_UNIT', unitId, perfect })

    const lastMod = isLastUnitOfModule(unitId)
    if (lastMod?.mission) {
      if (lastMod.mission.type === 'canvas') {
        onNav('companyCreation')
      } else {
        onNav('mission', { moduleId: lastMod.id })
      }
    } else {
      onNav('pathway')
    }
  }

  const handleShare = async () => {
    const level = Math.floor(state.xp / 500) + 1
    const text = `Avancei uma missão no Zapfy ⚡ Nível ${level} — construindo meu negócio. #Zapfy #Empreendedorismo`
    try {
      await navigator.share({ title: 'Zapfy', text })
    } catch {
      await navigator.clipboard.writeText(text)
    }
  }

  const rewards = [
    {
      icon: <Star  size={22} fill={C.warning} color={C.warning} />,
      label: <CountUp target={25} prefix="+"/>,
      sub:   'XP ganho',
      border: C.warning,
    },
    {
      icon: <Flame size={22} fill={C.accent}  color={C.accent} />,
      label: <CountUp target={state.streak} suffix=" dias"/>,
      sub:   'streak 🔥',
      border: C.accent,
    },
    {
      icon: <Coins size={22} fill={C.warning} color={C.warning} />,
      label: <CountUp target={10} prefix="+"/>,
      sub:   'Zapcoins',
      border: C.warning,
    },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center" style={{ background: C.bg }}>

      {/* Confetti layer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
        {confetti.map(c => (
          <div key={c.id} className="absolute" style={{
            left: `${c.left}%`, top: -20, width: c.size, height: c.size,
            background: c.color, borderRadius: c.shape,
            animation: `confetti-fall ${c.dur}s ${c.delay}s ease-in forwards`,
          }} />
        ))}
      </div>

      <div className="flex flex-col items-center px-6 pt-10 pb-8 gap-6 w-full z-20">

        {/* Hero */}
        <div className="bounce-in" style={{ animationDelay: '0ms' }}>
          <Zappy mood="cheer" size={130} />
        </div>

        <div className="text-center slide-up" style={{ animationDelay: '80ms' }}>
          <p className="text-4xl font-black" style={{ color: C.ink }}>Arrasou.</p>
          <p className="text-lg font-semibold" style={{ color: C.inkSoft }}>
            {getCopy('lessonComplete', { company: state.company, user: state.user })}
          </p>
        </div>

        {/* Reward cards — stagger */}
        <div className="flex gap-3 w-full">
          {rewards.map((r, i) => (
            <div key={i}
              className="flex-1 rounded-2xl border-2 p-3 flex flex-col items-center gap-1 pop-in stagger"
              style={{ '--i': i + 1, borderColor: r.border, background: `${r.border}14` }}>
              {r.icon}
              <p className="font-extrabold text-lg" style={{ color: C.ink }}>{r.label}</p>
              <p className="text-[11px] font-semibold" style={{ color: C.inkSoft }}>{r.sub}</p>
            </div>
          ))}
        </div>

        {/* AI tip */}
        <div className="w-full rounded-2xl border-2 p-4 card-rise stagger"
          style={{ '--i': 3, borderColor: C.primary, background: `${C.primary}08` }}>
          <p className="text-xs font-extrabold uppercase mb-2" style={{ color: C.primary }}>
            💡 Dica do Zappy{state.company ? ` pra ${state.company.name}` : ''}
          </p>
          {tipLoading ? (
            <div className="flex flex-col gap-1.5">
              <div className="h-3 rounded-full w-full animate-pulse" style={{ background: C.border }} />
              <div className="h-3 rounded-full w-4/5 animate-pulse" style={{ background: C.border }} />
            </div>
          ) : (
            <p className="text-sm font-semibold leading-relaxed" style={{ color: C.inkSoft }}>{tip}</p>
          )}
        </div>

        {/* Treasure chest */}
        {!chestCollected && (
          <TreasureChest reward={chestReward} onCollect={handleChestCollect} />
        )}

        {/* Upsell premium */}
        {!state.isPremium && (
          <div className="w-full rounded-2xl border-2 p-4 card-rise stagger" style={{ '--i': 4, borderColor: C.warning, background: `${C.warning}10` }}>
            <p className="font-extrabold text-sm mb-1" style={{ color: C.ink }}>
              ⚡ Quer dobrar XP nas próximas 3 lições?
            </p>
            <p className="text-xs font-semibold mb-3" style={{ color: C.inkSoft }}>
              Zapfy Premium — <strong>21 dias grátis</strong>, sem cartão
            </p>
            <button className="w-full py-2.5 rounded-xl font-extrabold text-sm uppercase tracking-wide"
              style={{ background: C.warning, color: C.ink, boxShadow: '0 3px 0 #D97706' }}>
              Experimentar grátis
            </button>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col gap-3 w-full card-rise stagger" style={{ '--i': 5 }}>
          <Btn onClick={handleContinue} variant="primary" size="lg" full>
            Continuar missões
          </Btn>
          <div className="flex gap-3">
            <Btn onClick={() => onNav('profile')} variant="secondary" full>
              Ver progresso
            </Btn>
            {'share' in navigator && (
              <Btn onClick={handleShare} variant="secondary" full>
                Compartilhar 🔗
              </Btn>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
