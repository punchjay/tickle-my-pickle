import { render } from '@testing-library/react'
import { Fallback, RetryButton } from '@/components/ErrorBoundary.styles'

describe('ErrorBoundary.styles', () => {
  it('Fallback renders a div and matches snapshot', () => {
    const { container } = render(<Fallback />)
    expect(container.firstChild?.nodeName).toBe('DIV')
    expect(container.firstChild).toMatchSnapshot()
  })

  it('RetryButton renders a button and matches snapshot', () => {
    const { container } = render(<RetryButton>Reload</RetryButton>)
    expect(container.firstChild?.nodeName).toBe('BUTTON')
    expect(container.firstChild).toHaveTextContent('Reload')
    expect(container.firstChild).toMatchSnapshot()
  })
})
