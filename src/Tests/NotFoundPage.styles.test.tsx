import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Wrapper, Code, Message, HomeLink } from '@/pages/NotFoundPage.styles'

describe('NotFoundPage.styles', () => {
  it('Wrapper renders a div', () => {
    const { container } = render(<Wrapper />)
    expect(container.firstChild?.nodeName).toBe('DIV')
  })

  it('Code renders a p', () => {
    const { container } = render(<Code>404</Code>)
    expect(container.firstChild?.nodeName).toBe('P')
  })

  it('Message renders a p', () => {
    const { container } = render(<Message>Lost</Message>)
    expect(container.firstChild?.nodeName).toBe('P')
  })

  it('HomeLink renders an anchor', () => {
    const { container } = render(
      <MemoryRouter>
        <HomeLink to="/">Home</HomeLink>
      </MemoryRouter>,
    )
    expect(container.firstChild?.nodeName).toBe('A')
  })
})
