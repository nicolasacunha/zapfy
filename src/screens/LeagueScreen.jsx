import { useState, useEffect } from 'react'
import { Trophy, TrendingUp, TrendingDown } from 'lucide-react'
import { C } from '../tokens'
import { useZapfy } from '../context/ZapfyContext'
import { supabase, IS_CONFIGURED } from '../lib/supabase'
import Header from '../components/Header'

const AVATARS = ['🦁', '🦊', '🐻', '🦋', '🐼', '🌟', '🦅', '🐯', '🌸', '🐸']

export default function LeagueScreen({ onNav }) {
  const { state } = useZapfy()
  const [others, setOthers] = useState([])

  useEffect(() => {
    if (!IS_CONFIGURED || !state.league || !state.childProfileId) return

    async function fetchLeaderboard() {
      const { data: rows, error } = await supabase
        .from('progress')
        .select('user_id, xp')
        .eq('league', state.league)
        .neq('user_id', state.childProfileId)
        .order('xp', { ascending: false })
        .limit(9)

      if (error || !rows?.length) return

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', rows.map(r => r.user_id))

      const nameMap = Object.fromEntries((profiles || []).map(p => [p.id, p.name]))
      setOthers(rows.map((r, i) => ({
        name: nameMap[r.user_id] || 'Founder',
        xp:   r.xp,
        av:   AVATARS[i % AVATARS.length],
      })))
    }

    fetchLeaderboard()
  }, [state.league, state.childProfileId])

  const lb = [
    ...others,
    { name: state.user.name || 'Você', xp: state.xp, av: '⚡', me: true },
  ].sort((a, b) => b.xp - a.xp).slice(0, 10)

  const top3 = lb.slice(0, 3)
  const rankCol = { 1: C.warning, 2: '#94A3B8', 3: '#CD7F32' }
  const leagues = ['Bronze', 'Prata', 'Ouro', 'Diamante', 'Mestre']
  const lCol    = { Bronze: '#CD7F32', Prata: '#94A3B8', Ouro: C.warning, Diamante: '#60A5FA', Mestre: '#A855F7' }

  const podiumOrder = [top3[1], top3[0], top3[2]]
  const podiumH     = [64, 88, 48]
  const podiumW     = [60, 72, 56]
  const podiumRank  = [2, 1, 3]

  return (
    <div className="min-h-screen pb-24" style={{ background: C.bg }}>
      <Header state={state} />
      <div className="px-4 pb-2">
        <h1 className="text-2xl font-black" style={{ color: C.ink }}>Liga {state.league}</h1>
        <p className="text-sm font-semibold" style={{ color: C.inkSoft }}>Top 5 avançam · Semana termina em 4 dias</p>
      </div>

      {/* League badges */}
      <div className="px-4 mb-4">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {leagues.map((l, i) => (
            <div key={l} className="flex items-center gap-1 flex-shrink-0">
              <div className="px-3 py-1.5 rounded-xl text-xs font-extrabold"
                style={{ background: l === state.league ? lCol[l] : 'transparent', color: l === state.league ? 'white' : lCol[l], border: `2px solid ${lCol[l]}` }}>
                {l}
              </div>
              {i < leagues.length - 1 && <span className="text-xs" style={{ color: C.border }}>›</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Podium */}
      <div className="px-4 mb-5">
        <div className="flex items-end justify-center gap-2">
          {podiumOrder.map((p, i) => p ? (
            <div key={i} className="flex flex-col items-center gap-1.5">
              {podiumRank[i] === 1 && <Trophy size={18} fill={C.warning} color={C.warning} />}
              <div className="flex items-center justify-center rounded-full text-xl"
                style={{ width: 40 + i * 0, height: 40, background: `${rankCol[podiumRank[i]]}20` }}>
                {p.av}
              </div>
              <p className="text-[10px] font-extrabold text-center leading-tight" style={{ color: p.me ? C.primary : C.inkSoft, maxWidth: podiumW[i] }}>
                {p.me ? 'Você' : p.name}
              </p>
              <div className="flex items-center justify-center rounded-t-xl font-extrabold text-white"
                style={{ width: podiumW[i], height: podiumH[i], background: rankCol[podiumRank[i]], fontSize: 20 }}>
                {podiumRank[i]}
              </div>
            </div>
          ) : null)}
        </div>
      </div>

      {/* Full leaderboard */}
      <div className="px-4 flex flex-col gap-2">
        {lb.map((p, i) => {
          const rank  = i + 1
          const arrow = null
          return (
            <div key={i} className="flex items-center gap-3 p-3 rounded-2xl border-2"
              style={{ borderColor: p.me ? C.primary : C.border, background: p.me ? `${C.primary}10` : C.card }}>
              <div className="w-8 flex items-center justify-center">
                {rank <= 3
                  ? <Trophy size={18} fill={rankCol[rank]} color={rankCol[rank]} />
                  : <span className="text-sm font-extrabold" style={{ color: C.inkSoft }}>{rank}</span>}
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                style={{ background: p.me ? `${C.primary}20` : C.bg }}>{p.av}</div>
              <div className="flex-1">
                <p className="font-extrabold text-sm" style={{ color: C.ink }}>
                  {p.name}{p.me ? ' (você)' : ''}
                </p>
                <div className="w-full h-1.5 rounded-full mt-1" style={{ background: C.border }}>
                  <div className="h-full rounded-full" style={{
                    width: `${(p.xp / 1480) * 100}%`,
                    background: p.me ? C.primary : rank <= 3 ? rankCol[rank] : C.inkSoft,
                  }} />
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {!p.me && arrow && (
                  arrow === '↑'
                    ? <TrendingUp  size={12} color={C.success} />
                    : <TrendingDown size={12} color="#EF4444" />
                )}
                <div className="text-right">
                  <p className="font-extrabold text-sm" style={{ color: p.me ? C.primary : C.ink }}>{p.xp}</p>
                  <p className="text-[10px]" style={{ color: C.inkSoft }}>XP</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mx-4 mt-3 p-3 rounded-2xl" style={{ background: `${C.success}14`, border: `2px dashed ${C.success}` }}>
        <p className="text-xs font-extrabold" style={{ color: C.successDk }}>🏆 Zona de promoção (Top 5 → Liga Ouro)</p>
      </div>
    </div>
  )
}
