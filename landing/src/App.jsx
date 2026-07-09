import Hero from './sections/Hero.jsx'
import Problema from './sections/Problema.jsx'
import ComoFunciona from './sections/ComoFunciona.jsx'
import PainelPai from './sections/PainelPai.jsx'
import Confianca from './sections/Confianca.jsx'
import Faq from './sections/Faq.jsx'
import CtaFinal from './sections/CtaFinal.jsx'
import Footer from './sections/Footer.jsx'
import StickyCta from './components/StickyCta.jsx'

/**
 * Landing page do Zapfy — one-page, mobile-first, PT-BR.
 * Público: o pai/mãe empreendedor(a) que decide e paga.
 * Ordem das seções conforme o brief (hero → problema → como funciona →
 * painel do pai → confiança → prova social → CTA final).
 */
export default function App() {
  return (
    <>
      <Hero />
      <main>
        <Problema />
        <ComoFunciona />
        <PainelPai />
        {/* Depoimentos: seção removida até existirem depoimentos reais do
            piloto — não renderizar placeholder na última impressão da página.
            Estrutura pronta em sections/Depoimentos.jsx. */}
        <Confianca />
        <Faq />
        <CtaFinal />
      </main>
      <Footer />
      <StickyCta />
    </>
  )
}
