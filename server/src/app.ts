import express from 'express'
import type Database from 'better-sqlite3'
import type { HealthResponse } from '@datsan/shared'

/**
 * Собирает Express-приложение со всеми маршрутами, но не запускает его.
 * Так его можно проверить в тестах без настоящего порта (см. app.test.ts).
 */
export function createApp(db: Database.Database) {
  const app = express()
  app.use(express.json())

  app.get('/api/health', (_req, res) => {
    // Простой запрос к базе: если она недоступна, здесь будет ошибка, и мы это увидим.
    db.prepare('SELECT 1').get()
    const body: HealthResponse = { status: 'ok' }
    res.json(body)
  })

  return app
}
