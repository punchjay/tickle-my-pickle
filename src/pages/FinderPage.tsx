import LocationInput from '../components/LocationInput'
import CourtList from '../components/CourtList'
import Footer from '../components/Footer'
import { usePickleballMap } from '../hooks/usePickleballMap'
import { app } from '../appData'
import {
  AppWrapper,
  MapDiv,
  OverlayTop,
  HeaderCard,
  Wordmark,
  Tagline,
  ErrorBanner,
} from './FinderPage.styles'

const FinderPage = () => {
  const {
    mapDivRef,
    courts,
    selectedCourt,
    loading,
    error,
    mapsReady,
    handleSearch,
    handleGeolocate,
    handleCourtSelect,
  } = usePickleballMap()

  return (
    <AppWrapper $mapVisible={courts.length > 0}>
      <MapDiv ref={mapDivRef} $visible={courts.length > 0} />
      <OverlayTop $mapVisible={courts.length > 0}>
        <HeaderCard>
          <Wordmark>{app.wordmark}</Wordmark>
          <Tagline>{app.tagline}</Tagline>
        </HeaderCard>
        <LocationInput
          onSearch={handleSearch}
          onGeolocate={handleGeolocate}
          loading={loading}
          disabled={!mapsReady}
          initializing={!mapsReady && !error}
        />
        {error && (
          <ErrorBanner role="alert" aria-live="assertive">
            {error}
          </ErrorBanner>
        )}
      </OverlayTop>
      {courts.length > 0 ? (
        <CourtList
          courts={courts}
          selectedCourt={selectedCourt}
          onSelect={handleCourtSelect}
        />
      ) : (
        <Footer />
      )}
    </AppWrapper>
  )
}

export default FinderPage
