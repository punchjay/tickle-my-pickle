import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import { GlobalStyle } from './GlobalStyle.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalStyle />
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
