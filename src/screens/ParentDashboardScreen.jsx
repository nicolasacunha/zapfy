import { useState } from 'react'
import { Flame, Star, Check, Trophy, ArrowLeft } from 'lucide-react'
import { C } from '../tokens'
import { useZapfy } from '../context/ZapfyContext'
import Zappy from '../components/Zappy'
import { MODULES } from '../data/modules'
import { getLast7Days, getWeekTotal } from '../lib/screenTime'
import { exportPilotData, pilotSummary } from '../lib/pilotMetrics'
import { PAYWALL_ENABLED } from '../lib/flags'
import { skillsFromProgress } from '../lib/domain'

export default function ParentDashboardScreen({ onNav }) {
  const { state } = useZapfy()
  const [notif,   setNotif]   = useState(true)
  const [offline, setOffline] = useState(true)

  const last7    = getLast7Days()
  const weekMins = getWeekTotal()
  const DAY_LABELS = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
  const days  = last7.map(d => DAY_LABELS[new Date(d.date + 'T12:00:00').getDay()])
  const usage = last7.map(d => d.minutes)
  const maxU  = Math.max(...usage, 1)

  const totalUnits = MODULES.reduce((acc, m) => acc + m.units.length, 0)
  const doneUnits  = state.completedUnits.length
  const progress   = totalUnits > 0 ? Math.round((doneUnits / totalUnits) * 100) : 0

  const SKILL_COLORS = [C.primary, '#7C3AED', C.accent, C.success]
  const skills = skillsFromProgress(doneUnits).map((s, i) => ({ n: s.name, pct: s.pct, c: SKILL_COLORS[i] }))

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: C.bg, overflow: 'hidden' }}>
      <div className="flex items-center gap-3 px-4 pb-4" style={{ flexShrink: 0, background: C.primary, paddingTop: 'max(16px, env(safe-area-inset-top, 16px))' }}>
        <button onClick={() => onNav('pathway')} className="w-10 h-10 rounded-xl flex items-center justify-center">
          <ArrowLeft size={22} color="white" />
        </button>
        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,.2)' }}>
          <Zappy mood="happy" size={44} />
        </div>
        <div>
          <p className="font-extrabold text-white text-lg">Acompanhamento de {state.user.name}</p>
          <p className="text-white/70 text-sm font-semibold">{state.user.age} anos · Zapfy</p>
        </div>
      </div>

      <div className="px-4 pt-4 pb-6 flex flex-col gap-4"
        style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { l: 'Streak atual',      v: `${state.streak} dias`, icon: <Flame size={20} fill={C.accent} color={C.accent} />,     col: C.accent   },
            { l: 'Tempo esta semana', v: `${weekMins} min`,        icon: <Star  size={20} fill={C.primary} color={C.primary} />,   col: C.primary  },
            { l: 'Lições completas',  v: String(doneUnits),       icon: <Check size={20} color={C.success} strokeWidth={3} />,    col: C.success  },
            { l: 'XP total',          v: state.xp.toLocaleString('pt-BR'), icon: <Trophy size={20} fill={C.warning} color={C.warning} />, col: C.warning },
          ].map((m, i) => (
            <div key={i} className="rounded-2xl border p-3" style={{ background: C.card, borderColor: C.border }}>
              <div className="flex items-center gap-2 mb-2">{m.icon}<span className="text-xs font-bold" style={{ color: C.inkSoft }}>{m.l}</span></div>
              <p className="text-2xl font-black" style={{ color: m.col }}>{m.v}</p>
            </div>
          ))}
        </div>

        {/* Progresso */}
        <div className="rounded-3xl border p-4" style={{ background: C.card, borderColor: C.border }}>
          <p className="font-extrabold mb-3" style={{ color: C.ink }}>Progresso no app</p>
          <div className="flex justify-between mb-1">
            <span className="text-xs font-bold" style={{ color: C.inkSoft }}>Módulo {state.currentModule} de {MODULES.length}</span>
            <span className="text-xs font-extrabold" style={{ color: C.primary }}>{progress}%</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: C.border }}>
            <div className="h-full rounded-full" style={{ width: `${progress}%`, background: C.primary }} />
          </div>
          {state.company && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-lg">{state.company.type === 'loja' ? '🏪' : state.company.type === 'servico' ? '⚡' : '📱'}</span>
              <div>
                <p className="text-sm font-extrabold" style={{ color: C.ink }}>{state.company.name}</p>
                <p className="text-xs font-semibold" style={{ color: C.inkSoft }}>
                  {state.company.isFounder ? '🏆 Founder de Verdade' : 'Empresa criada no Módulo 2'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Uso diário */}
        <div className="rounded-3xl border p-4" style={{ background: C.card, borderColor: C.border }}>
          <p className="font-extrabold mb-4" style={{ color: C.ink }}>Uso diário (minutos)</p>
          <div className="flex items-end justify-between gap-1" style={{ height: 100 }}>
            {days.map((d, i) => (
              <div key={d} className="flex flex-col items-center gap-1 flex-1">
                <span className="text-[10px] font-bold" style={{ color: C.inkSoft }}>{usage[i]}m</span>
                <div className="w-full rounded-t-lg" style={{
                  height: usage[i] === 0 ? 4 : `${(usage[i] / maxU) * 72}px`,
                  background: usage[i] === 0 ? C.border : C.primary,
                  minHeight: 4,
                }} />
                <span className="text-[10px] font-bold" style={{ color: C.inkSoft }}>{d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Primeira tentativa de venda */}
        {state.lessonChoices?.['m5-real'] && (() => {
          const c = state.lessonChoices['m5-real']
          const resultColor = c[1]?.includes('Vendeu') ? C.success : c[1]?.includes('pensar') ? C.warning : C.inkSoft
          return (
            <div className="rounded-3xl border p-4" style={{ background: C.card, borderColor: C.border }}>
              <p className="font-extrabold mb-3" style={{ color: C.ink }}>Primeira tentativa de venda real 🏆</p>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'Para quem tentou vender', value: c[0] },
                  { label: 'Resultado',                value: c[1], color: resultColor },
                  { label: 'Aprendizado',              value: c[2] },
                ].map((row, i) => row.value && (
                  <div key={i} className="flex justify-between items-center p-2.5 rounded-xl" style={{ background: C.bg }}>
                    <span className="text-xs font-semibold" style={{ color: C.inkSoft }}>{row.label}</span>
                    <span className="text-xs font-extrabold" style={{ color: row.color || C.ink }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })()}

        {/* Habilidades */}
        <div className="rounded-3xl border p-4" style={{ background: C.card, borderColor: C.border }}>
          <p className="font-extrabold mb-4" style={{ color: C.ink }}>Habilidades em desenvolvimento</p>
          {skills.map((s, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="text-xs font-bold" style={{ color: C.ink }}>{s.n}</span>
                <span className="text-xs font-extrabold" style={{ color: s.c }}>{s.pct}%</span>
              </div>
              <div className="h-2.5 rounded-full" style={{ background: C.border }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${s.pct}%`, background: s.c }} />
              </div>
            </div>
          ))}
        </div>

        {/* Controles */}
        <div className="rounded-3xl border p-4" style={{ background: C.card, borderColor: C.border }}>
          <p className="font-extrabold mb-3" style={{ color: C.ink }}>Controles</p>
          {[
            { l: 'Limite diário',  d: '30 min configurado',   ctrl: <button className="px-3 py-1.5 rounded-xl text-xs font-extrabold text-white" style={{ background: C.primary }}>Ajustar</button> },
            { l: 'Lembretes',      d: 'Notificações diárias', ctrl: <button onClick={() => setNotif(v => !v)} className="w-12 h-6 rounded-full relative transition-all" style={{ background: notif ? C.success : C.border }}><div className="w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all" style={{ left: notif ? '26px' : '2px' }} /></button> },
            { l: 'Mesada digital', d: 'Conecte a conta bancária', ctrl: <span className="px-2 py-1 rounded-lg text-[10px] font-extrabold uppercase" style={{ background: `${C.warning}28`, color: C.warning }}>Em breve</span> },
            { l: 'Modo offline',   d: 'Para viagens sem internet', ctrl: <button onClick={() => setOffline(v => !v)} className="w-12 h-6 rounded-full relative transition-all" style={{ background: offline ? C.success : C.border }}><div className="w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all" style={{ left: offline ? '26px' : '2px' }} /></button> },
          ].map((row, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-2xl mb-2" style={{ background: C.bg }}>
              <div>
                <p className="font-bold text-sm" style={{ color: C.ink }}>{row.l}</p>
                <p className="text-xs" style={{ color: C.inkSoft }}>{row.d}</p>
              </div>
              {row.ctrl}
            </div>
          ))}
        </div>

        {/* Dados do piloto (Link School) */}
        {(() => {
          const s = pilotSummary()
          return (
            <div className="rounded-3xl border p-4" style={{ background: C.card, borderColor: C.border }}>
              <p className="font-extrabold mb-1" style={{ color: C.ink }}>Dados do piloto</p>
              <p className="text-xs mb-3" style={{ color: C.inkSoft }}>
                Exporte e envie pro time do Zapfy no WhatsApp. Mede se {state.user.name} voltou nos primeiros dias.
              </p>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { l: 'Voltou no D1', v: s.returned_d1 ? 'Sim' : 'Ainda não', c: s.returned_d1 ? C.success : C.inkSoft },
                  { l: 'Voltou no D7', v: s.returned_d7 ? 'Sim' : 'Ainda não', c: s.returned_d7 ? C.success : C.inkSoft },
                  { l: 'Missões c/ prova', v: String(s.missions_with_proof), c: C.primary },
                ].map((m, i) => (
                  <div key={i} className="rounded-xl p-2.5" style={{ background: C.bg }}>
                    <p className="text-[10px] font-bold mb-1" style={{ color: C.inkSoft }}>{m.l}</p>
                    <p className="text-sm font-black" style={{ color: m.c }}>{m.v}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => exportPilotData(state.user.name)}
                className="w-full py-3 rounded-2xl font-extrabold text-white text-sm"
                style={{ background: C.primary }}
              >
                Exportar dados do piloto (JSON)
              </button>
            </div>
          )
        })()}
      </div>

      {PAYWALL_ENABLED && (
        <div className="w-full px-4 pt-3 bg-white border-t" style={{ flexShrink: 0, borderColor: C.border, paddingBottom: 'max(16px, env(safe-area-inset-bottom, 16px))' }}>
          <button className="w-full py-4 rounded-2xl font-extrabold text-white uppercase tracking-wide relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${C.primary}, #7C3AED)`, boxShadow: `0 4px 0 ${C.primaryDk}` }}>
            Zapfy Premium — cosméticos e extras
            <br />
            <span className="text-sm font-semibold opacity-75">R$ 14,90/mês · todo conteúdo educacional é gratuito</span>
          </button>
        </div>
      )}
    </div>
  )
}
