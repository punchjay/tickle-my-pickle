import { Component, type ErrorInfo, type ReactNode } from 'react'
import { errorBoundary } from '../appData'
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
          <h1>{errorBoundary.heading}</h1>
          <p>{errorBoundary.message}</p>
          <RetryButton onClick={() => window.location.reload()}>
            {errorBoundary.retry}
          </RetryButton>
        </Fallback>
      )
    }
    return this.props.children
  }
}
