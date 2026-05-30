import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify the calling user is a parent (authenticated)
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Não autorizado')

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    // Verify the token and get the parent user
    const { data: { user: parentUser }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    if (authError || !parentUser) throw new Error('Token inválido')

    const { name, age, parent_pin_hash, lgpd_consented } = await req.json()
    if (!name || !age) throw new Error('name e age são obrigatórios')
    // LGPD/COPPA: consent required for under-13 (enforced client-side + validated here)
    if (Number(age) < 13 && !lgpd_consented) throw new Error('Consentimento LGPD obrigatório para menores de 13 anos')

    const inviteCode = generateInviteCode()
    const childEmail = `child_${crypto.randomUUID()}@zapfy.internal`

    // Criar auth user para a criança (email + invite code como senha)
    const { data: authData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: childEmail,
      password: `ZAPFY_${inviteCode}_CHILD`,
      email_confirm: true,
    })
    if (createError) throw createError

    const childId = authData.user.id

    const consentNow = new Date().toISOString()
    // Criar perfil da criança
    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      id:              childId,
      name,
      age:             Number(age),
      role:            'child',
      parent_id:       parentUser.id,
      invite_code:     inviteCode,
      auth_email:      childEmail,
      lgpd_consent_at: lgpd_consented ? consentNow : null,
      coppa_consent_at: (Number(age) < 13 && lgpd_consented) ? consentNow : null,
    })
    if (profileError) throw profileError

    // Criar progresso inicial
    const { error: progressError } = await supabaseAdmin.from('progress').insert({
      user_id: childId,
    })
    if (progressError) throw progressError

    // Atualizar PIN do pai (se fornecido)
    if (parent_pin_hash) {
      await supabaseAdmin.from('profiles')
        .update({ parent_pin_hash })
        .eq('id', parentUser.id)
    }

    return new Response(
      JSON.stringify({ invite_code: inviteCode, child_id: childId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
