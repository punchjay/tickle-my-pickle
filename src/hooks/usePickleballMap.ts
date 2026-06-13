import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react'
import { setOptions, importLibrary } from '@googlemaps/js-api-loader'
import type { Court } from '../types'
import { palette } from '../theme'
import { errors, searchQuery, unknownCourt } from '../appData'

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined
// The .env.example placeholder; treat it as "no key" so dev without a real key
// shows the friendly missing-key error instead of failing Maps calls.
const hasApiKey = !!apiKey && apiKey !== 'YOUR_KEY_HERE'

// Map ID required by AdvancedMarkerElement. A real Cloud-styled Map ID
// (VITE_GOOGLE_MAPS_MAP_ID) applies the retro map theme — see docs/map-style.json
// for the style to import in the Google Cloud console. Falls back to Google's
// DEMO_MAP_ID (default styling) when unset, so dev works without one.
const MAP_ID =
  (import.meta.env.VITE_GOOGLE_MAPS_MAP_ID as string | undefined) ||
  'DEMO_MAP_ID'
const SEARCH_RADIUS_METERS = 16093 // ~10 miles

// Configure the loader once at module load. Calling setOptions() more than
// once warns, and StrictMode re-runs the init effect in dev.
if (hasApiKey) {
  setOptions({ key: apiKey, v: 'weekly' })
}

// Numbered map pin. The selected court gets the dark "midnight" treatment at a
// larger scale so it stands out from the terracotta crowd. Only called after
// the marker library has loaded.
function makePin(index: number, selected: boolean) {
  return new google.maps.marker.PinElement({
    glyphText: String(index + 1),
    glyphColor: 'white',
    background: selected ? palette.midnight : palette.terracotta,
    borderColor: selected ? palette.midnight : palette.terracottaDark,
    scale: selected ? 1.3 : 1,
  })
}

export function usePickleballMap() {
  const mapDivRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  // Markers mirror `courts` by index (both rebuilt together by the effect
  // below), so position i is always the pin for courts[i].
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([])
  // The selection id the marker DOM currently shows — owned by the two marker
  // effects so the re-skin pass can touch only the pins that actually changed.
  const paintedIdRef = useRef<string | null>(null)
  // A search/geolocate requested before the SDK finished loading. Held here and
  // replayed by the effect below once `mapsReady` flips true, so a fast user who
  // submits right after focusing isn't silently dropped.
  const pendingRef = useRef<
    { kind: 'search'; query: string } | { kind: 'geolocate' } | null
  >(null)

  const [courts, setCourts] = useState<Court[]>([])
  // Selection is stored as the court's id; the Court object consumers receive
  // is derived from the current list, so a rebuilt/filtered list can never
  // disagree with the selection state.
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selectedCourt = useMemo(
    () => courts.find((c) => c.id === selectedId) ?? null,
    [courts, selectedId],
  )
  // Drives the map's opacity fade independently of `courts`: the map fades out
  // while a (re-)search runs and fades back in once new results land.
  const [mapShown, setMapShown] = useState(false)
  // Bumped each time fresh results arrive, used as a React key to replay the
  // results list's entrance fade on every search.
  const [searchSeq, setSearchSeq] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(() =>
    hasApiKey ? null : errors.missingApiKey,
  )
  const [mapsReady, setMapsReady] = useState(false)
  // The map (and the whole Maps SDK) doesn't load on mount — it loads lazily the
  // first time the user activates the search pill (focus or click), so the app's
  // first paint has no map churning under the backdrop. `loadFailed` is terminal
  // and re-disables the input (the only case where !mapsReady should still gate).
  const [activated, setActivated] = useState(false)
  const [loadFailed, setLoadFailed] = useState(false)

  const activateMaps = useCallback(() => setActivated(true), [])

  useEffect(() => {
    if (!hasApiKey || !activated) return
    // Async init: a StrictMode remount (dev) tears this effect down mid-load, so
    // bail on cleanup, and only ever build one Map per div even if both passes
    // resolve.
    let cancelled = false

    Promise.all([
      importLibrary('maps'),
      importLibrary('places'),
      importLibrary('geocoding'),
      importLibrary('marker'),
    ])
      .then(() => {
        if (cancelled || mapRef.current || !mapDivRef.current) return
        mapRef.current = new google.maps.Map(mapDivRef.current, {
          center: { lat: 39.8283, lng: -98.5795 },
          zoom: 4,
          mapId: MAP_ID,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: 'greedy',
        })
        setMapsReady(true)
      })
      .catch(() => {
        if (cancelled) return
        setError(errors.mapsLoadFailed)
        setLoadFailed(true)
        setLoading(false)
        pendingRef.current = null
      })

    return () => {
      cancelled = true
    }
  }, [activated])

  const searchNearby = useCallback(
    async (location: google.maps.LatLngLiteral) => {
      const map = mapRef.current
      if (!map) return
      setLoading(true)
      setError(null)
      setSelectedId(null)
      // Fade the map out while the new location loads. Previous results are
      // intentionally kept until the new ones land, so the overlay (driven by
      // courts.length) stays pinned to the top during a re-search instead of
      // sliding back down to the canvas and up again.
      setMapShown(false)

      try {
        const { Place } = google.maps.places
        const { places } = await Place.searchByText({
          textQuery: searchQuery,
          fields: [
            'id',
            'displayName',
            'formattedAddress',
            'location',
            'rating',
            'userRatingCount',
            // Coarse category labels — input to the amenity heuristic.
            'types',
            'regularOpeningHours',
            // isOpen() needs utcOffsetMinutes; without it the SDK fires a
            // secondary fetch that can throw and reject the whole search.
            'utcOffsetMinutes',
          ],
          locationBias: { center: location, radius: SEARCH_RADIUS_METERS },
          maxResultCount: 20,
        })

        if (!places || places.length === 0) {
          setCourts([])
          setLoading(false)
          setError(errors.noCourtsFound)
          return
        }

        const results: Court[] = await Promise.all(
          places.map(async (place) => ({
            id: place.id,
            name: place.displayName ?? unknownCourt,
            address: place.formattedAddress ?? '',
            rating: place.rating ?? undefined,
            userRatingCount: place.userRatingCount ?? undefined,
            types: place.types ?? undefined,
            isOpen: place.regularOpeningHours
              ? await place.isOpen().catch(() => undefined)
              : undefined,
            location: {
              lat: place.location?.lat() ?? location.lat,
              lng: place.location?.lng() ?? location.lng,
            },
          })),
        )

        // Recenter while the map is still faded out, so the jump to the new
        // location is hidden, then publish the results (the marker effect
        // re-pins) and fade everything back in.
        map.setCenter(location)
        map.setZoom(12)
        setCourts(results)
        setSearchSeq((n) => n + 1)
        setMapShown(true)
      } catch (err) {
        console.error('Places searchByText failed:', err)
        setCourts([])
        setError(errors.searchFailed)
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  // Markers are a pure function of the displayed court list: tear down the old
  // pins and re-create them in list order whenever `courts` changes, so the
  // numbered glyphs always match the sidebar even once the list is filtered or
  // reordered. A layout effect so the pins exist before the browser paints the
  // same commit's mapShown fade-in — they're revealed by the fade, not popped
  // in after it starts. Pins are built unselected; the selection effect below
  // runs next in the same flush and skins the selected one before paint.
  // Guarded on having a map + results — true only after a search, by which
  // point the marker library has loaded.
  useLayoutEffect(() => {
    markersRef.current.forEach((marker) => {
      marker.map = null
    })
    markersRef.current = []
    paintedIdRef.current = null

    const map = mapRef.current
    if (!map || courts.length === 0) return

    const { AdvancedMarkerElement } = google.maps.marker
    markersRef.current = courts.map((court, i) => {
      const marker = new AdvancedMarkerElement({
        map,
        position: court.location,
        title: court.name,
        content: makePin(i, false),
        gmpClickable: true,
      })
      marker.addEventListener('gmp-click', () => setSelectedId(court.id))
      return marker
    })
  }, [courts])

  // Re-skin pins when the selection changes so the chosen court reads as
  // "active" on the map, mirroring the highlighted sidebar card. Diffs against
  // what the marker DOM currently shows (paintedIdRef) and rebuilds only the
  // pins that changed — at most two — instead of all of them. Also depends on
  // `courts`: a list change rebuilds the markers unselected (above), so this
  // pass re-applies the selection to the fresh pins.
  useLayoutEffect(() => {
    const prevId = paintedIdRef.current
    if (prevId === selectedId) return
    paintedIdRef.current = selectedId
    courts.forEach((court, i) => {
      if (court.id !== prevId && court.id !== selectedId) return
      const marker = markersRef.current[i]
      if (!marker) return
      const selected = court.id === selectedId
      marker.content = makePin(i, selected)
      marker.zIndex = selected ? 1 : null
    })
  }, [courts, selectedId])

  // The actual geocode + search; only safe to call once `mapsReady` (the
  // geocoding library is loaded by then). Callers set loading/error first.
  const runSearch = useCallback(
    (query: string) => {
      const geocoder = new google.maps.Geocoder()
      geocoder.geocode(
        { address: query, componentRestrictions: { country: 'US' } },
        (results, status) => {
          if (status === 'OK' && results?.[0]) {
            const loc = results[0].geometry.location
            searchNearby({ lat: loc.lat(), lng: loc.lng() })
          } else {
            setLoading(false)
            setError(errors.locationNotFound)
          }
        },
      )
    },
    [searchNearby],
  )

  const runGeolocate = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        searchNearby({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {
        setLoading(false)
        setError(errors.geolocationDenied)
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    )
  }, [searchNearby])

  // Replay a request that arrived before the SDK was ready, once it is.
  useEffect(() => {
    if (!mapsReady) return
    const pending = pendingRef.current
    if (!pending) return
    pendingRef.current = null
    if (pending.kind === 'search') runSearch(pending.query)
    else runGeolocate()
  }, [mapsReady, runSearch, runGeolocate])

  const handleSearch = useCallback(
    (query: string) => {
      if (!hasApiKey || loadFailed) return
      setLoading(true)
      setError(null)
      // Not loaded yet (e.g. the user submitted moments after focusing): queue
      // the request and kick off the lazy load — the effect above runs it.
      if (!mapsReady) {
        pendingRef.current = { kind: 'search', query }
        setActivated(true)
        return
      }
      runSearch(query)
    },
    [mapsReady, loadFailed, runSearch],
  )

  const handleGeolocate = useCallback(() => {
    if (!hasApiKey || loadFailed) return
    setLoading(true)
    setError(null)
    if (!mapsReady) {
      pendingRef.current = { kind: 'geolocate' }
      setActivated(true)
      return
    }
    runGeolocate()
  }, [mapsReady, loadFailed, runGeolocate])

  const handleCourtSelect = useCallback((court: Court) => {
    setSelectedId(court.id)
    mapRef.current?.panTo(court.location)
  }, [])

  return {
    mapDivRef,
    courts,
    selectedCourt,
    mapShown,
    searchSeq,
    loading,
    error,
    mapsReady,
    // `hasApiKey` is a module constant; surfaced so the page can disable the
    // input when there's no key (the only hard-blocked state besides loadFailed).
    hasApiKey,
    activated,
    loadFailed,
    activateMaps,
    handleSearch,
    handleGeolocate,
    handleCourtSelect,
  }
}
