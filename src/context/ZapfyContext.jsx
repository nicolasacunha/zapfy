import { createContext, useContext, useReducer, useEffect, useRef, useCallback } from 'react'
import { supabase, IS_CONFIGURED } from '../lib/supabase'
import { loadUserState, syncProgress, saveCompany, getChildProfiles, saveMissionReport } from '../lib/db'
import { checkNewAchievements, getAchievement } from '../data/achievements'

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
  completedMissions: [],
  missionReports:    {},

  // Escolhas de exercícios compostos
  lessonChoices: {},

  // Gamificação
  unlockedAchievements:  [],
  pendingToast:          null,
  pendingLevelUp:        null,
  pendingStreakMilestone: null,
  perfectLessons:        0,
  missionsDoneToday:     0,
  dailyXpGoal:           20,
  streakWager:           null,
  zapfySkin:             'default',
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
  seenModuleIntros:  [1],
  completedMissions: [],
  missionReports:    {},
  pendingToast:     null,
  pendingLevelUp:   null,
  perfectLessons:   2,
  missionsDoneToday: 0,
}

// Ações que precisam ser sincronizadas com o banco
const SYNC_ACTIONS = new Set([
  'COMPLETE_UNIT', 'COMPLETE_MODULE', 'LOSE_HEART', 'RESTORE_HEARTS', 'REGEN_HEARTS',
  'SPEND_ZAPCOIN', 'SPEND_GEM', 'UNLOCK_FOUNDER', 'COMPLETE_MISSION',
])

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
      const prevLevel    = Math.floor(state.xp / 500)
      const newXp        = state.xp + 25
      const newLevel     = Math.floor(newXp / 500)
      const newStreak    = state.streak + 1
      const MILESTONES   = [7, 30, 100, 365]
      const milestone    = MILESTONES.includes(newStreak) ? newStreak : (state.pendingStreakMilestone || null)
      // Verifica wager
      let wager = state.streakWager
      if (wager && !wager.completed) {
        const daysIn = newStreak - wager.startStreak
        if (daysIn >= 7) wager = { ...wager, completed: true, won: true }
      }
      const next = {
        ...state,
        streak:               newStreak,
        xp:                   newXp,
        zapcoins:             state.zapcoins + 10,
        hearts:               5,
        completedUnits:       [...state.completedUnits, unitId],
        perfectLessons:       action.perfect ? (state.perfectLessons || 0) + 1 : (state.perfectLessons || 0),
        pendingLevelUp:       newLevel > prevLevel ? newLevel : (state.pendingLevelUp || null),
        pendingStreakMilestone: milestone,
        streakWager:          wager,
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

    case 'COMPLETE_MISSION': {
      const prevUnlocked = state.unlockedAchievements || []
      const moduleId     = action.moduleId
      const alreadyDone  = (state.completedMissions || []).includes(moduleId)
      const next = {
        ...state,
        xp:               state.xp + (alreadyDone ? 0 : (action.xp || 0)),
        zapcoins:         state.zapcoins + (alreadyDone ? 0 : (action.zapcoins || 0)),
        missionsDoneToday: alreadyDone ? state.missionsDoneToday : (state.missionsDoneToday || 0) + 1,
        completedMissions: alreadyDone ? (state.completedMissions || []) : [...(state.completedMissions || []), moduleId],
        missionReports:    action.report
          ? { ...(state.missionReports || {}), [moduleId]: action.report }
          : (state.missionReports || {}),
      }
      return withAchievements(prevUnlocked, next)
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

    default:
      return state
  }
}

// ── Context ────────────────────────────────────────────────────
const ZapfyContext = createContext(null)

export function ZapfyProvider({ children }) {
  const [state, rawDispatch] = useReducer(reducer, INIT)
  const stateRef    = useRef(state)
  const syncTimer   = useRef(null)
  stateRef.current  = state

  const scheduleSync = useCallback((nextState) => {
    if (!IS_CONFIGURED || !nextState.childProfileId || nextState.childProfileId === 'mock-child') return
    clearTimeout(syncTimer.current)
    syncTimer.current = setTimeout(() => {
      syncProgress(nextState.childProfileId, nextState)
    }, 800)
  }, [])

  const dispatch = useCallback((action) => {
    rawDispatch(action)
    const nextState = reducer(stateRef.current, action)

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

    if (action.type === 'COMPLETE_MISSION' && action.moduleId && action.report &&
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
        rawDispatch({ type: 'LOAD_STATE', payload: { ...loaded, authUser, childProfileId: authUser.id } })
      } else {
        const children = await getChildProfiles(authUser.id)
        if (children.length > 0) {
          const child  = children[0]
          const loaded = await loadUserState(child.id)
          rawDispatch({ type: 'LOAD_STATE', payload: {
            ...loaded, authUser, childProfileId: child.id, parentProfileId: authUser.id,
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
      rawDispatch({ type: 'LOAD_STATE', payload: MOCK_STATE })
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) initUserState(session.user)
      else rawDispatch({ type: 'SET_LOADING', value: false })
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) initUserState(session.user)
      else if (event === 'SIGNED_OUT') rawDispatch({ type: 'RESET' })
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
