import { C } from '../../tokens'
import Zappy from '../../components/Zappy'

export default function InviteSuccessScreen({ onNav, inviteCode, childName }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 gap-6"
      style={{ background: `linear-gradient(160deg, ${C.success} 0%, #16A34A 100%)` }}>

      <div className="bounce-in"><Zappy mood="cheer" size={130} /></div>

      <div className="text-center">
        <p className="text-3xl font-black text-white mb-2">Tudo pronto.</p>
        <p className="text-white/80 font-semibold">
          O perfil de <strong className="text-white">{childName}</strong> foi criado com sucesso.
        </p>
      </div>

      <div className="w-full rounded-3xl p-5 text-center" style={{ background: 'rgba(255,255,255,.15)', border: '2px dashed rgba(255,255,255,.5)' }}>
        <p className="text-white/70 font-bold text-sm mb-2">Código de convite para a criança</p>
        <p className="text-4xl font-black text-white tracking-[.3em]">{inviteCode}</p>
        <p className="text-white/60 text-xs mt-2 font-semibold">
          Compartilhe este código com {childName} para que ele(a) entre no app.
        </p>
      </div>

      <button
        onClick={() => onNav('pathway')}
        className="w-full py-4 rounded-2xl font-extrabold text-lg uppercase"
        style={{ background: 'white', color: C.success }}>
        Começar a jogar!
      </button>
    </div>
  )
}
