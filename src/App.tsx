import { Routes, Route } from 'react-router-dom'
import FinderPage from './pages/FinderPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<FinderPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
