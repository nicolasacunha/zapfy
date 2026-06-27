import { useState } from 'react'
import { C } from '../../tokens'
import Zappy from '../../components/Zappy'
import { exchangeInviteCode } from '../../lib/auth'

export default function InviteCodeScreen({ onNav }) {
  const [code,    setCode]    = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const formatted = code.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)

  const handleEnter = async () => {
    if (formatted.length < 6) { setError('Digite os 6 caracteres do código.'); return }
    setError('')
    setLoading(true)
    try {
      await exchangeInviteCode(formatted)
      // ZapfyContext onAuthStateChange picks up the session automatically
    } catch (err) {
      setError(err.message || 'Código inválido. Confirme com seu responsável.')
    } finally {
      setLoading(false)
    }
  }

  const disabled = loading || formatted.length < 4

  return (
    <div
      className="h-screen overflow-hidden flex flex-col"
      style={{
        background: '#0C1222',
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: 'max(32px, env(safe-area-inset-top))',
        paddingBottom: 'max(32px, env(safe-area-inset-bottom))',
      }}
    >
      {/* Mascot + speech bubble */}
      <div className="flex flex-col items-center" style={{ paddingTop: 16 }}>
        {/* Speech bubble */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <div
            style={{
              background: '#1A2640',
              borderRadius: 20,
              padding: '18px 24px',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 20,
              color: '#E6EDFF',
              textAlign: 'center',
              lineHeight: 1.3,
            }}
          >
            Qual é o seu código de convite?
          </div>
          {/* Triangle pointing down */}
          <div
            style={{
              position: 'absolute',
              bottom: -12,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '12px solid transparent',
              borderRight: '12px solid transparent',
              borderTop: '12px solid #1A2640',
            }}
          />
        </div>

        {/* Zappy */}
        <div className="zappy-float" style={{ marginTop: 20 }}>
          <Zappy mood="happy" size={90} />
        </div>
      </div>

      {/* Form */}
      <div style={{ marginTop: 32, width: '100%' }}>
        <label
          style={{
            display: 'block',
            textTransform: 'uppercase',
            fontSize: 11,
            color: '#7C90B5',
            fontWeight: 700,
            letterSpacing: '0.08em',
            marginBottom: 8,
          }}
        >
          Código de acesso
        </label>

        <input
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.07)',
            border: '1.5px solid rgba(255,255,255,0.13)',
            borderRadius: 14,
            padding: 16,
            fontSize: 22,
            fontWeight: 800,
            textAlign: 'center',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'white',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          placeholder="ABC123"
          value={formatted}
          onChange={e => setCode(e.target.value)}
          maxLength={6}
          autoCapitalize="characters"
          onKeyDown={e => e.key === 'Enter' && handleEnter()}
        />

        <div
          style={{
            fontSize: 13,
            color: '#FF6060',
            textAlign: 'center',
            marginTop: 8,
            minHeight: 20,
          }}
        >
          {error}
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ marginTop: 'auto' }}>
        <button
          onClick={handleEnter}
          disabled={disabled}
          style={{
            width: '100%',
            padding: '16px 0',
            borderRadius: 16,
            fontWeight: 800,
            fontSize: 16,
            color: 'white',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            border: 'none',
            cursor: disabled ? 'default' : 'pointer',
            background: disabled ? C.locked : C.success,
            boxShadow: disabled ? 'none' : `0 4px 0 ${C.successDk}`,
            opacity: disabled ? 0.6 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          {loading ? 'Verificando…' : 'Entrar'}
        </button>

        <button
          onClick={() => onNav('roleSelect')}
          style={{
            display: 'block',
            margin: '16px auto 0',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 13,
            color: C.inkSoft,
          }}
        >
          ← Voltar
        </button>
      </div>
    </div>
  )
}
