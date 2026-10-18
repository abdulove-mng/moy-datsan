import { describe, expect, it } from 'vitest'
import request from 'supertest'
import { testApp } from './test-helpers.js'

describe('GET /api/health', () => {
  it('отвечает status: ok', async () => {
    const res = await request(testApp()).get('/api/health')

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ok' })
  })
})
