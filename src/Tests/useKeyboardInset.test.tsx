import { renderHook, act } from '@testing-library/react'
import { useKeyboardInset } from '@/hooks/useKeyboardInset'

// A minimal visualViewport: jsdom doesn't implement one.
const installViewport = (height: number, offsetTop = 0) => {
  const listeners = new Map<string, Set<() => void>>()
  const vv = {
    height,
    offsetTop,
    addEventListener: (type: string, fn: () => void) => {
      if (!listeners.has(type)) listeners.set(type, new Set())
      listeners.get(type)!.add(fn)
    },
    removeEventListener: (type: string, fn: () => void) =>
      listeners.get(type)?.delete(fn),
  }
  Object.defineProperty(window, 'visualViewport', {
    value: vv,
    configurable: true,
  })
  return {
    vv,
    fire: () => listeners.get('resize')?.forEach((fn) => fn()),
    listenerCount: () =>
      [...listeners.values()].reduce((n, set) => n + set.size, 0),
  }
}

describe('useKeyboardInset', () => {
  const innerHeight = window.innerHeight

  afterEach(() => {
    Object.defineProperty(window, 'visualViewport', {
      value: undefined,
      configurable: true,
    })
    Object.defineProperty(window, 'innerHeight', {
      value: innerHeight,
      configurable: true,
    })
  })

  beforeEach(() => {
    Object.defineProperty(window, 'innerHeight', {
      value: 800,
      configurable: true,
    })
  })

  it('is 0 without a visualViewport', () => {
    const { result } = renderHook(() => useKeyboardInset())
    expect(result.current).toBe(0)
  })

  it('is 0 while the visual viewport fills the window', () => {
    installViewport(800)
    const { result } = renderHook(() => useKeyboardInset())
    expect(result.current).toBe(0)
  })

  it('reports the covered height when the keyboard opens and closes', () => {
    const { vv, fire } = installViewport(800)
    const { result } = renderHook(() => useKeyboardInset())

    act(() => {
      vv.height = 460
      fire()
    })
    expect(result.current).toBe(340)

    act(() => {
      vv.height = 800
      fire()
    })
    expect(result.current).toBe(0)
  })

  it('accounts for the visual viewport scrolling down', () => {
    const { vv, fire } = installViewport(800)
    const { result } = renderHook(() => useKeyboardInset())
    act(() => {
      vv.height = 460
      vv.offsetTop = 100
      fire()
    })
    expect(result.current).toBe(240)
  })

  it('ignores small shifts from browser chrome', () => {
    installViewport(770)
    const { result } = renderHook(() => useKeyboardInset())
    expect(result.current).toBe(0)
  })

  it('stops listening on unmount', () => {
    const { listenerCount } = installViewport(800)
    const { unmount } = renderHook(() => useKeyboardInset())
    expect(listenerCount()).toBe(2)
    unmount()
    expect(listenerCount()).toBe(0)
  })
})
