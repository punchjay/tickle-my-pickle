import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import {
  Wrapper,
  Card,
  Code,
  Heading,
  Message,
  HomeLink,
} from '@/pages/NotFoundPage.styles'

describe('NotFoundPage.styles', () => {
  it('Wrapper renders a div', () => {
    const { container } = render(<Wrapper />)
    expect(container.firstChild?.nodeName).toBe('DIV')
  })

  it('Card renders a div', () => {
    const { container } = render(<Card />)
    expect(container.firstChild?.nodeName).toBe('DIV')
  })

  it('Code renders a p', () => {
    const { container } = render(<Code>404</Code>)
    expect(container.firstChild?.nodeName).toBe('P')
  })

  it('Heading renders an h1', () => {
    const { container } = render(<Heading>Page not found</Heading>)
    expect(container.firstChild?.nodeName).toBe('H1')
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
