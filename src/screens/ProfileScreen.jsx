import { Flame } from 'lucide-react'
import { C } from '../tokens'
import { useZapfy } from '../context/ZapfyContext'
import { ACHIEVEMENTS } from '../data/achievements'
import Header from '../components/Header'
import Zappy from '../components/Zappy'
import { getWeekXP } from '../lib/xpHistory'
import { evolutionStage, nextEvolution } from '../lib/zappyState'

const LEVEL_TITLES = ['Curioso', 'Aprendiz', 'Empreendedor', 'Estrategista', 'Visionário', 'Fundador', 'Lenda']

export default function ProfileScreen({ onNav }) {
  const { state } = useZapfy()
  const unlocked = state.unlockedAchievements || []
  const badges   = ACHIEVEMENTS.filter(a => unlocked.includes(a.id))
    .map(a => ({ e: a.emoji, n: a.name, d: a.desc }))
  const days  = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
  const level = Math.floor(state.xp / 500) + 1
  const title = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)]
  const stage = evolutionStage(level)
  const nextEvo = nextEvolution(level)
  const weekXP = getWeekXP()
  const maxXP  = Math.max(...weekXP, 1)


  return (
    <div className="min-h-screen pb-24" style={{ background: C.bg }}>
      <Header state={state} />
      <div className="px-4 flex flex-col gap-4">

        {/* User card */}
        <div className="rounded-3xl border p-4 flex items-center gap-4" style={{ background: C.card, borderColor: C.border }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: `${C.primary}15` }}>
            <Zappy mood={stage.key} size={62} />
          </div>
          <div className="flex-1">
            <p className="text-xl font-black" style={{ color: C.ink }}>{state.user.name}</p>
            <p className="text-sm font-semibold" style={{ color: C.inkSoft }}>
              {state.user.age} anos · Nível {level} · <span style={{ color: C.primary, fontWeight: 800 }}>{title}</span>
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <Flame size={14} fill={C.accent} color={C.accent} />
              <span className="text-sm font-bold" style={{ color: C.accent }}>{state.streak} dias de streak</span>
            </div>
            <p className="text-xs font-bold mt-1" style={{ color: C.primary }}>
              Zappy {stage.label}{nextEvo ? <span style={{ color: C.inkSoft, fontWeight: 600 }}> · evolui no Nível {nextEvo.minLevel}</span> : ' · forma máxima'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black" style={{ color: C.primary }}>{state.xp}</p>
            <p className="text-xs font-bold" style={{ color: C.inkSoft }}>XP total</p>
          </div>
        </div>

        {/* Empresa */}
        {state.company && (
          <div className="rounded-3xl border p-4" style={{ background: C.card, borderColor: C.border }}>
            <p className="font-extrabold mb-3" style={{ color: C.ink }}>Minha empresa</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{state.company.type === 'loja' ? '🏪' : state.company.type === 'servico' ? '⚡' : '📱'}</span>
              <div>
                <p className="font-extrabold" style={{ color: C.ink }}>{state.company.name}</p>
                <p className="text-sm font-semibold" style={{ color: C.inkSoft }}>{state.company.product}</p>
                {state.company.isFounder && (
                  <p className="text-xs font-extrabold mt-1" style={{ color: C.warning }}>🏆 Founder de Verdade</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* XP chart */}
        <div className="rounded-3xl border p-4" style={{ background: C.card, borderColor: C.border }}>
          <p className="font-extrabold mb-4" style={{ color: C.ink }}>XP desta semana</p>
          <div className="flex items-end justify-between gap-1" style={{ height: 96 }}>
            {days.map((d, i) => (
              <div key={d} className="flex flex-col items-center gap-1 flex-1">
                <div className="w-full rounded-t-lg transition-all" style={{
                  height:     weekXP[i] === 0 ? 4 : `${(weekXP[i] / maxXP) * 76}px`,
                  background: i === 4 ? C.accent : weekXP[i] === 0 ? C.border : C.primary,
                  minHeight:  4,
                }} />
                <span className="text-[10px] font-bold" style={{ color: C.inkSoft }}>{d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Conquistas */}
        <div className="rounded-3xl border p-4" style={{ background: C.card, borderColor: C.border }}>
          <div className="flex items-center justify-between mb-3">
            <p className="font-extrabold" style={{ color: C.ink }}>
              Conquistas ({unlocked.length}/{ACHIEVEMENTS.length})
            </p>
            {onNav && (
              <button onClick={() => onNav('achievements')}
                className="text-xs font-extrabold px-2 py-1 rounded-lg"
                style={{ color: C.primary, background: `${C.primary}12` }}>
                Ver todas →
              </button>
            )}
          </div>
          {badges.length === 0 ? (
            <p className="text-sm font-semibold text-center py-3" style={{ color: C.inkSoft }}>
              Complete lições para desbloquear conquistas! 🏆
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {badges.slice(0, 6).map((b, i) => (
                <div key={i} className="rounded-2xl border p-3 flex items-center gap-2" style={{ borderColor: C.border }}>
                  <span className="text-2xl">{b.e}</span>
                  <div>
                    <p className="text-xs font-extrabold" style={{ color: C.ink }}>{b.n}</p>
                    <p className="text-[10px] font-semibold" style={{ color: C.inkSoft }}>{b.d}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Demo interna — Zappy Lab (máquina de estados v2) */}
        {onNav && (
          <button onClick={() => onNav('zappyLab')}
            className="rounded-3xl border p-4 flex items-center gap-3"
            style={{ background: C.card, borderColor: C.primary }}>
            <span className="text-2xl">🧪</span>
            <div style={{ textAlign: 'left' }}>
              <p className="text-sm font-extrabold" style={{ color: C.ink }}>Zappy Lab</p>
              <p className="text-[11px] font-semibold" style={{ color: C.inkSoft }}>
                Demonstração da máquina de estados (v2)
              </p>
            </div>
          </button>
        )}
      </div>
    </div>
  )
}
