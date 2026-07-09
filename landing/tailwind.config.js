/**
 * Tokens copiados 1:1 do "Zapfy — Design System Guide" (PDF, V1).
 * Nenhuma cor, fonte ou raio inventado — fonte única de verdade visual.
 */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1E40AF',
        'primary-dark': '#1E3A8A',
        accent: '#F97316',
        'accent-dark': '#C2410C',
        purple: '#7C3AED',
        'purple-light': '#A855F7',
        success: '#22C55E',
        danger: '#EF4444',
        coin: '#FACC15',
        'coin-dark': '#EAB308',
        shell: '#0C1222',
        'app-bg': '#F8FAFC',
        ink: '#0F172A',
        'ink-soft': '#475569',
        line: '#E2E8F0',
      },
      fontFamily: {
        display: ['Grandstander', 'cursive'],
        body: ['Figtree', 'sans-serif'],
      },
      /*
       * Elevação do sistema: sombra sólida deslocada ("tecla pressionável").
       * Cada variante fica sobre um bloco de 4px da própria cor "-dark",
       * que cai para 2px ao ser pressionada. Sem sombra desfocada.
       */
      boxShadow: {
        'key-primary': '0 4px 0 #1E3A8A',
        'key-primary-pressed': '0 2px 0 #1E3A8A',
        'key-accent': '0 4px 0 #C2410C',
        'key-accent-pressed': '0 2px 0 #C2410C',
        'key-neutral': '0 4px 0 #E2E8F0',
        'key-neutral-pressed': '0 2px 0 #E2E8F0',
        // "-dark" derivados para success/coin (o guia só define primary/accent dark)
        'key-success': '0 4px 0 #15803D',
      },
      borderRadius: {
        // 16px = botões e opções de resposta · 24px = cards de seção
        btn: '16px',
        card: '24px',
      },
    },
  },
  plugins: [],
}
