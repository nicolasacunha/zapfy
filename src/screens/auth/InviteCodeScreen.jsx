import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
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

  return (
    <div className="min-h-screen flex flex-col" style={{ background: C.bg }}>
      <div className="flex items-center gap-3 px-4 pt-5 pb-4" style={{ background: C.primary }}>
        <button onClick={() => onNav('roleSelect')} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,.15)' }}>
          <ArrowLeft size={20} color="white" />
        </button>
        <p className="font-extrabold text-white text-lg">Entrar com código</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        <div className="zappy-float"><Zappy mood="happy" size={110} /></div>

        <div className="text-center">
          <h2 className="text-2xl font-black mb-2" style={{ color: C.ink }}>Qual é seu código?</h2>
          <p className="font-semibold" style={{ color: C.inkSoft }}>
            Peça o código de 6 letras/números para o seu responsável.
          </p>
        </div>

        <div className="w-full">
          <input
            className="w-full rounded-2xl px-4 py-4 font-black text-3xl text-center tracking-[.25em] uppercase outline-none border-2 transition-all"
            style={{
              borderColor: formatted.length === 6 ? C.primary : C.border,
              color: C.ink, background: C.card,
              letterSpacing: '0.25em',
            }}
            placeholder="ABC123"
            value={formatted}
            onChange={e => setCode(e.target.value)}
            maxLength={6}
            autoCapitalize="characters"
            onKeyDown={e => e.key === 'Enter' && handleEnter()}
          />
        </div>

        {error && (
          <p className="text-sm font-bold text-center rounded-xl py-2 px-3 w-full" style={{ background: `${C.danger}15`, color: C.danger }}>
            {error}
          </p>
        )}

        <button
          onClick={handleEnter}
          disabled={loading || formatted.length < 6}
          className="w-full py-4 rounded-2xl font-extrabold text-white uppercase tracking-wide"
          style={{
            background: loading || formatted.length < 6 ? C.border : C.primary,
            boxShadow: loading || formatted.length < 6 ? 'none' : `0 4px 0 ${C.primaryDk}`,
          }}>
          {loading ? 'Verificando…' : 'Entrar →'}
        </button>
      </div>
    </div>
  )
}
