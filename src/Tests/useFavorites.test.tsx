import { renderHook, act } from '@testing-library/react'
import { useFavorites } from '@/hooks/useFavorites'
import type { Court } from '@/types'

const court = (id: string, name: string): Court => ({
  id,
  name,
  address: `${name} Address`,
  location: { lat: 1, lng: 2 },
})

const a = court('place_a', 'Alpha Courts')
const b = court('place_b', 'Bravo Courts')

beforeEach(() => localStorage.clear())

describe('useFavorites', () => {
  it('starts empty and adds a favorite', () => {
    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites).toEqual([])
    expect(result.current.isFavorite('place_a')).toBe(false)

    act(() => result.current.toggleFavorite(a))
    expect(result.current.favorites).toEqual([a])
    expect(result.current.isFavorite('place_a')).toBe(true)
  })

  it('toggles a favorite off when added again', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => result.current.toggleFavorite(a))
    act(() => result.current.toggleFavorite(b))
    expect(result.current.favorites).toEqual([a, b])

    act(() => result.current.toggleFavorite(a))
    expect(result.current.favorites).toEqual([b])
    expect(result.current.isFavorite('place_a')).toBe(false)
  })

  it('persists favorites to localStorage and rehydrates on mount', () => {
    const first = renderHook(() => useFavorites())
    act(() => first.result.current.toggleFavorite(a))

    // A fresh mount reads the persisted list back from storage.
    const second = renderHook(() => useFavorites())
    expect(second.result.current.favorites).toEqual([a])
    expect(second.result.current.isFavorite('place_a')).toBe(true)
  })

  it('degrades gracefully when localStorage holds invalid JSON', () => {
    localStorage.setItem('tmp:favorites', 'not json')
    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites).toEqual([])
  })
})
