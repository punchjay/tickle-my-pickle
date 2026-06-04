import { render } from '@testing-library/react'
import {
  Wrapper,
  SearchForm,
  IconButton,
  Spinner,
  SearchInput,
  Divider,
  NearMeButton,
} from '@/components/LocationInput.styles'

describe('LocationInput.styles', () => {
  it('Wrapper renders a div and matches snapshot', () => {
    const { container } = render(<Wrapper />)
    expect(container.firstChild?.nodeName).toBe('DIV')
    expect(container.firstChild).toMatchSnapshot()
  })

  it('SearchForm renders a form and matches snapshot', () => {
    const { container } = render(<SearchForm />)
    expect(container.firstChild?.nodeName).toBe('FORM')
    expect(container.firstChild).toMatchSnapshot()
  })

  it('IconButton renders a button and matches snapshot', () => {
    const { container } = render(<IconButton />)
    expect(container.firstChild?.nodeName).toBe('BUTTON')
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Spinner renders a span and matches snapshot', () => {
    const { container } = render(<Spinner />)
    expect(container.firstChild?.nodeName).toBe('SPAN')
    expect(container.firstChild).toMatchSnapshot()
  })

  it('SearchInput renders an input and matches snapshot', () => {
    const { container } = render(<SearchInput />)
    expect(container.firstChild?.nodeName).toBe('INPUT')
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Divider renders a span and matches snapshot', () => {
    const { container } = render(<Divider />)
    expect(container.firstChild?.nodeName).toBe('SPAN')
    expect(container.firstChild).toMatchSnapshot()
  })

  it('NearMeButton renders a button and matches snapshot', () => {
    const { container } = render(<NearMeButton />)
    expect(container.firstChild?.nodeName).toBe('BUTTON')
    expect(container.firstChild).toMatchSnapshot()
  })
})
