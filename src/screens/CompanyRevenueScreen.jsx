import { useState, useEffect } from 'react'
import { ArrowLeft, Plus, TrendingUp } from 'lucide-react'
import { C } from '../tokens'
import { useZapfy } from '../context/ZapfyContext'
import Zappy from '../components/Zappy'

const STORAGE_KEY = 'zapfy_revenue'

function loadSales() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}

function saveSales(sales) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sales))
}

const ZAPPY_COMMENTS = [
  'Cada venda é uma prova que seu negócio existe.',
  'Você está construindo algo real.',
  'Mais uma venda registrada — você tá crescendo.',
  'Sabia que ia dar certo. Continua assim! 🔥',
  'Seu primeiro R$1 real vale mais do que mil planos.',
  'Cada cliente satisfeito é propaganda gratuita.',
  'Bem-vindo ao clube de quem realmente empreendeu.',
  'Você já foi além de 90% de quem "quer empreender".',
]

export default function CompanyRevenueScreen({ onNav }) {
  const { state } = useZapfy()
  const [sales,    setSales]    = useState(loadSales)
  const [showForm, setShowForm] = useState(false)
  const [amount,   setAmount]   = useState('')
  const [desc,     setDesc]     = useState('')
  const [comment,  setComment]  = useState('')

  const company = state.company
  const total   = sales.reduce((s, v) => s + v.amount, 0)
  const emoji   = company?.type === 'loja' ? '🏪' : company?.type === 'servico' ? '⚡' : '📱'

  const handleAdd = () => {
    const val = parseFloat(amount.replace(',', '.'))
    if (!val || val <= 0) return
    const newSale = {
      id: Date.now(),
      amount: val,
      desc: desc || 'Venda avulsa',
      date: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
    }
    const updated = [newSale, ...sales]
    setSales(updated)
    saveSales(updated)
    const c = ZAPPY_COMMENTS[Math.floor(Math.random() * ZAPPY_COMMENTS.length)]
    setComment(c)
    setAmount('')
    setDesc('')
    setShowForm(false)
  }

  if (!company) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-8" style={{ background: C.bg }}>
        <Zappy mood="think" size={100} />
        <p className="text-center font-extrabold text-lg" style={{ color: C.ink }}>
          Crie sua empresa primeiro!
        </p>
        <button onClick={() => onNav('pathway')} className="btn-accent px-8 py-3 rounded-2xl font-extrabold text-white uppercase">
          Ver minhas missões
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-8" style={{ background: C.bg }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-4 pb-4" style={{ background: C.primary, paddingTop: 'max(16px, env(safe-area-inset-top, 16px))' }}>
        <button onClick={() => onNav('pathway')} className="w-10 h-10 rounded-xl flex items-center justify-center">
          <ArrowLeft size={22} color="white" />
        </button>
        <span className="text-2xl">{emoji}</span>
        <div>
          <p className="font-extrabold text-white text-base leading-tight">{company.name}</p>
          <p className="text-white/70 text-xs font-semibold">Simulador de Receita</p>
        </div>
      </div>

      <div className="px-4 pt-4 flex flex-col gap-4">

        {/* Total card */}
        <div className="rounded-3xl p-5 flex items-center justify-between"
          style={{ background: `${C.success}12`, border: `2px solid ${C.success}40` }}>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wide mb-1" style={{ color: C.success }}>
              Receita total simulada
            </p>
            <p className="text-4xl font-black" style={{ color: C.success }}>
              R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs font-semibold mt-1" style={{ color: C.inkSoft }}>
              {sales.length} venda{sales.length !== 1 ? 's' : ''} registrada{sales.length !== 1 ? 's' : ''}
            </p>
          </div>
          <TrendingUp size={44} color={C.success} strokeWidth={1.5} />
        </div>

        {/* Zappy comment */}
        {comment && (
          <div className="rounded-2xl p-4 flex items-start gap-3 pop-in"
            style={{ background: `${C.primary}10`, border: `2px solid ${C.primary}30` }}>
            <Zappy mood="cheer" size={48} />
            <p className="text-sm font-semibold leading-relaxed flex-1" style={{ color: C.inkSoft }}>
              {comment}
            </p>
          </div>
        )}

        {/* Add sale button */}
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl font-extrabold text-white uppercase tracking-wide active:scale-95 transition-transform"
            style={{ background: C.accent, boxShadow: `0 4px 0 #EA580C` }}>
            <Plus size={20} />
            Registrar nova venda
          </button>
        ) : (
          <div className="rounded-3xl border-2 p-5 flex flex-col gap-3 card-rise"
            style={{ borderColor: C.primary, background: C.card }}>
            <p className="font-extrabold" style={{ color: C.ink }}>Nova venda</p>
            <div>
              <label className="text-xs font-bold mb-1 block" style={{ color: C.inkSoft }}>Valor (R$)</label>
              <input
                type="number"
                inputMode="decimal"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Ex: 25,00"
                className="w-full px-4 py-3 rounded-xl text-lg font-extrabold outline-none border-2"
                style={{ borderColor: C.border, background: C.bg, color: C.ink }}
                autoFocus
              />
            </div>
            <div>
              <label className="text-xs font-bold mb-1 block" style={{ color: C.inkSoft }}>Descrição (opcional)</label>
              <input
                value={desc}
                onChange={e => setDesc(e.target.value)}
                placeholder={`Ex: Venda de ${company.product?.split(' ')[0] || 'produto'}`}
                className="w-full px-4 py-3 rounded-xl font-semibold outline-none border-2"
                style={{ borderColor: C.border, background: C.bg, color: C.ink }}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowForm(false); setAmount(''); setDesc('') }}
                className="flex-1 py-3 rounded-xl font-extrabold text-sm"
                style={{ background: C.border, color: C.inkSoft }}>
                Cancelar
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 py-3 rounded-xl font-extrabold text-sm text-white"
                style={{ background: C.success, boxShadow: '0 3px 0 #16A34A' }}>
                Confirmar ✓
              </button>
            </div>
          </div>
        )}

        {/* Sales history */}
        {sales.length > 0 && (
          <div className="rounded-3xl border-2 overflow-hidden" style={{ borderColor: C.border }}>
            <div className="px-4 py-3" style={{ background: C.card }}>
              <p className="font-extrabold text-sm" style={{ color: C.ink }}>Histórico de vendas</p>
            </div>
            {sales.map((s, i) => (
              <div key={s.id}
                className="flex items-center justify-between px-4 py-3"
                style={{ background: i % 2 === 0 ? C.bg : C.card, borderTop: `1px solid ${C.border}` }}>
                <div>
                  <p className="text-sm font-bold" style={{ color: C.ink }}>{s.desc}</p>
                  <p className="text-xs" style={{ color: C.inkSoft }}>{s.date}</p>
                </div>
                <p className="font-extrabold text-base" style={{ color: C.success }}>
                  +R$ {s.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </div>
        )}

        {sales.length === 0 && !showForm && (
          <div className="flex flex-col items-center gap-3 py-8">
            <Zappy mood="think" size={72} />
            <p className="text-center text-sm font-semibold" style={{ color: C.inkSoft }}>
              Simule suas primeiras vendas aqui.{'\n'}É o primeiro passo pra um negócio real!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
