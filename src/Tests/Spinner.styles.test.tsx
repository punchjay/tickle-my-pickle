import { render } from '@testing-library/react'
import { Spinner, FullPageCenter } from '@/components/Spinner.styles'

describe('Spinner.styles', () => {
  it('Spinner renders a span', () => {
    const { container } = render(<Spinner />)
    expect(container.firstChild?.nodeName).toBe('SPAN')
  })

  it('FullPageCenter renders a div', () => {
    const { container } = render(<FullPageCenter />)
    expect(container.firstChild?.nodeName).toBe('DIV')
  })
})
