import { useEffect, useState } from 'react'
import type { HealthResponse } from '@datsan/shared'

type ServerState = 'checking' | 'ok' | 'down'

// Проверяет, отвечает ли сервер: запрос идёт на /api/health, Vite пересылает его на порт 3001.
export default function ServerStatus() {
  const [server, setServer] = useState<ServerState>('checking')

  useEffect(() => {
    fetch('/api/health')
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((body: HealthResponse) => setServer(body.status === 'ok' ? 'ok' : 'down'))
      .catch(() => setServer('down'))
  }, [])

  return (
    <span className={`server-status server-status--${server}`}>
      {server === 'checking' && 'Проверяю сервер…'}
      {server === 'ok' && '● Сервер работает'}
      {server === 'down' && '● Сервер не отвечает'}
    </span>
  )
}
