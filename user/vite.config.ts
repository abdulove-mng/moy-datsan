import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Запросы приложения к /api/* Vite пересылает на наш сервер (server/, порт 3001).
    // Для приложения это выглядит как один сайт — не нужно настраивать CORS.
    proxy: {
      '/api': 'http://localhost:3001',
      '/uploads': 'http://localhost:3001',
    },
  },
})
