import styled from 'styled-components'

// Floating credit pill, bottom-center, in the same "card over the canvas"
// language as the header card and search pill. Shown on the pre-search canvas
// (FinderPage hides it once results/map/sidebar appear).
export const Wrapper = styled.footer`
  position: absolute;
  left: 50%;
  bottom: 16px;
  transform: translateX(-50%);
  z-index: 10;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: calc(100vw - 32px);
  background: var(--pf-card);
  border: 1px solid var(--pf-border-soft);
  border-radius: var(--pf-radius-pill);
  padding: 6px 14px;
  box-shadow: var(--pf-shadow-card);
  font-size: 0.8125rem;
  color: var(--pf-text-muted);
  white-space: nowrap;
`

export const FooterLink = styled.a`
  display: inline-flex;
  align-items: center;
  color: var(--pf-link);
  text-decoration: none;
  transition: color 0.15s ease;

  &:hover {
    color: var(--pf-primary);
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid var(--pf-link);
    outline-offset: 2px;
    border-radius: 2px;
  }
`
