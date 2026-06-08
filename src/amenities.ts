// Amenity tagging heuristic. The Places API (New) fields we request carry no
// structured indoor/outdoor or amenity signal, so every tag here is an
// *inference* from the listing name and coarse Place `types`. See
// docs/amenities-tagging-plan.md. Tags carry a confidence so the UI can show
// only `high`-confidence guesses by default and never silently mislabel.

import type { Court } from './types'

export type AmenityKind = 'indoor' | 'outdoor' | 'lighted' | 'free'
export type Confidence = 'high' | 'low'

// The Nearby-tab amenity filter. Only indoor/outdoor are filterable (the
// headline ask and the least error-prone inferences); 'all' is the default.
export type AmenityFilter = 'all' | 'indoor' | 'outdoor'

export interface Tag {
  kind: AmenityKind
  confidence: Confidence
}

// Keyword tables — kept here, in one place, so they're tunable and testable.
// Matched case-insensitively as substrings of the listing name.
const INDOOR_HIGH = [
  'indoor',
  'fieldhouse',
  'rec center',
  'recreation center',
  'ymca',
  'athletic club',
  'sportsplex',
  'gym',
  'arena',
]
const INDOOR_LOW = ['club'] // weak: a "club" is often, but not always, indoor
const OUTDOOR_LOW = ['tennis center'] // weak: tennis centers are usually outdoor
const LIGHTED = ['lighted', 'lights']
const PRIVATE = ['club', 'academy'] // suppresses the "free" guess

const rank: Record<Confidence, number> = { high: 2, low: 1 }

// Derive the displayable amenity tags for a court. Indoor and outdoor are
// mutually exclusive: if both match, the higher-confidence one wins, and a tie
// yields neither (better to show nothing than guess wrong).
export function inferAmenities(court: Court): Tag[] {
  const name = court.name.toLowerCase()
  const types = court.types ?? []
  const isParkType = types.includes('park')
  const has = (keywords: string[]) => keywords.some((k) => name.includes(k))

  let indoor: Confidence | null = null
  if (has(INDOOR_HIGH)) indoor = 'high'
  else if (has(INDOOR_LOW)) indoor = 'low'

  let outdoor: Confidence | null = null
  if (name.includes('outdoor') || isParkType || name.includes('park'))
    outdoor = 'high'
  else if (has(OUTDOOR_LOW)) outdoor = 'low'

  // Resolve the indoor/outdoor conflict by confidence; drop both on a tie.
  if (indoor && outdoor) {
    if (rank[indoor] > rank[outdoor]) outdoor = null
    else if (rank[outdoor] > rank[indoor]) indoor = null
    else {
      indoor = null
      outdoor = null
    }
  }

  const tags: Tag[] = []
  if (indoor) tags.push({ kind: 'indoor', confidence: indoor })
  if (outdoor) tags.push({ kind: 'outdoor', confidence: outdoor })
  if (has(LIGHTED)) tags.push({ kind: 'lighted', confidence: 'high' })
  // Free: a public park, but not a private club/academy.
  if (isParkType && !has(PRIVATE))
    tags.push({ kind: 'free', confidence: 'high' })

  return tags
}

// Does the court carry a *high*-confidence tag of this kind? The Nearby-tab
// filter only ever matches on high-confidence guesses, so a weak inference
// can never hide a real court — untagged/low-confidence courts are surfaced via
// the "N hidden" escape instead.
export function hasAmenity(court: Court, kind: AmenityKind): boolean {
  return inferAmenities(court).some(
    (t) => t.kind === kind && t.confidence === 'high',
  )
}
