import { describe, expect, it } from 'vitest'
import { loadConfig } from './config.js'
import { hashPassword, verifyPassword } from './auth/password.js'

describe('настройки', () => {
  it('без JWT_SECRET и ADMIN_PASSWORD_HASH сервер не стартует', () => {
    expect(() => loadConfig({})).toThrow(/JWT_SECRET, ADMIN_PASSWORD_HASH/)
  })

  it('короткий JWT_SECRET отклоняется', () => {
    expect(() => loadConfig({ JWT_SECRET: 'short', ADMIN_PASSWORD_HASH: 'x' })).toThrow(/короткий/)
  })
})

describe('хеш пароля', () => {
  it('проверяет верный пароль и отклоняет неверный', () => {
    const stored = hashPassword('мой-пароль-123')

    expect(stored.startsWith('scrypt:')).toBe(true)
    expect(stored).not.toContain('мой-пароль-123')
    expect(verifyPassword('мой-пароль-123', stored)).toBe(true)
    expect(verifyPassword('чужой-пароль', stored)).toBe(false)
  })
})
