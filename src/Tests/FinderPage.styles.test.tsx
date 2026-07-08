import { render } from '@testing-library/react'
import {
  AppWrapper,
  MapDiv,
  OverlayTop,
  HeaderCard,
  Wordmark,
  Tagline,
  VisuallyHiddenTitle,
  ErrorBanner,
} from '@/pages/FinderPage.styles'

describe('FinderPage.styles', () => {
  it('AppWrapper renders a div with the striped backdrop before the map loads', () => {
    const { container } = render(<AppWrapper $mapVisible={false} />)
    expect(container.firstChild?.nodeName).toBe('DIV')
  })

  it('AppWrapper drops the backdrop once the map is visible', () => {
    const { container } = render(<AppWrapper $mapVisible={true} />)
    expect(container.firstChild?.nodeName).toBe('DIV')
  })

  it('MapDiv renders a div when hidden', () => {
    const { container } = render(<MapDiv $visible={false} />)
    expect(container.firstChild?.nodeName).toBe('DIV')
  })

  it('MapDiv renders a div when visible', () => {
    const { container } = render(<MapDiv $visible={true} />)
    expect(container.firstChild?.nodeName).toBe('DIV')
  })

  it('OverlayTop renders centered above the middle before the map loads', () => {
    const { container } = render(<OverlayTop $mapVisible={false} />)
    expect(container.firstChild?.nodeName).toBe('DIV')
  })

  it('OverlayTop slides to the top once the map is visible', () => {
    const { container } = render(<OverlayTop $mapVisible={true} />)
    expect(container.firstChild?.nodeName).toBe('DIV')
  })

  it('HeaderCard renders a header', () => {
    const { container } = render(<HeaderCard />)
    expect(container.firstChild?.nodeName).toBe('HEADER')
  })

  it('Wordmark renders an h1', () => {
    const { container } = render(<Wordmark>Tickle My Pickle</Wordmark>)
    expect(container.firstChild?.nodeName).toBe('H1')
    expect(container.firstChild).toHaveTextContent('Tickle My Pickle')
  })

  it('Tagline renders a p', () => {
    const { container } = render(
      <Tagline>Find pickleball courts near you</Tagline>,
    )
    expect(container.firstChild?.nodeName).toBe('P')
    expect(container.firstChild).toHaveTextContent(
      'Find pickleball courts near you',
    )
  })

  it('VisuallyHiddenTitle renders an h1', () => {
    const { container } = render(
      <VisuallyHiddenTitle>Tickle My Pickle</VisuallyHiddenTitle>,
    )
    expect(container.firstChild?.nodeName).toBe('H1')
    expect(container.firstChild).toHaveTextContent('Tickle My Pickle')
  })

  it('ErrorBanner renders a p', () => {
    const { container } = render(
      <ErrorBanner>Something went wrong</ErrorBanner>,
    )
    expect(container.firstChild?.nodeName).toBe('P')
    expect(container.firstChild).toHaveTextContent('Something went wrong')
  })
})
