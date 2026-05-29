import { render } from '@testing-library/react'
import CourtList from '@/components/CourtList'
import type { Court } from '@/types'

Element.prototype.scrollIntoView = vi.fn()

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
  it('matches snapshot with no selection', () => {
    const { container } = render(
      <CourtList courts={courts} selectedCourt={null} onSelect={() => {}} />,
    )
    expect(container).toMatchSnapshot()
  })

  it('matches snapshot with a selected court', () => {
    const { container } = render(
      <CourtList
        courts={courts}
        selectedCourt={courts[1]}
        onSelect={() => {}}
      />,
    )
    expect(container).toMatchSnapshot()
  })
})
