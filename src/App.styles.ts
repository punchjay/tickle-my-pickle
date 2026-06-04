import styled from 'styled-components'

export const AppWrapper = styled.div<{ $mapVisible: boolean }>`
  position: relative;
  width: 100vw;
  height: 100svh;
  overflow: hidden;
  /* Mood board "diagonal sunbeam stripes" shown before the map loads, under a
     translucent ivory wash for a low-contrast texture. Dropped once the map is
     visible (it covers this anyway). */
  background: ${({ $mapVisible }) =>
    $mapVisible
      ? 'var(--pf-bg)'
      : `linear-gradient(
          rgba(239, 231, 211, 0.1),
          rgba(239, 231, 211, 0.1)
        ),
        repeating-linear-gradient(
          110deg,
          var(--pf-marigold) 0 36px,
          var(--pf-tomato) 36px 72px,
          var(--pf-court-blue) 72px 108px,
          var(--pf-midnight) 108px 144px,
          var(--pf-ivory) 144px 180px
        )`};
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
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  width: min(400px, calc(100vw - 32px));
`

export const HeaderCard = styled.header`
  background: var(--pf-card);
  border: 1px solid var(--pf-border-soft);
  border-radius: var(--pf-radius-md);
  padding: 12px 16px;
  box-shadow: 0 2px 12px rgba(30, 45, 73, 0.18);
  text-align: center;
`

export const Wordmark = styled.h1`
  margin: 0;
  font-family: var(--pf-font-accent);
  font-weight: 600;
  font-size: 2.4rem;
  line-height: 1.1;
  letter-spacing: 0;
  color: var(--pf-midnight);
`

export const Tagline = styled.p`
  margin: 2px 0 0;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--pf-text-muted);
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
