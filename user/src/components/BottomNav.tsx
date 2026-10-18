import { NavLink } from 'react-router'

// Нижнее меню — как в «Я стоик», но без профиля. Философия — по центру.
const tabs = [
  {
    path: '/practice',
    label: 'Практика',
    // Пламя лампады (зула)
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3c2 3 4 4.5 4 7.5a4 4 0 0 1-8 0C8 7.5 10 6 12 3Z" />
        <path d="M5 17h14l-2 4H7z" />
      </svg>
    ),
  },
  {
    path: '/khurals',
    label: 'Хуралы',
    // Колокольчик
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>
    ),
  },
  {
    path: '/philosophy',
    label: 'Философия',
    // Колесо Дхармы
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="2" />
        <path d="M12 3v7M12 14v7M3 12h7M14 12h7M5.6 5.6l5 5M13.4 13.4l5 5M18.4 5.6l-5 5M10.6 13.4l-5 5" />
      </svg>
    ),
  },
  {
    path: '/zurkhai',
    label: 'Зурхай',
    // Луна
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    ),
  },
  {
    path: '/deities',
    label: 'Божества',
    // Лотос
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20c-4 0-8-2.5-9-7 3 0 5.5 1 7 3" />
        <path d="M12 20c4 0 8-2.5 9-7-3 0-5.5 1-7 3" />
        <path d="M12 20c-2.5-2-3.5-5-3.5-8S10 6 12 4c2 2 3.5 5 3.5 8s-1 6-3.5 8Z" />
      </svg>
    ),
  },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) => `nav-item${isActive ? ' nav-item--active' : ''}`}
        >
          <span className="nav-icon">{tab.icon}</span>
          <span className="nav-label">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
