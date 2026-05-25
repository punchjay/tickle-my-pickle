import { useEffect, useRef, useState, useCallback } from 'react'
import { setOptions, importLibrary } from '@googlemaps/js-api-loader'
import styled from 'styled-components'
import LocationInput from './components/LocationInput'
import CourtList from './components/CourtList'

export type Court = google.maps.places.PlaceResult

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined

const AppWrapper = styled.div`
  position: relative;
  width: 100vw;
  height: 100svh;
  overflow: hidden;
`

const MapDiv = styled.div`
  position: absolute;
  inset: 0;
`

const OverlayTop = styled.div`
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  width: min(400px, calc(100vw - 32px));
`

const ErrorBanner = styled.p`
  margin: 0;
  background: #fff;
  border-left: 4px solid #ef4444;
  border-radius: 6px;
  padding: 10px 14px;
  font-size: 13px;
  color: #374151;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
`

function App() {
  const mapDivRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null)

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
    ])
      .then(() => {
        if (!mapDivRef.current) return
        const map = new google.maps.Map(mapDivRef.current, {
          center: { lat: 39.8283, lng: -98.5795 },
          zoom: 4,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: 'greedy',
        })
        mapRef.current = map
        placesServiceRef.current = new google.maps.places.PlacesService(map)
        setMapsReady(true)
      })
      .catch(() => {
        setError('Failed to load Google Maps. Check your API key.')
      })
  }, [])

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((m) => m.setMap(null))
    markersRef.current = []
  }, [])

  const searchNearby = useCallback(
    (location: google.maps.LatLngLiteral) => {
      if (!mapRef.current || !placesServiceRef.current) return
      setLoading(true)
      setError(null)
      setCourts([])
      setSelectedCourt(null)
      clearMarkers()
      mapRef.current.setCenter(location)
      mapRef.current.setZoom(12)

      placesServiceRef.current.nearbySearch(
        { location, radius: 16093, keyword: 'pickleball' },
        (results, status) => {
          setLoading(false)
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            setCourts(results)
            results.forEach((place, i) => {
              if (!place.geometry?.location || !mapRef.current) return
              const marker = new google.maps.Marker({
                map: mapRef.current,
                position: place.geometry.location,
                title: place.name,
                label: {
                  text: String(i + 1),
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '12px',
                },
              })
              markersRef.current.push(marker)
              marker.addListener('click', () => setSelectedCourt(place))
            })
          } else if (
            status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS
          ) {
            setError(
              'No pickleball courts found nearby. Try a different location.',
            )
          } else {
            setError('Search failed. Please try again.')
          }
        },
      )
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
    )
  }, [mapsReady, searchNearby])

  const handleCourtSelect = useCallback((court: Court) => {
    setSelectedCourt(court)
    if (court.geometry?.location && mapRef.current) {
      mapRef.current.panTo(court.geometry.location)
    }
  }, [])

  return (
    <AppWrapper>
      <MapDiv ref={mapDivRef} />
      <OverlayTop>
        <LocationInput
          onZipSubmit={handleZipSubmit}
          onGeolocate={handleGeolocate}
          loading={loading}
          disabled={!mapsReady}
        />
        {error && <ErrorBanner>{error}</ErrorBanner>}
      </OverlayTop>
      {courts.length > 0 && (
        <CourtList
          courts={courts}
          selectedCourt={selectedCourt}
          onSelect={handleCourtSelect}
        />
      )}
    </AppWrapper>
  )
}

export default App
