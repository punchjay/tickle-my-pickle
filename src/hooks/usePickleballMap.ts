import { useEffect, useRef, useState, useCallback } from 'react'
import { setOptions, importLibrary } from '@googlemaps/js-api-loader'
import type { Court } from '../types'
import { palette } from '../theme'
import { errors, searchQuery, unknownCourt } from '../appData'

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined

// Map ID required by AdvancedMarkerElement. DEMO_MAP_ID renders default styling
// without Cloud-based map styling; swap for a real Map ID to customize.
const MAP_ID = 'DEMO_MAP_ID'
const SEARCH_RADIUS_METERS = 16093 // ~10 miles

// Configure the loader once at module load. Calling setOptions() more than
// once warns, and StrictMode re-runs the init effect in dev.
if (apiKey && apiKey !== 'YOUR_KEY_HERE') {
  setOptions({ key: apiKey, v: 'weekly' })
}

export function usePickleballMap() {
  const mapDivRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([])

  const [courts, setCourts] = useState<Court[]>([])
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(() =>
    !apiKey || apiKey === 'YOUR_KEY_HERE' ? errors.missingApiKey : null,
  )
  const [mapsReady, setMapsReady] = useState(false)

  useEffect(() => {
    if (!apiKey || apiKey === 'YOUR_KEY_HERE') return

    Promise.all([
      importLibrary('maps'),
      importLibrary('places'),
      importLibrary('geocoding'),
      importLibrary('marker'),
    ])
      .then(() => {
        if (!mapDivRef.current) return
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
        setError(errors.mapsLoadFailed)
      })
  }, [])

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((m) => {
      m.map = null
    })
    markersRef.current = []
  }, [])

  const searchNearby = useCallback(
    async (location: google.maps.LatLngLiteral) => {
      const map = mapRef.current
      if (!map) return
      setLoading(true)
      setError(null)
      setCourts([])
      setSelectedCourt(null)
      clearMarkers()
      map.setCenter(location)
      map.setZoom(12)

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
            'regularOpeningHours',
            // isOpen() needs utcOffsetMinutes; without it the SDK fires a
            // secondary fetch that can throw and reject the whole search.
            'utcOffsetMinutes',
          ],
          locationBias: { center: location, radius: SEARCH_RADIUS_METERS },
          maxResultCount: 20,
        })

        if (!places || places.length === 0) {
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
            isOpen: place.regularOpeningHours
              ? await place.isOpen().catch(() => undefined)
              : undefined,
            location: {
              lat: place.location?.lat() ?? location.lat,
              lng: place.location?.lng() ?? location.lng,
            },
          })),
        )

        setCourts(results)
        const { AdvancedMarkerElement, PinElement } = google.maps.marker
        results.forEach((court, i) => {
          const pin = new PinElement({
            glyphText: String(i + 1),
            glyphColor: 'white',
            background: palette.terracotta,
            borderColor: palette.terracottaDark,
          })
          const marker = new AdvancedMarkerElement({
            map,
            position: court.location,
            title: court.name,
            content: pin,
            gmpClickable: true,
          })
          marker.addEventListener('gmp-click', () => setSelectedCourt(court))
          markersRef.current.push(marker)
        })
      } catch (err) {
        console.error('Places searchByText failed:', err)
        setError(errors.searchFailed)
      } finally {
        setLoading(false)
      }
    },
    [clearMarkers],
  )

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
    selectedCourt,
    loading,
    error,
    mapsReady,
    handleSearch,
    handleGeolocate,
    handleCourtSelect,
  }
}
