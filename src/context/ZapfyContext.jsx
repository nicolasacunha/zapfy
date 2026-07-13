import { createContext, useContext, useReducer, useEffect, useRef, useCallback } from 'react'
import { supabase, IS_CONFIGURED } from '../lib/supabase'
import { loadUserState, syncProgress, saveCompany, getChildProfiles, saveMissionReport } from '../lib/db'
import { checkNewAchievements, getAchievement } from '../data/achievements'
import { recordXP } from '../lib/xpHistory'
import { logPilotEvent } from '../lib/pilotMetrics'
import { registerActivity, clampEnergy, decayEnergy } from '../lib/zappyState'
import { rewardForLesson, levelFromXp } from '../lib/economy'
import { nextStreak, dayKey } from '../lib/calendar'

// ── Estado inicial ─────────────────────────────────────────────
const INIT = {
  // Auth
  authUser:        null,
  childProfileId:  null,
  parentProfileId: null,
  isLoading:       true,

  // Jogo
  user:             { name: '', age: 0 },
  streak:           0,
  xp:               0,
  hearts:           5,
  zapcoins:         0,
  gems:             0,
  league:           'Bronze',
  leaguePosition:   1,
  isPremium:        false,
  parentPin:        null,
  streakLastDate:   null,
  streakFreezeActive:  false,
  streakFreezeExpiry:  null,
  company:          null,
  currentModule:    1,
  currentUnit:      0,
  completedModules: [],
  completedUnits:   [],
  seenModuleIntros:  [],
  missionReports:    {},

  // Escolhas de exercícios compostos
  lessonChoices: {},

  // Gamificação
  unlockedAchievements:  [],
  pendingToast:          null,
  pendingLevelUp:        null,
  pendingStreakMilestone: null,
  perfectLessons:        0,
  moduleMissionsDone:    0,
  dailyXpGoal:           20,
  streakWager:           null,
  zapfySkin:             'default',
  xp2xActive:            false,
  xp2xExpiry:            null,

  // Relacionamento do Zappy (máquina de estados v2)
  zappyEnergy:           80,
  zappyLastActive:       null,
  zappyName:             'Zappy',
}

// Modo mock: sem Supabase configurado
const MOCK_STATE = {
  ...INIT,
  isLoading:        false,
  authUser:         { id: 'mock' },
  childProfileId:   'mock-child',
  parentProfileId:  'mock-parent',
  user:             { name: 'Theo', age: 11 },
  streak:           7,
  xp:               1250,
  hearts:           5,
  zapcoins:         340,
  gems:             12,
  league:           'Prata',
  leaguePosition:   4,
  parentPin:        null,
  company:          { name: 'TechKids', type: 'digital', product: 'App de jogos educativos', isFounder: false },
  unlockedAchievements: ['primeira_licao', 'streak_7', 'empresa_criada'],
  zappyEnergy:       95,
  zappyLastActive:   null,
  seenModuleIntros:  [1],
  missionReports:    {},
  pendingToast:     null,
  pendingLevelUp:   null,
  perfectLessons:   2,
  moduleMissionsDone: 0,
}

// Ações que precisam ser sincronizadas com o banco
const SYNC_ACTIONS = new Set([
  'COMPLETE_UNIT', 'COMPLETE_MODULE', 'LOSE_HEART', 'RESTORE_HEARTS', 'REGEN_HEARTS',
  'SPEND_ZAPCOIN', 'SPEND_GEM', 'UNLOCK_FOUNDER', 'COMPLETE_MODULE_MISSION', 'GRANT_DAILY_REWARD',
])

// ── Persistência local (offline-first) ─────────────────────────
// Garante que o progresso fique intacto ao fechar/reabrir, mesmo se o sync do
// Supabase falhar. O merge nunca regride: união de listas, máximo de números.
const LS_PROGRESS = 'zapfy_progress'
const PERSIST_FIELDS = ['xp','hearts','zapcoins','gems','streak','streakLastDate','streakFreezeActive','streakFreezeExpiry','league','leaguePosition',
  'completedUnits','completedModules','currentModule','seenModuleIntros','company',
  'missionReports','lessonChoices','user','zappyEnergy','zappyLastActive','zappyName']

function saveLocalProgress(s) {
  if (!s || !s.childProfileId) return
  try {
    const snap = {}
    for (const k of PERSIST_FIELDS) if (s[k] !== undefined) snap[k] = s[k]
    localStorage.setItem(LS_PROGRESS, JSON.stringify(snap))
  } catch { /* quota / indisponível */ }
}
function loadLocalProgress() {
  try { return JSON.parse(localStorage.getItem(LS_PROGRESS) || 'null') } catch { return null }
}
const uniqArr = (a = [], b = []) => Array.from(new Set([...(a || []), ...(b || [])]))
function mergeProgress(base, local) {
  if (!local) return base
  // Para streakLastDate: data mais recente vence (local pode estar mais atualizado)
  const mergedStreakDate = base.streakLastDate && local.streakLastDate
    ? (base.streakLastDate > local.streakLastDate ? base.streakLastDate : local.streakLastDate)
    : (base.streakLastDate || local.streakLastDate || null)
  return {
    ...base,
    xp:               Math.max(base.xp ?? 0, local.xp ?? 0),
    zapcoins:         Math.max(base.zapcoins ?? 0, local.zapcoins ?? 0),
    gems:             Math.max(base.gems ?? 0, local.gems ?? 0),
    streak:           Math.max(base.streak ?? 0, local.streak ?? 0),
    streakLastDate:   mergedStreakDate,
    // freeze é efêmero no Supabase (só local o persiste): local vence
    streakFreezeActive: local.streakFreezeActive ?? base.streakFreezeActive ?? false,
    streakFreezeExpiry: local.streakFreezeExpiry ?? base.streakFreezeExpiry ?? null,
    currentModule:    Math.max(base.currentModule ?? 1, local.currentModule ?? 1),
    hearts:           base.hearts ?? local.hearts,
    completedUnits:   uniqArr(base.completedUnits, local.completedUnits),
    completedModules: uniqArr(base.completedModules, local.completedModules),
    seenModuleIntros: uniqArr(base.seenModuleIntros, local.seenModuleIntros),
    company:          base.company || local.company || null,
    missionReports:   { ...(local.missionReports || {}), ...(base.missionReports || {}) },
    lessonChoices:    { ...(local.lessonChoices || {}), ...(base.lessonChoices || {}) },
    user:             base.user?.name ? base.user : (local.user || base.user),
  }
}

// ── Helper: checa e aplica conquistas novas ────────────────────
function withAchievements(prevUnlocked, next) {
  const newIds = checkNewAchievements(prevUnlocked, next)
  if (!newIds.length) return next
  return {
    ...next,
    unlockedAchievements: [...(next.unlockedAchievements || []), ...newIds],
    pendingToast: next.pendingToast || getAchievement(newIds[0]),
  }
}

// ── Reducer ────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'SET_AUTH':
      return { ...state, ...action.payload, isLoading: false }

    case 'LOAD_STATE':
      return { ...state, ...action.payload, isLoading: false }

    case 'SET_LOADING':
      return { ...state, isLoading: action.value }

    case 'RESET':
      return { ...INIT, isLoading: false }

    case 'LOSE_HEART':
      return { ...state, hearts: Math.max(0, state.hearts - 1) }

    case 'RESTORE_HEARTS':
      if (state.zapcoins < 50) return state
      return { ...state, hearts: 5, zapcoins: state.zapcoins - 50 }

    case 'REGEN_HEARTS':
      return { ...state, hearts: Math.min(5, state.hearts + (action.amount || 1)) }

    case 'COMPLETE_UNIT': {
      const unitId = action.unitId
      if (state.completedUnits.includes(unitId)) return state
      const prevUnlocked = state.unlockedAchievements || []
      const prevLevel    = levelFromXp(state.xp)
      // Recompensa da lição vem da fonte única (respeita xp2x)
      const reward = rewardForLesson({ xp2xActive: state.xp2xActive })
      const newXp  = state.xp + reward.xp
      const newLevel = levelFromXp(newXp)
      // Streak: regra única em lib/calendar (dia local + freeze)
      const newStreak = nextStreak({
        current:      state.streak,
        lastKey:      state.streakLastDate,
        freezeActive: state.streakFreezeActive,
      })
      const MILESTONES = [7, 30, 100, 365]
      const milestone  = MILESTONES.includes(newStreak) ? newStreak : (state.pendingStreakMilestone || null)
      // Verifica wager
      let wager = state.streakWager
      if (wager && !wager.completed) {
        const daysIn = newStreak - wager.startStreak
        if (daysIn >= 7) wager = { ...wager, completed: true, won: true }
      }
      // Zappy ganha energia toda vez que a criança aparece e joga
      const zappyAct = registerActivity(state.zappyEnergy)
      const next = {
        ...state,
        streak:                newStreak,
        streakLastDate:        dayKey(),
        xp:                    newXp,
        zapcoins:              state.zapcoins + reward.zapcoins,
        completedUnits:        [...state.completedUnits, unitId],
        perfectLessons:        action.perfect ? (state.perfectLessons || 0) + 1 : (state.perfectLessons || 0),
        pendingLevelUp:        newLevel > prevLevel ? newLevel : (state.pendingLevelUp || null),
        pendingStreakMilestone: milestone,
        streakWager:           wager,
        zappyEnergy:           zappyAct.energy,
        zappyLastActive:       zappyAct.lastActiveDate,
      }
      return withAchievements(prevUnlocked, next)
    }

    case 'COMPLETE_MODULE': {
      const mod = action.moduleId
      if (state.completedModules.includes(mod)) return state
      return {
        ...state,
        completedModules: [...state.completedModules, mod],
        currentModule:    mod + 1,
      }
    }

    case 'SET_COMPANY_DRAFT': {
      // Nome coletado no onboarding antes do Módulo 2 — pré-preenche a criação formal
      return { ...state, companyDraftName: action.name }
    }

    case 'MARK_MODULE_INTRO_SEEN': {
      const mid = action.moduleId
      if (state.seenModuleIntros.includes(mid)) return state
      return { ...state, seenModuleIntros: [...state.seenModuleIntros, mid] }
    }

    case 'FOUND_COMPANY': {
      const prevUnlocked = state.unlockedAchievements || []
      const next = {
        ...state,
        company: {
          name:      action.name,
          type:      action.companyType,
          product:   action.product,
          isFounder: false,
        },
      }
      return withAchievements(prevUnlocked, next)
    }

    case 'UNLOCK_FOUNDER': {
      const prevUnlocked = state.unlockedAchievements || []
      const next = {
        ...state,
        company: state.company ? { ...state.company, isFounder: true } : state.company,
        xp:      state.xp + 200,
        gems:    state.gems + 5,
      }
      return withAchievements(prevUnlocked, next)
    }

    case 'COMPLETE_MODULE_MISSION': {
      const prevUnlocked = state.unlockedAchievements || []
      const moduleId     = action.moduleId
      // missionReports é o dono das missões de módulo concluídas; alreadyDone deriva dele
      const alreadyDone  = !!(state.missionReports || {})[moduleId]
      const next = {
        ...state,
        xp:                 state.xp + (alreadyDone ? 0 : (action.xp || 0)),
        zapcoins:           state.zapcoins + (alreadyDone ? 0 : (action.zapcoins || 0)),
        moduleMissionsDone: alreadyDone ? state.moduleMissionsDone : (state.moduleMissionsDone || 0) + 1,
        missionReports:     action.report
          ? { ...(state.missionReports || {}), [moduleId]: action.report }
          : (state.missionReports || {}),
      }
      return withAchievements(prevUnlocked, next)
    }

    case 'GRANT_DAILY_REWARD':
      // Crédito puro da carteira. A idempotência ("já resgatou?") vive em lib/missions.js,
      // que só devolve recompensa uma vez — aqui apenas somamos.
      return {
        ...state,
        xp:       state.xp + (action.xp || 0),
        zapcoins: state.zapcoins + (action.zapcoins || 0),
      }

    case 'DISMISS_TOAST':
      return { ...state, pendingToast: null }

    case 'DISMISS_LEVEL_UP':
      return { ...state, pendingLevelUp: null }

    case 'SPEND_ZAPCOIN':
      return { ...state, zapcoins: Math.max(0, state.zapcoins - action.amount) }

    case 'SPEND_GEM':
      return { ...state, gems: Math.max(0, state.gems - action.amount) }

    case 'BUY_STREAK_FREEZE': {
      if (state.gems < 10) return state
      const expiry = Date.now() + 24 * 60 * 60 * 1000
      return { ...state, gems: state.gems - 10, streakFreezeActive: true, streakFreezeExpiry: expiry }
    }

    case 'EXPIRE_STREAK_FREEZE':
      return { ...state, streakFreezeActive: false, streakFreezeExpiry: null }

    case 'BUY_XP2X': {
      if (state.zapcoins < 200) return state
      return {
        ...state,
        zapcoins:   state.zapcoins - 200,
        xp2xActive: true,
        xp2xExpiry: Date.now() + 15 * 60 * 1000,
      }
    }

    case 'EXPIRE_XP2X':
      return { ...state, xp2xActive: false, xp2xExpiry: null }

    case 'DISMISS_STREAK_MILESTONE':
      return { ...state, pendingStreakMilestone: null }

    case 'CHEST_REWARD':
      return {
        ...state,
        zapcoins: state.zapcoins + (action.zapcoins || 0),
        gems:     state.gems     + (action.gems     || 0),
      }

    case 'START_WAGER': {
      if (state.zapcoins < action.amount) return state
      return {
        ...state,
        zapcoins:    state.zapcoins - action.amount,
        streakWager: { startStreak: state.streak, betAmount: action.amount, completed: false, won: false },
      }
    }

    case 'COLLECT_WAGER': {
      if (!state.streakWager?.won) return { ...state, streakWager: null }
      return { ...state, zapcoins: state.zapcoins + state.streakWager.betAmount * 3, streakWager: null }
    }

    case 'SET_DAILY_XP_GOAL':
      return { ...state, dailyXpGoal: action.goal }

    case 'SET_SKIN':
      return { ...state, zapfySkin: action.skin }

    case 'DAILY_BONUS':
      return {
        ...state,
        zapcoins: state.zapcoins + (action.zapcoins || 0),
        gems:     state.gems     + (action.gems     || 0),
      }

    case 'SET_PREMIUM':
      return { ...state, isPremium: action.value }

    case 'SAVE_LESSON_CHOICES':
      return {
        ...state,
        lessonChoices: { ...state.lessonChoices, [action.lessonId]: action.choices },
      }

    // ── Zappy: máquina de estados de relacionamento ──────────────
    case 'ZAPPY_ACTIVITY': {
      const act = registerActivity(state.zappyEnergy)
      return { ...state, zappyEnergy: act.energy, zappyLastActive: act.lastActiveDate }
    }

    case 'ZAPPY_SET_ENERGY': // controle direto (demo / Zappy Lab)
      return { ...state, zappyEnergy: clampEnergy(action.value) }

    case 'ZAPPY_SET_LAST_ACTIVE': // simula data do último acesso (demo)
      return { ...state, zappyLastActive: action.date }

    case 'SET_ZAPPY_NAME': {
      const name = (action.name || '').trim().slice(0, 14)
      return { ...state, zappyName: name || 'Zappy' }
    }

    default:
      return state
  }
}

// ── Context ────────────────────────────────────────────────────
const ZapfyContext = createContext(null)

export function ZapfyProvider({ children }) {
  const [state, rawDispatch] = useReducer(reducer, INIT)
  const stateRef         = useRef(state)
  const syncTimer        = useRef(null)
  const isInitializingRef = useRef(false)
  const zappyDecayedRef  = useRef(false)
  stateRef.current       = state

  // App-open: o Zappy perde energia conforme os dias de sumiço (uma vez por sessão).
  // A recuperação vem ao concluir lição (registerActivity), então voltar é gostoso.
  useEffect(() => {
    if (state.isLoading || zappyDecayedRef.current) return
    zappyDecayedRef.current = true
    const decayed = decayEnergy(state.zappyEnergy, state.zappyLastActive)
    if (decayed !== state.zappyEnergy) {
      rawDispatch({ type: 'ZAPPY_SET_ENERGY', value: decayed })
    }
  }, [state.isLoading])

  const scheduleSync = useCallback((nextState) => {
    if (!IS_CONFIGURED || !nextState.childProfileId || nextState.childProfileId === 'mock-child') return
    clearTimeout(syncTimer.current)
    syncTimer.current = setTimeout(() => {
      syncProgress(nextState.childProfileId, nextState)
    }, 800)
  }, [])

  const dispatch = useCallback((action) => {
    // Computa nextState antes do rawDispatch para que dispatches encadeados no mesmo
    // ciclo usem o estado correto como base (stateRef ainda aponta para o render anterior)
    const nextState = reducer(stateRef.current, action)
    stateRef.current = nextState
    rawDispatch(action)
    saveLocalProgress(nextState) // persiste local a cada mudança (offline-first)

    if (action.type === 'COMPLETE_UNIT') recordXP(rewardForLesson({ xp2xActive: nextState.xp2xActive }).xp)

    // ── Piloto: log de eventos por criança (D1–D7 + engajamento) ──
    const pcid = nextState.childProfileId
    switch (action.type) {
      case 'COMPLETE_UNIT':
        logPilotEvent('lesson_complete', { unit_id: action.unitId }, pcid); break
      case 'COMPLETE_MODULE':
        logPilotEvent('module_complete', { module_id: action.moduleId }, pcid); break
      case 'COMPLETE_MODULE_MISSION':
        logPilotEvent('mission_complete', { module_id: action.moduleId, withProof: !!action.report }, pcid); break
      case 'FOUND_COMPANY':
        logPilotEvent('company_created', { name: nextState.company?.name || null }, pcid); break
      case 'UNLOCK_FOUNDER':
        logPilotEvent('founder_unlocked', {}, pcid); break
      default: break
    }

    if (SYNC_ACTIONS.has(action.type)) {
      scheduleSync(nextState)
    }

    if (action.type === 'FOUND_COMPANY' && nextState.company && nextState.childProfileId &&
        nextState.childProfileId !== 'mock-child') {
      saveCompany(nextState.childProfileId, nextState.company)
    }

    if (action.type === 'UNLOCK_FOUNDER' && nextState.company && nextState.childProfileId &&
        nextState.childProfileId !== 'mock-child') {
      saveCompany(nextState.childProfileId, { ...nextState.company, isFounder: true })
    }

    if (action.type === 'COMPLETE_MODULE_MISSION' && action.moduleId && action.report &&
        nextState.childProfileId && nextState.childProfileId !== 'mock-child') {
      saveMissionReport(nextState.childProfileId, action.moduleId, action.report)
    }
  }, [scheduleSync])

  // ── Inicialização / auth listener ──────────────────────────
  const initUserState = useCallback(async (authUser) => {
    try {
      const isChild = authUser.email?.includes('@zapfy.internal')

      if (isChild) {
        const loaded = await loadUserState(authUser.id)
        const merged = loaded ? mergeProgress(loaded, loadLocalProgress()) : loaded
        rawDispatch({ type: 'LOAD_STATE', payload: { ...merged, authUser, childProfileId: authUser.id } })
      } else {
        const children = await getChildProfiles(authUser.id)
        if (children.length > 0) {
          const child  = children[0]
          const loaded = await loadUserState(child.id)
          const merged = loaded ? mergeProgress(loaded, loadLocalProgress()) : loaded
          rawDispatch({ type: 'LOAD_STATE', payload: {
            ...merged, authUser, childProfileId: child.id, parentProfileId: authUser.id,
          }})
        } else {
          rawDispatch({ type: 'SET_AUTH', payload: { authUser, parentProfileId: authUser.id, childProfileId: null } })
        }
      }
    } catch (err) {
      console.error('[Zapfy] initUserState:', err)
      rawDispatch({ type: 'SET_LOADING', value: false })
    }
  }, [])

  const reloadAfterChildCreation = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) await initUserState(session.user)
  }, [initUserState])

  useEffect(() => {
    if (!IS_CONFIGURED) {
      rawDispatch({ type: 'LOAD_STATE', payload: mergeProgress(MOCK_STATE, loadLocalProgress()) })
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        isInitializingRef.current = true
        initUserState(session.user)
      } else {
        rawDispatch({ type: 'SET_LOADING', value: false })
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // getSession já disparou initUserState — pula a chamada duplicada do SIGNED_IN
        if (isInitializingRef.current) { isInitializingRef.current = false; return }
        initUserState(session.user)
      } else if (event === 'SIGNED_OUT') {
        rawDispatch({ type: 'RESET' })
      }
    })

    return () => subscription.unsubscribe()
  }, [initUserState])

  return (
    <ZapfyContext.Provider value={{ state, dispatch, reloadAfterChildCreation }}>
      {children}
    </ZapfyContext.Provider>
  )
}

export function useZapfy() {
  return useContext(ZapfyContext)
}
