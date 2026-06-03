import styled from 'styled-components'

export const AppWrapper = styled.div`
  position: relative;
  width: 100vw;
  height: 100svh;
  overflow: hidden;
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

export const OverlayTop = styled.div`
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
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
  font-size: 1.7rem;
  line-height: 1.1;
  letter-spacing: 0;
  color: var(--pf-midnight);
`

export const Tagline = styled.p`
  margin: 2px 0 0;
  font-size: 12px;
  font-weight: 500;
  color: var(--pf-text-muted);
`

export const ErrorBanner = styled.p`
  margin: 0;
  background: var(--pf-card);
  border-left: 4px solid var(--pf-tomato);
  border-radius: var(--pf-radius-sm);
  padding: 10px 14px;
  font-size: 13px;
  color: var(--pf-text);
  box-shadow: 0 2px 8px rgba(30, 45, 73, 0.18);
`
