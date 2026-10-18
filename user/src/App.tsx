import { Navigate, Route, Routes } from 'react-router'
import BottomNav from './components/BottomNav'
import StubPage from './pages/StubPage'

// Адреса страниц (маршруты) — по одному на каждую вкладку нижнего меню.
export default function App() {
  return (
    <div className="app">
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/philosophy" replace />} />
          <Route
            path="/practice"
            element={<StubPage emoji="🪔" title="Практика" subtitle="Утренний настрой и вечерняя рефлексия — этап 4" />}
          />
          <Route
            path="/khurals"
            element={<StubPage emoji="🔔" title="Хуралы" subtitle="Что означает хурал и что на нём делать — этап 5" />}
          />
          <Route
            path="/philosophy"
            element={<StubPage emoji="📖" title="Философия" subtitle="«Тибетский буддизм с самых основ» — главы появятся на этапе 3" />}
          />
          <Route
            path="/zurkhai"
            element={<StubPage emoji="🌙" title="Зурхай" subtitle="Благоприятные и неблагоприятные дела на каждый день — этап 7" />}
          />
          <Route
            path="/deities"
            element={<StubPage emoji="✨" title="Божества" subtitle="Будды, бодхисаттвы и защитники простым языком — этап 6" />}
          />
          <Route path="*" element={<Navigate to="/philosophy" replace />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}
