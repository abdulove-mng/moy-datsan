import { useEffect, useState } from 'react'
import type { HealthResponse } from '@datsan/shared'

// Разделы, которые появятся в админке на следующих этапах.
const upcoming = [
  { icon: '📖', title: 'Главы книги и тесты', stage: 3 },
  { icon: '🪔', title: 'Практики', stage: 4 },
  { icon: '🔔', title: 'Хуралы', stage: 5 },
  { icon: '✨', title: 'Божества', stage: 6 },
  { icon: '🌙', title: 'Зурхай', stage: 7 },
]

type ServerState = 'checking' | 'ok' | 'down'

export default function App() {
  const [server, setServer] = useState<ServerState>('checking')

  // Проверяем, отвечает ли сервер: запрос идёт на /api/health, Vite пересылает его на порт 3001.
  useEffect(() => {
    fetch('/api/health')
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((body: HealthResponse) => setServer(body.status === 'ok' ? 'ok' : 'down'))
      .catch(() => setServer('down'))
  }, [])

  return (
    <main className="admin-home">
      <header className="admin-home__header">
        <span className="admin-home__logo">☸</span>
        <div>
          <h1 className="admin-home__title">Админ-кабинет</h1>
          <p className="admin-home__subtitle">Мой дацан</p>
        </div>
      </header>

      <p className={`server-status server-status--${server}`}>
        {server === 'checking' && 'Проверяю сервер…'}
        {server === 'ok' && 'Сервер работает'}
        {server === 'down' && 'Сервер не отвечает — запустите npm run dev'}
      </p>

      <h2 className="admin-home__section">Скоро здесь</h2>
      <ul className="upcoming">
        {upcoming.map((item) => (
          <li key={item.title} className="upcoming__item">
            <span className="upcoming__icon">{item.icon}</span>
            <span className="upcoming__title">{item.title}</span>
            <span className="upcoming__stage">этап {item.stage}</span>
          </li>
        ))}
      </ul>
    </main>
  )
}
