import { useEffect, useRef } from 'react'
import styled from 'styled-components'

type Court = google.maps.places.PlaceResult

const Sidebar = styled.div`
  position: absolute;
  left: 16px;
  top: 104px;
  bottom: 16px;
  z-index: 10;
  width: 300px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 640px) {
    left: 0;
    right: 0;
    top: auto;
    bottom: 0;
    width: 100%;
    border-radius: 16px 16px 0 0;
    max-height: 45svh;
  }
`

const Header = styled.h2`
  margin: 0;
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  border-bottom: 1px solid #f3f4f6;
  flex-shrink: 0;
`

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  flex: 1;
`

interface ItemProps {
  $selected: boolean
}

const Item = styled.li<ItemProps>`
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  align-items: flex-start;
  transition: background 0.1s;
  background: ${({ $selected }) => ($selected ? '#f0fdf4' : 'transparent')};

  &:hover {
    background: ${({ $selected }) => ($selected ? '#f0fdf4' : '#f9fafb')};
  }
`

const CourtNum = styled.span<ItemProps>`
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${({ $selected }) => ($selected ? '#15803d' : '#16a34a')};
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
`

const Info = styled.div`
  flex: 1;
  min-width: 0;
`

const Name = styled.p`
  margin: 0 0 2px;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Address = styled.p`
  margin: 0 0 4px;
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Rating = styled.p`
  margin: 0 0 2px;
  font-size: 12px;
  color: #d97706;
`

const RatingCount = styled.span`
  color: #9ca3af;
`

interface HoursProps {
  $isOpen: boolean
}

const Hours = styled.p<HoursProps>`
  margin: 0;
  font-size: 12px;
  font-weight: 500;
  color: ${({ $isOpen }) => ($isOpen ? '#16a34a' : '#ef4444')};
`

interface Props {
  courts: Court[]
  selectedCourt: Court | null
  onSelect: (court: Court) => void
}

export default function CourtList({ courts, selectedCourt, onSelect }: Props) {
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
      <Header>
        {courts.length} pickleball {courts.length === 1 ? 'court' : 'courts'}{' '}
        nearby
      </Header>
      <List>
        {courts.map((court, i) => {
          const selected = court === selectedCourt
          const isOpen = court.opening_hours?.isOpen() ?? false
          return (
            <Item
              key={court.place_id ?? i}
              ref={(el) => {
                itemRefs.current[i] = el
              }}
              $selected={selected}
              onClick={() => onSelect(court)}
            >
              <CourtNum $selected={selected}>{i + 1}</CourtNum>
              <Info>
                <Name>{court.name}</Name>
                <Address>{court.vicinity}</Address>
                {court.rating != null && (
                  <Rating>
                    ★ {court.rating}
                    {court.user_ratings_total != null && (
                      <RatingCount> ({court.user_ratings_total})</RatingCount>
                    )}
                  </Rating>
                )}
                {court.opening_hours != null && (
                  <Hours $isOpen={isOpen}>
                    {isOpen ? 'Open now' : 'Closed'}
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
