import { render, screen, fireEvent } from '@testing-library/react'
import ErrorBoundary from '@/components/ErrorBoundary'

function Bomb({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error('test explosion')
  return <span>safe content</span>
}

describe('ErrorBoundary', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    // Suppress React's own error output so test logs stay clean
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <span>safe content</span>
      </ErrorBoundary>,
    )
    expect(screen.getByText('safe content')).toBeInTheDocument()
  })

  it('renders the fallback UI when a child throws', () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow />
      </ErrorBoundary>,
    )
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('The app hit an unexpected error.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument()
  })

  it('does not render children after a child throws', () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow />
      </ErrorBoundary>,
    )
    expect(screen.queryByText('safe content')).not.toBeInTheDocument()
  })

  it('logs the error via componentDidCatch', () => {
    const error = new Error('test explosion')
    function Thrower() {
      throw error
    }
    render(
      <ErrorBoundary>
        <Thrower />
      </ErrorBoundary>,
    )
    expect(consoleSpy).toHaveBeenCalledWith(
      'Unhandled error in component tree:',
      error,
      expect.objectContaining({ componentStack: expect.any(String) }),
    )
  })

  it('calls window.location.reload when the Reload button is clicked', () => {
    const reload = vi.fn()
    vi.stubGlobal('location', { ...window.location, reload })

    render(
      <ErrorBoundary>
        <Bomb shouldThrow />
      </ErrorBoundary>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Reload' }))
    expect(reload).toHaveBeenCalledOnce()

    vi.unstubAllGlobals()
  })
})
