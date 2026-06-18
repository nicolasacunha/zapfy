import { useState } from 'react'
import { C } from '../../tokens'
import Zappy from '../../components/Zappy'

export default function ChildSetupScreen({ onNav }) {
  const [name,    setName]    = useState('')
  const [age,     setAge]     = useState('')
  const [consent, setConsent] = useState(false)

  const ageNum     = Number(age)
  const needsLGPD  = ageNum >= 5 && ageNum < 18 // LGPD Art. 14: menores de 18 anos
  const dataValid  = name.trim().length >= 2 && ageNum >= 5 && ageNum <= 18
  const valid      = dataValid && (!needsLGPD || consent)

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-10 gap-6"
      style={{ background: `linear-gradient(160deg, ${C.primary} 0%, #7C3AED 100%)` }}>

      <div className="zappy-float mt-4"><Zappy mood="happy" size={110} /></div>

      <div className="text-center">
        <h1 className="text-2xl font-black text-white mb-2">Conta criada.</h1>
        <p className="text-white/75 font-semibold">
          Agora vamos configurar o perfil do seu filho.
        </p>
      </div>

      <div className="w-full flex flex-col gap-4">
        <div>
          <label className="text-white/80 text-xs font-bold mb-1 block">Nome da criança</label>
          <input
            className="w-full rounded-2xl px-4 py-4 font-extrabold text-lg outline-none placeholder-white/40"
            style={{ color: 'white', background: 'rgba(255,255,255,.18)', border: '2px solid rgba(255,255,255,.3)' }}
            placeholder="Joãozinho"
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
          />
        </div>

        <div>
          <label className="text-white/80 text-xs font-bold mb-1 block">Idade</label>
          <input
            type="number"
            min="5"
            max="18"
            className="w-full rounded-2xl px-4 py-4 font-extrabold text-lg outline-none placeholder-white/40"
            style={{ color: 'white', background: 'rgba(255,255,255,.18)', border: '2px solid rgba(255,255,255,.3)' }}
            placeholder="11"
            value={age}
            onChange={e => setAge(e.target.value)}
          />
        </div>

        {/* Consentimento LGPD/COPPA — aparece para crianças abaixo de 13 anos */}
        {needsLGPD && (
          <div className="rounded-2xl p-4 flex flex-col gap-3"
            style={{ background: 'rgba(255,255,255,.15)' }}>
            <p className="text-white text-xs font-bold uppercase tracking-wide">
              Consentimento do Responsável (LGPD)
            </p>
            <p className="text-white/80 text-xs leading-relaxed">
              Como responsável legal de <strong>{name || 'seu filho'}</strong> ({ageNum} anos), você
              autoriza o Zapfy a coletar e processar os dados necessários para o funcionamento do
              aplicativo: nome, idade e progresso de aprendizagem. Os dados não serão
              compartilhados com terceiros nem usados para publicidade.
            </p>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-0.5 w-5 h-5 rounded flex-shrink-0"
                checked={consent}
                onChange={e => setConsent(e.target.checked)}
              />
              <span className="text-white text-xs font-semibold leading-relaxed">
                Li e concordo com os{' '}
                <span className="underline">Termos de Uso</span> e{' '}
                <span className="underline">Política de Privacidade</span>,
                e consinto com o tratamento dos dados do menor conforme a LGPD.
              </span>
            </label>
          </div>
        )}
      </div>

      <div className="w-full mt-2">
        <button
          onClick={() => valid && onNav('pinSetup', { childName: name.trim(), childAge: ageNum, childConsent: consent || !needsLGPD })}
          disabled={!valid}
          className="w-full py-4 rounded-2xl font-extrabold text-lg uppercase tracking-wide transition-all"
          style={{ background: valid ? 'white' : 'rgba(255,255,255,.25)', color: valid ? C.primary : 'rgba(255,255,255,.5)' }}>
          Continuar →
        </button>
      </div>
    </div>
  )
}
