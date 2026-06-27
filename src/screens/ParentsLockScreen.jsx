import { useState } from 'react'
import { C } from '../tokens'
import { useZapfy } from '../context/ZapfyContext'
import Zappy from '../components/Zappy'
import { verifyPin } from '../lib/auth'

export default function ParentsLockScreen({ onNav }) {
  const { state } = useZapfy()
  const [pin, setPin] = useState('')
  const [err, setErr] = useState(false)

  // PIN configurado: do estado (Supabase) ou do localStorage (fallback confiável).
  const savedPin = (() => { try { return localStorage.getItem('zapfy_parent_pin') } catch { return null } })()
  const configuredPin = state.parentPin || savedPin

  const digit = async (d) => {
    if (pin.length >= 4) return
    const np = pin + d
    setPin(np)
    if (np.length === 4) {
      const isValid = configuredPin
        ? (configuredPin.length > 10 ? await verifyPin(np, configuredPin) : np === configuredPin)
        : np === '1234' // só quando nenhum PIN foi configurado (dev/mock)
      if (isValid) {
        setTimeout(() => onNav('parents'), 80)
      } else {
        setErr(true)
        setTimeout(() => { setPin(''); setErr(false) }, 900)
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 gap-8" style={{ background: C.primary }}>
      <div className="zappy-float"><Zappy mood="think" size={90} /></div>
      <div className="text-center">
        <p className="text-2xl font-black text-white mb-1">Painel dos pais</p>
        <p className="text-white/70 font-semibold">Digite o PIN para entrar</p>
        {!configuredPin && <p className="text-white/40 text-xs mt-1">PIN padrão: 1234</p>}
      </div>
      <div className={`flex gap-4 ${err ? 'shake' : ''}`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-5 h-5 rounded-full border-2 border-white/50 transition-all"
            style={{ background: i < pin.length ? 'white' : 'transparent' }} />
        ))}
      </div>
      {err && <p className="-mt-4 text-red-300 font-bold text-sm">PIN incorreto</p>}
      <div className="grid grid-cols-3 gap-3 w-full max-w-[260px]">
        {[1,2,3,4,5,6,7,8,9,'','0','⌫'].map((d, i) => (
          <button key={i}
            onClick={() => d === '⌫' ? setPin(p => p.slice(0, -1)) : d !== '' ? digit(String(d)) : undefined}
            className="h-16 rounded-2xl font-extrabold text-2xl text-white active:scale-95 transition-all"
            style={{ background: d === '' ? 'transparent' : 'rgba(255,255,255,.15)', cursor: d === '' ? 'default' : 'pointer' }}>
            {d}
          </button>
        ))}
      </div>
      <button onClick={() => onNav('pathway')} className="text-white/60 font-semibold text-sm">Cancelar</button>
    </div>
  )
}
