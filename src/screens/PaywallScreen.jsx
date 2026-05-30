import { useState } from 'react'
import { Check, X, Crown } from 'lucide-react'
import { C } from '../tokens'
import ZappyWithSkin from '../components/ZappyWithSkin'
import { PRODUCTS, purchasePremium, restorePurchases } from '../lib/purchases'
import { useZapfy } from '../context/ZapfyContext'

const MODULES_UNLOCKED = [
  { icon: '🏢', title: 'Módulo 2 — Cria sua empresa', desc: 'Nome, produto, identidade e diferencial da empresa do seu filho' },
  { icon: '🎯', title: 'Módulo 3 — Primeiro cliente', desc: 'Quem compraria, onde encontrar, como chegar até ele' },
  { icon: '💰', title: 'Módulo 4 — Preço e valor', desc: 'Como precificar, negociar e defender o preço sem dar desconto' },
  { icon: '🚀', title: 'Módulo 5 — Primeira venda', desc: 'Simulação completa + desafio: tentar vender para alguém de verdade' },
  { icon: '📊', title: 'Dashboard do pai', desc: 'Veja cada missão concluída, empresa criada e progresso em tempo real' },
]

export default function PaywallScreen({ onNav }) {
  const { dispatch } = useZapfy()
  const [plan,    setPlan]    = useState('annual')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const product = PRODUCTS[plan]

  const handleSubscribe = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await purchasePremium(product.id)
      if (result.success) {
        dispatch({ type: 'SET_PREMIUM', value: true })
        onNav('pathway')
      } else {
        setError('Não foi possível processar o pagamento. Tente novamente.')
      }
    } catch (e) {
      setError(e.message || 'Erro ao processar pagamento.')
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async () => {
    setLoading(true)
    try {
      const result = await restorePurchases()
      if (result.success) {
        dispatch({ type: 'SET_PREMIUM', value: true })
        onNav('pathway')
      } else {
        setError('Nenhuma compra anterior encontrada para esta conta.')
      }
    } finally {
      setLoading(false)
    }
  }

  const buttonLabel = loading
    ? 'Processando…'
    : plan === 'annual'
      ? 'Começar 7 dias grátis • depois R$599/ano'
      : 'Começar 7 dias grátis • depois R$69,90/mês'

  return (
    <div className="min-h-screen pb-8 flex flex-col" style={{ background: C.bg }}>

      {/* Header */}
      <div className="relative px-4 pt-10 pb-6 flex flex-col items-center text-center"
        style={{ background: `linear-gradient(160deg, #1E40AF 0%, #7C3AED 100%)` }}>
        <button onClick={() => onNav('pathway')}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,.2)' }}>
          <X size={16} color="white" />
        </button>
        <div className="mb-3">
          <ZappyWithSkin mood="cheer" size={80} />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Crown size={18} fill="#F97316" color="#F97316" />
          <span className="text-white/80 font-extrabold text-sm uppercase tracking-widest">Zapfy Premium</span>
          <Crown size={18} fill="#F97316" color="#F97316" />
        </div>
        <h1 className="text-2xl font-black text-white leading-tight">
          Seu filho vai criar<br />sua empresa de verdade.
        </h1>
        <p className="text-white/80 text-sm font-bold mt-2">
          7 dias grátis — sem cartão de crédito
        </p>
      </div>

      <div className="flex-1 px-4 pt-5 flex flex-col gap-4">

        {/* Modules unlocked */}
        <div className="rounded-3xl border p-4 flex flex-col gap-4" style={{ background: C.card, borderColor: C.border }}>
          <p className="text-xs font-extrabold uppercase tracking-widest text-center" style={{ color: C.inkSoft }}>
            O que é desbloqueado
          </p>
          {MODULES_UNLOCKED.map((m, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-xl w-7 flex-shrink-0 mt-0.5">{m.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-extrabold leading-tight" style={{ color: C.ink }}>{m.title}</p>
                <p className="text-xs font-semibold leading-snug mt-0.5" style={{ color: C.inkSoft }}>{m.desc}</p>
              </div>
              <Check size={16} color={C.success} strokeWidth={3} className="flex-shrink-0 mt-0.5" />
            </div>
          ))}
        </div>

        {/* Stat badge */}
        <div className="rounded-2xl px-4 py-3 text-center"
          style={{ background: `${C.primary}12`, border: `1.5px solid ${C.primary}30` }}>
          <p className="text-xs font-bold leading-snug" style={{ color: C.primary }}>
            "71% dos filhos de empreendedores chegaram aos 19 anos sem entender o negócio dos pais."
          </p>
        </div>

        {/* Plan selector */}
        <div className="grid grid-cols-2 gap-3">
          {['monthly', 'annual'].map(p => {
            const prod = PRODUCTS[p]
            const active = plan === p
            return (
              <button key={p} onClick={() => setPlan(p)}
                className="rounded-2xl p-3 text-left transition-all relative overflow-hidden"
                style={{
                  border:     `2px solid ${active ? C.primary : C.border}`,
                  background: active ? `${C.primary}10` : C.card,
                }}>
                {prod.savings && (
                  <span className="absolute top-2 right-2 text-[9px] font-extrabold px-1.5 py-0.5 rounded-lg text-white"
                    style={{ background: C.accent }}>
                    {prod.savings}
                  </span>
                )}
                <p className="text-xs font-bold mb-0.5" style={{ color: C.inkSoft }}>
                  {p === 'monthly' ? 'Mensal' : 'Anual'}
                </p>
                <p className="text-base font-extrabold" style={{ color: active ? C.primary : C.ink }}>
                  {prod.price}
                </p>
              </button>
            )
          })}
        </div>

        {error && (
          <p className="text-sm font-semibold text-center px-4 py-3 rounded-2xl"
            style={{ background: '#FEF2F2', color: '#DC2626' }}>
            {error}
          </p>
        )}

        {/* Subscribe button */}
        <button onClick={handleSubscribe} disabled={loading}
          className="w-full py-4 rounded-2xl font-extrabold text-sm text-white transition-all active:scale-95 leading-tight px-4"
          style={{
            background:  loading ? C.border : `linear-gradient(135deg, #1E40AF, #7C3AED)`,
            boxShadow:   loading ? 'none' : '0 4px 0 #1E3A8A',
          }}>
          {buttonLabel}
        </button>

        <button onClick={handleRestore} disabled={loading}
          className="text-center text-sm font-bold"
          style={{ color: C.inkSoft }}>
          Restaurar compras anteriores
        </button>

        {/* Legal */}
        <p className="text-center text-[10px] font-semibold leading-relaxed" style={{ color: C.inkSoft }}>
          Ao assinar, você concorda com nossos{' '}
          <a href="https://zapfy.app/termos" target="_blank" rel="noopener" style={{ color: C.primary }}>Termos de Uso</a>{' '}e{' '}
          <a href="https://zapfy.app/privacidade" target="_blank" rel="noopener" style={{ color: C.primary }}>Política de Privacidade</a>.{' '}
          A assinatura renova automaticamente — cancele quando quiser nas configurações da App Store.{' '}
          Para menores de 13 anos, o consentimento do responsável é obrigatório (LGPD/COPPA).
        </p>
      </div>
    </div>
  )
}
