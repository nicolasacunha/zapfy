import { useState } from 'react'
import { C } from '../../tokens'
import Zappy from '../../components/Zappy'
import { hashPin, createChildProfile } from '../../lib/auth'
import { useZapfy } from '../../context/ZapfyContext'

const KEYS = [1, 2, 3, 4, 5, 6, 7, 8, 9, '', '0', '⌫']

export default function PinSetupScreen({ onNav, childName, childAge, childConsent = true }) {
  const { reloadAfterChildCreation } = useZapfy()
  const [step,    setStep]    = useState(0)   // 0 = definir, 1 = confirmar
  const [pin,     setPin]     = useState('')
  const [first,   setFirst]   = useState('')
  const [err,     setErr]     = useState(false)
  const [errMsg,  setErrMsg]  = useState('')
  const [loading, setLoading] = useState(false)

  const subtitle = step === 0
    ? 'Crie um PIN de 4 dígitos para acessar o painel dos pais.'
    : 'Digite o PIN novamente para confirmar.'

  const digit = async (d) => {
    if (pin.length >= 4) return
    const np = pin + d
    setPin(np)

    if (np.length < 4) return

    if (step === 0) {
      setFirst(np)
      setTimeout(() => { setPin(''); setStep(1) }, 200)
    } else {
      if (np !== first) {
        setErr(true)
        setErrMsg('PINs diferentes. Tente novamente.')
        setTimeout(() => { setPin(''); setErr(false); setErrMsg(''); setStep(0); setFirst('') }, 900)
        return
      }
      // PINs match — create child profile
      setLoading(true)
      try {
        const pinHash = await hashPin(np)
        // Persiste local: garante que o PIN definido seja o que destrava o painel,
        // mesmo se o round-trip do Supabase não popular state.parentPin.
        try { localStorage.setItem('zapfy_parent_pin', pinHash) } catch { /* ignore */ }
        const result = await createChildProfile({ name: childName, age: childAge, parentPinHash: pinHash, lgpdConsented: childConsent })
        await reloadAfterChildCreation()
        onNav('inviteSuccess', { inviteCode: result.invite_code })
      } catch (e) {
        setErr(true)
        setErrMsg(e?.message || 'Erro ao criar perfil. Tente novamente.')
        setTimeout(() => { setPin(''); setErr(false); setErrMsg('') }, 2000)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <>
      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0) }
          20%      { transform: translateX(-8px) }
          40%      { transform: translateX(8px) }
          60%      { transform: translateX(-5px) }
          80%      { transform: translateX(5px) }
        }
        .pin-shake { animation: shake 0.4s ease; }
      `}</style>

      <div
        style={{
          height: '100dvh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: '#0C1222',
          paddingTop: 'max(32px, env(safe-area-inset-top, 32px))',
          paddingBottom: 'max(24px, env(safe-area-inset-bottom, 24px))',
          paddingLeft: 24,
          paddingRight: 24,
          boxSizing: 'border-box',
        }}
      >
        {/* Top section — mascot + speech bubble */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0 }}>

          {/* Speech bubble */}
          <div
            style={{
              background: '#1A2640',
              borderRadius: 20,
              padding: '18px 24px',
              textAlign: 'center',
              maxWidth: 280,
              position: 'relative',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: 20,
                color: C.ink,
                margin: 0,
                marginBottom: 4,
              }}
            >
              {step === 0 ? 'Crie seu PIN' : 'Confirme o PIN'}
            </p>
            <p style={{ fontSize: 14, fontWeight: 500, color: C.inkSoft, margin: 0 }}>
              {subtitle}
            </p>
            {/* Triangle tail pointing down */}
            <div
              style={{
                position: 'absolute',
                bottom: -12,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent',
                borderTop: '12px solid #1A2640',
              }}
            />
          </div>

          {/* Mascot below bubble */}
          <div className="zappy-float" style={{ marginTop: 16 }}>
            <Zappy mood={err ? 'sad' : 'think'} size={80} />
          </div>

          {/* PIN dots */}
          <div
            className={err ? 'pin-shake' : ''}
            style={{ display: 'flex', gap: 16, marginTop: 28 }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: i < pin.length ? C.primary : 'rgba(255,255,255,0.2)',
                  transition: 'background 120ms',
                }}
              />
            ))}
          </div>

          {/* Error message slot — fixed height to avoid layout shift */}
          <p
            style={{
              height: 20,
              marginTop: 10,
              fontSize: 13,
              fontWeight: 600,
              color: '#FF6060',
              textAlign: 'center',
              opacity: err ? 1 : 0,
              transition: 'opacity 150ms',
            }}
          >
            {errMsg || (err ? 'PINs diferentes. Tente novamente.' : '')}
          </p>

          {loading && (
            <p style={{ fontSize: 13, fontWeight: 600, color: C.inkSoft, marginTop: 4 }}>
              Criando perfil…
            </p>
          )}
        </div>

        {/* Number pad */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 80px)',
            gap: 12,
            justifyContent: 'center',
          }}
        >
          {KEYS.map((d, i) => {
            const isEmpty = d === ''
            const isDelete = d === '⌫'
            return (
              <button
                key={i}
                disabled={loading || isEmpty}
                onClick={() => {
                  if (isEmpty) return
                  if (isDelete) { setPin(p => p.slice(0, -1)); return }
                  digit(String(d))
                }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 20,
                  background: isEmpty ? 'transparent' : 'rgba(255,255,255,0.08)',
                  border: 'none',
                  cursor: isEmpty ? 'default' : 'pointer',
                  fontFamily: 'var(--font-display)',
                  fontSize: 26,
                  fontWeight: 700,
                  color: isDelete ? C.inkSoft : C.ink,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 80ms',
                  WebkitTapHighlightColor: 'transparent',
                }}
                onMouseDown={e => { if (!isEmpty) e.currentTarget.style.background = 'rgba(255,255,255,0.15)' }}
                onMouseUp={e => { if (!isEmpty) e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
                onTouchStart={e => { if (!isEmpty) e.currentTarget.style.background = 'rgba(255,255,255,0.15)' }}
                onTouchEnd={e => { if (!isEmpty) e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
              >
                {d}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
