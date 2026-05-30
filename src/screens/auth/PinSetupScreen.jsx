import { useState } from 'react'
import { C } from '../../tokens'
import Zappy from '../../components/Zappy'
import { hashPin, createChildProfile } from '../../lib/auth'
import { useZapfy } from '../../context/ZapfyContext'

export default function PinSetupScreen({ onNav, childName, childAge, childConsent = true }) {
  const { reloadAfterChildCreation } = useZapfy()
  const [step,    setStep]    = useState(0)   // 0 = definir, 1 = confirmar
  const [pin,     setPin]     = useState('')
  const [first,   setFirst]   = useState('')
  const [err,     setErr]     = useState(false)
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
        setTimeout(() => { setPin(''); setErr(false); setStep(0); setFirst('') }, 900)
        return
      }
      // PINs match — create child profile
      setLoading(true)
      try {
        const pinHash = await hashPin(np)
        const result  = await createChildProfile({ name: childName, age: childAge, parentPinHash: pinHash, lgpdConsented: childConsent })
        await reloadAfterChildCreation()
        onNav('inviteSuccess', { inviteCode: result.invite_code })
      } catch (e) {
        setErr(true)
        setTimeout(() => { setPin(''); setErr(false) }, 1200)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 gap-8"
      style={{ background: C.primary }}>

      <div className="zappy-float"><Zappy mood={err ? 'sad' : 'think'} size={90} /></div>

      <div className="text-center">
        <p className="text-2xl font-black text-white mb-1">
          {step === 0 ? 'Crie seu PIN' : 'Confirme o PIN'}
        </p>
        <p className="text-white/70 font-semibold text-sm">{subtitle}</p>
      </div>

      <div className={`flex gap-4 ${err ? 'shake' : ''}`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-5 h-5 rounded-full border-2 border-white/50 transition-all"
            style={{ background: i < pin.length ? 'white' : 'transparent' }} />
        ))}
      </div>

      {err && <p className="-mt-4 text-red-300 font-bold text-sm">
        {step === 0 ? 'Erro ao criar PIN.' : 'PINs diferentes. Tente novamente.'}
      </p>}

      {loading && <p className="text-white/70 font-bold text-sm">Criando perfil…</p>}

      <div className="grid grid-cols-3 gap-3 w-full max-w-[260px]">
        {[1,2,3,4,5,6,7,8,9,'','0','⌫'].map((d, i) => (
          <button key={i}
            onClick={() => d === '⌫' ? setPin(p => p.slice(0, -1)) : d !== '' ? digit(String(d)) : undefined}
            disabled={loading}
            className="h-16 rounded-2xl font-extrabold text-2xl text-white active:scale-95 transition-all"
            style={{ background: d === '' ? 'transparent' : 'rgba(255,255,255,.15)', cursor: d === '' ? 'default' : 'pointer' }}>
            {d}
          </button>
        ))}
      </div>
    </div>
  )
}
