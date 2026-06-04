import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Fallback, RetryButton } from './ErrorBoundary.styles'

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
