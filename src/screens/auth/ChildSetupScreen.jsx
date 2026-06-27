import { useState } from 'react'
import { C } from '../../tokens'
import Zappy from '../../components/Zappy'

export default function ChildSetupScreen({ onNav }) {
  const [name,    setName]    = useState('')
  const [age,     setAge]     = useState('')
  const [consent, setConsent] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [nameFocused, setNameFocused] = useState(false)
  const [ageFocused,  setAgeFocused]  = useState(false)

  const ageNum    = Number(age)
  const needsLGPD = ageNum >= 5 && ageNum < 18 // LGPD Art. 14: menores de 18 anos
  const dataValid = name.trim().length >= 2 && ageNum >= 5 && ageNum <= 18
  const valid     = dataValid && (!needsLGPD || consent)

  const bubbleText = name.trim().length > 0
    ? `Conta criada! Agora vamos configurar ${name.trim()}.`
    : 'Conta criada! Agora vamos configurar seu filho.'

  const inputStyle = (focused) => ({
    width: '100%',
    background: 'rgba(255,255,255,0.07)',
    border: focused ? '1.5px solid #4D7FFF' : '1.5px solid rgba(255,255,255,0.13)',
    borderRadius: 14,
    padding: '14px 16px',
    fontSize: 16,
    fontWeight: 600,
    color: 'white',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  })

  const labelStyle = {
    display: 'block',
    fontSize: 11,
    fontWeight: 700,
    color: C.inkSoft,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 6,
  }

  return (
    <div
      style={{
        background: C.bg,
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 'max(24px, env(safe-area-inset-top, 24px))',
        paddingBottom: 'max(32px, env(safe-area-inset-bottom, 32px))',
        paddingLeft: 20,
        paddingRight: 20,
        overflowY: 'auto',
      }}
    >
      {/* Speech bubble + mascot */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <div
            style={{
              background: '#1A2640',
              borderRadius: 20,
              padding: '18px 24px',
              maxWidth: 280,
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: 18,
                color: C.ink,
                textAlign: 'center',
                margin: 0,
                lineHeight: 1.35,
              }}
            >
              {bubbleText}
            </p>
          </div>
          {/* Triangle tail pointing down */}
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

        <div className="zappy-float" style={{ marginTop: 20 }}>
          <Zappy mood="happy" size={100} />
        </div>
      </div>

      {/* Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={labelStyle}>Nome da criança</label>
          <input
            style={inputStyle(nameFocused)}
            placeholder="Joãozinho"
            value={name}
            onChange={e => setName(e.target.value)}
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
            autoFocus
          />
        </div>

        <div>
          <label style={labelStyle}>Idade</label>
          <input
            type="number"
            min="5"
            max="18"
            style={inputStyle(ageFocused)}
            placeholder="11"
            value={age}
            onChange={e => setAge(e.target.value)}
            onFocus={() => setAgeFocused(true)}
            onBlur={() => setAgeFocused(false)}
          />
        </div>

        {/* Consentimento LGPD/COPPA — aparece para crianças abaixo de 18 anos */}
        {needsLGPD && (
          <div
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 16,
              padding: '16px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 10,
                fontWeight: 700,
                color: C.inkSoft,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Consentimento do Responsável (LGPD)
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.6,
              }}
            >
              Como responsável legal de{' '}
              <strong style={{ color: C.ink }}>{name || 'seu filho'}</strong> ({ageNum} anos), você
              autoriza o Zapfy a coletar e processar os dados necessários para o funcionamento do
              aplicativo: nome, idade e progresso de aprendizagem. Os dados não serão
              compartilhados com terceiros nem usados para publicidade.
            </p>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
              <input
                type="checkbox"
                style={{ marginTop: 2, width: 18, height: 18, flexShrink: 0, accentColor: C.success }}
                checked={consent}
                onChange={e => setConsent(e.target.checked)}
              />
              <span style={{ fontSize: 12, color: C.ink, lineHeight: 1.6 }}>
                Li e concordo com os{' '}
                <span style={{ textDecoration: 'underline', color: C.primary }}>Termos de Uso</span> e{' '}
                <span style={{ textDecoration: 'underline', color: C.primary }}>Política de Privacidade</span>,
                e consinto com o tratamento dos dados do menor conforme a LGPD.
              </span>
            </label>
          </div>
        )}
      </div>

      {/* CTA — pinned to bottom */}
      <div style={{ marginTop: 'auto', paddingTop: 24 }}>
        <button
          onClick={() => valid && onNav('pinSetup', { childName: name.trim(), childAge: ageNum, childConsent: consent || !needsLGPD })}
          disabled={!valid}
          onPointerDown={() => valid && setPressed(true)}
          onPointerUp={() => setPressed(false)}
          onPointerLeave={() => setPressed(false)}
          style={{
            width: '100%',
            padding: '17px 0',
            borderRadius: 16,
            border: 'none',
            cursor: valid ? 'pointer' : 'default',
            background: valid ? C.success : 'rgba(255,255,255,0.08)',
            boxShadow: valid && !pressed ? '0 5px 0 #16A34A' : 'none',
            color: valid ? '#052010' : 'rgba(255,255,255,0.3)',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 15,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            transform: valid && pressed ? 'translateY(3px)' : 'translateY(0)',
            transition: 'transform 0.08s, box-shadow 0.08s',
            display: 'block',
          }}
        >
          Continuar →
        </button>
      </div>
    </div>
  )
}
