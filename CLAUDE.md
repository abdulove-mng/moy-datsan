# Правила работы над проектом «Мой дацан»

Этот файл читает Claude в начале каждой сессии. Здесь — как мы работаем.

## Режим работы: обычная разработка

Учебный этап (этапы 0–1) пройден: владелец освоил Git/GitHub, конспект — в [docs/GIT_GUIDE.md](docs/GIT_GUIDE.md).
С 2026-10-18 Claude работает самостоятельно:

1. Сам ведёт весь цикл задачи: issue → ветка → коммиты → push → PR → merge → `git pull` в `main`.
2. Владельцу — короткий итог: что сделано, как проверено, ссылка на PR. Без пошаговых объяснений git.
3. Владельца просим только о том, что может сделать лишь он: пароли и секреты (`server/.env`), решения по продукту и контенту.
4. Команды для владельца — в `inline code` на отдельной строке (блоки ```bash у него отображаются пустыми).
5. В конце этапа — обновить [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), отметить [roadmap.md](roadmap.md), тег и Release.

## Процесс: всё через GitHub

Репозиторий: https://github.com/abdulove-mng/moy-datsan (публичный). Ветка `main` защищена на GitHub —
изменения только через Pull Request, только squash merge, ветка удаляется после merge.
Git ходит на GitHub по HTTPS через `gh` (`gh auth setup-git`). Доска задач: https://github.com/users/abdulove-mng/projects/1

Для каждой задачи:

1. Задача есть в **Issues** на GitHub и привязана к **Milestone** (этапу из [roadmap.md](roadmap.md)). Нет задачи — сначала создаём.
2. `git switch main && git pull` — начинаем со свежего `main`.
3. Новая ветка: `feature/<номер-issue>-<кратко>` (для документов — `docs/…`, для исправлений — `fix/…`).
4. Коммиты маленькие и осмысленные, в формате **Conventional Commits** на русском:
   `feat: экран списка глав`, `fix: позиция чтения не сбрасывается`, `docs: …`, `chore: …`, `refactor: …`, `test: …`.
5. `git push -u origin <ветка>` → `gh pr create` с описанием «что сделано / как проверить» и строкой `Closes #N`.
6. Перед merge: `npm run typecheck`, `npm test`, `npm run build`, для UI — проверка во встроенном браузере;
   затем `gh pr merge --squash --delete-branch`.
7. `git switch main && git pull`.
8. Конец этапа — тег `vX.Y.Z` и GitHub Release.

Никогда: коммитить прямо в `main`, делать `git push --force` в `main`, мержить PR с непроходящими проверками.

## Безопасность

- В git **никогда** не попадают: `.env`, пароли, ключи API, ключ подписи APK (`*.jks`, `*.keystore`), база `*.db`,
  PDF книги. Всё это — в `.gitignore`. Для настроек есть `.env.example` без реальных значений.
- Перед каждым коммитом — `git status` и взгляд на список файлов.
- Все изменяющие роуты API — только через `requireAdmin`. Секрет JWT — только из `.env`, без значения по умолчанию в коде.

## Продукт и архитектура

- Требования: [PRD.md](PRD.md). Этапы: [roadmap.md](roadmap.md). Архитектура: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
- **Нет регистрации, входа и профиля** для пользователей. Личные данные — только localStorage на устройстве.
- 5 вкладок: Практика · Хуралы · **Философия** (по центру, книга) · Зурхай · Божества.
- Стек: Node + Express + TypeScript + SQLite (better-sqlite3); React 18 + Vite; чистый CSS (BEM); npm workspaces.
- Тексты о хуралах и божествах сохраняются с `published=0` и статусом «на проверке», пока владелец их не проверит.

## Шаблон «Я стоик»

Разделы «Книга» и «Практика» повторяют приложение владельца «Я стоик» один в один:

- исходники: `/Users/alexander/Documents/Codex/Я стоик/remote-current/2026-09-13`
  (`user/src/pages/Learning.tsx`, `LessonDetail.tsx`, `Practices.tsx`, `PracticeDetail.tsx`, `lib/*`, `index.css`;
  админка `admin/src/…`; сервер `server/src/…`);
- Android: `/Users/alexander/Documents/Codex/Я стоик/android-app`;
- живые страницы для визуальной сверки во встроенном браузере:
  https://tageretutum.beget.app/stoic_app/learning и https://tageretutum.beget.app/stoic_app/practices

Из «Я стоик» **не** переносим: вход по email, профиль, ИИ, стресс-карточки, запасной JWT-секрет в коде,
открытые (без авторизации) админ-роуты, подпись релиза debug-ключом, файлы с паролями.

## Проверка

- Перед PR: `npm run build` и `npm test`.
- UI проверяем во встроенном браузере (`.claude/launch.json`: `user` — 5173, `admin` — 5174, `server` — 3001),
  в мобильном размере экрана (375×812), рядом с «Я стоик».
- Живой сайт «Я стоик» во встроенном браузере зависает. Для сверки запускаем его локальную сборку:
  папка с символической ссылкой `stoic_app` → `Я стоик/remote-current/2026-09-13/user/dist`,
  `python3 -m http.server 5180` → `http://localhost:5180/stoic_app/` (API не будет — «Ошибка сети», но вёрстка видна).
  Сравниваем не только «на глаз», но и размеры через `getComputedStyle` (высота меню, отступы, шрифты).
