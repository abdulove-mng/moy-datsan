import { useState, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import ServerStatus from '../components/ServerStatus'

export default function Login() {
  const { login } = useAuth()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(password)
    } catch (err) {
      setError((err as Error).message)
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <span className="login-card__logo">☸</span>
        <h1 className="login-card__title">Мой дацан</h1>
        <p className="login-card__subtitle">Админ-кабинет</p>

        <label className="field">
          <span className="field__label">Пароль администратора</span>
          <input
            type="password"
            className="field__input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            autoFocus
            required
          />
        </label>

        {error && <p className="login-card__error">{error}</p>}

        <button type="submit" className="btn btn--primary btn--wide" disabled={loading || !password}>
          {loading ? 'Вход…' : 'Войти'}
        </button>

        <div className="login-card__footer">
          <ServerStatus />
        </div>
      </form>
    </div>
  )
}
