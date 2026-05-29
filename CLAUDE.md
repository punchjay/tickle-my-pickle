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
  App.tsx                    # root: composes map + overlay UI from the hook
  types.ts                   # Court view-model (decoupled from google.maps types)
  hooks/
    usePickleballMap.ts      # map init, geocoding, Places search, marker state
  components/
    LocationInput.tsx        # zip input + geolocation button
    CourtList.tsx            # sidebar list of nearby courts
    ErrorBoundary.tsx        # top-level fallback (wraps App in main.tsx)
  index.css                  # global reset only (box-sizing, html/body height)
  App.css                    # intentionally empty — all styles are in styled-components
  Tests/
    App.test.tsx             # smoke test (renders without crashing)
    LocationInput.test.tsx   # snapshot + interaction tests
    CourtList.test.tsx       # snapshot tests (unselected and selected states)
    __snapshots__/           # committed — update with: vitest -u
```

All map/search logic lives in `usePickleballMap.ts`; `App.tsx` is a thin
composition layer. Components and tests depend on the `Court` interface in
`types.ts`, not on the Google Maps SDK shape.

## Styling

All component styles use **styled-components** (no CSS modules, no utility classes). Conditional styles use transient props (`$propName`) to avoid leaking custom props to the DOM. `App.css` is kept as an empty file; do not add CSS there.

## TypeScript

Strict mode with `noUnusedLocals`, `noUnusedParameters`, and `erasableSyntaxOnly` enforced. Two tsconfig files: `tsconfig.app.json` covers `src/`, `tsconfig.node.json` covers `vite.config.ts`. Both include `"google.maps"` in the `types` array so the `google.maps.*` global namespace is available without explicit imports.

## Google Maps

Uses `@googlemaps/js-api-loader` functional API (`setOptions` + `importLibrary`). Loads four libraries at startup: `maps`, `places`, `geocoding`, `marker`. Court search uses the **new Places API** `google.maps.places.Place.searchByText` (text query "pickleball court" with a `locationBias`). Map pins use **`AdvancedMarkerElement`** with numbered `PinElement` glyphs (the map needs a `mapId` — `DEMO_MAP_ID` in dev). Google `Place` results are mapped into the local `Court` interface in the hook, so the rest of the app never touches the SDK shape.

## Testing

Tests live in `src/Tests/` and run with Vitest + Testing Library (jsdom). Three test files, three strategies:

- **Smoke** (`App.test.tsx`) — confirms the root component mounts without crashing. No snapshot; `App` is too stateful and async to snapshot meaningfully.
- **Snapshot** (`CourtList.test.tsx`) — renders with mock court data and serializes the DOM. Catches unintended markup or style changes. Update snapshots intentionally with `vitest -u`.
- **Snapshot + interaction** (`LocationInput.test.tsx`) — one snapshot for the default render; interaction tests use `fireEvent` (not `userEvent` — not installed) to verify submit behavior, the 5-digit gate on the Search button, and the disabled state.

`google.maps` types are globally available in tests via the `"google.maps"` entry in `src/Tests/tsconfig.json`. Mock court objects are plain `Court[]` literals (the `Court` interface in `types.ts` is a small view-model, so no casting is needed). `Element.prototype.scrollIntoView` is mocked with `vi.fn()` in `CourtList.test.tsx` since jsdom doesn't implement it.

## CI

`.github/workflows/ci.yml` runs on every pull request and push to `main`: `lint`, `typecheck`, `test`, `build`. `.github/workflows/deploy.yml` deploys to GitHub Pages on push to `main`. Dependabot (`.github/dependabot.yml`) opens grouped weekly npm + actions update PRs.

## Claude API

Default model for any Claude API integrations in this project: `claude-opus-4-8`.

## Code style

Prettier config (`.prettierrc`): single quotes, no semicolons, trailing commas, 80-char print width, 2-space indent.

ESLint uses the modern flat config (`eslint.config.js`) with `typescript-eslint`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh`. The `react-hooks/set-state-in-effect` rule is active — initialize state from a lazy initializer rather than calling `setState` synchronously inside `useEffect`.
