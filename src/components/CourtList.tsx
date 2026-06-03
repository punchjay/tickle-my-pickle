import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import type { Court } from '../types'

const Sidebar = styled.div`
  position: absolute;
  left: 16px;
  top: 104px;
  bottom: 16px;
  z-index: 10;
  width: 300px;
  background: var(--pf-card);
  border: 1px solid var(--pf-border-soft);
  border-radius: var(--pf-radius-md);
  box-shadow: 0 2px 12px rgba(30, 45, 73, 0.18);
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
  font-family: var(--pf-font-display);
  font-size: 1.1rem;
  letter-spacing: 0.02em;
  font-weight: 400;
  color: var(--pf-text);
  border-bottom: 1px solid var(--pf-border-soft);
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
  cursor: pointer;
  align-items: flex-start;
  transition: background 0.1s;
  border-bottom: 1px solid var(--pf-border-soft);
  background: ${({ $selected }) =>
    $selected ? 'var(--pf-ivory)' : 'transparent'};

  &:hover {
    background: ${({ $selected }) =>
      $selected ? 'var(--pf-ivory)' : 'var(--pf-surface)'};
  }
`

const CourtNum = styled.span<ItemProps>`
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${({ $selected }) =>
    $selected ? 'var(--pf-primary-hover)' : 'var(--pf-primary)'};
  color: var(--pf-card);
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
  font-weight: 700;
  color: var(--pf-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Address = styled.p`
  margin: 0 0 4px;
  font-size: 12px;
  color: var(--pf-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Rating = styled.p`
  margin: 0 0 2px;
  font-size: 12px;
  color: var(--pf-marigold);
`

const RatingCount = styled.span`
  color: var(--pf-text-muted);
`

interface HoursProps {
  $isOpen: boolean
}

const Hours = styled.p<HoursProps>`
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  /* open: dark green from the mood board's "free" badge text (#3B6D11) */
  color: ${({ $isOpen }) => ($isOpen ? '#3b6d11' : 'var(--pf-tomato)')};
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
      <Header aria-live="polite">
        {courts.length} pickleball {courts.length === 1 ? 'court' : 'courts'}{' '}
        nearby
      </Header>
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
                    {court.isOpen ? 'Open now' : 'Closed'}
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
