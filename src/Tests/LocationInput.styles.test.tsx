import { render } from '@testing-library/react'
import {
  Wrapper,
  SearchForm,
  IconButton,
  SearchInput,
  Divider,
  NearMeButton,
} from '@/components/LocationInput.styles'

describe('LocationInput.styles', () => {
  it('Wrapper renders a div', () => {
    const { container } = render(<Wrapper />)
    expect(container.firstChild?.nodeName).toBe('DIV')
  })

  it('SearchForm renders a form', () => {
    const { container } = render(<SearchForm />)
    expect(container.firstChild?.nodeName).toBe('FORM')
  })

  it('IconButton renders a button', () => {
    const { container } = render(<IconButton />)
    expect(container.firstChild?.nodeName).toBe('BUTTON')
  })

  it('SearchInput renders an input', () => {
    const { container } = render(<SearchInput />)
    expect(container.firstChild?.nodeName).toBe('INPUT')
  })

  it('Divider renders a span', () => {
    const { container } = render(<Divider />)
    expect(container.firstChild?.nodeName).toBe('SPAN')
  })

  it('NearMeButton renders a button', () => {
    const { container } = render(<NearMeButton />)
    expect(container.firstChild?.nodeName).toBe('BUTTON')
  })
})
