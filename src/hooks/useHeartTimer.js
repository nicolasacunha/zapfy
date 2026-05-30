import { useState, useEffect } from 'react'
import { useZapfy } from '../context/ZapfyContext'

const REGEN_MS = 30 * 60 * 1000
const MAX_HEARTS = 5
const LS_KEY = 'zapfy_hearts_timer'

export function useHeartTimer() {
  const { state, dispatch } = useZapfy()
  const [nextRegenIn, setNextRegenIn] = useState(0)

  useEffect(() => {
    if (state.hearts >= MAX_HEARTS) {
      localStorage.removeItem(LS_KEY)
      setNextRegenIn(0)
      return
    }

    if (!localStorage.getItem(LS_KEY)) {
      localStorage.setItem(LS_KEY, String(Date.now()))
    }

    const tick = () => {
      const start = parseInt(localStorage.getItem(LS_KEY) || String(Date.now()), 10)
      const elapsed = Date.now() - start
      const regen = Math.floor(elapsed / REGEN_MS)

      if (regen > 0) {
        const amount = Math.min(regen, MAX_HEARTS - state.hearts)
        dispatch({ type: 'REGEN_HEARTS', amount })
        localStorage.setItem(LS_KEY, String(start + regen * REGEN_MS))
      }

      const updatedStart = parseInt(localStorage.getItem(LS_KEY) || String(Date.now()), 10)
      const msUntilNext = Math.max(0, REGEN_MS - ((Date.now() - updatedStart) % REGEN_MS))
      setNextRegenIn(Math.ceil(msUntilNext / 1000))
    }

    tick()
    const id = setInterval(tick, 60_000)
    return () => clearInterval(id)
  }, [state.hearts, dispatch])

  return { nextRegenIn }
}
