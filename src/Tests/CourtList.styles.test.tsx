import { render } from '@testing-library/react'
import {
  Sidebar,
  Header,
  Tabs,
  TabButton,
  List,
  Item,
  CourtNum,
  Info,
  Name,
  Address,
  Rating,
  RatingCount,
  Hours,
  DirectionsLink,
  StarButton,
  EmptySaved,
} from '@/components/CourtList.styles'

describe('CourtList.styles', () => {
  it('Sidebar renders a div', () => {
    const { container } = render(<Sidebar />)
    expect(container.firstChild?.nodeName).toBe('DIV')
  })

  it('Header renders an h2', () => {
    const { container } = render(<Header />)
    expect(container.firstChild?.nodeName).toBe('H2')
  })

  it('Tabs renders a div', () => {
    const { container } = render(<Tabs />)
    expect(container.firstChild?.nodeName).toBe('DIV')
  })

  it('TabButton renders a button (active and inactive)', () => {
    const { container: active } = render(<TabButton $active={true} />)
    expect(active.firstChild?.nodeName).toBe('BUTTON')

    const { container: inactive } = render(<TabButton $active={false} />)
    expect(inactive.firstChild?.nodeName).toBe('BUTTON')
  })

  it('List renders a ul', () => {
    const { container } = render(<List />)
    expect(container.firstChild?.nodeName).toBe('UL')
  })

  it('Item renders an li (unselected and selected)', () => {
    const { container: unselected } = render(<Item $selected={false} />)
    expect(unselected.firstChild?.nodeName).toBe('LI')

    const { container: selected } = render(<Item $selected={true} />)
    expect(selected.firstChild?.nodeName).toBe('LI')
  })

  it('CourtNum renders a span (unselected and selected)', () => {
    const { container: unselected } = render(<CourtNum $selected={false} />)
    expect(unselected.firstChild?.nodeName).toBe('SPAN')

    const { container: selected } = render(<CourtNum $selected={true} />)
    expect(selected.firstChild?.nodeName).toBe('SPAN')
  })

  it('Info renders a div', () => {
    const { container } = render(<Info />)
    expect(container.firstChild?.nodeName).toBe('DIV')
  })

  it('Name renders a p', () => {
    const { container } = render(<Name />)
    expect(container.firstChild?.nodeName).toBe('P')
  })

  it('Address renders a p', () => {
    const { container } = render(<Address />)
    expect(container.firstChild?.nodeName).toBe('P')
  })

  it('Rating renders a p', () => {
    const { container } = render(<Rating />)
    expect(container.firstChild?.nodeName).toBe('P')
  })

  it('RatingCount renders a span', () => {
    const { container } = render(<RatingCount />)
    expect(container.firstChild?.nodeName).toBe('SPAN')
  })

  it('Hours renders a p (open and closed)', () => {
    const { container: open } = render(<Hours $isOpen={true} />)
    expect(open.firstChild?.nodeName).toBe('P')

    const { container: closed } = render(<Hours $isOpen={false} />)
    expect(closed.firstChild?.nodeName).toBe('P')
  })

  it('DirectionsLink renders an a', () => {
    const { container } = render(<DirectionsLink>Directions</DirectionsLink>)
    expect(container.firstChild?.nodeName).toBe('A')
  })

  it('StarButton renders a button (active and inactive)', () => {
    const { container: active } = render(<StarButton $active={true} />)
    expect(active.firstChild?.nodeName).toBe('BUTTON')

    const { container: inactive } = render(<StarButton $active={false} />)
    expect(inactive.firstChild?.nodeName).toBe('BUTTON')
  })

  it('EmptySaved renders a p', () => {
    const { container } = render(<EmptySaved />)
    expect(container.firstChild?.nodeName).toBe('P')
  })
})
