import { Navigate, Route, Routes } from 'react-router'
import Sidebar from './components/Sidebar'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import EditorSandbox from './pages/EditorSandbox'
import Overview from './pages/Overview'
import SectionPage from './pages/SectionPage'
import { sections } from './sections'

// Без входа — только экран пароля. После входа — меню слева, рабочая область справа.
export default function App() {
  const { status } = useAuth()

  if (status === 'checking') return <div className="splash">☸</div>
  if (status === 'signed-out') return <Login />

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-content">
        <Routes>
          <Route path="/" element={<Overview />} />
          {sections.map((section) => (
            <Route key={section.path} path={section.path} element={<SectionPage section={section} />} />
          ))}
          <Route path="/editor" element={<EditorSandbox />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
