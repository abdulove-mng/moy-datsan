import type { Section } from '../sections'

// Рабочая область раздела: заголовок, кнопка «Добавить», список записей.
// Пока раздел в разработке, вместо списка — пояснение, на каком этапе он заработает.
export default function SectionPage({ section }: { section: Section }) {
  return (
    <>
      <header className="page-header">
        <div>
          <h1 className="page-header__title">
            {section.icon} {section.title}
          </h1>
          <p className="page-header__subtitle">{section.description}</p>
        </div>
        <button className="btn btn--primary" disabled title={`Заработает на этапе ${section.stage}`}>
          + {section.addLabel}
        </button>
      </header>

      <div className="empty-state">
        <span className="empty-state__icon">{section.icon}</span>
        <p className="empty-state__title">Здесь будет список: «{section.title}»</p>
        <p className="empty-state__text">
          Добавление, редактирование и публикация появятся на этапе {section.stage}.
        </p>
      </div>
    </>
  )
}
