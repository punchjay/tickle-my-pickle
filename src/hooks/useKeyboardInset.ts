import { useEffect, useState } from 'react'

// How many CSS pixels of the layout viewport the on-screen keyboard covers,
// so a bottom-docked control can ride just above it. iOS Safari keeps the
// layout viewport full height when the keyboard opens and only shrinks the
// visual viewport, so the gap between the two is the keyboard. Browsers that
// resize the layout viewport instead (Android Chrome) report ~0, and the
// layout reflows on its own. 0 when there's no visualViewport (desktop, jsdom).
const measure = () => {
  const vv = window.visualViewport
  if (!vv) return 0
  const covered = window.innerHeight - (vv.height + vv.offsetTop)
  // Ignore sub-pixel noise and the few px browser chrome can shift by.
  return covered > 40 ? Math.round(covered) : 0
}

export const useKeyboardInset = () => {
  const [inset, setInset] = useState(measure)

  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return

    const update = () => setInset(measure())
    vv.addEventListener('resize', update)
    vv.addEventListener('scroll', update)
    return () => {
      vv.removeEventListener('resize', update)
      vv.removeEventListener('scroll', update)
    }
  }, [])

  return inset
}
