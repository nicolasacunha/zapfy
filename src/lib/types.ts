// Zapfy — Supabase Database Types
// Gerado manualmente a partir do schema em supabase/migrations/001_schema.sql

export type Role = 'parent' | 'child'
export type CompanyType = 'loja' | 'servico' | 'digital'
export type League = 'Bronze' | 'Prata' | 'Ouro' | 'Diamante' | 'Mestre'

// ── Tabelas ────────────────────────────────────────────────────

export interface Profile {
  id:               string        // uuid — FK auth.users
  name:             string
  age:              number | null
  role:             Role
  parent_id:        string | null // FK profiles.id
  parent_pin_hash:  string | null // SHA-256 hex do PIN
  invite_code:      string | null // 6 chars, apenas children
  auth_email:       string | null // email interno children
  created_at:       string        // ISO 8601
}

export interface Progress {
  id:                string
  user_id:           string        // FK profiles.id
  xp:                number
  streak:            number
  hearts:            number
  zapcoins:          number
  gems:              number
  league:            League
  league_position:   number
  completed_units:   string[]      // e.g. ['m1-u1', 'm1-u2']
  completed_modules: number[]      // e.g. [1, 2]
  current_module:    number
  last_played_at:    string | null // ISO 8601
  updated_at:        string
}

export interface Company {
  id:         string
  user_id:    string  // FK profiles.id
  name:       string
  type:       CompanyType
  product:    string
  is_founder: boolean
  created_at: string
}

// ── Payload das Edge Functions ─────────────────────────────────

export interface CreateChildPayload {
  name:            string
  age:             number
  parent_pin_hash: string
}

export interface CreateChildResult {
  invite_code: string
  child_id:    string
}

export interface ExchangeInvitePayload {
  invite_code: string
}

export interface ExchangeInviteResult {
  access_token:  string
  refresh_token: string
  child: {
    id:   string
    name: string
    age:  number
  }
}

// ── Estado do ZapfyContext (frontend) ─────────────────────────

export interface Company_FE {
  name:      string
  type:      CompanyType
  product:   string
  isFounder: boolean
}

export interface ZapfyState {
  // Auth
  authUser:        { id: string; email?: string } | null
  childProfileId:  string | null
  parentProfileId: string | null
  isLoading:       boolean

  // Usuário
  user:  { name: string; age: number }

  // Gamificação
  streak:           number
  xp:               number
  hearts:           number
  zapcoins:         number
  gems:             number
  league:           League
  leaguePosition:   number
  isPremium:        boolean
  parentPin:        string | null
  streakLastDate:   string | null
  company:          Company_FE | null
  currentModule:    number
  currentUnit:      number
  completedModules: number[]
  completedUnits:   string[]
}

export type ZapfyAction =
  | { type: 'SET_AUTH';     payload: Partial<ZapfyState> }
  | { type: 'LOAD_STATE';   payload: Partial<ZapfyState> }
  | { type: 'SET_LOADING';  value: boolean }
  | { type: 'RESET' }
  | { type: 'LOSE_HEART' }
  | { type: 'RESTORE_HEARTS' }
  | { type: 'COMPLETE_UNIT';   unitId: string }
  | { type: 'COMPLETE_MODULE'; moduleId: number }
  | { type: 'FOUND_COMPANY';   name: string; companyType: CompanyType; product: string }
  | { type: 'UNLOCK_FOUNDER' }
  | { type: 'SPEND_ZAPCOIN';   amount: number }
  | { type: 'SPEND_GEM';       amount: number }
