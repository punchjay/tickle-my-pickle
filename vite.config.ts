import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/tickle-my-pickle/' : '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [react()],
  server: {
    open: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx,js,jsx}'],
      exclude: ['src/**/*.test.*', 'src/Tests/**', 'src/setupTests.ts', 'src/**/*.d.ts'],
      reporter: ['text-summary', 'text', 'html'],
    },
  },
})
