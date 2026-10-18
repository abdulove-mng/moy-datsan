// Общие типы данных (файл .d.ts — только описания типов, без кода) — «договор» между сервером (server/) и приложениями (user/, admin/).
// Если сервер отдаёт главу книги, а приложение её показывает, оба импортируют тип Chapter отсюда,
// и TypeScript сразу подскажет, если они «разошлись».
//
// Типы будут добавляться по этапам: Chapter и Test (этап 3), Practice (4), Khural (5), Deity (6), ZurkhaiDay (7).

/** Ответ GET /api/health — проверка, что сервер жив. */
export interface HealthResponse {
  status: 'ok';
}

/** Ошибка API: { error: "текст для человека" }. */
export interface ApiError {
  error: string;
}

/** POST /api/admin/login — вход администратора. */
export interface AdminLoginRequest {
  password: string;
}

export interface AdminLoginResponse {
  /** Токен для заголовка `Authorization: Bearer <token>`, действует 30 дней. */
  token: string;
}
