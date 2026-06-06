import type { ComponentProps } from 'react'
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

// Renders CourtList with sensible favorites defaults; individual tests override.
const renderList = (props: Partial<ComponentProps<typeof CourtList>> = {}) =>
  render(
    <CourtList
      courts={courts}
      selectedCourt={null}
      onSelect={() => {}}
      favorites={[]}
      isFavorite={() => false}
      onToggleFavorite={() => {}}
      {...props}
    />,
  )

describe('CourtList', () => {
  beforeEach(() => scrollIntoViewMock.mockClear())

  it('shows tab labels with nearby and saved counts', () => {
    renderList({ favorites: [courts[0]] })
    expect(
      screen.getByRole('tab', { name: /Nearby \(3\)/ }),
    ).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Saved \(1\)/ })).toBeInTheDocument()
  })

  it('calls onSelect with the clicked court', () => {
    const onSelect = vi.fn()
    renderList({ onSelect })
    fireEvent.click(screen.getByText('Riverside Courts'))
    expect(onSelect).toHaveBeenCalledWith(courts[1])
  })

  it('scrolls the selected court into view when selection changes', () => {
    const { rerender } = renderList()
    expect(scrollIntoViewMock).not.toHaveBeenCalled()

    rerender(
      <CourtList
        courts={courts}
        selectedCourt={courts[2]}
        onSelect={() => {}}
        favorites={[]}
        isFavorite={() => false}
        onToggleFavorite={() => {}}
      />,
    )
    expect(scrollIntoViewMock).toHaveBeenCalled()
  })

  it('renders rating only for courts that have one', () => {
    renderList()
    expect(screen.getByText(/4\.5/)).toBeInTheDocument()
    expect(screen.getByText(/\(127\)/)).toBeInTheDocument()
    // courts[0] and courts[1] have ratings; courts[2] does not.
    expect(screen.getAllByText(/★/)).toHaveLength(2)
  })

  it('shows open/closed status only when isOpen is defined', () => {
    renderList()
    expect(screen.getByText('Open now')).toBeInTheDocument() // courts[0]
    expect(screen.getByText('Closed')).toBeInTheDocument() // courts[1]
    // courts[2] has no isOpen, so only two status labels render.
    expect(screen.getAllByText(/Open now|Closed/)).toHaveLength(2)
  })

  it('renders a directions link per court without selecting on click', () => {
    const onSelect = vi.fn()
    renderList({ onSelect })
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

  it('toggles a favorite without selecting the row', () => {
    const onSelect = vi.fn()
    const onToggleFavorite = vi.fn()
    renderList({ onSelect, onToggleFavorite })
    const stars = screen.getAllByRole('button', { name: 'Save court' })
    expect(stars).toHaveLength(3)
    fireEvent.click(stars[0])
    expect(onToggleFavorite).toHaveBeenCalledWith(courts[0])
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('reflects favorite state on the star (aria-pressed + label)', () => {
    renderList({ isFavorite: (id) => id === 'place_2' })
    // Only the favorited court shows the "remove" affordance.
    const remove = screen.getByRole('button', { name: 'Remove from saved' })
    expect(remove).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getAllByRole('button', { name: 'Save court' })).toHaveLength(
      2,
    )
  })

  it('shows saved courts under the Saved tab', () => {
    renderList({
      favorites: [courts[0]],
      isFavorite: (id) => id === 'place_1',
    })
    fireEvent.click(screen.getByRole('tab', { name: /Saved/ }))
    expect(screen.getByText('City Pickleball Club')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Remove from saved' }),
    ).toBeInTheDocument()
    // Riverside is a nearby result but not saved, so it's hidden here.
    expect(screen.queryByText('Riverside Courts')).not.toBeInTheDocument()
  })

  it('shows an empty state under Saved when there are no favorites', () => {
    renderList()
    fireEvent.click(screen.getByRole('tab', { name: /Saved/ }))
    expect(screen.getByText(/No saved courts yet/)).toBeInTheDocument()
  })

  it('renders high-confidence amenity badges only', () => {
    const tagged: Court[] = [
      // park-typed → Outdoor + Free (both high).
      {
        id: 'p1',
        name: 'Lincoln Park',
        address: '1 Park Rd',
        types: ['park'],
        location: { lat: 0, lng: 0 },
      },
      // "rec center" → Indoor (high).
      {
        id: 'p2',
        name: 'Community Rec Center',
        address: '2 Rec Ave',
        location: { lat: 0, lng: 0 },
      },
      // "club" is only a low-confidence indoor hint → no badge in Phase 1.
      {
        id: 'p3',
        name: 'The Pickle Club',
        address: '3 Dink Ln',
        location: { lat: 0, lng: 0 },
      },
    ]
    renderList({ courts: tagged })
    expect(screen.getByText('Outdoor')).toBeInTheDocument()
    expect(screen.getByText('Free')).toBeInTheDocument()
    expect(screen.getByText('Indoor')).toBeInTheDocument()
    // The low-confidence club hint shows nothing.
    expect(screen.queryByText('Lighted')).not.toBeInTheDocument()
  })
})
