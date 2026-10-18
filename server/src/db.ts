import Database from 'better-sqlite3'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** Файл базы по умолчанию: server/data/datsan.db (в git не попадает — *.db в .gitignore). */
export const DEFAULT_DB_PATH = path.join(__dirname, '..', 'data', 'datsan.db')

/**
 * Открывает базу SQLite и создаёт таблицы, если их ещё нет.
 * Для тестов можно передать ':memory:' — база будет в памяти и исчезнет после теста.
 */
export function openDb(dbPath: string = DEFAULT_DB_PATH): Database.Database {
  if (dbPath !== ':memory:') {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true })
  }

  const db = new Database(dbPath)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  createTables(db)
  return db
}

function createTables(db: Database.Database): void {
  // Служебная таблица: когда создана база. Таблицы контента (главы, хуралы, божества…)
  // добавляются на следующих этапах.
  db.exec(`
    CREATE TABLE IF NOT EXISTS app_meta (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `)
  db.prepare(`INSERT OR IGNORE INTO app_meta (key, value) VALUES ('created_at', ?)`).run(
    new Date().toISOString(),
  )
}
