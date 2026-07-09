/**
 * Moldura de iPhone para os mockups do app (o Zapfy é iOS-only).
 * A tela interna usa o App BG (#F8FAFC) e os tokens reais do sistema.
 */
export default function PhoneMock({ children, className = '' }) {
  return (
    <div
      className={[
        'w-[248px] shrink-0 rounded-[40px] bg-shell p-2.5',
        'ring-1 ring-white/10',
        className,
      ].join(' ')}
    >
      <div className="overflow-hidden rounded-[30px] bg-app-bg">
        {/* notch */}
        <div className="flex justify-center bg-app-bg pt-2">
          <div className="h-1.5 w-16 rounded-full bg-shell/20" />
        </div>
        <div className="px-3 pb-4 pt-3">{children}</div>
      </div>
    </div>
  )
}
