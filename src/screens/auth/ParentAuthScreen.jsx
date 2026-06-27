import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { C } from '../../tokens'
import Zappy from '../../components/Zappy'
import { signUpParent, signInParent } from '../../lib/auth'

const inputStyle = {
  background: 'rgba(255,255,255,0.07)',
  border: '1.5px solid rgba(255,255,255,0.13)',
  color: 'white',
  borderRadius: 14,
  padding: '14px 16px',
  fontSize: 16,
  fontWeight: 600,
  width: '100%',
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle = {
  fontSize: 11,
  fontWeight: 700,
  color: C.inkSoft,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: 6,
  display: 'block',
}

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

  const press3d = e => {
    e.currentTarget.style.transform = 'translateY(3px)'
    e.currentTarget.style.boxShadow = '0 2px 0 #16A34A'
  }
  const release3d = e => {
    e.currentTarget.style.transform = ''
    e.currentTarget.style.boxShadow = loading ? 'none' : '0 5px 0 #16A34A'
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        background: '#0C1222',
        paddingTop: 'max(24px, env(safe-area-inset-top, 24px))',
        paddingBottom: 'max(32px, env(safe-area-inset-bottom, 32px))',
        paddingLeft: 24,
        paddingRight: 24,
        overflowY: 'auto',
        boxSizing: 'border-box',
      }}
    >
      {/* Back button */}
      <button
        onClick={() => onNav('roleSelect')}
        style={{
          padding: '4px 0',
          background: 'none',
          border: 'none',
          color: C.inkSoft,
          fontSize: 13,
          fontWeight: 700,
          cursor: 'pointer',
          alignSelf: 'flex-start',
        }}
      >
        ← Voltar
      </button>

      {/* Mascot + heading */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 28 }}>
        <div className="zappy-float">
          <Zappy mood="happy" size={80} />
        </div>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: 26,
            color: C.ink,
            textAlign: 'center',
            marginTop: 16,
            marginBottom: 0,
          }}
        >
          {isSignup ? 'Criar conta' : 'Entrar como Responsável'}
        </p>
      </div>

      {/* Form fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 24 }}>
        {isSignup && (
          <div>
            <label style={labelStyle}>Seu nome</label>
            <input
              style={inputStyle}
              placeholder="Ex: Ana Maria"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
        )}

        <div>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            style={inputStyle}
            placeholder="seu@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label style={labelStyle}>Senha</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPw ? 'text' : 'password'}
              style={{ ...inputStyle, paddingRight: 48 }}
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
            <button
              onClick={() => setShowPw(v => !v)}
              style={{
                position: 'absolute',
                right: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {showPw
                ? <EyeOff size={18} color={C.inkSoft} />
                : <Eye size={18} color={C.inkSoft} />
              }
            </button>
          </div>
        </div>

        {error && (
          <p style={{ color: '#FF6060', textAlign: 'center', fontSize: 13, fontWeight: 600, marginTop: 8 }}>
            {error}
          </p>
        )}
      </div>

      {/* CTA — pushed to bottom */}
      <div style={{ marginTop: 'auto', paddingTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            background: loading ? 'rgba(46,223,116,0.4)' : '#2EDF74',
            boxShadow: loading ? 'none' : '0 5px 0 #16A34A',
            color: '#052010',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 15,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            borderRadius: 16,
            padding: '17px 0',
            width: '100%',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'box-shadow 80ms, transform 80ms',
          }}
          onMouseDown={e => { if (!loading) press3d(e) }}
          onMouseUp={e => { if (!loading) release3d(e) }}
          onTouchStart={e => { if (!loading) press3d(e) }}
          onTouchEnd={e => { if (!loading) release3d(e) }}
        >
          {loading ? 'Aguarde…' : isSignup ? 'Criar conta' : 'Entrar'}
        </button>

        {/* Mode toggle */}
        <button
          onClick={() => { setMode(isSignup ? 'login' : 'signup'); setError('') }}
          style={{
            background: 'none',
            border: 'none',
            color: C.primary,
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            padding: '6px 0',
            textAlign: 'center',
          }}
        >
          {isSignup ? 'Já tem conta? Entre' : 'Não tem conta? Cadastre-se'}
        </button>
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
