import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { ZapfyProvider } from './context/ZapfyContext'
import { useZapfy } from './context/ZapfyContext'
import TabBar from './components/TabBar'
import ErrorBoundary from './components/ErrorBoundary'
import ToastAchievement from './components/ToastAchievement'
import DailyBonusModal from './components/DailyBonusModal'
import OfflineBanner from './components/OfflineBanner'
import { trackMission } from './lib/missions'
import { recordSession } from './lib/screenTime'
import { shouldShowBonus, claimBonus } from './lib/dailyBonus'
import { trackScreen } from './lib/analytics'
import { logSessionOpen } from './lib/pilotMetrics'

// Auth screens
import RoleSelectScreen    from './screens/auth/RoleSelectScreen'
import ParentAuthScreen    from './screens/auth/ParentAuthScreen'
import ChildSetupScreen    from './screens/auth/ChildSetupScreen'
import PinSetupScreen      from './screens/auth/PinSetupScreen'
import InviteCodeScreen    from './screens/auth/InviteCodeScreen'
import InviteSuccessScreen from './screens/auth/InviteSuccessScreen'

// App screens
import OnboardingScreen       from './screens/OnboardingScreen'
import PathwayScreen          from './screens/PathwayScreen'
import LessonScreen           from './screens/LessonScreen'
import LessonResultScreen     from './screens/LessonResultScreen'
import CompanyCreationScreen  from './screens/CompanyCreationScreen'
import CompanyRevenueScreen   from './screens/CompanyRevenueScreen'
import FounderCelebration     from './screens/FounderCelebration'
import LeagueScreen           from './screens/LeagueScreen'
import ShopScreen             from './screens/ShopScreen'
import ProfileScreen          from './screens/ProfileScreen'
import ParentsLockScreen      from './screens/ParentsLockScreen'
import ParentDashboardScreen  from './screens/ParentDashboardScreen'
import LevelUpScreen           from './screens/LevelUpScreen'
import DailyMissionsScreen     from './screens/DailyMissionsScreen'
import AchievementsScreen      from './screens/AchievementsScreen'
import StreakMilestoneScreen   from './screens/StreakMilestoneScreen'
import PaywallScreen           from './screens/PaywallScreen'
import ModuleVideoScreen      from './screens/ModuleVideoScreen'
import RealWorldMissionScreen from './screens/RealWorldMissionScreen'

const NO_TAB = new Set([
  'lesson', 'lessonResult', 'roleSelect', 'parentAuth', 'childSetup',
  'pinSetup', 'inviteCode', 'inviteSuccess',
  'parentsLock', 'parents', 'companyCreation', 'founderCelebration',
  'onboarding', 'levelUp', 'missions', 'achievements', 'companyRevenue',
  'streakMilestone', 'paywall', 'moduleVideo', 'mission',
])

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(160deg, #1D44BF 0%, #1535A0 55%, #0F2680 100%)' }}>
      <div className="flex flex-col items-center gap-5">
        <div className="bounce-in" style={{
          width: 80, height: 80, borderRadius: 24,
          background: 'rgba(255,255,255,0.15)',
          border: '1.5px solid rgba(255,255,255,0.28)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <path d="M10 12H34L16 32H34" stroke="white" strokeWidth="5.5"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p style={{
          fontFamily: 'var(--font-display)', color: 'rgba(255,255,255,0.65)',
          fontWeight: 800, fontSize: 13, letterSpacing: '0.18em',
        }}>ZAPFY</p>
        <div className="spin" style={{
          width: 28, height: 28,
          border: '3px solid rgba(255,255,255,0.18)',
          borderTopColor: 'rgba(255,255,255,0.75)',
          borderRadius: '50%',
          animationDuration: '0.75s',
        }} />
      </div>
    </div>
  )
}

function ZapfyApp() {
  const { state, dispatch } = useZapfy()
  const [screen,       setScreen]       = useState(null)
  const [lessonCtx,    setLessonCtx]    = useState({ unitId: null, lessonId: null, perfect: false })
  const [missionModuleId, setMissionModuleId] = useState(null)
  const [videoCtx, setVideoCtx] = useState({ moduleId: null, unitId: null, lessonId: null })
  const [authCtx,      setAuthCtx]      = useState({})
  const [levelUpValue,    setLevelUpValue]    = useState(null)
  const [streakMilestone, setStreakMilestone] = useState(null)
  const [dailyBonus,      setDailyBonus]      = useState(null)
  const screenWrapperRef = useRef(null)

  // Aplica a animação de entrada via JS após o React comitar o novo elemento de tela.
  // Usar className="screen-enter" diretamente no JSX falha no WKWebView: o WebKit
  // precisa de um ciclo de layout (leitura de offsetWidth) antes de disparar animações
  // CSS em nós DOM recém-inseridos — sem isso o elemento trava em opacity:0.
  // O fill-mode "forwards" garante que, mesmo se a animação não disparar, o elemento
  // fique em opacity:1 (visível) em vez de preto.
  useLayoutEffect(() => {
    const el = screenWrapperRef.current
    if (!el) return
    void el.offsetWidth // força o WebKit a processar o layout → habilita a animação CSS
    el.classList.add('screen-enter')
  }, [screen])

  // Rastreia tempo de tela — conta só o DELTA desde o último flush (não o
  // elapsed total), senão cada troca de aba / remontagem re-soma tudo e infla.
  // Tempo em background (aba oculta) é descartado.
  useEffect(() => {
    let last = Date.now()
    const flush = () => {
      const now = Date.now()
      recordSession(now - last)
      last = now
    }
    const onVis = () => {
      if (document.hidden) flush()   // ao ocultar: contabiliza o tempo ativo
      else last = Date.now()         // ao voltar: descarta o tempo oculto
    }
    window.addEventListener('pagehide', flush)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.removeEventListener('pagehide', flush)
      document.removeEventListener('visibilitychange', onVis)
      flush()
    }
  }, [])

  const onNav = (s, ctx) => {
    if (ctx?.unitId !== undefined || ctx?.lessonId !== undefined || ctx?.perfect !== undefined)
      setLessonCtx(c => ({ ...c, ...ctx }))
    if (ctx?.childName || ctx?.childAge !== undefined || ctx?.inviteCode || ctx?.childConsent !== undefined)
      setAuthCtx(c => ({ ...c, ...ctx }))
    if (ctx?.moduleId !== undefined) {
      setMissionModuleId(ctx.moduleId)
      setVideoCtx(v => ({ ...v, ...ctx }))
    }

    trackScreen(s)

    const el = screenWrapperRef.current
    if (el) {
      el.style.animation = 'screen-exit 160ms ease-in forwards'
      setTimeout(() => {
        el.style.animation = ''
        setScreen(s)
      }, 200)
    } else {
      setScreen(s)
    }
  }

  // Auto-marca missão de streak sempre que streak mudar
  useEffect(() => {
    if (!state.isLoading && state.streak > 0) {
      trackMission('streak', state.streak)
    }
  }, [state.isLoading, state.streak])

  // Detecta level-up e navega para a tela comemorativa
  useEffect(() => {
    if (state.pendingLevelUp) {
      setLevelUpValue(state.pendingLevelUp)
      dispatch({ type: 'DISMISS_LEVEL_UP' })
      setScreen('levelUp')
    }
  }, [state.pendingLevelUp, dispatch])

  // Detecta streak milestone
  useEffect(() => {
    if (state.pendingStreakMilestone) {
      setStreakMilestone(state.pendingStreakMilestone)
      setScreen('streakMilestone')
    }
  }, [state.pendingStreakMilestone])

  // Daily login bonus — só depois do perfil do filho existir E o onboarding ter terminado
  useEffect(() => {
    if (state.isLoading || !state.authUser || !state.childProfileId) return
    let onboarded = false
    try { onboarded = !!localStorage.getItem('zapfy_onboarded') } catch { /* ignore */ }
    if (!onboarded) return
    if (!shouldShowBonus()) return
    const bonus = claimBonus()
    if (!bonus) return
    setDailyBonus(bonus)
    dispatch({ type: 'DAILY_BONUS', zapcoins: bonus.zapcoins || 0, gems: bonus.gems || 0 })
  }, [state.isLoading, state.authUser, state.childProfileId])

  // Expiração do bônus 2× XP
  useEffect(() => {
    if (!state.xp2xActive || !state.xp2xExpiry) return
    const remaining = state.xp2xExpiry - Date.now()
    if (remaining <= 0) { dispatch({ type: 'EXPIRE_XP2X' }); return }
    const t = setTimeout(() => dispatch({ type: 'EXPIRE_XP2X' }), remaining)
    return () => clearTimeout(t)
  }, [state.xp2xActive, state.xp2xExpiry, dispatch])

  // Verifica expiração do streak freeze
  useEffect(() => {
    if (!state.streakFreezeActive || !state.streakFreezeExpiry) return
    const remaining = state.streakFreezeExpiry - Date.now()
    if (remaining <= 0) { dispatch({ type: 'EXPIRE_STREAK_FREEZE' }); return }
    const t = setTimeout(() => dispatch({ type: 'EXPIRE_STREAK_FREEZE' }), remaining)
    return () => clearTimeout(t)
  }, [state.streakFreezeActive, state.streakFreezeExpiry, dispatch])

  // Agenda notificação push às 19h se streak > 0
  useEffect(() => {
    if (state.isLoading || !state.authUser || typeof Notification === 'undefined') return
    if (Notification.permission !== 'granted') return
    const now = new Date()
    const next19 = new Date(now)
    next19.setHours(19, 0, 0, 0)
    if (now >= next19) next19.setDate(next19.getDate() + 1)
    const ms = next19.getTime() - now.getTime()
    const t = setTimeout(() => {
      const companyName = state.company?.name
      const notifTitle = companyName ? companyName : 'Zapfy 🔥'
      const notifBody = companyName
        ? `A ${companyName} vai fechar se você não entrar hoje. ${state.streak} dias em risco.`
        : `Sua sequência de ${state.streak} dias tá em risco! Entre agora pra não perder.`
      new Notification(notifTitle, {
        body: notifBody,
        icon: '/pwa-192x192.png',
      })
    }, ms)
    return () => clearTimeout(t)
  }, [state.isLoading, state.authUser])

  // Alerta de churn: filho inativo por 3 dias recebe notificação personalizada
  useEffect(() => {
    if (state.isLoading || !state.authUser || !state.company) return
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return
    const LAST_SEEN_KEY = `zapfy_last_seen_${state.childProfileId}`
    const lastSeen = parseInt(localStorage.getItem(LAST_SEEN_KEY) || '0', 10)
    const now = Date.now()
    localStorage.setItem(LAST_SEEN_KEY, String(now))
    if (!lastSeen) return
    const daysSince = (now - lastSeen) / 86_400_000
    if (daysSince >= 3) {
      const companyName = state.company.name
      setTimeout(() => {
        new Notification(`A ${companyName} está esperando você`, {
          body: `Zappy tem uma missão nova. Não deixe sua empresa parada!`,
          icon: '/pwa-192x192.png',
        })
      }, 3000)
    }
  }, [state.isLoading, state.authUser, state.company])

  // Piloto: marca sessão diária (base da retenção D1–D7), 1x por dia-calendário
  useEffect(() => {
    if (state.isLoading || !state.childProfileId) return
    logSessionOpen(state.childProfileId)
  }, [state.isLoading, state.childProfileId])

  // Routing baseado no estado de auth
  useEffect(() => {
    if (state.isLoading) return

    if (!state.authUser) {
      setScreen(s => s && NO_TAB.has(s) && s !== 'pathway' ? s : 'roleSelect')
      return
    }

    if (!state.childProfileId) {
      setScreen('childSetup')
      return
    }

    setScreen(s => {
      if (!s || s === 'roleSelect' || s === 'parentAuth' || s === 'inviteCode') {
        return localStorage.getItem('zapfy_onboarded') ? 'pathway' : 'onboarding'
      }
      return s
    })
  }, [state.isLoading, state.authUser, state.childProfileId])

  if (state.isLoading || screen === null) return <LoadingScreen />

  const noTab = NO_TAB.has(screen)

  return (
    <>
      <div key={screen} ref={screenWrapperRef}>
        {screen === 'onboarding'         && <OnboardingScreen       onNav={onNav} userName={state.user?.name} />}
        {screen === 'roleSelect'         && <RoleSelectScreen       onNav={onNav} />}
        {screen === 'parentAuth'         && <ParentAuthScreen       onNav={onNav} />}
        {screen === 'childSetup'         && <ChildSetupScreen       onNav={onNav} />}
        {screen === 'pinSetup'           && <PinSetupScreen         onNav={onNav} childName={authCtx.childName} childAge={authCtx.childAge} childConsent={authCtx.childConsent ?? true} />}
        {screen === 'inviteCode'         && <InviteCodeScreen       onNav={onNav} />}
        {screen === 'inviteSuccess'      && <InviteSuccessScreen    onNav={onNav} inviteCode={authCtx.inviteCode} childName={authCtx.childName} />}

        {screen === 'pathway'            && <PathwayScreen          onNav={onNav} />}
        {screen === 'lesson'             && <LessonScreen           onNav={onNav} lessonId={lessonCtx.lessonId} unitId={lessonCtx.unitId} />}
        {screen === 'lessonResult'       && <LessonResultScreen     onNav={onNav} unitId={lessonCtx.unitId} perfect={lessonCtx.perfect} />}
        {screen === 'companyCreation'    && <CompanyCreationScreen  onNav={onNav} />}
        {screen === 'companyRevenue'     && <CompanyRevenueScreen   onNav={onNav} />}
        {screen === 'founderCelebration' && <FounderCelebration     onNav={onNav} />}
        {screen === 'league'             && <LeagueScreen           onNav={onNav} />}
        {screen === 'shop'               && <ShopScreen />}
        {screen === 'profile'            && <ProfileScreen          onNav={onNav} />}
        {screen === 'parentsLock'        && <ParentsLockScreen      onNav={onNav} />}
        {screen === 'parents'            && <ParentDashboardScreen  onNav={onNav} />}
        {screen === 'levelUp'            && <LevelUpScreen          onNav={onNav} level={levelUpValue || 2} />}
        {screen === 'missions'           && <DailyMissionsScreen    onNav={onNav} />}
        {screen === 'achievements'       && <AchievementsScreen     onNav={onNav} />}
        {screen === 'streakMilestone'    && <StreakMilestoneScreen  onNav={onNav} streak={streakMilestone || 7} />}
        {screen === 'paywall'            && <PaywallScreen          onNav={onNav} />}
        {screen === 'moduleVideo' && (
          <ModuleVideoScreen
            onNav={onNav}
            moduleId={videoCtx.moduleId}
            unitId={videoCtx.unitId}
            lessonId={videoCtx.lessonId}
          />
        )}
        {screen === 'mission' && (
          <RealWorldMissionScreen
            onNav={onNav}
            moduleId={missionModuleId}
          />
        )}
      </div>

      {!noTab && <TabBar screen={screen} onNav={onNav} />}

      {state.pendingToast && (
        <ToastAchievement
          achievement={state.pendingToast}
          onDismiss={() => dispatch({ type: 'DISMISS_TOAST' })}
        />
      )}

      {dailyBonus && (
        <DailyBonusModal
          bonus={dailyBonus}
          onClaim={() => setDailyBonus(null)}
        />
      )}

      <OfflineBanner />
    </>
  )
}

export default function App() {
  return (
    <div
      className="relative w-full min-h-screen overflow-x-hidden overflow-y-auto"
      style={{
        background: '#0C1222',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <ErrorBoundary>
        <ZapfyProvider>
          <ZapfyApp />
        </ZapfyProvider>
      </ErrorBoundary>
    </div>
  )
}
