// Centralized UI copy — single source of truth for user-facing strings.
// Components import from here rather than hard-coding text, so wording,
// tone, and future localization all live in one place. Dynamic strings
// (e.g. pluralized counts) are exposed as small functions.

export const app = {
  wordmark: 'Tickle My Pickle',
  tagline: 'Find pickleball courts near you',
} as const

export const search = {
  placeholder: 'Search City, ZIP, or Hood',
  submitLabel: 'Search',
  inputLabel: 'Search location',
  nearMe: 'Near me',
} as const

export const courtList = {
  // "1 pickleball court nearby" / "3 pickleball courts nearby"
  heading: (count: number) =>
    `${count} pickleball ${count === 1 ? 'court' : 'courts'} nearby`,
  openNow: 'Open now',
  closed: 'Closed',
  directions: 'Directions',
  nearbyTab: 'Nearby',
  savedTab: 'Saved',
  save: 'Save court',
  unsave: 'Remove from saved',
  emptySaved: 'No saved courts yet — tap the star on a court to save it.',
} as const

// Amenity badge labels + the honest "these are guesses" note. Keyed by the
// AmenityKind in src/amenities.ts so a tag maps straight to its label.
export const amenities = {
  indoor: 'Indoor',
  outdoor: 'Outdoor',
  lighted: 'Lighted',
  free: 'Free',
  disclaimer: 'Tags are best guesses from the listing name',
} as const

export const footer = {
  email: 'punchjay@gmail.com',
  contactLabel: 'Get in touch',
  githubUrl: 'https://github.com/punchjay',
  githubLabel: 'GitHub profile',
} as const

export const notFound = {
  code: '404',
  heading: 'Page not found',
  message: 'That page dinked out of bounds.',
  homeLink: 'Back to the courts',
} as const

export const errorBoundary = {
  heading: 'Something went wrong',
  message: 'The app hit an unexpected error.',
  retry: 'Reload',
} as const

// Free-text query sent to the Places text search.
export const searchQuery = 'pickleball court'

// Fallback name when a Place has no displayName.
export const unknownCourt = 'Unknown court'

// User-facing error messages surfaced by usePickleballMap.
export const errors = {
  missingApiKey:
    'Add your VITE_GOOGLE_MAPS_API_KEY to .env.local and restart the dev server.',
  mapsLoadFailed: 'Failed to load Google Maps. Check your API key.',
  noCourtsFound: 'No pickleball courts found nearby. Try a different location.',
  searchFailed: 'Search failed. Please try again.',
  locationNotFound: 'Could not find that location. Try again.',
  geolocationDenied: 'Location access denied. Enter a zip code instead.',
} as const
