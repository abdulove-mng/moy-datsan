import { config as loadEnv } from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createApp } from './app.js'
import { loadConfig } from './config.js'
import { DEFAULT_DB_PATH, openDb } from './db.js'

// Читаем настройки из server/.env.
const __dirname = path.dirname(fileURLToPath(import.meta.url))
loadEnv({ path: path.join(__dirname, '..', '.env') })

let config
try {
  config = loadConfig()
} catch (error) {
  console.error(`[config] ${(error as Error).message}`)
  process.exit(1)
}

const db = openDb()
console.log(`[db] SQLite: ${DEFAULT_DB_PATH}`)

createApp(db, config).listen(config.port, () => {
  console.log(`[server] API: http://localhost:${config.port}/api/health`)
})
