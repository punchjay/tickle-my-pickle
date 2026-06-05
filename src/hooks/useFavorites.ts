import { useCallback, useState } from 'react'
import type { Court } from '../types'

const STORAGE_KEY = 'tmp:favorites'

// Favorites persist across sessions in localStorage. Full `Court` records are
// stored (not just ids) so the Saved view can render without a live search.
// All access is guarded: private mode / disabled storage degrades to an
// in-memory list rather than throwing.
function readFavorites(): Court[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Court[]) : []
  } catch {
    return []
  }
}

function writeFavorites(courts: Court[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courts))
  } catch {
    // Storage unavailable or over quota — keep the in-memory list only.
  }
}

export function useFavorites() {
  // Lazy initializer (not a setState-in-effect) reads storage once on mount.
  const [favorites, setFavorites] = useState<Court[]>(readFavorites)

  const isFavorite = useCallback(
    (id: string) => favorites.some((c) => c.id === id),
    [favorites],
  )

  const toggleFavorite = useCallback((court: Court) => {
    setFavorites((prev) => {
      const next = prev.some((c) => c.id === court.id)
        ? prev.filter((c) => c.id !== court.id)
        : [...prev, court]
      writeFavorites(next)
      return next
    })
  }, [])

  return { favorites, isFavorite, toggleFavorite }
}
