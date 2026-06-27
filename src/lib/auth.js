import { supabase, IS_CONFIGURED } from './supabase'

function requireSupabase() {
  if (!IS_CONFIGURED || !supabase) throw new Error('Supabase não configurado.')
}

// PIN hashing via Web Crypto API (SHA-256)
export async function hashPin(pin) {
  const enc  = new TextEncoder()
  const data = enc.encode('zapfy::' + pin)
  const buf  = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function verifyPin(pin, storedHash) {
  const h = await hashPin(pin)
  return h === storedHash
}

export async function signUpParent({ email, password, name }) {
  requireSupabase()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  })
  if (error) throw error
  return data
}

export async function signInParent({ email, password }) {
  requireSupabase()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  requireSupabase()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function createChildProfile({ name, age, parentPinHash, lgpdConsented = true }) {
  requireSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Sessão expirada. Faça login novamente.')
  const { data, error } = await supabase.functions.invoke('create-child-profile', {
    body: { name, age, parent_pin_hash: parentPinHash, lgpd_consented: lgpdConsented },
    headers: { Authorization: `Bearer ${session.access_token}` },
  })
  if (error) throw error
  if (data?.error) throw new Error(data.error)
  return data // { invite_code, child_id }
}

export async function exchangeInviteCode(inviteCode) {
  requireSupabase()
  const { data, error } = await supabase.functions.invoke('exchange-invite-code', {
    body: { invite_code: inviteCode },
  })
  if (error) throw error
  if (data?.error) throw new Error(data.error)

  const { error: sessionError } = await supabase.auth.setSession({
    access_token:  data.access_token,
    refresh_token: data.refresh_token,
  })
  if (sessionError) throw sessionError
  return data.child
}
