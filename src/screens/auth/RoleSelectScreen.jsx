import { C } from '../../tokens'
import Zappy from '../../components/Zappy'

export default function RoleSelectScreen({ onNav }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-6 py-10"
      style={{ background: `linear-gradient(160deg, ${C.primary} 0%, #7C3AED 100%)` }}>

      <div className="flex-1 flex flex-col items-center justify-center gap-6 w-full">
        <div className="zappy-float">
          <Zappy mood="happy" size={140} />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-black text-white mb-2">Bem-vindo ao Zapfy!</h1>
          <p className="text-white/75 font-semibold text-lg">Você é…</p>
        </div>

        <div className="flex flex-col gap-4 w-full mt-4">
          <button
            onClick={() => onNav('parentAuth')}
            className="w-full py-5 rounded-2xl font-extrabold text-lg text-white flex items-center justify-center gap-3 active:scale-95 transition-all"
            style={{ background: 'rgba(255,255,255,.18)', border: '2px solid rgba(255,255,255,.4)' }}>
            <span className="text-3xl">👨‍👩‍👧</span>
            <span>Pai / Responsável</span>
          </button>

          <button
            onClick={() => onNav('inviteCode')}
            className="w-full py-5 rounded-2xl font-extrabold text-lg flex items-center justify-center gap-3 active:scale-95 transition-all"
            style={{ background: 'white', color: C.primary }}>
            <span className="text-3xl">🧒</span>
            <span>Sou a criança</span>
          </button>
        </div>

        <p className="text-white/40 text-xs text-center mt-2">
          Já tem conta? Escolha "Pai / Responsável" e faça login.
        </p>
      </div>
    </div>
  )
}
