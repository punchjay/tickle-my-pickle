import { inferAmenities } from '@/amenities'
import type { AmenityKind, Confidence } from '@/amenities'
import type { Court } from '@/types'

// Minimal Court factory — only name/types feed the heuristic.
const court = (name: string, types: string[] = []): Court => ({
  id: name,
  name,
  address: '',
  types,
  location: { lat: 0, lng: 0 },
})

const kinds = (c: Court): AmenityKind[] => inferAmenities(c).map((t) => t.kind)
const confidenceOf = (c: Court, kind: AmenityKind): Confidence | undefined =>
  inferAmenities(c).find((t) => t.kind === kind)?.confidence

describe('inferAmenities', () => {
  it('tags clear indoor names as high-confidence indoor', () => {
    expect(kinds(court('Downtown Indoor Pickleball'))).toContain('indoor')
    expect(kinds(court('Westside YMCA'))).toContain('indoor')
    expect(kinds(court('Community Recreation Center'))).toContain('indoor')
    expect(confidenceOf(court('Indoor Pickle Hub'), 'indoor')).toBe('high')
  })

  it('tags parks as high-confidence outdoor and free', () => {
    const c = court('Lincoln Park', ['park'])
    expect(kinds(c)).toEqual(expect.arrayContaining(['outdoor', 'free']))
    expect(confidenceOf(c, 'outdoor')).toBe('high')
    expect(confidenceOf(c, 'free')).toBe('high')
  })

  it('treats a bare "outdoor" name as outdoor', () => {
    expect(kinds(court('Outdoor Courts at Maple'))).toContain('outdoor')
  })

  it('tags lighted names', () => {
    expect(kinds(court('Riverside Lighted Courts'))).toContain('lighted')
    expect(kinds(court('Field of Lights Pickleball'))).toContain('lighted')
  })

  it('does not mark a private club or academy as free even if park-typed', () => {
    expect(kinds(court('Elite Pickleball Club', ['park']))).not.toContain(
      'free',
    )
    expect(kinds(court('Smash Academy', ['park']))).not.toContain('free')
  })

  it('resolves indoor/outdoor conflict in favor of higher confidence', () => {
    // "park" (outdoor high) beats "club" (indoor low) → outdoor, not indoor.
    const c = court('Lincoln Park Tennis & Pickleball Club', ['park'])
    expect(kinds(c)).toContain('outdoor')
    expect(kinds(c)).not.toContain('indoor')
  })

  it('drops both indoor and outdoor on a same-confidence tie', () => {
    // "indoor" (high) + "outdoor" (high) in one name → neither wins.
    const c = court('Indoor & Outdoor Pickleball Center')
    expect(kinds(c)).not.toContain('indoor')
    expect(kinds(c)).not.toContain('outdoor')
  })

  it('marks weak signals as low confidence', () => {
    expect(confidenceOf(court('The Pickle Club'), 'indoor')).toBe('low')
    expect(confidenceOf(court('Regional Tennis Center'), 'outdoor')).toBe('low')
  })

  it('returns no tags for a generic, unmatched name', () => {
    expect(inferAmenities(court('Smith Sports'))).toEqual([])
  })

  it('handles a missing types array', () => {
    expect(() => inferAmenities(court('Indoor Courts'))).not.toThrow()
  })
})
