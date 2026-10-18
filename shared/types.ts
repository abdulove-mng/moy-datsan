// Общие типы данных — «договор» между сервером (server/) и приложениями (user/, admin/).
// Если сервер отдаёт главу книги, а приложение её показывает, оба импортируют тип Chapter отсюда,
// и TypeScript сразу подскажет, если они «разошлись».
//
// Типы будут добавляться по этапам: Chapter и Test (этап 3), Practice (4), Khural (5), Deity (6), ZurkhaiDay (7).

/** Ответ GET /api/health — проверка, что сервер жив. */
export interface HealthResponse {
  status: 'ok';
}
