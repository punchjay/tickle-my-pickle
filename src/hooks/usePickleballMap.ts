import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { setOptions, importLibrary } from '@googlemaps/js-api-loader'
import type { Court } from '../types'
import { hasAmenity } from '../amenities'
import type { AmenityFilter } from '../amenities'
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

// A map marker paired with the court it represents, so selection and re-skinning
// match on court identity (id) rather than array position — the displayed list
// can be filtered or reordered without the pins drifting out of sync.
interface CourtMarker {
  court: Court
  marker: google.maps.marker.AdvancedMarkerElement
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
  const markersRef = useRef<CourtMarker[]>([])
  // Latest selection id, read when (re)building markers so a rebuild triggered
  // by a list change paints the right pin without waiting on the selection
  // effect. Kept in a ref so the build effect needn't depend on selectedCourt.
  const selectedIdRef = useRef<string | null>(null)

  const [courts, setCourts] = useState<Court[]>([])
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null)
  const [amenityFilter, setAmenityFilter] = useState<AmenityFilter>('all')

  // The courts actually shown — the full result set narrowed by the amenity
  // filter. Single source of truth for both the sidebar list and the map
  // markers (the marker effect keys on this), so a filter can never desync the
  // numbered pins from the list. Returns the `courts` reference unchanged when
  // unfiltered, so toggling back to "all" doesn't needlessly rebuild markers.
  const displayedCourts = useMemo(
    () =>
      amenityFilter === 'all'
        ? courts
        : courts.filter((c) => hasAmenity(c, amenityFilter)),
    [courts, amenityFilter],
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

  useEffect(() => {
    if (!hasApiKey) return
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
        if (!cancelled) setError(errors.mapsLoadFailed)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const searchNearby = useCallback(
    async (location: google.maps.LatLngLiteral) => {
      const map = mapRef.current
      if (!map) return
      setLoading(true)
      setError(null)
      setSelectedCourt(null)
      // A fresh search starts unfiltered, so results are never hidden behind a
      // filter left over from the previous location.
      setAmenityFilter('all')
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
  // pins and re-create them in list order whenever `displayedCourts` changes,
  // so the numbered glyphs always match the sidebar even when the amenity
  // filter narrows the list. Each pin reflects the current selection (via the
  // ref) at build time. Guarded on having a map + results — true only after a
  // search, by which point the marker library has loaded.
  useEffect(() => {
    markersRef.current.forEach(({ marker }) => {
      marker.map = null
    })
    markersRef.current = []

    const map = mapRef.current
    if (!map || displayedCourts.length === 0) return

    const { AdvancedMarkerElement } = google.maps.marker
    markersRef.current = displayedCourts.map((court, i) => {
      const marker = new AdvancedMarkerElement({
        map,
        position: court.location,
        title: court.name,
        content: makePin(i, court.id === selectedIdRef.current),
        gmpClickable: true,
      })
      marker.addEventListener('gmp-click', () => setSelectedCourt(court))
      return { court, marker }
    })
  }, [displayedCourts])

  // Re-skin the pins in place whenever the selection changes so the chosen
  // court reads as "active" on the map, mirroring the highlighted sidebar card.
  // Match on court id (not array position) so a filtered/reordered list stays
  // correct. Also keep selectedIdRef current for the marker-build effect above.
  useEffect(() => {
    selectedIdRef.current = selectedCourt?.id ?? null
    markersRef.current.forEach(({ court, marker }, i) => {
      const selected = court.id === selectedCourt?.id
      marker.content = makePin(i, selected)
      marker.zIndex = selected ? 1 : null
    })
  }, [selectedCourt])

  const handleSearch = useCallback(
    (query: string) => {
      if (!mapsReady) return
      setLoading(true)
      setError(null)
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
    [mapsReady, searchNearby],
  )

  const handleGeolocate = useCallback(() => {
    if (!mapsReady) return
    setLoading(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        searchNearby({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {
        setLoading(false)
        setError(errors.geolocationDenied)
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    )
  }, [mapsReady, searchNearby])

  const handleCourtSelect = useCallback((court: Court) => {
    setSelectedCourt(court)
    mapRef.current?.panTo(court.location)
  }, [])

  return {
    mapDivRef,
    courts,
    displayedCourts,
    amenityFilter,
    setAmenityFilter,
    selectedCourt,
    mapShown,
    searchSeq,
    loading,
    error,
    mapsReady,
    handleSearch,
    handleGeolocate,
    handleCourtSelect,
  }
}
