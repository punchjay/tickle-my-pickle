import { Component, type ErrorInfo, type ReactNode } from 'react'
import styled from 'styled-components'

const Fallback = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 100svh;
  padding: 24px;
  text-align: center;
  font-family: system-ui, sans-serif;
  color: #374151;
`

const RetryButton = styled.button`
  background: #16a34a;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 9px 18px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
`

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled error in component tree:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Fallback role="alert">
          <h1>Something went wrong</h1>
          <p>The app hit an unexpected error.</p>
          <RetryButton onClick={() => window.location.reload()}>
            Reload
          </RetryButton>
        </Fallback>
      )
    }
    return this.props.children
  }
}
