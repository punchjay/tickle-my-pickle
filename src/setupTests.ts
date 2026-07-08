import '@testing-library/jest-dom'

// Node 22+ exposes a native, disabled-by-default `localStorage` global (it needs
// --localstorage-file to work). Being defined on globalThis, it shadows the one
// jsdom provides, so storage-backed tests throw on newer Node. Install a real
// in-memory Storage here so persistence behaves identically on every Node
// version (CI runs Node 20; local dev may be newer).
class MemoryStorage implements Storage {
  private store = new Map<string, string>()
  get length() {
    return this.store.size
  }
  clear() {
    this.store.clear()
  }
  getItem(key: string) {
    return this.store.has(key) ? this.store.get(key)! : null
  }
  key(index: number) {
    return [...this.store.keys()][index] ?? null
  }
  removeItem(key: string) {
    this.store.delete(key)
  }
  setItem(key: string, value: string) {
    this.store.set(key, String(value))
  }
}

Object.defineProperty(globalThis, 'localStorage', {
  value: new MemoryStorage(),
  configurable: true,
  writable: true,
})
