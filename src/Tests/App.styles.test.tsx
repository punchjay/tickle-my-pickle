import { render } from '@testing-library/react'
import {
  AppWrapper,
  MapDiv,
  OverlayTop,
  HeaderCard,
  Wordmark,
  Tagline,
  ErrorBanner,
} from '@/App.styles'

describe('App.styles', () => {
  it('AppWrapper renders a div and matches snapshot', () => {
    const { container } = render(<AppWrapper />)
    expect(container.firstChild?.nodeName).toBe('DIV')
    expect(container.firstChild).toMatchSnapshot()
  })

  it('MapDiv renders a div and matches snapshot when hidden', () => {
    const { container } = render(<MapDiv $visible={false} />)
    expect(container.firstChild?.nodeName).toBe('DIV')
    expect(container.firstChild).toMatchSnapshot()
  })

  it('MapDiv renders a div and matches snapshot when visible', () => {
    const { container } = render(<MapDiv $visible={true} />)
    expect(container.firstChild?.nodeName).toBe('DIV')
    expect(container.firstChild).toMatchSnapshot()
  })

  it('OverlayTop renders a div and matches snapshot', () => {
    const { container } = render(<OverlayTop />)
    expect(container.firstChild?.nodeName).toBe('DIV')
    expect(container.firstChild).toMatchSnapshot()
  })

  it('HeaderCard renders a header and matches snapshot', () => {
    const { container } = render(<HeaderCard />)
    expect(container.firstChild?.nodeName).toBe('HEADER')
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Wordmark renders an h1 and matches snapshot', () => {
    const { container } = render(<Wordmark>Tickle My Pickle</Wordmark>)
    expect(container.firstChild?.nodeName).toBe('H1')
    expect(container.firstChild).toHaveTextContent('Tickle My Pickle')
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Tagline renders a p and matches snapshot', () => {
    const { container } = render(<Tagline>Find pickleball courts near you</Tagline>)
    expect(container.firstChild?.nodeName).toBe('P')
    expect(container.firstChild).toHaveTextContent('Find pickleball courts near you')
    expect(container.firstChild).toMatchSnapshot()
  })

  it('ErrorBanner renders a p and matches snapshot', () => {
    const { container } = render(<ErrorBanner>Something went wrong</ErrorBanner>)
    expect(container.firstChild?.nodeName).toBe('P')
    expect(container.firstChild).toHaveTextContent('Something went wrong')
    expect(container.firstChild).toMatchSnapshot()
  })
})
