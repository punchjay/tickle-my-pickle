import styled from 'styled-components'

export const Sidebar = styled.div`
  position: absolute;
  left: 16px;
  top: 184px;
  bottom: 16px;
  z-index: 10;
  width: 300px;
  background: var(--pf-card);
  border: 1px solid var(--pf-border-soft);
  border-radius: var(--pf-radius-md);
  box-shadow: var(--pf-shadow-card);
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

export const Header = styled.h2`
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

export const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  flex: 1;
`

interface ItemProps {
  $selected: boolean
}

export const Item = styled.li<ItemProps>`
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

export const CourtNum = styled.span<ItemProps>`
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${({ $selected }) =>
    $selected ? 'var(--pf-primary-hover)' : 'var(--pf-primary)'};
  color: var(--pf-card);
  font-size: 0.6875rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
`

export const Info = styled.div`
  flex: 1;
  min-width: 0;
`

export const Name = styled.p`
  margin: 0 0 2px;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--pf-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const Address = styled.p`
  margin: 0 0 4px;
  font-size: 0.75rem;
  color: var(--pf-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const Rating = styled.p`
  margin: 0 0 2px;
  font-size: 0.75rem;
  color: var(--pf-marigold);
`

export const RatingCount = styled.span`
  color: var(--pf-text-muted);
`

interface HoursProps {
  $isOpen: boolean
}

export const Hours = styled.p<HoursProps>`
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ $isOpen }) =>
    $isOpen ? 'var(--pf-open)' : 'var(--pf-closed)'};
`
