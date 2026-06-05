import styled, { keyframes } from 'styled-components'

/* Slide one full stripe period (5 bands × 36px = 180px) along the 110deg
   gradient direction — d = (sin110°, -cos110°) ≈ (0.940, 0.342) — so the
   pattern lands exactly on itself and loops seamlessly. GPU-accelerated
   transform on an oversized layer keeps the motion smooth and visible. */
const stripeSlide = keyframes`
  from {
    transform: translate(0, 0);
  }
  to {
    transform: translate(-169.1px, -61.6px);
  }
`

/* Gentle entrance: the striped backdrop and the cards fade up on first paint
   rather than popping in. Staggered via per-element animation-delay (stripes →
   cards → footer) for a soft cascade. */
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

export const AppWrapper = styled.div<{ $mapVisible: boolean }>`
  position: relative;
  width: 100vw;
  height: 100svh;
  overflow: hidden;
  background: var(--pf-bg);

  /* Mood board "diagonal sunbeam stripes" shown before the map loads, under a
     translucent ivory wash for a low-contrast texture. Lives on an oversized
     pseudo-element that drifts via transform, then is dropped once the map is
     visible (it covers this anyway). */
  &::before {
    content: '';
    position: absolute;
    /* Overscan so the translate never reveals an uncovered edge. */
    inset: -240px;
    background:
      linear-gradient(
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
      );
    animation:
      ${fadeIn} 0.9s ease both,
      ${stripeSlide} 12s linear infinite;
    display: ${({ $mapVisible }) => ($mapVisible ? 'none' : 'block')};
    will-change: transform;
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

export const HeaderCard = styled.header`
  background: var(--pf-card);
  border: 1px solid var(--pf-border-soft);
  border-radius: var(--pf-radius-md);
  padding: 12px 16px;
  box-shadow: var(--pf-shadow-card);
  text-align: center;
`

export const Wordmark = styled.h1<{ $mapVisible: boolean }>`
  margin: 0;
  font-family: var(--pf-font-accent);
  font-weight: 600;
  font-size: 2.4rem;
  line-height: 1.1;
  letter-spacing: 0;
  /* Lighter court blue on the pre-search canvas, midnight once the map shows. */
  color: ${({ $mapVisible }) =>
    $mapVisible ? 'var(--pf-midnight)' : 'var(--pf-court-blue)'};
  transition: color 0.4s ease;
`

export const Tagline = styled.p`
  margin: 2px 0 0;
  font-size: 1rem;
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
