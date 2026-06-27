import { useRef, useState, useId } from 'react'
import html2canvas from 'html2canvas'
import Zappy from './Zappy'

/* ─── Palettes ────────────────────────────────────────────────────────────── */
const PALETTES = {
  standard: {
    bg:          '#0C1222',
    burst:       '#7C3AED',
    accent:      '#A57DFF',
    nameColor:   '#E6EDFF',
    subColor:    '#A57DFF',
    mutedColor:  '#4B5677',
    divider:     '#7C3AED',
    barBg:       '#7C3AED',
    barText:     'rgba(255,255,255,0.75)',
    seal:        '#7C3AED',
    sealText:    '#A57DFF',
    badgeLabel:  '⚡ FUNDADOR OFICIAL',
    zappySkin:   'astronaut',
  },
  gold: {
    bg:          '#100800',
    burst:       '#D97706',
    accent:      '#FBBF24',
    nameColor:   '#FEF3C7',
    subColor:    '#FCD34D',
    mutedColor:  '#92400E',
    divider:     '#D97706',
    barBg:       '#78350F',
    barText:     'rgba(254,243,199,0.8)',
    seal:        '#D97706',
    sealText:    '#FCD34D',
    badgeLabel:  '★ GOLD FOUNDER',
    zappySkin:   'golden',
  },
}

/* ─── Dynamic font size ───────────────────────────────────────────────────── */
function nameSize(name) {
  const n = name?.length ?? 0
  if (n <= 8)  return 52
  if (n <= 13) return 44
  if (n <= 18) return 36
  if (n <= 24) return 28
  return 22
}

/* ─── Sparkle positions (deterministic) ─────────────────────────────────── */
const STARS = [
  { x: 68,  y: 82,  s: 12, o: 0.55 },
  { x: 462, y: 64,  s: 8,  o: 0.40 },
  { x: 36,  y: 298, s: 10, o: 0.45 },
  { x: 500, y: 336, s: 8,  o: 0.30 },
  { x: 268, y: 30,  s: 14, o: 0.50 },
  { x: 494, y: 188, s: 6,  o: 0.32 },
  { x: 48,  y: 200, s: 6,  o: 0.28 },
]

/* ─── Sub-components ─────────────────────────────────────────────────────── */
function StarSVG({ x, y, s, o, color }) {
  return (
    <svg
      width={s} height={s} viewBox="0 0 24 24"
      style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', pointerEvents: 'none' }}
    >
      <path d="M12 1 L13.8 9.2 L22 10.5 L13.8 12 L12 20.5 L10.2 12 L2 10.5 L10.2 9.2 Z"
        fill={color} opacity={o} />
    </svg>
  )
}

function BurstSVG({ color, uid, size }) {
  const cx = size / 2
  const rays = Array.from({ length: 24 }, (_, i) => {
    const angle = (i * 15 * Math.PI) / 180
    const inner = 18
    const outer = i % 2 === 0 ? 118 : 82
    return {
      x1: cx + Math.cos(angle) * inner,
      y1: cx + Math.sin(angle) * inner,
      x2: cx + Math.cos(angle) * outer,
      y2: cx + Math.sin(angle) * outer,
      thick: i % 2 === 0,
    }
  })

  return (
    <svg
      width={size} height={size}
      style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -60%)',
        pointerEvents: 'none',
      }}
    >
      <defs>
        <radialGradient id={`bg-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={color} stopOpacity="0.30" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cx} r={cx} fill={`url(#bg-${uid})`} />
      {rays.map((r, i) => (
        <line key={i}
          x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
          stroke={color}
          strokeWidth={r.thick ? 2 : 1}
          strokeOpacity={r.thick ? 0.22 : 0.11}
          strokeLinecap="round"
        />
      ))}
    </svg>
  )
}

function SealSVG({ color, textColor, uid, isGold = false }) {
  const r = 26, cx = 36, cy = 36
  const d = `M ${cx},${cy} m -${r},0 a ${r},${r} 0 1,1 ${r * 2},0 a ${r},${r} 0 1,1 -${r * 2},0`
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <defs><path id={`seal-${uid}`} d={d} /></defs>
      <circle cx={cx} cy={cy} r={30} fill="none" stroke={color} strokeWidth="1.5" opacity="0.5" />
      <circle cx={cx} cy={cy} r={22} fill="none" stroke={color} strokeWidth="0.75" opacity="0.25" />
      <text
        fontFamily="Grandstander, cursive"
        fontSize="6"
        fontWeight="800"
        fill={textColor}
        letterSpacing="1.8"
      >
        <textPath href={`#seal-${uid}`} startOffset="8%">
          FUNDADOR OFICIAL · ZAPFY ·
        </textPath>
      </text>
      <text x={cx} y={cy + 6} textAnchor="middle" fontSize="14" fontFamily="Grandstander, cursive">
        {isGold ? '★' : '⚡'}
      </text>
    </svg>
  )
}

/* ─── Card visual (pure display, no interactions) ───────────────────────── */
export function FounderCardVisual({ company, founderName, format = 'square', theme = 'standard', uid }) {
  const P      = PALETTES[theme] ?? PALETTES.standard
  const isS    = format === 'stories'
  const W      = 540
  const H      = isS ? 960 : 540
  const label  = company?.name?.slice(0, 32) || 'Minha Empresa'
  const trunc  = label.length > 30 ? label.slice(0, 29) + '…' : label
  const ns     = nameSize(trunc)
  const rawDate = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  const date    = rawDate.charAt(0).toUpperCase() + rawDate.slice(1)
  const safeId = uid ?? 'card'

  return (
    <div style={{
      width: W, height: H,
      background: P.bg,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Burst glow */}
      <BurstSVG color={P.burst} uid={safeId} size={isS ? 480 : 360} />

      {/* Stars */}
      {STARS.map((s, i) => (
        <StarSVG key={i} {...s} color={P.accent} />
      ))}

      {/* ── TOP BAR ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 24px 0',
        position: 'relative', zIndex: 2,
      }}>
        <span style={{
          fontFamily: 'Grandstander, cursive',
          fontSize: 20, fontWeight: 900,
          color: P.nameColor,
          letterSpacing: '-0.03em',
        }}>
          zapfy
        </span>
        <SealSVG color={P.seal} textColor={P.sealText} uid={safeId} isGold={theme === 'gold'} />
      </div>

      {/* ── ZAPPY ── */}
      <div style={{
        display: 'flex', justifyContent: 'center',
        position: 'relative', zIndex: 2,
        marginTop: isS ? 100 : 16,
        filter: `drop-shadow(0 20px 56px ${P.burst}80)`,
      }}>
        <Zappy mood="cheer" size={isS ? 210 : 152} skin={P.zappySkin} />
      </div>

      {/* ── CONTENT ── */}
      <div style={{
        flex: 1,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'flex-end',
        padding: isS ? '0 40px 24px' : '0 28px 16px',
        position: 'relative', zIndex: 2,
        textAlign: 'center',
        gap: 0,
      }}>
        {/* Company name */}
        <p style={{
          fontFamily: 'Grandstander, cursive',
          fontSize: ns,
          fontWeight: 900,
          color: P.nameColor,
          lineHeight: 1.1,
          letterSpacing: '-0.025em',
          marginBottom: 12,
        }}>
          {trunc}
        </p>

        {/* Divider */}
        <div style={{
          width: 36, height: 2,
          background: P.divider,
          borderRadius: 2,
          marginBottom: 12,
          opacity: 0.8,
        }} />

        {/* Founder */}
        {founderName && (
          <p style={{
            fontFamily: 'Figtree, system-ui, sans-serif',
            fontSize: 13, fontWeight: 700,
            color: P.subColor,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            marginBottom: 5,
          }}>
            Fundado por {founderName}
          </p>
        )}

        {/* Date */}
        <p style={{
          fontFamily: 'Figtree, system-ui, sans-serif',
          fontSize: 11, fontWeight: 500,
          color: P.mutedColor,
        }}>
          {date}
        </p>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div style={{
        background: P.barBg,
        padding: '11px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative', zIndex: 2,
      }}>
        <span style={{
          fontFamily: 'Figtree, system-ui, sans-serif',
          fontSize: 11, fontWeight: 800,
          color: P.barText,
          letterSpacing: '0.09em',
        }}>
          zapfy.app
        </span>
        <span style={{
          fontFamily: 'Figtree, system-ui, sans-serif',
          fontSize: 10, fontWeight: 700,
          color: P.barText,
          opacity: 0.8,
          letterSpacing: '0.06em',
        }}>
          {P.badgeLabel}
        </span>
      </div>
    </div>
  )
}

/* ─── Main export: card + share UI ──────────────────────────────────────── */
export default function FounderCard({ company, founderName, isGold = false }) {
  const uid      = useId().replace(/:/g, '')
  const captureRef = useRef(null)
  const [format, setFormat]   = useState('square')
  const [sharing, setSharing] = useState(false)
  const theme = isGold ? 'gold' : 'standard'
  const P     = PALETTES[theme]

  const isS        = format === 'stories'
  const CARD_W     = 540
  const CARD_H     = isS ? 960 : 540
  const PREVIEW_W  = isS ? 200 : 300
  const PREVIEW_H  = isS ? Math.round(200 * (960 / 540)) : 300
  const scale      = PREVIEW_W / CARD_W

  const handleShare = async () => {
    if (!captureRef.current || sharing) return
    setSharing(true)
    try {
      await document.fonts.ready
      const canvas = await html2canvas(captureRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
        logging: false,
        width: CARD_W,
        height: CARD_H,
      })
      canvas.toBlob(async (blob) => {
        const slug = company?.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'zapfy'
        const file = new File([blob], `fundador-${slug}.png`, { type: 'image/png' })
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: `${company?.name} — Fundador Oficial · Zapfy` })
        } else {
          const url = URL.createObjectURL(blob)
          const a   = document.createElement('a')
          a.href    = url
          a.download = file.name
          a.click()
          URL.revokeObjectURL(url)
        }
        setSharing(false)
      }, 'image/png')
    } catch (err) {
      console.error('[FounderCard] share error:', err)
      setSharing(false)
    }
  }

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>

      {/* Format toggle */}
      <div style={{
        display: 'flex', gap: 6, padding: '4px',
        background: 'rgba(255,255,255,0.06)',
        borderRadius: 12,
      }}>
        {(['square', 'stories']).map(f => (
          <button key={f} onClick={() => setFormat(f)} style={{
            padding: '6px 18px', borderRadius: 9, border: 'none',
            background: format === f ? P.barBg : 'transparent',
            color: format === f ? P.barText : 'rgba(255,255,255,0.35)',
            fontFamily: 'Figtree, system-ui, sans-serif',
            fontSize: 12, fontWeight: 700, letterSpacing: '0.05em',
            cursor: 'pointer', transition: 'background 0.15s, color 0.15s',
          }}>
            {f === 'square' ? 'Quadrado' : 'Stories'}
          </button>
        ))}
      </div>

      {/* ── Preview window (clips the scaled card) ── */}
      <div style={{
        width: PREVIEW_W,
        height: PREVIEW_H,
        overflow: 'hidden',
        borderRadius: 12,
        boxShadow: `0 20px 72px ${P.burst}50`,
        flexShrink: 0,
        transition: 'width 0.25s, height 0.25s',
      }}>
        {/* The ref lives here — transform doesn't affect DOM dimensions,
            so html2canvas reads 540×H and captures at 1080×H@2x */}
        <div
          ref={captureRef}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: CARD_W,
            height: CARD_H,
          }}
        >
          <FounderCardVisual
            company={company}
            founderName={founderName}
            format={format}
            theme={theme}
            uid={uid}
          />
        </div>
      </div>

      {/* Share button */}
      <button
        onClick={handleShare}
        disabled={sharing}
        style={{
          width: '100%',
          padding: '15px 0',
          borderRadius: 14,
          border: 'none',
          background: P.barBg,
          color: 'white',
          fontFamily: 'Grandstander, cursive',
          fontSize: 15, fontWeight: 900,
          letterSpacing: '0.03em',
          cursor: sharing ? 'not-allowed' : 'pointer',
          opacity: sharing ? 0.65 : 1,
          boxShadow: `0 4px 0 ${P.burst}88, 0 8px 32px ${P.burst}38`,
          transition: 'opacity 0.15s',
        }}
      >
        {sharing ? 'Gerando imagem…' : '⚡ Compartilhar card'}
      </button>
    </div>
  )
}
