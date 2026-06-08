import { useEffect, useRef, useState } from 'react'
import type { Court } from '../types'
import { inferAmenities } from '../amenities'
import type { AmenityFilter } from '../amenities'
import { amenities, courtList } from '../appData'
import {
  Sidebar,
  Tabs,
  TabButton,
  FilterBar,
  FilterButton,
  List,
  Item,
  CourtNum,
  Info,
  Name,
  Address,
  Rating,
  RatingCount,
  Hours,
  Badges,
  Badge,
  DirectionsLink,
  StarButton,
  EmptySaved,
  EmptyFiltered,
  HiddenNote,
  ShowAllButton,
} from './CourtList.styles'

interface Props {
  courts: Court[]
  // Total nearby results before the amenity filter — drives the Nearby tab
  // count and the "N hidden" math. `courts` is the already-filtered list.
  nearbyTotal: number
  amenityFilter: AmenityFilter
  onFilterChange: (filter: AmenityFilter) => void
  selectedCourt: Court | null
  onSelect: (court: Court) => void
  favorites: Court[]
  isFavorite: (id: string) => boolean
  onToggleFavorite: (court: Court) => void
}

// The segmented filter options, paired with their labels.
const filterOptions: { value: AmenityFilter; label: string }[] = [
  { value: 'all', label: courtList.filterAll },
  { value: 'indoor', label: courtList.filterIndoor },
  { value: 'outdoor', label: courtList.filterOutdoor },
]

// Google Maps "Universal" directions URL — opens turn-by-turn to the court in
// a new tab. Pinning the place id keeps it exact even when names collide.
const directionsUrl = (court: Court) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    court.name,
  )}&destination_place_id=${encodeURIComponent(court.id)}`

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth={filled ? 0 : 1.8}
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
)

type Tab = 'nearby' | 'saved'

const CourtList = ({
  courts,
  nearbyTotal,
  amenityFilter,
  onFilterChange,
  selectedCourt,
  onSelect,
  favorites,
  isFavorite,
  onToggleFavorite,
}: Props) => {
  const [tab, setTab] = useState<Tab>('nearby')
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
  const hiddenCount = nearbyTotal - courts.length

  useEffect(() => {
    if (tab !== 'nearby' || !selectedCourt) return
    const idx = courts.indexOf(selectedCourt)
    itemRefs.current[idx]?.scrollIntoView({
      block: 'nearest',
      behavior: 'smooth',
    })
  }, [selectedCourt, courts, tab])

  const star = (court: Court) => {
    const active = isFavorite(court.id)
    return (
      <StarButton
        type="button"
        $active={active}
        aria-label={active ? courtList.unsave : courtList.save}
        aria-pressed={active}
        onClick={(e) => {
          e.stopPropagation()
          onToggleFavorite(court)
        }}
      >
        <StarIcon filled={active} />
      </StarButton>
    )
  }

  const details = (court: Court) => {
    // Show high-confidence amenity guesses only — the same bar the Nearby
    // filter uses. See docs/amenities-tagging-plan.md.
    const tags = inferAmenities(court).filter((t) => t.confidence === 'high')
    return (
      <Info>
        <Name>{court.name}</Name>
        {tags.length > 0 && (
          <Badges title={amenities.disclaimer}>
            {tags.map((t) => (
              <Badge key={t.kind} $kind={t.kind}>
                {amenities[t.kind]}
              </Badge>
            ))}
          </Badges>
        )}
        <Address>{court.address}</Address>
        {court.rating != null && (
          <Rating>
            ★ {court.rating}
            {court.userRatingCount != null && (
              <RatingCount> ({court.userRatingCount})</RatingCount>
            )}
          </Rating>
        )}
        {court.isOpen != null && (
          <Hours $isOpen={court.isOpen}>
            {court.isOpen ? courtList.openNow : courtList.closed}
          </Hours>
        )}
        <DirectionsLink
          href={directionsUrl(court)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          {courtList.directions}
        </DirectionsLink>
      </Info>
    )
  }

  return (
    <Sidebar>
      <Tabs role="tablist">
        <TabButton
          type="button"
          role="tab"
          aria-selected={tab === 'nearby'}
          $active={tab === 'nearby'}
          onClick={() => setTab('nearby')}
        >
          {courtList.nearbyTab} ({nearbyTotal})
        </TabButton>
        <TabButton
          type="button"
          role="tab"
          aria-selected={tab === 'saved'}
          $active={tab === 'saved'}
          onClick={() => setTab('saved')}
        >
          {courtList.savedTab} ({favorites.length})
        </TabButton>
      </Tabs>

      {tab === 'nearby' ? (
        <>
          <FilterBar role="group" aria-label={courtList.filterLabel}>
            {filterOptions.map(({ value, label }) => (
              <FilterButton
                key={value}
                type="button"
                $active={amenityFilter === value}
                aria-pressed={amenityFilter === value}
                onClick={() => onFilterChange(value)}
              >
                {label}
              </FilterButton>
            ))}
          </FilterBar>
          {courts.length === 0 ? (
            <EmptyFiltered>
              {courtList.emptyFiltered}{' '}
              <ShowAllButton
                type="button"
                onClick={() => onFilterChange('all')}
              >
                {courtList.showAll}
              </ShowAllButton>
            </EmptyFiltered>
          ) : (
            <List aria-label={courtList.heading(courts.length)}>
              {courts.map((court, i) => {
                const selected = court === selectedCourt
                return (
                  <Item
                    key={court.id ?? i}
                    ref={(el) => {
                      itemRefs.current[i] = el
                    }}
                    $selected={selected}
                    onClick={() => onSelect(court)}
                  >
                    <CourtNum $selected={selected}>{i + 1}</CourtNum>
                    {details(court)}
                    {star(court)}
                  </Item>
                )
              })}
            </List>
          )}
          {hiddenCount > 0 && courts.length > 0 && (
            <HiddenNote>
              {courtList.hiddenByFilter(hiddenCount)}{' '}
              <ShowAllButton
                type="button"
                onClick={() => onFilterChange('all')}
              >
                {courtList.showAll}
              </ShowAllButton>
            </HiddenNote>
          )}
        </>
      ) : favorites.length === 0 ? (
        <EmptySaved>{courtList.emptySaved}</EmptySaved>
      ) : (
        <List aria-label={courtList.savedTab}>
          {favorites.map((court) => (
            <Item key={court.id} $selected={false}>
              {details(court)}
              {star(court)}
            </Item>
          ))}
        </List>
      )}
    </Sidebar>
  )
}

export default CourtList
