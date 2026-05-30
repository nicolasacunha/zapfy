import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { invite_code } = await req.json()
    if (!invite_code) throw new Error('invite_code obrigatório')

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    // Buscar perfil da criança pelo código
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, name, age, auth_email, invite_code')
      .eq('invite_code', invite_code.toUpperCase())
      .eq('role', 'child')
      .single()

    if (profileError || !profile) {
      throw new Error('Código inválido. Verifique com seu responsável.')
    }

    // Gerar sessão para a criança via signInWithPassword
    const { data: session, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email: profile.auth_email,
      password: `ZAPFY_${profile.invite_code}_CHILD`,
    })

    if (signInError) throw signInError

    return new Response(
      JSON.stringify({
        access_token: session.session!.access_token,
        refresh_token: session.session!.refresh_token,
        child: { id: profile.id, name: profile.name, age: profile.age },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
