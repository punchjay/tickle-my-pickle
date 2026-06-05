import { useEffect, useRef } from 'react'
import type { Court } from '../types'
import { courtList } from '../appData'
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
  DirectionsLink,
} from './CourtList.styles'

interface Props {
  courts: Court[]
  selectedCourt: Court | null
  onSelect: (court: Court) => void
}

// Google Maps "Universal" directions URL — opens turn-by-turn to the court in
// a new tab. Pinning the place id keeps it exact even when names collide.
const directionsUrl = (court: Court) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    court.name,
  )}&destination_place_id=${encodeURIComponent(court.id)}`

const CourtList = ({ courts, selectedCourt, onSelect }: Props) => {
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    if (!selectedCourt) return
    const idx = courts.indexOf(selectedCourt)
    itemRefs.current[idx]?.scrollIntoView({
      block: 'nearest',
      behavior: 'smooth',
    })
  }, [selectedCourt, courts])

  return (
    <Sidebar>
      <Header aria-live="polite">{courtList.heading(courts.length)}</Header>
      <List>
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
              <Info>
                <Name>{court.name}</Name>
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
            </Item>
          )
        })}
      </List>
    </Sidebar>
  )
}

export default CourtList
