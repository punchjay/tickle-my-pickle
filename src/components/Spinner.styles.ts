import styled from 'styled-components'

// Shared spinning indicator. Used inline in the search pill (LocationInput)
// and, centered via FullPageCenter, as the <Suspense> fallback for lazy routes.
export const Spinner = styled.span`
  width: 16px;
  height: 16px;
  border: 2px solid var(--pf-border);
  border-top-color: var(--pf-primary);
  border-radius: 50%;
  animation: pf-spin 0.7s linear infinite;

  @keyframes pf-spin {
    to {
      transform: rotate(360deg);
    }
  }
`

// Full-viewport centering for the route-level loading fallback.
export const FullPageCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`
