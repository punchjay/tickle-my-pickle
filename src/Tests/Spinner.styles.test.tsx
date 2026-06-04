import { render } from '@testing-library/react'
import { Spinner, FullPageCenter } from '@/components/Spinner.styles'

describe('Spinner.styles', () => {
  it('Spinner renders a span and matches snapshot', () => {
    const { container } = render(<Spinner />)
    expect(container.firstChild?.nodeName).toBe('SPAN')
    expect(container.firstChild).toMatchSnapshot()
  })

  it('FullPageCenter renders a div and matches snapshot', () => {
    const { container } = render(<FullPageCenter />)
    expect(container.firstChild?.nodeName).toBe('DIV')
    expect(container.firstChild).toMatchSnapshot()
  })
})
