import express from 'express'
import type Database from 'better-sqlite3'
import type { HealthResponse } from '@datsan/shared'
import type { Config } from './config.js'
import { adminRouter } from './routes/admin.js'
import { uploadRouter } from './routes/upload.js'

/**
 * Собирает Express-приложение со всеми маршрутами, но не запускает его.
 * Так его можно проверить в тестах без настоящего порта (см. *.test.ts).
 */
export function createApp(db: Database.Database, config: Config) {
  const app = express()
  app.use(express.json())

  app.get('/api/health', (_req, res) => {
    // Простой запрос к базе: если она недоступна, здесь будет ошибка, и мы это увидим.
    db.prepare('SELECT 1').get()
    const body: HealthResponse = { status: 'ok' }
    res.json(body)
  })

  app.use('/api/admin', adminRouter(config))
  app.use('/api/upload', uploadRouter(config))

  // Загруженные картинки раздаются как обычные файлы: /uploads/<имя>.
  app.use('/uploads', express.static(config.uploadDir, { maxAge: '30d', immutable: true }))

  return app
}
