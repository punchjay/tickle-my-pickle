import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Wrapper, Code, Message, HomeLink } from '@/pages/NotFoundPage.styles'

describe('NotFoundPage.styles', () => {
  it('Wrapper renders a div and matches snapshot', () => {
    const { container } = render(<Wrapper />)
    expect(container.firstChild?.nodeName).toBe('DIV')
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Code renders a p and matches snapshot', () => {
    const { container } = render(<Code>404</Code>)
    expect(container.firstChild?.nodeName).toBe('P')
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Message renders a p and matches snapshot', () => {
    const { container } = render(<Message>Lost</Message>)
    expect(container.firstChild?.nodeName).toBe('P')
    expect(container.firstChild).toMatchSnapshot()
  })

  it('HomeLink renders an anchor and matches snapshot', () => {
    const { container } = render(
      <MemoryRouter>
        <HomeLink to="/">Home</HomeLink>
      </MemoryRouter>,
    )
    expect(container.firstChild?.nodeName).toBe('A')
    expect(container.firstChild).toMatchSnapshot()
  })
})
