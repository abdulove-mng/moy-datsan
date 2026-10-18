import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import type { AdminLoginRequest, AdminLoginResponse } from '@datsan/shared'
import { api, getToken, setToken, UNAUTHORIZED_EVENT } from '../lib/api'

type Status = 'checking' | 'signed-in' | 'signed-out'

interface AuthValue {
  status: Status
  login: (password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>(() => (getToken() ? 'checking' : 'signed-out'))

  const logout = useCallback(() => {
    setToken(null)
    setStatus('signed-out')
  }, [])

  // При открытии админки проверяем, что сохранённый токен ещё действует.
  useEffect(() => {
    if (status !== 'checking') return
    api('/api/admin/me')
      .then(() => setStatus('signed-in'))
      .catch(() => logout())
  }, [status, logout])

  // Любой ответ 401 от сервера → выход на экран входа.
  useEffect(() => {
    window.addEventListener(UNAUTHORIZED_EVENT, logout)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, logout)
  }, [logout])

  const login = useCallback(async (password: string) => {
    const body: AdminLoginRequest = { password }
    const { token } = await api<AdminLoginResponse>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify(body),
    })
    setToken(token)
    setStatus('signed-in')
  }, [])

  return <AuthContext.Provider value={{ status, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthValue {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth нужно использовать внутри <AuthProvider>')
  return value
}
