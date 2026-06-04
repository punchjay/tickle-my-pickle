import { Spinner, FullPageCenter } from './Spinner.styles'

// Centered full-viewport loader — the <Suspense> fallback for lazy routes.
export default function RouteFallback() {
  return (
    <FullPageCenter role="status" aria-label="Loading">
      <Spinner />
    </FullPageCenter>
  )
}
