import { Check, Lock, Star } from 'lucide-react'
import { C } from '../tokens'
import { MODULES, isFirstUnitOfModule } from '../data/modules'
import { useZapfy } from '../context/ZapfyContext'
import Header from '../components/Header'
import XPBar from '../components/XPBar'
import ZappyWithSkin from '../components/ZappyWithSkin'
import ZappyCompanion from '../components/ZappyCompanion'
import ZappyWelcomeBack from '../components/ZappyWelcomeBack'
import { useHeartTimer } from '../hooks/useHeartTimer'
import { getCopy } from '../lib/copy'
import { getMissions } from '../lib/missions'
import { levelFromXp, xpPct, titleForLevel } from '../lib/economy'

const MOD_EMOJI = { 1: '💡', 2: '🏢', 3: '👥', 4: '💎', 5: '🚀' }
const ZIGZAG = ['mr-auto ml-8', 'mx-auto', 'ml-auto mr-8', 'mx-auto']

function InfoCard({ icon, title, sub, badge, badgeColor, badgeBg, onClick }) {
  return (
    <button onClick={onClick}
      style={{
        margin: '0 16px 12px',
        width: 'calc(100% - 32px)',
        background: '#131D33',
        borderRadius: 18,
        padding: '11px 14px',
        display: 'flex', alignItems: 'center', gap: 12,
        textAlign: 'left',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.35)',
        border: '1.5px solid rgba(255,255,255,0.08)',
        transition: 'transform .09s var(--ease-expo)',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onMouseDown={e => { if (onClick) e.currentTarget.style.transform = 'scale(0.97)' }}
      onMouseUp={e => { e.currentTarget.style.transform = '' }}
      onMouseLeave={e => { e.currentTarget.style.transform = '' }}
      onTouchStart={e => { if (onClick) e.currentTarget.style.transform = 'scale(0.97)' }}
      onTouchEnd={e => { e.currentTarget.style.transform = '' }}
    >
      <div style={{
        fontSize: 22, lineHeight: 1, flexShrink: 0,
        width: 44, height: 44, borderRadius: 13,
        background: 'rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13.5,
          color: C.ink, margin: 0, lineHeight: 1.2,
        }}>
          {title}
        </p>
        <p style={{ fontSize: 11.5, fontWeight: 600, color: C.inkSoft, margin: '3px 0 0' }}>
          {sub}
        </p>
      </div>
      {badge && (
        <span style={{
          background: badgeBg || C.primaryLt,
          color: badgeColor || C.primary,
          borderRadius: 9, padding: '4px 10px',
          fontSize: 11, fontWeight: 800, flexShrink: 0,
        }}>
          {badge}
        </span>
      )}
    </button>
  )
}

export default function PathwayScreen({ onNav }) {
  const { state, dispatch } = useZapfy()
  const { nextRegenIn } = useHeartTimer()

  const getModuleStatus = (mod) => {
    if (state.completedModules.includes(mod.id)) return 'done'
    return 'active'
  }

  const getUnitStatus = (unit) => {
    if (state.completedUnits.includes(unit.id)) return 'done'
    return 'active'
  }

  const pct        = xpPct(state.xp)
  const level      = levelFromXp(state.xp)
  const title      = titleForLevel(level)
  const missions   = getMissions(state.streak)
  const wager      = state.streakWager
  const doneMissions = missions.filter(m => m.done).length
  const allDone    = doneMissions === missions.length
  const pendingXP  = missions.filter(m => !m.done).reduce((s, m) => s + m.reward.xp, 0)

  return (
    <div style={{
      minHeight: '100vh', paddingBottom: 96,
      backgroundColor: C.bg,
      backgroundImage: `
        radial-gradient(ellipse at 18% 0%, rgba(77,127,255,0.22) 0%, transparent 48%),
        radial-gradient(ellipse at 85% 5%, rgba(165,125,255,0.16) 0%, transparent 42%),
        radial-gradient(circle at 1.5px 1.5px, rgba(255,255,255,0.045) 1.5px, transparent 0)
      `,
      backgroundSize: 'auto, auto, 30px 30px',
      backgroundRepeat: 'no-repeat, no-repeat, repeat',
    }}>
      <Header state={state} nextRegenIn={nextRegenIn} />

      {/* Greeting + XP */}
      <div style={{ padding: '12px 16px 10px' }}>
        <p style={{ fontSize: 12.5, fontWeight: 600, color: C.inkSoft, margin: '0 0 8px' }}>
          {getCopy('pathwayGreeting', { company: state.company })}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: C.inkSoft }}>
            Nível {level} ·{' '}
            <span style={{ color: C.primary, fontFamily: 'var(--font-display)' }}>{title}</span>
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.inkSoft }}>{state.xp} XP</span>
        </div>
        <XPBar pct={pct} />
      </div>

      {/* Abraço de boas-vindas no retorno (1x por sessão) */}
      <ZappyWelcomeBack />

      {/* Companheiro vivo — humor do Zappy + reação ao toque */}
      <ZappyCompanion />

      {/* Quick-access cards */}
      <InfoCard
        icon={allDone ? '✅' : '📋'}
        title="Missões do Dia"
        sub={`${doneMissions}/${missions.length} completas`}
        badge={allDone ? '✓ Feito' : `+${pendingXP} XP`}
        badgeColor={allDone ? C.successDk : '#92510A'}
        badgeBg={allDone ? C.successLt : C.warningLt}
        onClick={() => onNav('missions')}
      />

      {wager && !wager.completed && (
        <InfoCard
          icon="🎰"
          title="Aposta ativa!"
          sub={`${7 - (state.streak - wager.startStreak)} dias restantes · ${wager.betAmount} 🪙 apostados`}
          badge={`+${wager.betAmount * 2} se ganhar`}
          badgeColor={C.purple}
          badgeBg={C.purpleLt}
        />
      )}

      {wager?.won && (
        <div className="pop-in" style={{ margin: '0 16px 12px' }}>
          <InfoCard
            icon="🏆"
            title="Aposta vencida!"
            sub={`Você ganhou +${wager.betAmount * 2} Zapcoins!`}
            badge={
              <button
                onClick={e => { e.stopPropagation(); dispatch({ type: 'COLLECT_WAGER' }) }}
                className="btn-success"
                style={{ padding: '4px 12px', borderRadius: 9, fontSize: 11, fontWeight: 800, color: 'white', border: 'none', cursor: 'pointer' }}>
                Coletar!
              </button>
            }
          />
        </div>
      )}

      {state.company && (
        <InfoCard
          icon={state.company.type === 'loja' ? '🏪' : state.company.type === 'servico' ? '⚡' : '📱'}
          title={state.company.name}
          sub={state.company.isFounder ? '🏆 Founder de Verdade' : 'Empresa ativa'}
          badge="Vendas →"
          badgeColor={C.primary}
          badgeBg={C.primaryLt}
          onClick={() => onNav('companyRevenue')}
        />
      )}

      {/* Module sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '4px 12px 8px' }}>
        {MODULES.map((mod, modIdx) => {
          const status = getModuleStatus(mod)
          const locked = status === 'locked'
          const done   = status === 'done'
          const completedCount = mod.units.filter(u => state.completedUnits.includes(u.id)).length
          const headerBg = locked ? '#94A3B8' : done ? C.success : mod.color

          return (
            <div key={mod.id} className="card-rise stagger"
              style={{ '--i': modIdx }}>

              {/* Module header — full-color band */}
              <div style={{
                background: headerBg,
                margin: '0 16px',
                borderRadius: 16,
                padding: '13px 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 4,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 11, flexShrink: 0,
                    background: 'rgba(255,255,255,0.2)',
                    border: '1.5px solid rgba(255,255,255,0.32)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {done
                      ? <Check size={17} strokeWidth={3} color="white" />
                      : locked
                        ? <Lock size={14} color="white" />
                        : <span style={{ fontSize: 16 }}>{MOD_EMOJI[mod.id]}</span>}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{
                      fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13,
                      color: 'white', margin: 0,
                      textShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {mod.name}
                    </p>
                    <p style={{ fontSize: 10.5, fontWeight: 600, color: 'rgba(255,255,255,0.72)', margin: '2px 0 0' }}>
                      {mod.isCompanyCreation && mod.units.length === 0
                        ? mod.tag
                        : `${completedCount}/${mod.units.length} unidades · ${mod.tag}`}
                    </p>
                  </div>
                </div>

                {!locked && !done && !mod.isCompanyCreation && (
                  <span style={{
                    background: 'rgba(255,255,255,0.22)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: 'white', borderRadius: 8,
                    padding: '3px 9px', fontSize: 10, fontWeight: 800,
                    flexShrink: 0, marginLeft: 8,
                  }}>
                    ATIVO
                  </span>
                )}
                {done && (
                  <span style={{
                    background: 'rgba(255,255,255,0.22)',
                    color: 'white', borderRadius: 8,
                    padding: '3px 9px', fontSize: 10, fontWeight: 800,
                    flexShrink: 0, marginLeft: 8,
                  }}>
                    COMPLETO ✓
                  </span>
                )}
                {locked && (
                  <Lock size={14} color="rgba(255,255,255,0.8)"
                    style={{ flexShrink: 0, marginLeft: 8 }} />
                )}
              </div>

              {/* Company creation CTA */}
              {mod.isCompanyCreation && (
                <div style={{
                  padding: '16px 16px 20px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                }}>
                  {!locked && !state.company ? (
                    <>
                      <p style={{ fontSize: 13, textAlign: 'center', fontWeight: 600, color: C.inkSoft, margin: 0 }}>
                        Hora de criar sua empresa e virar empreendedor de verdade!
                      </p>
                      <button onClick={() => onNav('companyCreation')}
                        className="btn-accent"
                        style={{
                          padding: '0 28px', height: 44, borderRadius: 14,
                          fontFamily: 'var(--font-display)', fontWeight: 800,
                          fontSize: 13, color: 'white', border: 'none', cursor: 'pointer',
                        }}>
                        Criar minha empresa →
                      </button>
                    </>
                  ) : state.company ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Check size={18} color={C.success} strokeWidth={3} />
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.success }}>
                        {state.company.name} — fundada!
                      </span>
                    </div>
                  ) : (
                    <p style={{ fontSize: 13, textAlign: 'center', fontWeight: 600, color: C.inkSoft, margin: 0 }}>
                      Complete o Módulo 1 primeiro 🔒
                    </p>
                  )}
                </div>
              )}

              {/* Unit nodes — zigzag path */}
              {mod.units.length > 0 && (
                <div style={{
                  padding: '16px 0 24px',
                  display: 'flex', flexDirection: 'column', alignItems: 'stretch',
                  opacity: locked ? 0.45 : 1,
                }}>
                  {mod.units.map((unit, idx) => {
                    const uStatus  = locked ? 'locked' : getUnitStatus(unit)
                    const isDone   = uStatus === 'done'
                    const isActive = uStatus === 'active'
                    const isLocked = uStatus === 'locked'
                    const isLast   = idx === mod.units.length - 1
                    const pos      = ZIGZAG[idx % 4]

                    return (
                      <div key={unit.id}
                        className={`flex flex-col items-center ${pos}`}
                        style={{ width: 88 }}>

                        {isActive && (
                          <div className="mb-2 pop-in"
                            style={{
                              padding: '3px 10px', borderRadius: 10,
                              background: C.accent, color: 'white',
                              fontSize: 10, fontWeight: 800, letterSpacing: '0.06em',
                              boxShadow: `0 3px 10px ${C.accent}55`,
                            }}>
                            COMECE! ▼
                          </div>
                        )}

                        <div style={{ position: 'relative' }}>
                          <button
                            onClick={isActive
                              ? () => {
                                  const firstMod = isFirstUnitOfModule(unit.id)
                                  const introSeen = firstMod && state.seenModuleIntros?.includes(firstMod.id)
                                  if (firstMod && !introSeen) {
                                    onNav('moduleVideo', {
                                      moduleId:  firstMod.id,
                                      unitId:    unit.id,
                                      lessonId:  unit.lessonId,
                                    })
                                  } else {
                                    onNav('lesson', { unitId: unit.id, lessonId: unit.lessonId })
                                  }
                                }
                              : undefined}
                            disabled={isLocked}
                            className={isActive ? 'node-active' : ''}
                            style={{
                              width: isActive ? 68 : 56, height: isActive ? 68 : 56, borderRadius: '50%',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              border: `4px solid ${isDone ? C.successDk : isActive ? mod.color : '#2A3A50'}`,
                              background: isDone ? C.success : isActive ? mod.color : '#1E2D45',
                              boxShadow: isActive
                                ? `0 6px 0 ${mod.color}CC, 0 8px 24px ${mod.color}70`
                                : isDone
                                  ? `0 4px 0 ${C.successDk}, 0 6px 16px ${C.success}40`
                                  : '0 3px 0 #1A2535',
                              cursor: isActive ? 'pointer' : 'default',
                              transition: 'transform .09s var(--ease-expo)',
                            }}
                            onMouseDown={e => { if (isActive) e.currentTarget.style.transform = 'translateY(3px) scale(0.96)' }}
                            onMouseUp={e => { e.currentTarget.style.transform = '' }}
                            onMouseLeave={e => { e.currentTarget.style.transform = '' }}
                          >
                            {isDone
                              ? <Check size={22} color="white" strokeWidth={3} />
                              : isActive
                                ? <Star size={18} fill="white" color="white" />
                                : <Lock size={15} color="white" />}
                          </button>

                          {isActive && (
                            <div className="zappy-float pointer-events-none"
                              style={{ position: 'absolute', right: -38, top: -4 }}>
                              <ZappyWithSkin mood="happy" size={38} />
                            </div>
                          )}
                        </div>

                        <p style={{
                          fontSize: 10, fontWeight: 700, textAlign: 'center',
                          lineHeight: 1.3, marginTop: 7,
                          color: isLocked ? C.locked : C.ink,
                          maxWidth: 80,
                        }}>
                          {unit.title}
                        </p>

                        {!isLast && (
                          <div style={{
                            width: 0, height: 26, marginTop: 6,
                            borderLeft: `2.5px ${isDone ? 'solid' : 'dashed'} ${isDone ? mod.color : C.border}`,
                          }} />
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
