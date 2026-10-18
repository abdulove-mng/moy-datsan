import { config } from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createApp } from './app.js'
import { DEFAULT_DB_PATH, openDb } from './db.js'

// Читаем настройки из server/.env (если файла нет — берём значения по умолчанию).
const __dirname = path.dirname(fileURLToPath(import.meta.url))
config({ path: path.join(__dirname, '..', '.env') })

const PORT = Number(process.env.PORT) || 3001

const db = openDb()
console.log(`[db] SQLite: ${DEFAULT_DB_PATH}`)

createApp(db).listen(PORT, () => {
  console.log(`[server] API: http://localhost:${PORT}/api/health`)
})
