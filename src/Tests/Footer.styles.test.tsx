import { render } from '@testing-library/react'
import { Wrapper, FooterLink } from '@/components/Footer.styles'

describe('Footer.styles', () => {
  it('Wrapper renders a footer and matches snapshot', () => {
    const { container } = render(<Wrapper />)
    expect(container.firstChild?.nodeName).toBe('FOOTER')
    expect(container.firstChild).toMatchSnapshot()
  })

  it('FooterLink renders an anchor and matches snapshot', () => {
    const { container } = render(<FooterLink />)
    expect(container.firstChild?.nodeName).toBe('A')
    expect(container.firstChild).toMatchSnapshot()
  })
})
