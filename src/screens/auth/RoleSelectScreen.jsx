import { useState } from 'react'
import { C } from '../../tokens'
import Zappy from '../../components/Zappy'

export default function RoleSelectScreen({ onNav }) {
  const [pressed, setPressed] = useState(false)

  return (
    <div
      className="h-screen overflow-hidden flex flex-col"
      style={{
        background: '#0C1222',
        paddingTop: 'max(50px, env(safe-area-inset-top, 50px))',
        paddingBottom: 'max(40px, env(safe-area-inset-bottom, 40px))',
      }}
    >
      {/* Top section */}
      <div className="flex-1 flex flex-col items-center justify-center">
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
                fontSize: 22,
                color: '#E6EDFF',
                textAlign: 'center',
                margin: 0,
              }}
            >
              Bem-vindo ao Zapfy!
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
          <Zappy mood="happy" size={140} />
        </div>
      </div>

      {/* Bottom section */}
      <div style={{ padding: '0 24px' }}>
        {/* Label */}
        <p
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: C.inkSoft,
            textAlign: 'center',
            margin: '0 0 14px',
          }}
        >
          Quem vai acessar?
        </p>

        {/* Primary button — Pai / Responsável */}
        <button
          onClick={() => onNav('parentAuth')}
          onPointerDown={() => setPressed(true)}
          onPointerUp={() => setPressed(false)}
          onPointerLeave={() => setPressed(false)}
          style={{
            width: '100%',
            padding: '17px 0',
            borderRadius: 16,
            background: '#2EDF74',
            boxShadow: pressed ? 'none' : '0 5px 0 #16A34A',
            border: 'none',
            cursor: 'pointer',
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
          👨‍👩‍👧&nbsp;&nbsp;Pai / Responsável
        </button>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: 'rgba(255,255,255,0.08)',
            margin: '18px 0',
            position: 'relative',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: -9,
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#0C1222',
              padding: '0 12px',
              fontSize: 12,
              fontWeight: 700,
              color: '#7C90B5',
            }}
          >
            ou
          </span>
        </div>

        {/* Secondary button — Criança */}
        <button
          onClick={() => onNav('inviteCode')}
          style={{
            width: '100%',
            padding: '17px 0',
            borderRadius: 16,
            background: 'transparent',
            border: '2.5px solid rgba(255,255,255,0.15)',
            cursor: 'pointer',
            color: '#4D7FFF',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 15,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            display: 'block',
          }}
        >
          🧒&nbsp;&nbsp;Sou a Criança
        </button>

        {/* Footer note */}
        <p
          style={{
            marginTop: 16,
            fontSize: 11,
            color: '#7C90B5',
            textAlign: 'center',
          }}
        >
          Já tem conta? Escolha Pai / Responsável e faça login.
        </p>
      </div>
    </div>
  )
}
