import { useState } from 'react'
import { ArrowRight, Clock } from 'lucide-react'
import { C } from '../tokens'
import Zappy from '../components/Zappy'
import Btn from '../components/Btn'
import { MODULES } from '../data/modules'
import { useZapfy } from '../context/ZapfyContext'
import { hapticSuccess } from '../lib/haptic'
import { playLevelUp } from '../lib/sound'

export default function RealWorldMissionScreen({ onNav, moduleId }) {
  const { state, dispatch } = useZapfy()
  const mod     = MODULES.find(m => m.id === moduleId)
  const mission = mod?.mission
  const color   = mod?.color || C.primary

  const [phase, setPhase]   = useState('briefing') // briefing | away | reporting | done
  const [report, setReport] = useState({})
  const [errors, setErrors] = useState({})

  if (!mission || mission.type !== 'real-world') {
    onNav('pathway')
    return null
  }

  const updateField = (id, val) => {
    setReport(r => ({ ...r, [id]: val }))
    setErrors(e => ({ ...e, [id]: undefined }))
  }

  const validateAndSubmit = () => {
    const newErrors = {}
    for (const field of mission.fields) {
      if (!report[field.id] || String(report[field.id]).trim() === '') {
        newErrors[field.id] = 'Obrigatório'
      }
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    dispatch({
      type: 'COMPLETE_MODULE_MISSION',
      moduleId,
      xp:     mission.xp,
      report,
    })

    hapticSuccess()
    playLevelUp()
    setPhase('done')
  }

  const handleFinish = () => {
    if (mission.isFounderMission) {
      onNav('founderCelebration')
    } else {
      onNav('pathway')
    }
  }

  // ── BRIEFING ───────────────────────────────────────────────
  if (phase === 'briefing') {
    return (
      <div style={{
        minHeight: '100vh', background: `linear-gradient(160deg, ${color}18 0%, ${C.bg} 100%)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '48px 24px 40px',
      }}>
        <div style={{
          filter: `drop-shadow(0 12px 40px ${color}50)`,
          animation: 'zappy-float 3s ease-in-out infinite',
          marginBottom: 24,
        }}>
          <Zappy mood="cheer" size={152} />
        </div>

        <div style={{
          fontSize: 9, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase',
          color: color, background: `${color}18`, border: `1px solid ${color}40`,
          borderRadius: 100, padding: '4px 14px', marginBottom: 16,
        }}>
          Missão do Módulo {moduleId}
        </div>

        <h1 style={{
          fontSize: 26, fontWeight: 900, color: C.ink,
          textAlign: 'center', lineHeight: 1.2, marginBottom: 8,
        }}>
          {mission.title}
        </h1>

        <p style={{
          fontSize: 12, fontWeight: 700, color: color, textAlign: 'center',
          marginBottom: 24, letterSpacing: '0.05em',
        }}>
          {mission.subtitle}
        </p>

        <div style={{
          background: C.card, borderRadius: 18, padding: '20px 20px',
          border: `1px solid ${color}30`, width: '100%', marginBottom: 24,
        }}>
          <p style={{ fontSize: 14, color: C.ink, lineHeight: 1.75, fontWeight: 500, margin: 0 }}>
            {mission.instruction}
          </p>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 12, color: C.inkSoft, fontWeight: 600, marginBottom: 32,
        }}>
          <Clock size={13} />
          {mission.timeEstimate}
        </div>

        <Btn onClick={() => setPhase('away')} variant="primary" size="lg" full
          style={{ background: color, boxShadow: `0 4px 0 ${color}88` }}>
          Aceitar missão <ArrowRight size={16} />
        </Btn>

        <style>{`
          @keyframes zappy-float {
            0%, 100% { transform: translateY(0); }
            50%       { transform: translateY(-8px); }
          }
        `}</style>
      </div>
    )
  }

  // ── AWAY ───────────────────────────────────────────────────
  if (phase === 'away') {
    return (
      <div style={{
        minHeight: '100vh', background: C.bg,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '48px 24px 40px',
      }}>
        <div style={{
          filter: `drop-shadow(0 8px 24px ${color}40)`,
          animation: 'zappy-float 3s ease-in-out infinite',
          marginBottom: 28,
        }}>
          <Zappy mood="think" size={130} />
        </div>

        <p style={{ fontSize: 20, fontWeight: 900, color: C.ink, textAlign: 'center', marginBottom: 10 }}>
          Zappy está esperando você...
        </p>

        <p style={{ fontSize: 13, color: C.inkSoft, textAlign: 'center', lineHeight: 1.6, marginBottom: 40 }}>
          {mission.zappyMessage}
        </p>

        <Btn onClick={() => setPhase('reporting')} variant="primary" size="lg" full
          style={{ background: color, boxShadow: `0 4px 0 ${color}88`, marginBottom: 12 }}>
          Já fiz! Contar o que aconteceu
        </Btn>

        <Btn onClick={() => onNav('pathway')} variant="secondary" size="md" full>
          Fazer depois
        </Btn>

        <style>{`
          @keyframes zappy-float {
            0%, 100% { transform: translateY(0); }
            50%       { transform: translateY(-8px); }
          }
        `}</style>
      </div>
    )
  }

  // ── REPORTING ──────────────────────────────────────────────
  if (phase === 'reporting') {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, padding: '24px 24px 48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <Zappy mood="happy" size={52} />
          <div>
            <p style={{ fontSize: 16, fontWeight: 900, color: C.ink, margin: 0 }}>
              Conta o que aconteceu!
            </p>
            <p style={{ fontSize: 12, color: C.inkSoft, margin: '3px 0 0' }}>
              {mission.title}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {mission.fields.map(field => (
            <FieldRenderer
              key={field.id}
              field={field}
              value={report[field.id]}
              error={errors[field.id]}
              color={color}
              onChange={val => updateField(field.id, val)}
            />
          ))}
        </div>

        <div style={{ marginTop: 32 }}>
          <Btn onClick={validateAndSubmit} variant="primary" size="lg" full
            style={{ background: color, boxShadow: `0 4px 0 ${color}88` }}>
            Enviar missão — +{mission.xp} XP
          </Btn>
        </div>
      </div>
    )
  }

  // ── DONE ───────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: '100vh', background: `linear-gradient(160deg, ${color}18 0%, ${C.bg} 100%)`,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '64px 24px 40px',
    }}>
      <div style={{
        filter: `drop-shadow(0 12px 40px ${color}60)`,
        animation: 'zappy-pulse 0.6s ease-out',
        marginBottom: 24,
      }}>
        <Zappy mood="comemoracao" size={185} />
      </div>

      <div style={{
        background: `${color}18`, border: `1px solid ${color}40`,
        borderRadius: 14, padding: '12px 20px', marginBottom: 16,
      }}>
        <p style={{ fontSize: 18, fontWeight: 900, color: color, textAlign: 'center', margin: 0 }}>
          +{mission.xp} XP
        </p>
      </div>

      <p style={{ fontSize: 28, fontWeight: 900, color: C.ink, textAlign: 'center', marginBottom: 24 }}>
        Missão cumprida!
      </p>

      <p style={{ fontSize: 14, color: C.inkSoft, textAlign: 'center', lineHeight: 1.7, marginBottom: 40 }}>
        Você fez o que a maioria nunca faz. Isso é empreendedorismo.
      </p>

      <Btn onClick={handleFinish} variant="primary" size="lg" full
        style={{ background: color, boxShadow: `0 4px 0 ${color}88` }}>
        {mission.isFounderMission ? 'Ver sua conquista!' : 'Próximo módulo'} <ArrowRight size={16} />
      </Btn>

      <style>{`
        @keyframes zappy-float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes zappy-pulse {
          0%   { transform: scale(0.8); opacity: 0; }
          60%  { transform: scale(1.1); }
          100% { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </div>
  )
}

// ── Renderizador de campos do formulário ───────────────────
function FieldRenderer({ field, value, error, color, onChange }) {
  const labelStyle = {
    fontSize: 12, fontWeight: 700, color: C.inkSoft,
    textTransform: 'uppercase', letterSpacing: '0.08em',
    marginBottom: 8, display: 'block',
  }
  const errorStyle = { fontSize: 11, color: C.danger, marginTop: 4 }

  if (field.type === 'textarea') {
    return (
      <div>
        <span style={labelStyle}>{field.label}</span>
        <textarea
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder={field.placeholder}
          maxLength={field.maxLength}
          rows={3}
          style={{
            width: '100%', background: C.card, border: `1.5px solid ${error ? C.danger : C.border}`,
            borderRadius: 12, padding: '12px 14px', color: C.ink,
            fontSize: 16, fontFamily: 'inherit', resize: 'none', outline: 'none',
            transition: 'border-color 0.15s',
          }}
          onFocus={e => { e.target.style.borderColor = color }}
          onBlur={e => { e.target.style.borderColor = error ? C.danger : C.border }}
        />
        {error && <p style={errorStyle}>{error}</p>}
      </div>
    )
  }

  if (field.type === 'radio') {
    return (
      <div>
        <span style={labelStyle}>{field.label}</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {field.options.map(opt => (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              style={{
                background: value === opt ? `${color}22` : C.card,
                border: `1.5px solid ${value === opt ? color : C.border}`,
                borderRadius: 12, padding: '12px 16px', textAlign: 'left',
                color: value === opt ? color : C.ink,
                fontSize: 14, fontWeight: value === opt ? 700 : 500,
                cursor: 'pointer', transition: 'all 0.12s',
              }}
            >
              {opt}
            </button>
          ))}
        </div>
        {error && <p style={errorStyle}>{error}</p>}
      </div>
    )
  }

  if (field.type === 'number') {
    return (
      <div>
        <span style={labelStyle}>{field.label}</span>
        <div style={{ position: 'relative' }}>
          {field.prefix && (
            <span style={{
              position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
              color: C.inkSoft, fontSize: 15, fontWeight: 700,
            }}>
              {field.prefix}
            </span>
          )}
          <input
            type="number"
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            placeholder={field.placeholder}
            style={{
              width: '100%', background: C.card,
              border: `1.5px solid ${error ? C.danger : C.border}`,
              borderRadius: 12, padding: `12px 14px 12px ${field.prefix ? '36px' : '14px'}`,
              color: C.ink, fontSize: 16, fontFamily: 'inherit', outline: 'none',
            }}
            onFocus={e => { e.target.style.borderColor = color }}
            onBlur={e => { e.target.style.borderColor = error ? C.danger : C.border }}
          />
        </div>
        {error && <p style={errorStyle}>{error}</p>}
      </div>
    )
  }

  return null
}
