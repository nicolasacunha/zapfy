import { useState, useEffect } from 'react'
import { WifiOff } from 'lucide-react'

export default function OfflineBanner() {
  const [offline, setOffline] = useState(!navigator.onLine)
  const [visible, setVisible] = useState(!navigator.onLine)

  useEffect(() => {
    const handleOnline  = () => { setOffline(false); setTimeout(() => setVisible(false), 2000) }
    const handleOffline = () => { setOffline(true); setVisible(true) }
    window.addEventListener('online',  handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online',  handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-bold transition-all"
      style={{
        background: offline ? '#EF4444' : '#22C55E',
        color:      'white',
        maxWidth:   420,
        margin:     '0 auto',
      }}
    >
      <WifiOff size={14} />
      {offline ? 'Sem conexão — progresso salvo localmente' : 'Conexão restaurada ✓'}
    </div>
  )
}
