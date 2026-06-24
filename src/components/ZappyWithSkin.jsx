import { useZapfy } from '../context/ZapfyContext'
import Zappy from './Zappy'

export default function ZappyWithSkin({ mood, energy, size }) {
  const { state } = useZapfy()
  return <Zappy mood={mood} energy={energy} size={size} skin={state.zapfySkin || 'default'} />
}
