import { useEffect, useRef, useState, useCallback } from 'react'
import { setOptions, importLibrary } from '@googlemaps/js-api-loader'
import type { Court } from '../types'

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined

// Map ID required by AdvancedMarkerElement. DEMO_MAP_ID renders default styling
// without Cloud-based map styling; swap for a real Map ID to customize.
const MAP_ID = 'DEMO_MAP_ID'
const SEARCH_RADIUS_METERS = 16093 // ~10 miles

export function usePickleballMap() {
  const mapDivRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([])

  const [courts, setCourts] = useState<Court[]>([])
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(() =>
    !apiKey || apiKey === 'YOUR_KEY_HERE'
      ? 'Add your VITE_GOOGLE_MAPS_API_KEY to .env.local and restart the dev server.'
      : null,
  )
  const [mapsReady, setMapsReady] = useState(false)

  useEffect(() => {
    if (!apiKey || apiKey === 'YOUR_KEY_HERE') return

    setOptions({ key: apiKey, v: 'weekly' })

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
        setError('Failed to load Google Maps. Check your API key.')
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
          textQuery: 'pickleball court',
          fields: [
            'id',
            'displayName',
            'formattedAddress',
            'location',
            'rating',
            'userRatingCount',
            'regularOpeningHours',
          ],
          locationBias: { center: location, radius: SEARCH_RADIUS_METERS },
          maxResultCount: 20,
        })

        if (!places || places.length === 0) {
          setLoading(false)
          setError('No pickleball courts found nearby. Try a different location.')
          return
        }

        const results: Court[] = await Promise.all(
          places.map(async (place) => ({
            id: place.id,
            name: place.displayName ?? 'Unknown court',
            address: place.formattedAddress ?? '',
            rating: place.rating ?? undefined,
            userRatingCount: place.userRatingCount ?? undefined,
            isOpen: place.regularOpeningHours
              ? await place.isOpen()
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
            glyph: String(i + 1),
            glyphColor: 'white',
            background: '#16a34a',
            borderColor: '#15803d',
          })
          const marker = new AdvancedMarkerElement({
            map,
            position: court.location,
            title: court.name,
            content: pin.element,
            gmpClickable: true,
          })
          marker.addListener('click', () => setSelectedCourt(court))
          markersRef.current.push(marker)
        })
      } catch {
        setError('Search failed. Please try again.')
      } finally {
        setLoading(false)
      }
    },
    [clearMarkers],
  )

  const handleZipSubmit = useCallback(
    (zip: string) => {
      if (!mapsReady) return
      setLoading(true)
      setError(null)
      const geocoder = new google.maps.Geocoder()
      geocoder.geocode(
        { address: zip, componentRestrictions: { country: 'US' } },
        (results, status) => {
          if (status === 'OK' && results?.[0]) {
            const loc = results[0].geometry.location
            searchNearby({ lat: loc.lat(), lng: loc.lng() })
          } else {
            setLoading(false)
            setError('Could not find that zip code. Try again.')
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
        setError('Location access denied. Enter a zip code instead.')
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
    handleZipSubmit,
    handleGeolocate,
    handleCourtSelect,
  }
}
