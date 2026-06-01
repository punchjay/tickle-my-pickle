import { render } from '@testing-library/react'
import {
  AppWrapper,
  MapDiv,
  OverlayTop,
  ErrorBanner,
} from '@/App.styles'

describe('App.styles', () => {
  it('AppWrapper renders a div and matches snapshot', () => {
    const { container } = render(<AppWrapper />)
    expect(container.firstChild?.nodeName).toBe('DIV')
    expect(container.firstChild).toMatchSnapshot()
  })

  it('MapDiv renders a div and matches snapshot', () => {
    const { container } = render(<MapDiv />)
    expect(container.firstChild?.nodeName).toBe('DIV')
    expect(container.firstChild).toMatchSnapshot()
  })

  it('OverlayTop renders a div and matches snapshot', () => {
    const { container } = render(<OverlayTop />)
    expect(container.firstChild?.nodeName).toBe('DIV')
    expect(container.firstChild).toMatchSnapshot()
  })

  it('ErrorBanner renders a p and matches snapshot', () => {
    const { container } = render(<ErrorBanner>Something went wrong</ErrorBanner>)
    expect(container.firstChild?.nodeName).toBe('P')
    expect(container.firstChild).toHaveTextContent('Something went wrong')
    expect(container.firstChild).toMatchSnapshot()
  })
})
