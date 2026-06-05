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
} from './CourtList.styles'

interface Props {
  courts: Court[]
  selectedCourt: Court | null
  onSelect: (court: Court) => void
}

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
              </Info>
            </Item>
          )
        })}
      </List>
    </Sidebar>
  )
}

export default CourtList
