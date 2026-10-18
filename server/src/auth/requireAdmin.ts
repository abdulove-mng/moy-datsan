import type { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'

// Токен администратора — «пропуск» после входа. Действует 30 дней.
export const TOKEN_TTL = '30d'

export function signAdminToken(secret: string): string {
  return jwt.sign({ role: 'admin' }, secret, { expiresIn: TOKEN_TTL })
}

/**
 * Охранник маршрута: пропускает дальше только запросы с действующим токеном администратора
 * в заголовке `Authorization: Bearer <токен>`. Остальным — 401.
 * Ставится на все маршруты, которые что-то меняют (создать, изменить, удалить, загрузить).
 */
export function requireAdmin(secret: string): RequestHandler {
  return (req, res, next) => {
    const header = req.headers.authorization ?? ''
    const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length) : ''

    try {
      const payload = jwt.verify(token, secret)
      if (typeof payload === 'object' && payload.role === 'admin') {
        next()
        return
      }
    } catch {
      // токена нет, он подделан или истёк — ниже ответим 401
    }
    res.status(401).json({ error: 'Нужен вход администратора' })
  }
}
