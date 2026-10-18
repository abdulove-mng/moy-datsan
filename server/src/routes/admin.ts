import { Router } from 'express'
import type { AdminLoginRequest, AdminLoginResponse } from '@datsan/shared'
import type { Config } from '../config.js'
import { verifyPassword } from '../auth/password.js'
import { requireAdmin, signAdminToken } from '../auth/requireAdmin.js'

// Простая защита от перебора пароля: не больше 5 неудачных попыток за 15 минут с одного адреса.
const MAX_FAILS = 5
const WINDOW_MS = 15 * 60 * 1000

export function adminRouter(config: Config): Router {
  const router = Router()
  const fails = new Map<string, { count: number; since: number }>()

  // POST /api/admin/login { password } → { token }
  router.post('/login', (req, res) => {
    const ip = req.ip ?? 'unknown'
    const now = Date.now()
    const entry = fails.get(ip)
    if (entry && now - entry.since < WINDOW_MS && entry.count >= MAX_FAILS) {
      res.status(429).json({ error: 'Слишком много попыток. Подождите 15 минут.' })
      return
    }

    const { password } = (req.body ?? {}) as Partial<AdminLoginRequest>
    if (typeof password !== 'string' || !verifyPassword(password, config.adminPasswordHash)) {
      const fresh = !entry || now - entry.since >= WINDOW_MS
      fails.set(ip, { count: fresh ? 1 : entry.count + 1, since: fresh ? now : entry.since })
      res.status(401).json({ error: 'Неверный пароль' })
      return
    }

    fails.delete(ip)
    const body: AdminLoginResponse = { token: signAdminToken(config.jwtSecret) }
    res.json(body)
  })

  // GET /api/admin/me — проверить, что токен ещё действует.
  router.get('/me', requireAdmin(config.jwtSecret), (_req, res) => {
    res.json({ role: 'admin' })
  })

  return router
}
