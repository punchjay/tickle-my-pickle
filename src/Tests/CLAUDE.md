# Testing conventions

Tests run with Vitest + Testing Library (jsdom). The suite is **snapshot-free** — tests assert behavior and structure directly (queries, element types, `fireEvent` interactions), not serialized DOM, so there is no `__snapshots__/` to maintain or review.

- **Interaction** (`LocationInput.test.tsx`) — the search is a free-text pill (no ZIP/numeric gate); interaction tests use `fireEvent` (not `userEvent` — not installed) to verify submit (via the magnifying-glass submit button), the "Near me" geolocation action, and the disabled + loading states. The trim/guard tests dispatch `fireEvent.submit` on the form directly.
- **Hook** (`usePickleballMap.test.tsx`) — drives the hook through a `Harness` component against a faked `google.maps` global (the fake `AdvancedMarkerElement` exposes `addEventListener`, matching the real HTMLElement). Captures the hook return in an effect (not during render) to satisfy `react-hooks` lint rules.

`google.maps` types are globally available in tests via the `"google.maps"` entry in `src/Tests/tsconfig.json`. Mock court objects are plain `Court[]` literals (the `Court` interface in `types.ts` is a small view-model, so no casting is needed). `Element.prototype.scrollIntoView` is mocked with `vi.fn()` in `CourtList.test.tsx` since jsdom doesn't implement it. `src/setupTests.ts` registers `@testing-library/jest-dom` and installs an in-memory `localStorage` (Node 22+ ships a disabled native `localStorage` global that shadows jsdom's and throws).
