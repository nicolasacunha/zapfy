import { C } from '../tokens'

export default function XPBar({ pct }) {
  return (
    <div className="w-full rounded-full overflow-hidden relative" style={{ background: 'rgba(255,255,255,0.08)', height: 10 }}>
      <div
        className="h-full rounded-full relative overflow-hidden"
        style={{
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${C.primary} 0%, #7BA8FF 100%)`,
          transition: 'width 600ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* shimmer sweep */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,.6) 50%, transparent 100%)',
            animation: 'shimmer 2.2s ease-in-out infinite',
          }}
        />
      </div>
    </div>
  )
}
