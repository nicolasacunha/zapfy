import { useZapfy } from '../context/ZapfyContext'
import Zappy from './Zappy'

export default function ZappyWithSkin({ mood, size }) {
  const { state } = useZapfy()
  return <Zappy mood={mood} size={size} skin={state.zapfySkin || 'default'} />
}
