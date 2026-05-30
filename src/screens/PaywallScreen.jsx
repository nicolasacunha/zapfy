import { useState } from 'react'
import { X, Crown, Check, Sparkles } from 'lucide-react'
import { C } from '../tokens'
import ZappyWithSkin from '../components/ZappyWithSkin'
import { PRODUCTS, purchasePremium, restorePurchases } from '../lib/purchases'
import { useZapfy } from '../context/ZapfyContext'

const FOUNDER_FEATURES = [
  { icon: '🧊', title: 'Streak Freeze ilimitado', desc: 'Nunca perca sua sequência por um dia ruim' },
  { icon: '⚡', title: 'Missões bônus por módulo', desc: 'Conteúdo extra além dos 5 módulos principais' },
  { icon: '📊', title: 'Relatório PDF do pai', desc: 'Resumo mensal de progresso para compartilhar' },
  { icon: '🚀', title: 'Acesso antecipado', desc: 'Novos módulos antes de todo mundo' },
  { icon: '✨', title: 'Zappy Dourado', desc: 'Skin exclusiva do mascote para Founders' },
  { icon: '🏆', title: 'Liga Founder', desc: 'Compita com os melhores founders do país' },
]

export default function PaywallScreen({ onNav }) {
  const { dispatch } = useZapfy()
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const product = PRODUCTS.founder

  const handleSubscribe = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await purchasePremium(product.id)
      if (result.success) {
        dispatch({ type: 'SET_PREMIUM', value: true })
        dispatch({ type: 'SET_SKIN', skin: 'golden' })
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

  return (
    <div className="min-h-screen pb-8 flex flex-col" style={{ background: C.bg }}>

      {/* Header */}
      <div className="relative px-4 pt-10 pb-6 flex flex-col items-center text-center"
        style={{ background: 'linear-gradient(160deg, #1E40AF 0%, #7C3AED 100%)' }}>
        <button onClick={() => onNav('pathway')}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,.15)' }}>
          <X size={16} color="white" />
        </button>
        <div className="mb-3">
          <ZappyWithSkin mood="cheer" size={80} skin="golden" />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Crown size={18} fill="#F97316" color="#F97316" />
          <span className="text-white/80 font-extrabold text-sm uppercase tracking-widest">Zapfy Founder</span>
          <Crown size={18} fill="#F97316" color="#F97316" />
        </div>
        <h1 className="text-2xl font-black text-white leading-tight">
          Para quem quer ir<br />além do básico.
        </h1>
        <p className="text-white/70 text-sm font-semibold mt-2">
          Todos os módulos são gratuitos. Isso é só para quem quer mais.
        </p>
      </div>

      <div className="flex-1 px-4 pt-5 flex flex-col gap-4">

        {/* Features */}
        <div className="rounded-3xl border p-4 flex flex-col gap-3" style={{ background: C.card, borderColor: C.border }}>
          {FOUNDER_FEATURES.map((f, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-xl w-7 flex-shrink-0 mt-0.5">{f.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-bold leading-snug" style={{ color: C.ink }}>{f.title}</p>
                <p className="text-xs font-semibold mt-0.5" style={{ color: C.inkSoft }}>{f.desc}</p>
              </div>
              <Check size={15} color={C.success} strokeWidth={3} className="flex-shrink-0 mt-1" />
            </div>
          ))}
        </div>

        {/* Price */}
        <div className="rounded-2xl border-2 p-4 text-center" style={{ borderColor: C.primary, background: `${C.primary}08` }}>
          <p className="text-3xl font-black" style={{ color: C.ink }}>R$19,90<span className="text-base font-bold text-gray-400">/mês</span></p>
          <p className="text-sm font-semibold mt-1" style={{ color: C.inkSoft }}>Cancele quando quiser</p>
        </div>

        {error && (
          <p className="text-sm font-semibold text-center px-4 py-3 rounded-2xl"
            style={{ background: '#FEF2F2', color: '#DC2626' }}>
            {error}
          </p>
        )}

        {/* Subscribe */}
        <button onClick={handleSubscribe} disabled={loading}
          className="w-full py-4 rounded-2xl font-extrabold text-base text-white uppercase tracking-wide transition-all active:scale-95"
          style={{ background: loading ? C.border : 'linear-gradient(135deg, #1E40AF, #7C3AED)', boxShadow: loading ? 'none' : '0 4px 0 #1E3A8A' }}>
          {loading ? 'Processando…' : 'Virar Founder — R$19,90/mês'}
        </button>

        {/* No thanks */}
        <button onClick={() => onNav('pathway')}
          className="text-center text-sm font-bold py-2"
          style={{ color: C.inkSoft }}>
          Não, obrigado — continuar de graça
        </button>

        <button onClick={handleRestore} disabled={loading}
          className="text-center text-xs font-bold"
          style={{ color: C.inkSoft }}>
          Restaurar compra anterior
        </button>

        {/* Legal */}
        <p className="text-center text-[10px] font-semibold leading-relaxed" style={{ color: C.inkSoft }}>
          Ao assinar, você concorda com nossos{' '}
          <a href="https://zapfy.app/termos" target="_blank" rel="noopener" style={{ color: C.primary }}>Termos de Uso</a>{' '}e{' '}
          <a href="https://zapfy.app/privacidade" target="_blank" rel="noopener" style={{ color: C.primary }}>Política de Privacidade</a>.{' '}
          A assinatura renova automaticamente — cancele quando quiser.
        </p>
      </div>
    </div>
  )
}
