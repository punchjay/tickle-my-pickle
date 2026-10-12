import LocationInput from '../components/LocationInput'
import CourtList from '../components/CourtList'
import Footer from '../components/Footer'
import { usePickleballMap } from '../hooks/usePickleballMap'
import { useFavorites } from '../hooks/useFavorites'
import { useKeyboardInset } from '../hooks/useKeyboardInset'
import { app } from '../appData'
import {
  AppWrapper,
  MapDiv,
  OverlayTop,
  HeaderCard,
  Wordmark,
  Tagline,
  VisuallyHiddenTitle,
  ErrorBanner,
} from './FinderPage.styles'

const FinderPage = () => {
  const {
    mapDivRef,
    courts,
    selectedCourt,
    mapShown,
    searchSeq,
    loading,
    error,
    mapsReady,
    hasApiKey,
    activated,
    loadFailed,
    activateMaps,
    handleSearch,
    handleGeolocate,
    handleCourtSelect,
  } = usePickleballMap()
  const { favorites, isFavorite, toggleFavorite } = useFavorites()
  const keyboardInset = useKeyboardInset()

  return (
    <AppWrapper $mapVisible={courts.length > 0}>
      <MapDiv ref={mapDivRef} $visible={mapShown} />
      <OverlayTop
        $mapVisible={courts.length > 0}
        $keyboardInset={keyboardInset}
      >
        {courts.length === 0 ? (
          <HeaderCard>
            <Wordmark>{app.wordmark}</Wordmark>
            <Tagline>{app.tagline}</Tagline>
          </HeaderCard>
        ) : (
          <VisuallyHiddenTitle>{app.wordmark}</VisuallyHiddenTitle>
        )}
        <LocationInput
          onSearch={handleSearch}
          onGeolocate={handleGeolocate}
          onActivate={activateMaps}
          autoFocus={courts.length === 0}
          loading={loading}
          disabled={!hasApiKey || loadFailed}
          initializing={activated && !mapsReady && !error}
        />
        {error && (
          <ErrorBanner role="alert" aria-live="assertive">
            {error}
          </ErrorBanner>
        )}
      </OverlayTop>
      {courts.length > 0 ? (
        <CourtList
          key={searchSeq}
          courts={courts}
          selectedCourt={selectedCourt}
          onSelect={handleCourtSelect}
          favorites={favorites}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
        />
      ) : (
        <Footer />
      )}
    </AppWrapper>
  )
}

export default FinderPage
