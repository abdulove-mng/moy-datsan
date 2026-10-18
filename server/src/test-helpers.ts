import { hashPassword } from './auth/password.js'
import type { Config } from './config.js'
import { createApp } from './app.js'
import { openDb } from './db.js'

// Общая заготовка для тестов: приложение с базой в памяти и известным тестовым паролем.
export const TEST_PASSWORD = 'test-password-123'

export function testConfig(): Config {
  return {
    port: 0,
    jwtSecret: 'test-secret-test-secret-test-secret-123',
    adminPasswordHash: hashPassword(TEST_PASSWORD),
  }
}

export function testApp() {
  return createApp(openDb(':memory:'), testConfig())
}
