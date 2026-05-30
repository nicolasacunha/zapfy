import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY

export const IS_CONFIGURED = !!(supabaseUrl && supabaseKey)

export const supabase = IS_CONFIGURED
  ? createClient(supabaseUrl, supabaseKey)
  : null
