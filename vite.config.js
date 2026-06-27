import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// NOTE: vite-plugin-pwa (service worker) was removed on purpose.
// A service worker breaks the native iOS (Capacitor) build: after an app
// update, the cached SW serves the old app shell, which points at asset
// filenames that no longer exist in the new bundle -> black screen.
// Capacitor already serves the web assets locally, so no SW is needed.
// If a web/PWA deployment is needed later, re-add VitePWA ONLY for that build.
export default defineConfig({
  plugins: [react()],
})
