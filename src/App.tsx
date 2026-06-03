import LocationInput from './components/LocationInput'
import CourtList from './components/CourtList'
import { usePickleballMap } from './hooks/usePickleballMap'
import {
  AppWrapper,
  MapDiv,
  OverlayTop,
  HeaderCard,
  Wordmark,
  Tagline,
  ErrorBanner,
} from './App.styles'

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
      <MapDiv ref={mapDivRef} $visible={courts.length > 0} />
      <OverlayTop>
        <HeaderCard>
          <Wordmark>Tickle My Pickle</Wordmark>
          <Tagline>Find pickleball courts near you</Tagline>
        </HeaderCard>
        <LocationInput
          onZipSubmit={handleZipSubmit}
          onGeolocate={handleGeolocate}
          loading={loading}
          disabled={!mapsReady}
        />
        {error && (
          <ErrorBanner role="alert" aria-live="assertive">
            {error}
          </ErrorBanner>
        )}
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
