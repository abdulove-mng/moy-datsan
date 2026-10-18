import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

// Пароль администратора хранится не в открытом виде, а как «хеш» — необратимый отпечаток.
// По хешу нельзя восстановить пароль, но можно проверить, что введённый пароль тот же.
// Формат: scrypt:<соль>:<хеш> (соль — случайные байты, чтобы одинаковые пароли давали разные хеши).

const KEY_LENGTH = 64

export function hashPassword(password: string): string {
  const salt = randomBytes(16)
  const hash = scryptSync(password, salt, KEY_LENGTH)
  return `scrypt:${salt.toString('base64')}:${hash.toString('base64')}`
}

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, saltB64, hashB64] = stored.split(':')
  if (scheme !== 'scrypt' || !saltB64 || !hashB64) return false

  const expected = Buffer.from(hashB64, 'base64')
  const actual = scryptSync(password, Buffer.from(saltB64, 'base64'), expected.length)
  // timingSafeEqual сравнивает за одинаковое время — по скорости ответа нельзя угадать пароль.
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}
