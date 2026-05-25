# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # dev server (Vite, localhost:5173)
npm run build      # type-check + production build → dist/
npm run lint       # ESLint on src/
npm run format     # Prettier on src/
npm run preview    # preview production build locally
npm test           # run all tests once (Vitest)
npm run test:watch # watch mode
```

To run a single test file:

```bash
npx vitest run src/Tests/MyComponent.test.tsx
```

## Stack

React 19 + TypeScript 6 + Vite 8 + styled-components v6. Entry point is `src/main.tsx` → `src/App.tsx`.

## What this app does

Pickleball court finder. User enters a zip code or uses browser geolocation; the app geocodes the location and runs a Google Maps Places nearby search (keyword: "pickleball", 10-mile radius), drops numbered markers on the map, and shows a scrollable sidebar of results with name, address, rating, and open/closed status.

## Environment

Requires `VITE_GOOGLE_MAPS_API_KEY` in `.env.local` (gitignored). See `.env.example`. The Google Cloud project needs **Maps JavaScript API**, **Places API**, and **Geocoding API** enabled.

## Key files

```
src/
  App.tsx                    # root: map init, geocoding, Places search, state
  components/
    LocationInput.tsx        # zip input + geolocation button
    CourtList.tsx            # sidebar list of nearby courts
  index.css                  # global reset only (box-sizing, html/body height)
  App.css                    # intentionally empty — all styles are in styled-components
  Tests/
    App.test.tsx             # smoke test (renders without crashing)
    LocationInput.test.tsx   # snapshot + interaction tests
    CourtList.test.tsx       # snapshot tests (unselected and selected states)
    __snapshots__/           # committed — update with: vitest -u
```

## Styling

All component styles use **styled-components** (no CSS modules, no utility classes). Conditional styles use transient props (`$propName`) to avoid leaking custom props to the DOM. `App.css` is kept as an empty file; do not add CSS there.

## TypeScript

Strict mode with `noUnusedLocals`, `noUnusedParameters`, and `erasableSyntaxOnly` enforced. Two tsconfig files: `tsconfig.app.json` covers `src/`, `tsconfig.node.json` covers `vite.config.ts`. Both include `"google.maps"` in the `types` array so the `google.maps.*` global namespace is available without explicit imports.

## Google Maps

Uses `@googlemaps/js-api-loader` functional API (`setOptions` + `importLibrary`). Loads three libraries at startup: `maps`, `places`, `geocoding`. The legacy `google.maps.places.PlacesService.nearbySearch` API is used for court search; `google.maps.Marker` (legacy) is used for map pins.

## Testing

Tests live in `src/Tests/` and run with Vitest + Testing Library (jsdom). Three test files, three strategies:

- **Smoke** (`App.test.tsx`) — confirms the root component mounts without crashing. No snapshot; `App` is too stateful and async to snapshot meaningfully.
- **Snapshot** (`CourtList.test.tsx`) — renders with mock court data and serializes the DOM. Catches unintended markup or style changes. Update snapshots intentionally with `vitest -u`.
- **Snapshot + interaction** (`LocationInput.test.tsx`) — one snapshot for the default render; interaction tests use `fireEvent` (not `userEvent` — not installed) to verify submit behavior, the 5-digit gate on the Search button, and the disabled state.

`google.maps` types are globally available in tests via the `"google.maps"` entry in `src/Tests/tsconfig.json`. Mock court objects use `as unknown as Court[]` to satisfy the type without implementing the full `PlaceResult` shape. `Element.prototype.scrollIntoView` is mocked with `vi.fn()` in `CourtList.test.tsx` since jsdom doesn't implement it.

## Code style

Prettier config (`.prettierrc`): single quotes, no semicolons, trailing commas, 80-char print width, 2-space indent.

ESLint uses the modern flat config (`eslint.config.js`) with `typescript-eslint`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh`. The `react-hooks/set-state-in-effect` rule is active — initialize state from a lazy initializer rather than calling `setState` synchronously inside `useEffect`.
