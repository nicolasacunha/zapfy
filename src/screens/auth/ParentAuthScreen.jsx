import { useState } from 'react'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { C } from '../../tokens'
import Zappy from '../../components/Zappy'
import { signUpParent, signInParent } from '../../lib/auth'

export default function ParentAuthScreen({ onNav }) {
  const [mode,     setMode]     = useState('login')   // 'login' | 'signup'
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const isSignup = mode === 'signup'

  const handleSubmit = async () => {
    setError('')
    if (!email || !password || (isSignup && !name)) {
      setError('Preencha todos os campos.')
      return
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    setLoading(true)
    try {
      if (isSignup) {
        await signUpParent({ email: email.trim(), password, name: name.trim() })
        // After signup, Supabase sends confirmation email.
        // For dev, email confirm is often disabled — ZapfyContext will pick up the session.
        onNav('childSetup')
      } else {
        await signInParent({ email: email.trim(), password })
        // ZapfyContext onAuthStateChange handles the rest
      }
    } catch (err) {
      setError(friendlyError(err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: C.bg }}>
      <div className="flex items-center gap-3 px-4 pt-5 pb-4" style={{ background: C.primary }}>
        <button onClick={() => onNav('roleSelect')} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,.15)' }}>
          <ArrowLeft size={20} color="white" />
        </button>
        <p className="font-extrabold text-white text-lg">
          {isSignup ? 'Criar conta' : 'Entrar'}
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center px-6 pt-8 gap-5">
        <div className="zappy-float"><Zappy mood="think" size={90} /></div>

        <div className="w-full flex rounded-2xl overflow-hidden border" style={{ borderColor: C.border }}>
          {['login', 'signup'].map(m => (
            <button key={m} onClick={() => { setMode(m); setError('') }}
              className="flex-1 py-3 font-extrabold text-sm transition-all"
              style={{ background: mode === m ? C.primary : C.card, color: mode === m ? 'white' : C.inkSoft }}>
              {m === 'login' ? 'Já tenho conta' : 'Criar conta'}
            </button>
          ))}
        </div>

        <div className="w-full flex flex-col gap-3">
          {isSignup && (
            <div>
              <label className="text-xs font-bold mb-1 block" style={{ color: C.inkSoft }}>Seu nome</label>
              <input
                className="w-full rounded-2xl px-4 py-3.5 font-semibold outline-none border text-base"
                style={{ borderColor: C.border, color: C.ink, background: C.card }}
                placeholder="Ex: Ana Maria"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold mb-1 block" style={{ color: C.inkSoft }}>E-mail</label>
            <input
              type="email"
              className="w-full rounded-2xl px-4 py-3.5 font-semibold outline-none border text-base"
              style={{ borderColor: C.border, color: C.ink, background: C.card }}
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-bold mb-1 block" style={{ color: C.inkSoft }}>Senha</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                className="w-full rounded-2xl px-4 py-3.5 font-semibold outline-none border text-base pr-12"
                style={{ borderColor: C.border, color: C.ink, background: C.card }}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
              <button onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1">
                {showPw ? <EyeOff size={18} color={C.inkSoft} /> : <Eye size={18} color={C.inkSoft} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm font-bold text-center rounded-xl py-2 px-3" style={{ background: `${C.danger}15`, color: C.danger }}>
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 rounded-2xl font-extrabold text-white uppercase tracking-wide mt-2"
            style={{ background: loading ? C.border : C.primary, boxShadow: loading ? 'none' : `0 4px 0 ${C.primaryDk}` }}>
            {loading ? 'Aguarde…' : isSignup ? 'Criar conta' : 'Entrar'}
          </button>
        </div>
      </div>
    </div>
  )
}

function friendlyError(msg) {
  if (msg.includes('Invalid login')) return 'E-mail ou senha incorretos.'
  if (msg.includes('already registered')) return 'Este e-mail já está cadastrado.'
  if (msg.includes('valid email')) return 'Digite um e-mail válido.'
  return msg
}
