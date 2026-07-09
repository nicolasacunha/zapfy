/**
 * Botão do design system: raio 16px, maiúsculas (permitidas só em CTAs),
 * elevação por sombra sólida deslocada — bloco de 4px da cor "-dark"
 * que cai para 2px quando pressionado. Sem sombra desfocada.
 */
const VARIANTS = {
  primary:
    'bg-primary text-white shadow-key-primary active:shadow-key-primary-pressed',
  accent:
    'bg-accent text-white shadow-key-accent active:shadow-key-accent-pressed',
  white:
    'bg-white text-primary border border-line shadow-key-neutral active:shadow-key-neutral-pressed',
}

const SIZES = {
  md: 'px-5 py-3 text-sm',
  lg: 'px-7 py-4 text-base',
}

export default function Button({
  as: Tag = 'button',
  variant = 'primary',
  size = 'lg',
  full = false,
  className = '',
  children,
  ...props
}) {
  return (
    <Tag
      className={[
        'inline-flex items-center justify-center gap-2 rounded-btn font-body font-extrabold uppercase tracking-wide',
        'transition-[transform,box-shadow] duration-100 active:translate-y-[2px]',
        'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-purple',
        'disabled:pointer-events-none disabled:opacity-60',
        VARIANTS[variant],
        SIZES[size],
        full ? 'w-full' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </Tag>
  )
}
