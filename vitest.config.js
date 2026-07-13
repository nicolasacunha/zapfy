import { defineConfig } from 'vitest/config'

// Config isolada: testamos lógica pura (lib/), então não herdamos o vite.config
// (rolldown) nem plugins de UI. Ambiente node com localStorage stubado nos testes.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.js'],
  },
})
