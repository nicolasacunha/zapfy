import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'app.naclabs.zapfy',
  appName: 'Zapfy',
  webDir: 'dist',
  ios: {
    contentInset: 'never',
    preferredContentMode: 'mobile',
    backgroundColor: '#0C1222',
    scrollEnabled: true,
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 600,
      backgroundColor: '#0C1222',
      showSpinner: false,
    },
    StatusBar: {
      style: 'Dark',
      backgroundColor: '#0C1222',
    },
  },
}

export default config
