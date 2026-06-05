import styled, { keyframes } from 'styled-components'

/* Entrance fade for the results panel; replays on each search because the
   list is remounted via a per-search key. */
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: none;
  }
`

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
  animation: ${fadeIn} 0.4s ease both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

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

export const Tabs = styled.div`
  display: flex;
  gap: 4px;
  padding: 8px 8px 0;
  flex-shrink: 0;
`

interface TabProps {
  $active: boolean
}

export const TabButton = styled.button<TabProps>`
  flex: 1;
  border: none;
  border-radius: var(--pf-radius-sm) var(--pf-radius-sm) 0 0;
  padding: 8px 10px;
  font-family: var(--pf-font-body);
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  background: ${({ $active }) => ($active ? 'var(--pf-ivory)' : 'transparent')};
  color: ${({ $active }) => ($active ? 'var(--pf-text)' : 'var(--pf-text-muted)')};

  &:hover {
    color: var(--pf-text);
  }
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

export const DirectionsLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--pf-link);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

interface StarProps {
  $active: boolean
}

// Star toggle. Colors come straight from the theme: active is the terracotta
// primary (filled) — kept distinct from the marigold ratings accent — and
// inactive is a muted caramel outline.
export const StarButton = styled.button<StarProps>`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  margin: -4px -4px 0 4px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${({ $active }) =>
    $active ? 'var(--pf-primary)' : 'var(--pf-text-muted)'};
  transition:
    color 0.12s,
    transform 0.12s;

  &:hover {
    color: var(--pf-primary);
    transform: scale(1.1);
  }
`

export const EmptySaved = styled.p`
  margin: 0;
  padding: 24px 20px;
  text-align: center;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--pf-text-muted);
`
