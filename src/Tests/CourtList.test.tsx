import { render } from '@testing-library/react'
import CourtList from '@/components/CourtList'
import type { Court } from '@/App'

Element.prototype.scrollIntoView = vi.fn()

const courts = [
  {
    place_id: 'place_1',
    name: 'City Pickleball Club',
    vicinity: '123 Main St, Springfield',
    rating: 4.5,
    user_ratings_total: 127,
    opening_hours: { isOpen: () => true },
  },
  {
    place_id: 'place_2',
    name: 'Riverside Courts',
    vicinity: '456 Oak Ave, Springfield',
    rating: 3.8,
    user_ratings_total: 42,
    opening_hours: { isOpen: () => false },
  },
  {
    place_id: 'place_3',
    name: 'Community Rec Center',
    vicinity: '789 Elm Blvd, Springfield',
  },
] as unknown as Court[]

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
