# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # dev server (Vite, localhost:5173)
npm run build      # type-check + production build → dist/
npm run typecheck  # tsc over src/ and src/Tests/ (no emit)
npm run lint       # ESLint on src/
npm run format     # Prettier on src/
npm run preview    # preview production build locally (localhost:4173)
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

Pickleball court finder. User enters a free-text location (city, ZIP, or neighborhood) or uses browser geolocation; the app geocodes the location and runs a Google Maps Places text search ("pickleball court", ~10-mile location bias), drops numbered markers on the map, and shows a scrollable sidebar of results with name, address, rating, and open/closed status.

## Environment

Requires `VITE_GOOGLE_MAPS_API_KEY` in `.env.local` (gitignored). See `.env.example`. The Google Cloud project needs **Maps JavaScript API**, **Places API (New)**, and **Geocoding API** enabled. The key is website-restricted; because GitHub Pages sends an origin-only referer, the prod referer pattern must be `https://punchjay.github.io/*` (an origin, not a subpath).

## Key files

```
src/
  App.tsx                    # root: composes map + overlay UI from the hook
  App.styles.ts              # styled-components for App.tsx
  types.ts                   # Court view-model (decoupled from google.maps types)
  theme.ts                   # typed design tokens (palette/semantic/fonts/radii/shadows) — source of truth
  GlobalStyle.ts             # createGlobalStyle: emits --pf-* CSS vars on :root + base type
  index.css                  # global reset only (box-sizing, html/body height)
  hooks/
    usePickleballMap.ts      # map init, geocoding, Places search, marker state
  components/
    LocationInput.tsx        # search pill: free-text location input + "Near me" geolocation
    LocationInput.styles.ts  # styled-components for LocationInput
    CourtList.tsx            # sidebar list of nearby courts
    CourtList.styles.ts      # styled-components for CourtList
    ErrorBoundary.tsx        # top-level fallback (wraps App in main.tsx)
    ErrorBoundary.styles.ts  # styled-components for ErrorBoundary
  Tests/
    App.test.tsx             # smoke test (mounts; asserts header + search render)
    LocationInput.test.tsx   # snapshot + interaction tests
    CourtList.test.tsx       # snapshot tests (unselected and selected states)
    usePickleballMap.test.tsx # hook tests against a faked google.maps global
    App.styles.test.tsx           # per-styled-component render + snapshot tests
    LocationInput.styles.test.tsx # per-styled-component render + snapshot tests
    CourtList.styles.test.tsx     # per-styled-component render + snapshot tests
    ErrorBoundary.styles.test.tsx # per-styled-component render + snapshot tests
    __snapshots__/           # committed — update with: vitest -u
```

All map/search logic lives in `usePickleballMap.ts`; `App.tsx` is a thin
composition layer. Components and tests depend on the `Court` interface in
`types.ts`, not on the Google Maps SDK shape.

## Styling

All component styles use **styled-components** (no CSS modules, no utility classes). Conditional styles use transient props (`$propName`) to avoid leaking custom props to the DOM.

**Theme tokens are CSS custom properties (`--pf-*`).** `theme.ts` is the typed source of truth (palette/semantic/fonts/radii/shadows); `GlobalStyle.ts` (`createGlobalStyle`) emits them on `:root` plus the base typography; styled-components reference them via `var(--pf-*)`. This was chosen over a styled-components `ThemeProvider` so snapshots stay deterministic and tests need no provider wrapping. `index.css` is reset-only — `GlobalStyle` carries the themed globals. Non-CSS consumers (e.g. the map `PinElement` colors) import the `palette` object from `theme.ts`.

**Each component keeps its styled-components in a sibling `*.styles.ts`** (`LocationInput.styles.ts`, `CourtList.styles.ts`, `ErrorBoundary.styles.ts`), and `App.tsx`'s styles are in `App.styles.ts`. The component file imports them by name. Prefer a token over a raw hex; a couple of genuine one-offs remain inline (the search pill's white background and placeholder color).

## TypeScript

Strict mode with `noUnusedLocals`, `noUnusedParameters`, and `erasableSyntaxOnly` enforced. Two tsconfig files: `tsconfig.app.json` covers `src/`, `tsconfig.node.json` covers `vite.config.ts`. Both include `"google.maps"` in the `types` array so the `google.maps.*` global namespace is available without explicit imports.

## Google Maps

Uses `@googlemaps/js-api-loader` functional API (`setOptions` + `importLibrary`). `setOptions` is called **once at module load** (not in the init effect) — StrictMode re-runs effects in dev and a second `setOptions` call warns. Loads four libraries at startup: `maps`, `places`, `geocoding`, `marker`. Court search uses the **new Places API** `google.maps.places.Place.searchByText` (text query "pickleball court" with a `locationBias`). Map pins use **`AdvancedMarkerElement`** (the map needs a `mapId` — `DEMO_MAP_ID` in dev) with numbered `PinElement` glyphs; use the **current**, non-deprecated API: `PinElement({ glyphText })`, pass the `PinElement` directly as `content` (not `pin.element`), and listen via `addEventListener('gmp-click', …)` (not `addListener('click', …)`). Google `Place` results are mapped into the local `Court` interface in the hook, so the rest of the app never touches the SDK shape.

## Testing

Tests live in `src/Tests/` and run with Vitest + Testing Library (jsdom). Eight test files:

- **Smoke** (`App.test.tsx`) — confirms the root component mounts without crashing and that the header card title/tagline and search input render. No DOM snapshot; `App` is too stateful and async to snapshot meaningfully.
- **Snapshot** (`CourtList.test.tsx`) — renders with mock court data and serializes the DOM. Catches unintended markup or style changes. Update snapshots intentionally with `vitest -u`.
- **Snapshot + interaction** (`LocationInput.test.tsx`) — the search is a free-text pill (no ZIP/numeric gate). One snapshot for the default render; interaction tests use `fireEvent` (not `userEvent` — not installed) to verify submit (via the magnifying-glass submit button), the "Near me" geolocation action, and the disabled + loading states. The trim/guard tests dispatch `fireEvent.submit` on the form directly.
- **Styled-components** (`App.styles.test.tsx`, `LocationInput.styles.test.tsx`, `CourtList.styles.test.tsx`, `ErrorBoundary.styles.test.tsx`) — one per `*.styles.ts` file; each renders every export, asserts the element type, and snapshots the inlined CSS. Conditional styled-components are rendered in both prop states.
- **Hook** (`usePickleballMap.test.tsx`) — drives the hook through a `Harness` component against a faked `google.maps` global (the fake `AdvancedMarkerElement` exposes `addEventListener`, matching the real HTMLElement). Captures the hook return in an effect (not during render) to satisfy `react-hooks` lint rules.

`google.maps` types are globally available in tests via the `"google.maps"` entry in `src/Tests/tsconfig.json`. Mock court objects are plain `Court[]` literals (the `Court` interface in `types.ts` is a small view-model, so no casting is needed). `Element.prototype.scrollIntoView` is mocked with `vi.fn()` in `CourtList.test.tsx` since jsdom doesn't implement it.

Snapshots **must be committed** (they are not gitignored) — CI runs with `vitest run`, which fails rather than writes missing snapshots. `src/setupTests.ts` registers the `jest-styled-components` serializer so snapshots show inlined CSS with stable `c0/c1` class names instead of runtime-generated `sc-*` IDs; this keeps them deterministic across machines and CI.

## CI

`.github/workflows/ci.yml` (named **CI**) runs on every pull request and push to `main`: `lint`, `typecheck`, `test`, `build`. `main` is **branch-protected** — the `verify` check must pass before merge (`enforce_admins: false`, so admins can still bypass).

`.github/workflows/deploy.yml` deploys to GitHub Pages **only after CI succeeds** — it triggers via `workflow_run` on the CI workflow completing on `main` and runs only when the conclusion is `success` (plus a manual `workflow_dispatch` escape hatch). It builds with the `VITE_GOOGLE_MAPS_API_KEY` secret and publishes `dist/`.

`.github/workflows/release-please.yml` automates releases: it opens/updates a release PR aggregating Conventional Commits on `main`; merging that PR cuts the tag + GitHub release and bumps `package.json`/`CHANGELOG.md`. Config in `release-please-config.json` + `.release-please-manifest.json`. Note: release-please's own PRs are created by `GITHUB_TOKEN`, so CI does **not** run on them and the required `verify` check never reports — merge them with `gh pr merge <num> --squash --admin`.

Dependabot (`.github/dependabot.yml`) opens grouped weekly npm + actions update PRs.

## Claude API

Default model for any Claude API integrations in this project: `claude-opus-4-8`.

## Code style

Prettier config (`.prettierrc`): single quotes, no semicolons, trailing commas, 80-char print width, 2-space indent.

ESLint uses the modern flat config (`eslint.config.js`) with `typescript-eslint`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh`. The `react-hooks/set-state-in-effect` rule is active — initialize state from a lazy initializer rather than calling `setState` synchronously inside `useEffect`.
