import styled from 'styled-components'
import { fadeIn, stripedBackdrop } from './backdrop.styles'

export const AppWrapper = styled.div<{ $mapVisible: boolean }>`
  position: relative;
  width: 100vw;
  height: 100svh;
  overflow: hidden;
  background: var(--pf-bg);

  /* Shared striped backdrop, shown before the map loads then dropped once the
     map is visible (it covers this anyway). */
  &::before {
    ${stripedBackdrop}
    display: ${({ $mapVisible }) => ($mapVisible ? 'none' : 'block')};
  }

  @media (prefers-reduced-motion: reduce) {
    &::before {
      animation: none;
    }
  }
`

export const MapDiv = styled.div<{ $visible: boolean }>`
  position: absolute;
  inset: 0;
  /* Kept mounted (the map inits against this node) but hidden until a search
     returns results, so the ivory canvas shows first. */
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  transition: opacity 0.4s ease;
`

export const OverlayTop = styled.div<{ $mapVisible: boolean }>`
  position: absolute;
  left: 50%;
  /* Sits just above center before a search, then slides to the top once the
     map is visible. */
  top: ${({ $mapVisible }) => ($mapVisible ? '16px' : '40%')};
  transform: ${({ $mapVisible }) =>
    $mapVisible ? 'translate(-50%, 0)' : 'translate(-50%, -50%)'};
  transition:
    top 0.5s ease,
    transform 0.5s ease;
  /* Fade the header card + search pill in just after the backdrop. */
  animation: ${fadeIn} 0.9s ease 0.15s both;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  width: min(400px, calc(100vw - 32px));

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

// The header is the pre-search hero only — it unmounts once the map loads
// (results mode reclaims the vertical space), so it has a single fixed size.
export const HeaderCard = styled.header`
  background: var(--pf-card);
  border: 1px solid var(--pf-border-soft);
  border-radius: var(--pf-radius-md);
  padding: 12px 16px;
  box-shadow: var(--pf-shadow-card);
  text-align: center;
`

export const Wordmark = styled.h1`
  margin: 0;
  font-family: var(--pf-font-accent);
  font-weight: 600;
  font-size: 2.4rem;
  line-height: 1.1;
  letter-spacing: 0;
  color: var(--pf-court-blue);
`

export const Tagline = styled.p`
  margin: 2px 0 0;
  font-size: 1rem;
  font-weight: 500;
  color: var(--pf-text-muted);
`

// Keeps an accessible page <h1> in results mode, where the visible hero header
// is unmounted. Standard screen-reader-only clip pattern.
export const VisuallyHiddenTitle = styled.h1`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`

export const ErrorBanner = styled.p`
  margin: 0;
  background: var(--pf-card);
  border-left: 4px solid var(--pf-tomato);
  border-radius: var(--pf-radius-sm);
  padding: 10px 14px;
  font-size: 0.8125rem;
  color: var(--pf-text);
  box-shadow: 0 2px 8px rgba(30, 45, 73, 0.18);
`
