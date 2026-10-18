// Разделы админки: из этого списка строятся и меню слева, и страницы справа.
// Чтобы добавить раздел — добавьте строку сюда.
export interface Section {
  path: string
  icon: string
  title: string
  /** Что будет в разделе — показывается, пока раздел в разработке. */
  description: string
  /** Кнопка добавления новой записи. */
  addLabel: string
  stage: number
}

export const sections: Section[] = [
  {
    path: '/chapters',
    icon: '📖',
    title: 'Главы книги',
    description: '«Тибетский буддизм с самых основ»: главы, текст, порядок, публикация.',
    addLabel: 'Добавить главу',
    stage: 3,
  },
  {
    path: '/tests',
    icon: '✅',
    title: 'Тесты к главам',
    description: 'Вопросы, варианты ответов, правильный ответ и пояснение.',
    addLabel: 'Добавить вопрос',
    stage: 3,
  },
  {
    path: '/practices',
    icon: '🪔',
    title: 'Практики',
    description: 'Системные практики: утренний настрой бодхисаттвы, вечерняя рефлексия и другие.',
    addLabel: 'Добавить практику',
    stage: 4,
  },
  {
    path: '/khurals',
    icon: '🔔',
    title: 'Хуралы',
    description: 'Значение хурала, когда проводится, что делать, какая мантра, настрой ума, источники.',
    addLabel: 'Добавить хурал',
    stage: 5,
  },
  {
    path: '/deities',
    icon: '✨',
    title: 'Божества',
    description: 'Кто это, чем помогает, мантра и её смысл, иконография, источники.',
    addLabel: 'Добавить божество',
    stage: 6,
  },
  {
    path: '/zurkhai',
    icon: '🌙',
    title: 'Зурхай',
    description: 'Зурхай по дням: автообновление с источника, ручная правка.',
    addLabel: 'Добавить день',
    stage: 7,
  },
]
