import { render } from '@testing-library/react'
import {
  Sidebar,
  Header,
  List,
  Item,
  CourtNum,
  Info,
  Name,
  Address,
  Rating,
  RatingCount,
  Hours,
} from '@/components/CourtList.styles'

describe('CourtList.styles', () => {
  it('Sidebar renders a div and matches snapshot', () => {
    const { container } = render(<Sidebar />)
    expect(container.firstChild?.nodeName).toBe('DIV')
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Header renders an h2 and matches snapshot', () => {
    const { container } = render(<Header />)
    expect(container.firstChild?.nodeName).toBe('H2')
    expect(container.firstChild).toMatchSnapshot()
  })

  it('List renders a ul and matches snapshot', () => {
    const { container } = render(<List />)
    expect(container.firstChild?.nodeName).toBe('UL')
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Item renders an li and matches snapshot (unselected and selected)', () => {
    const { container: unselected } = render(<Item $selected={false} />)
    expect(unselected.firstChild?.nodeName).toBe('LI')
    expect(unselected.firstChild).toMatchSnapshot()

    const { container: selected } = render(<Item $selected={true} />)
    expect(selected.firstChild).toMatchSnapshot()
  })

  it('CourtNum renders a span and matches snapshot (unselected and selected)', () => {
    const { container: unselected } = render(<CourtNum $selected={false} />)
    expect(unselected.firstChild?.nodeName).toBe('SPAN')
    expect(unselected.firstChild).toMatchSnapshot()

    const { container: selected } = render(<CourtNum $selected={true} />)
    expect(selected.firstChild).toMatchSnapshot()
  })

  it('Info renders a div and matches snapshot', () => {
    const { container } = render(<Info />)
    expect(container.firstChild?.nodeName).toBe('DIV')
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Name renders a p and matches snapshot', () => {
    const { container } = render(<Name />)
    expect(container.firstChild?.nodeName).toBe('P')
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Address renders a p and matches snapshot', () => {
    const { container } = render(<Address />)
    expect(container.firstChild?.nodeName).toBe('P')
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Rating renders a p and matches snapshot', () => {
    const { container } = render(<Rating />)
    expect(container.firstChild?.nodeName).toBe('P')
    expect(container.firstChild).toMatchSnapshot()
  })

  it('RatingCount renders a span and matches snapshot', () => {
    const { container } = render(<RatingCount />)
    expect(container.firstChild?.nodeName).toBe('SPAN')
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Hours renders a p and matches snapshot (open and closed)', () => {
    const { container: open } = render(<Hours $isOpen={true} />)
    expect(open.firstChild?.nodeName).toBe('P')
    expect(open.firstChild).toMatchSnapshot()

    const { container: closed } = render(<Hours $isOpen={false} />)
    expect(closed.firstChild).toMatchSnapshot()
  })
})
