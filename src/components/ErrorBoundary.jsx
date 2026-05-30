import { Component } from 'react'
import Zappy from './Zappy'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[Zapfy] ErrorBoundary:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6"
          style={{ background: '#F8FAFC' }}>
          <div className="bounce-in">
            <Zappy mood="sad" size={100} />
          </div>
          <div className="text-center slide-up">
            <p className="text-2xl font-black" style={{ color: '#0F172A' }}>Algo deu errado 😅</p>
            <p className="text-sm mt-2 font-semibold" style={{ color: '#64748B' }}>
              Não se preocupa, a gente reinicia!
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary px-10 h-12 rounded-2xl font-extrabold text-white uppercase tracking-wide slide-up"
            style={{ background: '#1E40AF', animationDelay: '80ms' }}>
            Reiniciar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
