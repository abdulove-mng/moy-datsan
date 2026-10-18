import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Отдельный порт, чтобы админка и приложение работали одновременно (приложение — 5173).
    port: 5174,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
