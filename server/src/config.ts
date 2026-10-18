// Настройки сервера из переменных окружения (файл server/.env).
// Секретов «по умолчанию» в коде нет: если чего-то не хватает — сервер не стартует и говорит, что сделать.

export interface Config {
  port: number
  /** Секрет для подписи токенов администратора. */
  jwtSecret: string
  /** Хеш пароля администратора (сам пароль нигде не хранится). */
  adminPasswordHash: string
}

const HOW_TO_FIX = 'Создайте server/.env: npm run admin:password -w @datsan/server — и вставьте напечатанные строки.'

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const jwtSecret = env.JWT_SECRET?.trim()
  const adminPasswordHash = env.ADMIN_PASSWORD_HASH?.trim()

  const missing = [!jwtSecret && 'JWT_SECRET', !adminPasswordHash && 'ADMIN_PASSWORD_HASH'].filter(Boolean)
  if (missing.length > 0) {
    throw new Error(`В server/.env не заданы: ${missing.join(', ')}. ${HOW_TO_FIX}`)
  }
  if (jwtSecret!.length < 32) {
    throw new Error(`JWT_SECRET слишком короткий (нужно от 32 символов). ${HOW_TO_FIX}`)
  }

  return {
    port: Number(env.PORT) || 3001,
    jwtSecret: jwtSecret!,
    adminPasswordHash: adminPasswordHash!,
  }
}
