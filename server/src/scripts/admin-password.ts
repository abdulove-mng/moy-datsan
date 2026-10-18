import { randomBytes } from 'node:crypto'
import { createInterface } from 'node:readline/promises'
import { hashPassword } from '../auth/password.js'

// Помощник настройки: спрашивает пароль администратора и печатает строки для server/.env.
// Запуск: npm run admin:password -w @datsan/server
// Сам пароль никуда не записывается — в .env попадает только его хеш.

const rl = createInterface({ input: process.stdin, output: process.stdout })
const password = (await rl.question('Придумайте пароль администратора (от 10 символов): ')).trim()
rl.close()

if (password.length < 10) {
  console.error('Пароль слишком короткий — нужно от 10 символов. Запустите ещё раз.')
  process.exit(1)
}

console.log('\nСкопируйте эти строки в файл server/.env (замените старые, если есть):\n')
console.log(`ADMIN_PASSWORD_HASH=${hashPassword(password)}`)
console.log(`JWT_SECRET=${randomBytes(48).toString('base64url')}`)
console.log('\nПароль запомните или сохраните в менеджере паролей — восстановить его по хешу нельзя.')
