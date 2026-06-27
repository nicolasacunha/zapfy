import { useState } from 'react'
import { C } from '../../tokens'
import Zappy from '../../components/Zappy'

export default function InviteSuccessScreen({ onNav, inviteCode, childName }) {
  const [pressed, setPressed] = useState(false)

  return (
    <div
      style={{
        background: C.bg,
        height: '100dvh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 'max(50px, env(safe-area-inset-top, 50px))',
        paddingBottom: 'max(40px, env(safe-area-inset-bottom, 40px))',
        paddingLeft: 24,
        paddingRight: 24,
      }}
    >
      {/* Top section — speech bubble + mascot */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Speech bubble */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <div
            style={{
              background: '#1A2640',
              borderRadius: 20,
              padding: '18px 24px',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: 24,
                color: C.ink,
                textAlign: 'center',
                margin: 0,
                whiteSpace: 'pre-line',
              }}
            >
              {childName ? `Tudo pronto,\n${childName}!` : 'Tudo pronto!'}
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

        {/* Zappy mascot */}
        <div className="zappy-float" style={{ marginTop: 20 }}>
          <Zappy mood="cheer" size={120} />
        </div>

        {/* Invite code card */}
        <div
          style={{
            width: '100%',
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 20,
            padding: '20px 24px',
            textAlign: 'center',
            marginTop: 20,
          }}
        >
          <p
            style={{
              margin: '0 0 8px',
              fontSize: 11,
              fontWeight: 700,
              color: C.inkSoft,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Código para a criança entrar
          </p>
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--font-display)',
              fontSize: 36,
              fontWeight: 900,
              color: C.ink,
              letterSpacing: '0.25em',
            }}
          >
            {inviteCode}
          </p>
          {childName && (
            <p
              style={{
                margin: '6px 0 0',
                fontSize: 12,
                color: C.inkSoft,
              }}
            >
              Compartilhe com {childName}
            </p>
          )}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => onNav('pathway')}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        style={{
          width: '100%',
          padding: '17px 0',
          borderRadius: 16,
          border: 'none',
          cursor: 'pointer',
          background: C.success,
          boxShadow: pressed ? 'none' : `0 5px 0 ${C.successDk}`,
          color: '#052010',
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 15,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          transform: pressed ? 'translateY(3px)' : 'translateY(0)',
          transition: 'transform 0.08s, box-shadow 0.08s',
          display: 'block',
        }}
      >
        Começar a jogar!
      </button>
    </div>
  )
}
