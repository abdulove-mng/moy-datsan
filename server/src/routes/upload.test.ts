import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import request from 'supertest'
import { signAdminToken } from '../auth/requireAdmin.js'
import { testApp, testConfig } from '../test-helpers.js'

// Минимальная настоящая PNG-картинка 1×1.
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=',
  'base64',
)

describe('POST /api/upload', () => {
  it('без токена → 401, файл не сохраняется', async () => {
    const config = testConfig()
    const res = await request(testApp(config)).post('/api/upload').attach('image', PNG, 'a.png')

    expect(res.status).toBe(401)
    expect(fs.readdirSync(config.uploadDir)).toHaveLength(0)
  })

  it('с токеном: PNG сохраняется и раздаётся по /uploads/…', async () => {
    const config = testConfig()
    const app = testApp(config)
    const token = signAdminToken(config.jwtSecret)

    const res = await request(app)
      .post('/api/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', PNG, { filename: '../../evil name.png', contentType: 'image/png' })

    expect(res.status).toBe(200)
    expect(res.body.url).toMatch(/^\/uploads\/\d+-[0-9a-f]{8}\.png$/)
    expect(fs.existsSync(path.join(config.uploadDir, path.basename(res.body.url)))).toBe(true)

    const file = await request(app).get(res.body.url)
    expect(file.status).toBe(200)
    expect(file.headers['content-type']).toBe('image/png')
  })

  it('SVG и текст отклоняются', async () => {
    const config = testConfig()
    const token = signAdminToken(config.jwtSecret)

    for (const [name, type] of [['x.svg', 'image/svg+xml'], ['x.txt', 'text/plain']]) {
      const res = await request(testApp(config))
        .post('/api/upload')
        .set('Authorization', `Bearer ${token}`)
        .attach('image', Buffer.from('<svg/>'), { filename: name, contentType: type })
      expect(res.status).toBe(400)
    }
    expect(fs.readdirSync(config.uploadDir)).toHaveLength(0)
  })
})
