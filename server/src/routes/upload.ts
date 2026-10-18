import { randomBytes } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { Router } from 'express'
import multer from 'multer'
import type { UploadResponse } from '@datsan/shared'
import type { Config } from '../config.js'
import { requireAdmin } from '../auth/requireAdmin.js'

const MAX_SIZE = 10 * 1024 * 1024 // 10 МБ

// Разрешены только растровые картинки. SVG не принимаем: внутри SVG может быть скрипт.
const ALLOWED: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
}

/** POST /api/upload (поле формы `image`) → { url: "/uploads/<файл>" }. Только для администратора. */
export function uploadRouter(config: Config): Router {
  fs.mkdirSync(config.uploadDir, { recursive: true })

  const upload = multer({
    storage: multer.diskStorage({
      destination: config.uploadDir,
      // Имя файла придумываем сами — не доверяем имени от пользователя.
      filename: (_req, file, cb) => cb(null, `${Date.now()}-${randomBytes(4).toString('hex')}${ALLOWED[file.mimetype]}`),
    }),
    limits: { fileSize: MAX_SIZE, files: 1 },
    fileFilter: (_req, file, cb) => {
      if (ALLOWED[file.mimetype]) cb(null, true)
      else cb(new Error('Недопустимый формат. Можно: JPG, PNG, WebP, GIF.'))
    },
  })

  const router = Router()

  router.post('/', requireAdmin(config.jwtSecret), (req, res) => {
    upload.single('image')(req, res, (err) => {
      if (err) {
        const tooBig = err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE'
        res.status(400).json({ error: tooBig ? 'Файл больше 10 МБ.' : (err as Error).message })
        return
      }
      if (!req.file) {
        res.status(400).json({ error: 'Файл не выбран.' })
        return
      }
      const body: UploadResponse = { url: `/uploads/${path.basename(req.file.filename)}` }
      res.json(body)
    })
  })

  return router
}
