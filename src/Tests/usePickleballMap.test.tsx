import { useEffect } from 'react'
import { render, waitFor, act } from '@testing-library/react'

// The loader is a no-op in tests; the hook only needs its promises to resolve.
vi.mock('@googlemaps/js-api-loader', () => ({
  setOptions: vi.fn(),
  importLibrary: vi.fn().mockResolvedValue(undefined),
}))

// Minimal Place/Geocoder shapes the hook actually reads.
interface FakePlace {
  id: string
  displayName: string
  formattedAddress: string
  location: { lat: () => number; lng: () => number }
  rating?: number
  userRatingCount?: number
  regularOpeningHours?: object
  isOpen: () => Promise<boolean | undefined>
}
interface FakeGeoResult {
  geometry: { location: { lat: () => number; lng: () => number } }
}

// Per-test overridable implementations behind the global google mock.
let searchByTextImpl: () => Promise<{ places: FakePlace[] }>
let geocodeImpl: (
  req: unknown,
  cb: (results: FakeGeoResult[] | null, status: string) => void,
) => void

function makePlace(over: Partial<FakePlace> = {}): FakePlace {
  return {
    id: 'place_1',
    displayName: 'Court One',
    formattedAddress: '1 A St',
    location: { lat: () => 39.78, lng: () => -89.65 },
    rating: 4.5,
    userRatingCount: 100,
    regularOpeningHours: {},
    isOpen: () => Promise.resolve<boolean | undefined>(true),
    ...over,
  }
}

class FakeMap {
  setCenter = vi.fn()
  setZoom = vi.fn()
  panTo = vi.fn()
}
class FakeGeocoder {
  geocode(req: unknown, cb: (r: FakeGeoResult[] | null, s: string) => void) {
    geocodeImpl(req, cb)
  }
}
class FakeAdvancedMarker {
  map: unknown
  // Real AdvancedMarkerElement extends HTMLElement; the hook listens via
  // addEventListener('gmp-click', ...).
  addEventListener = vi.fn()
  constructor(opts: { map: unknown }) {
    this.map = opts.map
  }
}
class FakePin {
  element = document.createElement('div')
}

function installGoogle() {
  const mock = {
    maps: {
      Map: FakeMap,
      Geocoder: FakeGeocoder,
      places: { Place: { searchByText: () => searchByTextImpl() } },
      marker: { AdvancedMarkerElement: FakeAdvancedMarker, PinElement: FakePin },
    },
  }
  ;(globalThis as { google?: unknown }).google = mock
}

type HookApi = ReturnType<
  (typeof import('@/hooks/usePickleballMap'))['usePickleballMap']
>

let hookApi!: HookApi
let useHook!: (typeof import('@/hooks/usePickleballMap'))['usePickleballMap']

function Harness() {
  const api = useHook()
  const { mapDivRef } = api
  // Capture the latest hook return in an effect (not during render) so tests
  // can read updated state without violating the rules of hooks.
  useEffect(() => {
    hookApi = api
  })
  return <div ref={mapDivRef} />
}

beforeEach(async () => {
  vi.resetModules()
  vi.stubEnv('VITE_GOOGLE_MAPS_API_KEY', 'test-key')
  installGoogle()
  // Sensible defaults; individual tests override as needed.
  geocodeImpl = (_req, cb) =>
    cb([{ geometry: { location: { lat: () => 39.78, lng: () => -89.65 } } }], 'OK')
  searchByTextImpl = () => Promise.resolve({ places: [makePlace()] })
  ;({ usePickleballMap: useHook } = await import('@/hooks/usePickleballMap'))
})

afterEach(() => {
  vi.unstubAllEnvs()
})

async function renderReady() {
  render(<Harness />)
  await waitFor(() => expect(hookApi.mapsReady).toBe(true))
}

async function runSearch(zip = '90210') {
  act(() => hookApi.handleSearch(zip))
  await waitFor(() => expect(hookApi.loading).toBe(false))
}

describe('usePickleballMap', () => {
  it('geocodes a zip, searches, and maps Places into Courts', async () => {
    searchByTextImpl = () =>
      Promise.resolve({
        places: [
          makePlace(),
          makePlace({
            id: 'place_2',
            displayName: 'Court Two',
            regularOpeningHours: undefined, // no hours -> isOpen undefined
          }),
        ],
      })
    await renderReady()
    await runSearch()

    expect(hookApi.error).toBeNull()
    expect(hookApi.courts).toHaveLength(2)
    expect(hookApi.courts[0]).toMatchObject({
      id: 'place_1',
      name: 'Court One',
      address: '1 A St',
      rating: 4.5,
      userRatingCount: 100,
      isOpen: true,
    })
    expect(hookApi.courts[1].isOpen).toBeUndefined()
  })

  it('keeps the search alive when one place isOpen() rejects (regression)', async () => {
    searchByTextImpl = () =>
      Promise.resolve({
        places: [
          makePlace({ id: 'a', isOpen: () => Promise.reject(new Error('x')) }),
          makePlace({ id: 'b', isOpen: () => Promise.resolve(true) }),
        ],
      })
    await renderReady()
    await runSearch()

    // Before the fix, one rejecting isOpen() rejected the whole Promise.all
    // and surfaced "Search failed". Now it degrades to undefined per court.
    expect(hookApi.error).toBeNull()
    expect(hookApi.courts).toHaveLength(2)
    expect(hookApi.courts[0].isOpen).toBeUndefined()
    expect(hookApi.courts[1].isOpen).toBe(true)
  })

  it('reports when no courts are found', async () => {
    searchByTextImpl = () => Promise.resolve({ places: [] })
    await renderReady()
    await runSearch()

    expect(hookApi.courts).toHaveLength(0)
    expect(hookApi.error).toMatch(/no pickleball courts found/i)
  })

  it('reports a generic failure when the search throws', async () => {
    searchByTextImpl = () => Promise.reject(new Error('boom'))
    await renderReady()
    await runSearch()

    expect(hookApi.courts).toHaveLength(0)
    expect(hookApi.error).toBe('Search failed. Please try again.')
  })

  it('reports when the location cannot be geocoded', async () => {
    geocodeImpl = (_req, cb) => cb(null, 'ZERO_RESULTS')
    await renderReady()
    await runSearch('nowhere')

    expect(hookApi.courts).toHaveLength(0)
    expect(hookApi.error).toMatch(/could not find that location/i)
  })
})
