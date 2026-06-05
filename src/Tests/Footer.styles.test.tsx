import { render } from '@testing-library/react'
import { Wrapper, FooterLink } from '@/components/Footer.styles'

describe('Footer.styles', () => {
  it('Wrapper renders a footer', () => {
    const { container } = render(<Wrapper />)
    expect(container.firstChild?.nodeName).toBe('FOOTER')
  })

  it('FooterLink renders an anchor', () => {
    const { container } = render(<FooterLink />)
    expect(container.firstChild?.nodeName).toBe('A')
  })
})
