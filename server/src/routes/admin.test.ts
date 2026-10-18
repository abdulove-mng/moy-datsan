import { describe, expect, it } from 'vitest'
import request from 'supertest'
import { TEST_PASSWORD, testApp } from '../test-helpers.js'
import { signAdminToken } from '../auth/requireAdmin.js'

describe('вход администратора', () => {
  it('верный пароль → токен, с токеном /me открывается', async () => {
    const app = testApp()

    const login = await request(app).post('/api/admin/login').send({ password: TEST_PASSWORD })
    expect(login.status).toBe(200)
    expect(typeof login.body.token).toBe('string')

    const me = await request(app).get('/api/admin/me').set('Authorization', `Bearer ${login.body.token}`)
    expect(me.status).toBe(200)
    expect(me.body).toEqual({ role: 'admin' })
  })

  it('неверный пароль → 401 без токена', async () => {
    const res = await request(testApp()).post('/api/admin/login').send({ password: 'не тот' })

    expect(res.status).toBe(401)
    expect(res.body.token).toBeUndefined()
  })

  it('без токена → 401', async () => {
    const res = await request(testApp()).get('/api/admin/me')
    expect(res.status).toBe(401)
  })

  it('с токеном, подписанным чужим секретом → 401', async () => {
    const forged = signAdminToken('chuzhoi-secret-chuzhoi-secret-chuzhoi-123')
    const res = await request(testApp()).get('/api/admin/me').set('Authorization', `Bearer ${forged}`)
    expect(res.status).toBe(401)
  })

  it('после 5 неудачных попыток → 429, даже с верным паролем', async () => {
    const app = testApp()
    for (let i = 0; i < 5; i++) {
      await request(app).post('/api/admin/login').send({ password: 'не тот' })
    }

    const res = await request(app).post('/api/admin/login').send({ password: TEST_PASSWORD })
    expect(res.status).toBe(429)
  })
})
