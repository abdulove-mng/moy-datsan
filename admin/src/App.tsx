import { Navigate, Route, Routes } from 'react-router'
import Sidebar from './components/Sidebar'
import Overview from './pages/Overview'
import SectionPage from './pages/SectionPage'
import { sections } from './sections'

// Раскладка админки: меню слева, рабочая область справа.
export default function App() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-content">
        <Routes>
          <Route path="/" element={<Overview />} />
          {sections.map((section) => (
            <Route key={section.path} path={section.path} element={<SectionPage section={section} />} />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
