import { NavLink } from 'react-router'
import { sections } from '../sections'
import ServerStatus from './ServerStatus'

// Боковое меню админки — как в «Я стоик»: логотип, разделы, внизу статус сервера.
export default function Sidebar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `sidebar__link${isActive ? ' sidebar__link--active' : ''}`

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <span className="sidebar__logo">☸</span>
        <div>
          <div className="sidebar__title">Мой дацан</div>
          <div className="sidebar__subtitle">Админ-кабинет</div>
        </div>
      </div>

      <nav className="sidebar__nav">
        <NavLink to="/" end className={linkClass}>
          <span className="sidebar__icon">🏠</span>
          <span>Обзор</span>
        </NavLink>
        {sections.map((section) => (
          <NavLink key={section.path} to={section.path} className={linkClass}>
            <span className="sidebar__icon">{section.icon}</span>
            <span>{section.title}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <ServerStatus />
      </div>
    </aside>
  )
}
