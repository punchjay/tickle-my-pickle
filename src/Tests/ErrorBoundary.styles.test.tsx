import { render } from '@testing-library/react'
import { Fallback, RetryButton } from '@/components/ErrorBoundary.styles'

describe('ErrorBoundary.styles', () => {
  it('Fallback renders a div', () => {
    const { container } = render(<Fallback />)
    expect(container.firstChild?.nodeName).toBe('DIV')
  })

  it('RetryButton renders a button', () => {
    const { container } = render(<RetryButton>Reload</RetryButton>)
    expect(container.firstChild?.nodeName).toBe('BUTTON')
    expect(container.firstChild).toHaveTextContent('Reload')
  })
})
