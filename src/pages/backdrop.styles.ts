import { css, keyframes } from 'styled-components'

// Shared retro backdrop used by the finder canvas and the 404 page.

/* Slide one full stripe period (5 bands × 36px = 180px) along the 110deg
   gradient direction — d = (sin110°, -cos110°) ≈ (0.940, 0.342) — so the
   pattern lands exactly on itself and loops seamlessly. GPU-accelerated
   transform on an oversized layer keeps the motion smooth and visible. */
export const stripeSlide = keyframes`
  from {
    transform: translate(0, 0);
  }
  to {
    transform: translate(-169.1px, -61.6px);
  }
`

/* Gentle entrance: the striped backdrop and the cards fade up on first paint
   rather than popping in. Stagger via per-element animation-delay for a soft
   cascade. */
export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

/* Mood board "diagonal sunbeam stripes" under a translucent ivory wash for a
   low-contrast texture. Meant for an oversized, absolutely-positioned
   pseudo-element that drifts via transform; the overscan (inset: -240px) keeps
   the translate from ever revealing an uncovered edge. Consumers add their own
   `content`/positioning context and any conditional `display`. */
export const stripedBackdrop = css`
  content: '';
  position: absolute;
  inset: -240px;
  background:
    linear-gradient(rgba(239, 231, 211, 0.1), rgba(239, 231, 211, 0.1)),
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
  will-change: transform;
`
