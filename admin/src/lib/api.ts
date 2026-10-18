// Запросы админки к серверу. Токен администратора хранится в localStorage
// и автоматически добавляется в каждый запрос. Если сервер ответил 401 —
// токен истёк или неверен: сообщаем приложению, и оно показывает экран входа.

const TOKEN_KEY = 'datsan_admin_token'
export const UNAUTHORIZED_EVENT = 'datsan:unauthorized'

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    // приватный режим браузера — токен проживёт до перезагрузки страницы
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  const token = getToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (init.body && !(init.body instanceof FormData)) headers.set('Content-Type', 'application/json')

  let res: Response
  try {
    res = await fetch(path, { ...init, headers })
  } catch {
    throw new ApiError(0, 'Сервер не отвечает — запустите npm run dev')
  }

  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    if (res.status === 401 && token) window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
    throw new ApiError(res.status, (body as { error?: string }).error ?? `Ошибка ${res.status}`)
  }
  return body as T
}
