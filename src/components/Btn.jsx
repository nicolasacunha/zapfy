export default function Btn({ children, onClick, variant = 'primary', size = 'md', disabled, full, cls = '' }) {
  const sz = size === 'lg' ? 'h-14 px-8 text-base' : size === 'sm' ? 'h-9 px-4 text-xs' : 'h-12 px-6 text-sm'
  const col = {
    primary:   'btn-primary text-white',
    accent:    'btn-accent text-white',
    success:   'btn-success text-white',
    secondary: 'btn-secondary text-gray-900',
  }[variant]
  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={`${col} ${sz} ${full ? 'w-full' : ''} rounded-2xl font-extrabold tracking-wide uppercase cursor-pointer select-none ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${cls}`}
    >
      {children}
    </button>
  )
}
