import { describe, expect, it } from 'vitest'
import request from 'supertest'
import { createApp } from './app.js'
import { openDb } from './db.js'

describe('GET /api/health', () => {
  it('отвечает status: ok', async () => {
    const app = createApp(openDb(':memory:'))

    const res = await request(app).get('/api/health')

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ok' })
  })
})
