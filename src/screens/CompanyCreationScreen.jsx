import { useState } from 'react'
import { Check } from 'lucide-react'
import { C } from '../tokens'
import { useZapfy } from '../context/ZapfyContext'
import Zappy from '../components/Zappy'
import Btn from '../components/Btn'

const TYPES = [
  {
    id:    'loja',
    emoji: '🏪',
    name:  'Loja',
    desc:  'Vende produto físico. Aprende sobre estoque, custo e margem.',
    color: '#0891B2',
    products: ['Doces e salgados artesanais', 'Acessórios e bijuterias', 'Artesanato e itens decorativos'],
  },
  {
    id:    'servico',
    emoji: '⚡',
    name:  'Serviço',
    desc:  'Vende habilidade. Aprende sobre tempo, reputação e portfólio.',
    color: '#7C3AED',
    products: ['Aulas particulares', 'Pet sitting e passeio de pets', 'Arte, design e ilustração'],
  },
  {
    id:    'digital',
    emoji: '📱',
    name:  'Digital',
    desc:  'Vende acesso ou conteúdo. Aprende sobre audiência e escala.',
    color: '#059669',
    products: ['Conteúdo de redes sociais', 'E-books e guias digitais', 'Cursos e workshops online'],
  },
]

const ZAPPY_REACTIONS = [
  'Que nome incrível! 🔥',
  'Adorei! Parece profissional!',
  'Esse nome tem tudo!',
  'Sensacional.',
  'Perfeito pra você!',
]

// Mapeia escolhas dos exercícios para tipo de empresa
function inferTypeFromChoices(lessonChoices) {
  const m2 = lessonChoices?.['m2-nome']?.[0] || ''
  const m1 = lessonChoices?.['m1-ideia']?.[0] || ''
  if (m2.includes('Produto físico')) return 'loja'
  if (m2.includes('Digital')  || m1.includes('Tecnologia')) return 'digital'
  if (m2.includes('Serviço')  || m1.includes('Desenho') || m1.includes('Estudos')) return 'servico'
  return null
}

export default function CompanyCreationScreen({ onNav }) {
  const { state, dispatch } = useZapfy()
  const { lessonChoices } = state

  const suggestedType = inferTypeFromChoices(lessonChoices)

  const [step,           setStep]          = useState(0)
  const [selectedType,   setSelectedType]  = useState(suggestedType)
  const [companyName,    setCompanyName]   = useState('')
  const [selectedProduct,setSelectedProduct] = useState(null)
  const [reaction,       setReaction]      = useState(ZAPPY_REACTIONS[0])
  const [nameTyped,      setNameTyped]     = useState(false)

  const type = TYPES.find(t => t.id === selectedType)

  // Dica extraída das escolhas anteriores
  const ideaHint = lessonChoices?.['m1-ideia']
    ? `Nas aulas você pensou em "${lessonChoices['m1-ideia'][0]?.replace(/[^\w\sÀ-ú]/g, '').trim()}" para "${lessonChoices['m1-ideia'][1]}". Use isso de inspiração!`
    : null
  const nomeHint = lessonChoices?.['m2-nome']?.[2]
    ? `Estilo sugerido nas aulas: ${lessonChoices['m2-nome'][2]}`
    : null
  const diferencialHint = lessonChoices?.['m2-diferencial']
    ? `Seu diferencial definido: ${lessonChoices['m2-diferencial'][1]}`
    : null

  const handleNameChange = (v) => {
    setCompanyName(v)
    if (v.length > 0 && !nameTyped) {
      setNameTyped(true)
      setReaction(ZAPPY_REACTIONS[Math.floor(Math.random() * ZAPPY_REACTIONS.length)])
    }
    if (v.length === 0) setNameTyped(false)
  }

  const handleFinish = () => {
    dispatch({
      type:        'FOUND_COMPANY',
      name:        companyName.trim(),
      companyType: selectedType,
      product:     selectedProduct,
    })
    dispatch({ type: 'COMPLETE_MODULE', moduleId: 2 })
    onNav('pathway')
  }

  // ── STEP 0: Tipo ────────────────────────────────────────────────────────────
  if (step === 0) return (
    <div className="min-h-screen flex flex-col px-5 pt-8 pb-10" style={{ background: C.bg }}>
      <button onClick={() => onNav('pathway')} className="text-sm font-semibold mb-6" style={{ color: C.inkSoft }}>← Voltar</button>
      <div className="flex flex-col items-center mb-6">
        <div className="zappy-float mb-4"><Zappy mood="happy" size={90} /></div>
        <h1 className="text-2xl font-black text-center" style={{ color: C.ink }}>Que tipo de negócio você quer criar?</h1>
        <p className="text-sm font-semibold text-center mt-2" style={{ color: C.inkSoft }}>Essa escolha vai personalizar todas as suas missões</p>
      </div>
      {ideaHint && (
        <div className="mb-4 px-4 py-3 rounded-2xl flex items-start gap-2" style={{ background: `${C.primary}10`, border: `1.5px solid ${C.primary}30` }}>
          <span className="text-base">💡</span>
          <p className="text-xs font-semibold" style={{ color: C.primary }}>{ideaHint}</p>
        </div>
      )}
      <div className="flex flex-col gap-3">
        {TYPES.map(t => (
          <button key={t.id}
            onClick={() => { setSelectedType(t.id); setStep(1) }}
            className="flex items-center gap-4 p-5 rounded-3xl border-2 text-left transition-all active:scale-[.98]"
            style={{ borderColor: suggestedType === t.id ? t.color : C.border, background: suggestedType === t.id ? `${t.color}08` : C.card }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0" style={{ background: `${t.color}18` }}>
              {t.emoji}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-lg font-black" style={{ color: C.ink }}>{t.name}</p>
                {suggestedType === t.id && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-lg" style={{ background: `${t.color}20`, color: t.color }}>
                    Sugerido pelas aulas ✓
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold" style={{ color: C.inkSoft }}>{t.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )

  // ── STEP 1: Nome ────────────────────────────────────────────────────────────
  if (step === 1) return (
    <div className="min-h-screen flex flex-col px-5 pt-8 pb-10" style={{ background: C.bg }}>
      <button onClick={() => setStep(0)} className="text-sm font-semibold mb-6" style={{ color: C.inkSoft }}>← Voltar</button>
      <div className="flex flex-col items-center mb-8">
        <div className={`mb-4 ${nameTyped ? 'bounce-in' : 'zappy-float'}`}>
          <Zappy mood={nameTyped ? 'cheer' : 'happy'} size={90} />
        </div>
        {nameTyped && companyName.length > 0 ? (
          <p className="text-base font-extrabold text-center px-4 py-2 rounded-2xl mb-2"
            style={{ color: type.color, background: `${type.color}15` }}>
            {reaction}
          </p>
        ) : null}
        <h1 className="text-2xl font-black text-center" style={{ color: C.ink }}>Como vai se chamar sua {type.name.toLowerCase()}?</h1>
        <p className="text-sm font-semibold text-center mt-2" style={{ color: C.inkSoft }}>Pode ser qualquer nome que você quiser</p>
      </div>

      {nomeHint && (
        <div className="mb-6 px-4 py-3 rounded-2xl flex items-start gap-2" style={{ background: `${type.color}10`, border: `1.5px solid ${type.color}30` }}>
          <span className="text-base">✏️</span>
          <p className="text-xs font-semibold" style={{ color: type.color }}>{nomeHint}</p>
        </div>
      )}

      <input
        className="w-full h-16 rounded-2xl border-2 px-5 text-xl font-extrabold text-center outline-none transition-all"
        style={{ borderColor: companyName.length > 0 ? type.color : C.border, background: C.card, color: C.ink }}
        placeholder="Ex: Doces da Mari"
        value={companyName}
        onChange={e => handleNameChange(e.target.value)}
        maxLength={40}
        autoFocus
      />
      <p className="text-xs font-semibold text-center mt-2" style={{ color: C.inkSoft }}>{companyName.length}/40</p>

      <div className="mt-8">
        <Btn onClick={() => setStep(2)} variant="primary" size="lg" full disabled={companyName.trim().length < 2}>
          Próximo →
        </Btn>
      </div>
    </div>
  )

  // ── STEP 2: Produto ─────────────────────────────────────────────────────────
  if (step === 2) return (
    <div className="min-h-screen flex flex-col px-5 pt-8 pb-10" style={{ background: C.bg }}>
      <button onClick={() => setStep(1)} className="text-sm font-semibold mb-6" style={{ color: C.inkSoft }}>← Voltar</button>
      <div className="flex flex-col items-center mb-8">
        <div className="zappy-float mb-4"><Zappy mood="think" size={90} /></div>
        <h1 className="text-2xl font-black text-center" style={{ color: C.ink }}>O que a <span style={{ color: type.color }}>{companyName}</span> vai oferecer?</h1>
        <p className="text-sm font-semibold text-center mt-2" style={{ color: C.inkSoft }}>Escolha uma opção para começar — você pode mudar depois</p>
      </div>

      {diferencialHint && (
        <div className="mb-4 px-4 py-3 rounded-2xl flex items-start gap-2" style={{ background: `${type.color}10`, border: `1.5px solid ${type.color}30` }}>
          <span className="text-base">🎯</span>
          <p className="text-xs font-semibold" style={{ color: type.color }}>{diferencialHint}</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {type.products.map((product, i) => (
          <button key={i}
            onClick={() => setSelectedProduct(product)}
            className="flex items-center justify-between p-5 rounded-3xl border-2 text-left transition-all"
            style={{
              borderColor: selectedProduct === product ? type.color : C.border,
              background:  selectedProduct === product ? `${type.color}10` : C.card,
            }}>
            <span className="font-bold text-sm" style={{ color: C.ink }}>{product}</span>
            {selectedProduct === product && (
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: type.color }}>
                <Check size={14} color="white" strokeWidth={3} />
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="mt-8">
        <Btn onClick={() => setStep(3)} variant="primary" size="lg" full disabled={!selectedProduct}>
          Fundar minha empresa! →
        </Btn>
      </div>
    </div>
  )

  // ── STEP 3: Certificado ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-6 py-10" style={{ background: `linear-gradient(135deg, ${type.color}, #1E3A8A)` }}>
      {/* Confetti */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {Array.from({ length: 40 }, (_, i) => ({
          id: i,
          color: ['#FACC15','#F97316','#22C55E','#A855F7','white'][i % 5],
          left: Math.random() * 100, delay: Math.random() * 1.5,
          size: 8 + Math.random() * 10, dur: 2 + Math.random() * 2,
          shape: i % 3 === 0 ? '50%' : '4px',
        })).map(c => (
          <div key={c.id} className="absolute" style={{
            left: `${c.left}%`, top: -20, width: c.size, height: c.size,
            background: c.color, borderRadius: c.shape,
            animation: `confetti-fall ${c.dur}s ${c.delay}s ease-in forwards`,
          }} />
        ))}
      </div>

      <div className="z-10 flex flex-col items-center w-full gap-6 mt-4">
        <div className="bounce-in"><Zappy mood="cheer" size={110} /></div>

        <div className="w-full rounded-3xl p-6 text-center" style={{ background: 'rgba(255,255,255,.12)', border: '2px solid rgba(255,255,255,.3)' }}>
          <p className="text-xs font-extrabold uppercase tracking-widest text-white/60 mb-3">Certificado de Fundação</p>
          <p className="text-4xl mb-2">{type.emoji}</p>
          <h1 className="text-3xl font-black text-white mb-1">{companyName}</h1>
          <p className="text-white/80 font-semibold text-sm mb-3">{selectedProduct}</p>
          <div className="w-full h-px bg-white/20 my-3" />
          <p className="text-white/60 text-xs font-bold">FUNDADA EM {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()}</p>
        </div>

        <p className="text-white/90 font-bold text-center text-base">
          Parabéns! Você acabou de fundar sua empresa. Agora as missões vão usar o nome da <strong>{companyName}</strong> — é de verdade!
        </p>
      </div>

      <div className="z-10 w-full">
        <Btn onClick={handleFinish} variant="secondary" size="lg" full>
          Começar as missões →
        </Btn>
      </div>
    </div>
  )
}
