import { useState } from 'react'
import { X } from 'lucide-react'
import { C } from '../tokens'
import { useZapfy } from '../context/ZapfyContext'
import Zappy from './Zappy'
import { daysBetween } from '../lib/zappyState'

// Abraço de boas-vindas — aparece uma vez por sessão quando a criança
// volta depois de alguns dias sumida. Retenção: voltar tem que ser gostoso.
export default function ZappyWelcomeBack() {
  const { state } = useZapfy()
  const name = state.zappyName || 'Zappy'
  const daysAway = daysBetween(state.zappyLastActive)

  const [show, setShow] = useState(() => {
    try {
      if (daysAway >= 2 && !sessionStorage.getItem('zappy_greeted')) {
        sessionStorage.setItem('zappy_greeted', '1')
        return true
      }
    } catch { /* sessionStorage indisponível */ }
    return false
  })

  if (!show) return null

  return (
    <div style={{
      margin: '0 16px 12px', width: 'calc(100% - 32px)', position: 'relative',
      background: 'linear-gradient(135deg, #131D33, #1A1340)',
      border: `1.5px solid ${C.primary}55`, borderRadius: 18, padding: '12px 14px',
      display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: `0 4px 24px ${C.primary}30`,
    }} className="pop-in">
      <div style={{ flexShrink: 0 }}>
        <Zappy mood="radiante" size={56} float />
      </div>
      <div style={{ flex: 1, minWidth: 0, paddingRight: 18 }}>
        <p style={{ fontSize: 14, fontWeight: 900, color: C.ink, margin: 0 }}>
          O {name} sentiu sua falta! 💚
        </p>
        <p style={{ fontSize: 11.5, fontWeight: 600, color: C.inkSoft, margin: '2px 0 0', lineHeight: 1.35 }}>
          Faz {daysAway} dias. Que bom que você voltou — bora fazer ele brilhar de novo?
        </p>
      </div>
      <button onClick={() => setShow(false)} aria-label="fechar"
        style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
        <X size={16} color={C.inkSoft} />
      </button>
    </div>
  )
}
