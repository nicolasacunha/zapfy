import { Heart } from 'lucide-react'
import { C } from '../tokens'

export default function Hearts({ count, max = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Heart key={i} size={18} fill={i < count ? C.danger : 'none'} color={i < count ? C.danger : C.locked} strokeWidth={2} />
      ))}
    </div>
  )
}
