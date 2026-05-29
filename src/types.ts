// A view-model for a pickleball court, decoupled from the Google Maps
// `Place` shape so components and tests don't depend on the SDK's types.
export interface Court {
  id: string
  name: string
  address: string
  rating?: number
  userRatingCount?: number
  isOpen?: boolean
  location: google.maps.LatLngLiteral
}
