import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import FinderPage from './pages/FinderPage'
import RouteFallback from './components/Spinner'

// FinderPage is the primary route, kept eager. The 404 is rarely hit, so it's
// code-split behind <Suspense> with the shared spinner as the fallback.
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<FinderPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
