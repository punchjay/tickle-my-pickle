import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { fadeIn, stripedBackdrop } from './backdrop.styles'

export const Wrapper = styled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100svh;
  padding: 24px;
  text-align: center;
  background: var(--pf-bg);
  color: var(--pf-text);
  font-family: var(--pf-font-body);

  /* Shared striped backdrop — mirrors the finder canvas. */
  &::before {
    ${stripedBackdrop}
  }

  @media (prefers-reduced-motion: reduce) {
    &::before {
      animation: none;
    }
  }
`

// Card holding the 404 content, floating above the striped backdrop.
export const Card = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  max-width: min(420px, calc(100vw - 48px));
  padding: 32px 28px;
  background: var(--pf-card);
  border: 1px solid var(--pf-border-soft);
  border-radius: var(--pf-radius-md);
  box-shadow: var(--pf-shadow-card);
  animation: ${fadeIn} 0.9s ease 0.15s both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

// "4 🥒 4" — the pickleball SVG stands in for the middle zero, sized to the
// digits and tilted so it reads as "dinked out of bounds".
export const Code = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.12em;
  margin: 0;
  font-family: var(--pf-font-display);
  font-size: 7rem;
  line-height: 0.5;
  color: var(--pf-primary);

  svg {
    width: 0.82em;
    height: 0.82em;
    transform: rotate(-12deg);
  }
`

export const Heading = styled.h1`
  margin: 0;
  font-size: 2.5rem;
`

export const Message = styled.p`
  margin: 0;
  max-width: 30ch;
  font-size: 1rem;
  line-height: 0.5;
  color: var(--pf-text-muted);
`

export const HomeLink = styled(Link)`
  margin-top: 20px;
  background: var(--pf-court-blue);
  color: var(--pf-card);
  border-radius: var(--pf-radius-sm);
  padding: 11px 20px;
  font-size: 0.9375rem;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.15s;

  &:hover {
    background: var(--pf-midnight);
    text-decoration: none;
  }
`
