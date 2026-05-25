import styled from 'styled-components'
import LocationInput from './components/LocationInput'
import CourtList from './components/CourtList'
import { usePickleballMap } from './hooks/usePickleballMap'

export type Court = google.maps.places.PlaceResult

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
  const {
    mapDivRef,
    courts,
    selectedCourt,
    loading,
    error,
    mapsReady,
    handleZipSubmit,
    handleGeolocate,
    handleCourtSelect,
  } = usePickleballMap()

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
