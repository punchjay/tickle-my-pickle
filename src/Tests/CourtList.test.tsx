import { render, screen, fireEvent } from '@testing-library/react'
import CourtList from '@/components/CourtList'
import type { Court } from '@/types'

const scrollIntoViewMock = vi.fn()
Element.prototype.scrollIntoView = scrollIntoViewMock

const courts: Court[] = [
  {
    id: 'place_1',
    name: 'City Pickleball Club',
    address: '123 Main St, Springfield',
    rating: 4.5,
    userRatingCount: 127,
    isOpen: true,
    location: { lat: 39.78, lng: -89.65 },
  },
  {
    id: 'place_2',
    name: 'Riverside Courts',
    address: '456 Oak Ave, Springfield',
    rating: 3.8,
    userRatingCount: 42,
    isOpen: false,
    location: { lat: 39.79, lng: -89.66 },
  },
  {
    id: 'place_3',
    name: 'Community Rec Center',
    address: '789 Elm Blvd, Springfield',
    location: { lat: 39.8, lng: -89.67 },
  },
]

describe('CourtList', () => {
  beforeEach(() => scrollIntoViewMock.mockClear())

  it('shows a pluralized count in the header', () => {
    const { rerender } = render(
      <CourtList courts={courts} selectedCourt={null} onSelect={() => {}} />,
    )
    expect(screen.getByText(/3 pickleball courts nearby/)).toBeInTheDocument()

    rerender(
      <CourtList courts={[courts[0]]} selectedCourt={null} onSelect={() => {}} />,
    )
    expect(screen.getByText(/1 pickleball court nearby/)).toBeInTheDocument()

    rerender(<CourtList courts={[]} selectedCourt={null} onSelect={() => {}} />)
    expect(screen.getByText(/0 pickleball courts nearby/)).toBeInTheDocument()
  })

  it('calls onSelect with the clicked court', () => {
    const onSelect = vi.fn()
    render(
      <CourtList courts={courts} selectedCourt={null} onSelect={onSelect} />,
    )
    fireEvent.click(screen.getByText('Riverside Courts'))
    expect(onSelect).toHaveBeenCalledWith(courts[1])
  })

  it('scrolls the selected court into view when selection changes', () => {
    const { rerender } = render(
      <CourtList courts={courts} selectedCourt={null} onSelect={() => {}} />,
    )
    expect(scrollIntoViewMock).not.toHaveBeenCalled()

    rerender(
      <CourtList courts={courts} selectedCourt={courts[2]} onSelect={() => {}} />,
    )
    expect(scrollIntoViewMock).toHaveBeenCalled()
  })

  it('renders rating only for courts that have one', () => {
    render(
      <CourtList courts={courts} selectedCourt={null} onSelect={() => {}} />,
    )
    expect(screen.getByText(/4\.5/)).toBeInTheDocument()
    expect(screen.getByText(/\(127\)/)).toBeInTheDocument()
    // courts[0] and courts[1] have ratings; courts[2] does not.
    expect(screen.getAllByText(/★/)).toHaveLength(2)
  })

  it('renders a directions link per court without selecting on click', () => {
    const onSelect = vi.fn()
    render(
      <CourtList courts={courts} selectedCourt={null} onSelect={onSelect} />,
    )
    const links = screen.getAllByRole('link', { name: 'Directions' })
    expect(links).toHaveLength(3)
    expect(links[0]).toHaveAttribute('target', '_blank')
    expect(links[0]).toHaveAttribute('rel', 'noopener noreferrer')
    expect(links[0].getAttribute('href')).toContain(
      'destination_place_id=place_1',
    )
    // Clicking the link should not bubble up to select the row.
    fireEvent.click(links[0])
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('shows open/closed status only when isOpen is defined', () => {
    render(
      <CourtList courts={courts} selectedCourt={null} onSelect={() => {}} />,
    )
    expect(screen.getByText('Open now')).toBeInTheDocument() // courts[0]
    expect(screen.getByText('Closed')).toBeInTheDocument() // courts[1]
    // courts[2] has no isOpen, so only two status labels render.
    expect(screen.getAllByText(/Open now|Closed/)).toHaveLength(2)
  })
})
