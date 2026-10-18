import { Link } from 'react-router'
import { sections } from '../sections'

// Главный экран админки: карточки всех разделов.
export default function Overview() {
  return (
    <>
      <header className="page-header">
        <div>
          <h1 className="page-header__title">Обзор</h1>
          <p className="page-header__subtitle">Все материалы приложения «Мой дацан»</p>
        </div>
      </header>

      <div className="cards">
        {sections.map((section) => (
          <Link key={section.path} to={section.path} className="card">
            <span className="card__icon">{section.icon}</span>
            <span className="card__title">{section.title}</span>
            <span className="card__text">{section.description}</span>
            <span className="card__stage">этап {section.stage}</span>
          </Link>
        ))}
      </div>
    </>
  )
}
