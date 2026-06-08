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
// Every marker the hook builds is registered here so tests can assert the
// pins stay in lockstep with the displayed list. A marker is "live" while its
// .map is set; the hook nulls .map when it tears a pin down.
let createdMarkers: FakeAdvancedMarker[] = []
const liveMarkers = () => createdMarkers.filter((m) => m.map != null)

class FakeAdvancedMarker {
  map: unknown
  // Real AdvancedMarkerElement extends HTMLElement; the hook listens via
  // addEventListener('gmp-click', ...).
  addEventListener = vi.fn()
  constructor(opts: { map: unknown }) {
    this.map = opts.map
    createdMarkers.push(this)
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
      marker: {
        AdvancedMarkerElement: FakeAdvancedMarker,
        PinElement: FakePin,
      },
    },
  }
  ;(globalThis as { google?: unknown }).google = mock
}

type HookApi = ReturnType<
  (typeof import('@/hooks/usePickleballMap'))['usePickleballMap']
>

let hookApi!: HookApi
let useHook!: (typeof import('@/hooks/usePickleballMap'))['usePickleballMap']

const Harness = () => {
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
  createdMarkers = []
  installGoogle()
  // Sensible defaults; individual tests override as needed.
  geocodeImpl = (_req, cb) =>
    cb(
      [{ geometry: { location: { lat: () => 39.78, lng: () => -89.65 } } }],
      'OK',
    )
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
    expect(hookApi.mapShown).toBe(true) // map fades in once results land
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

  it('keeps prior results during a re-search so the overlay does not slide back (regression)', async () => {
    await renderReady()
    await runSearch()
    expect(hookApi.courts).toHaveLength(1)
    const seqAfterFirst = hookApi.searchSeq

    // Second search whose Places call we resolve by hand, to observe the
    // in-flight state. Previously the hook cleared courts up front, which
    // flipped courts.length to 0 and slid the header/search overlay down.
    let resolveSearch!: (v: { places: FakePlace[] }) => void
    searchByTextImpl = () =>
      new Promise<{ places: FakePlace[] }>((res) => {
        resolveSearch = res
      })

    act(() => hookApi.handleSearch('98101'))
    await waitFor(() => expect(hookApi.loading).toBe(true))
    // While the new search is in flight, the old results remain on screen.
    expect(hookApi.courts).toHaveLength(1)
    expect(hookApi.courts[0].name).toBe('Court One')

    await act(async () => {
      resolveSearch({
        places: [makePlace({ id: 'place_2', displayName: 'Court Two' })],
      })
    })
    await waitFor(() => expect(hookApi.loading).toBe(false))
    // New results swap in place, without ever emptying.
    expect(hookApi.courts).toHaveLength(1)
    expect(hookApi.courts[0].name).toBe('Court Two')
    // The list's fade key advances so its entrance animation replays.
    expect(hookApi.searchSeq).toBe(seqAfterFirst + 1)
  })

  it('filters the displayed list and re-pins markers in lockstep (Phase 2)', async () => {
    searchByTextImpl = () =>
      Promise.resolve({
        places: [
          makePlace({ id: 'in', displayName: 'Downtown Gym' }), // indoor (high)
          makePlace({ id: 'out', displayName: 'Riverside Park' }), // outdoor (high)
        ],
      })
    await renderReady()
    await runSearch()

    expect(hookApi.courts).toHaveLength(2)
    expect(hookApi.displayedCourts).toHaveLength(2)
    expect(liveMarkers()).toHaveLength(2) // one pin per displayed court

    // Filter to indoor: only the gym shows, the full result set is untouched,
    // and the map re-pins to match the shortened list.
    act(() => hookApi.setAmenityFilter('indoor'))
    await waitFor(() => expect(hookApi.displayedCourts).toHaveLength(1))
    expect(hookApi.displayedCourts[0].id).toBe('in')
    expect(hookApi.courts).toHaveLength(2)
    expect(liveMarkers()).toHaveLength(1)

    // Clearing the filter restores every court and pin.
    act(() => hookApi.setAmenityFilter('all'))
    await waitFor(() => expect(hookApi.displayedCourts).toHaveLength(2))
    expect(liveMarkers()).toHaveLength(2)
  })

  it('resets the amenity filter on a fresh search', async () => {
    await renderReady()
    await runSearch()
    act(() => hookApi.setAmenityFilter('indoor'))
    expect(hookApi.amenityFilter).toBe('indoor')

    await runSearch('98101')
    expect(hookApi.amenityFilter).toBe('all')
  })

  it('selects a court and pans the map on handleCourtSelect', async () => {
    await renderReady()
    await runSearch()
    expect(hookApi.selectedCourt).toBeNull()

    // Drives the marker-emphasis effect over the faked markers (must not throw)
    // and surfaces the selection for the highlighted sidebar card.
    act(() => hookApi.handleCourtSelect(hookApi.courts[0]))
    expect(hookApi.selectedCourt).toBe(hookApi.courts[0])
  })

  it('reports when no courts are found', async () => {
    searchByTextImpl = () => Promise.resolve({ places: [] })
    await renderReady()
    await runSearch()

    expect(hookApi.courts).toHaveLength(0)
    expect(hookApi.mapShown).toBe(false) // map stays hidden when nothing found
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
