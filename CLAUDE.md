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

React 19 + TypeScript 6 + Vite 8 + styled-components v6 + React Router v7. Entry point is `src/main.tsx` (wraps `<BrowserRouter>`) → `src/App.tsx` (route table) → `src/pages/*`.

## What this app does

Pickleball court finder. User enters a free-text location (city, ZIP, or neighborhood) or uses browser geolocation; the app geocodes the location and runs a Google Maps Places text search ("pickleball court", ~10-mile location bias), drops numbered markers on the map, and shows a scrollable sidebar of results with name, address, rating, open/closed status, and a "Directions" link (opens Google Maps turn-by-turn in a new tab). Selecting a court — by clicking its card or its pin — highlights the card, scrolls it into view, pans the map, and emphasizes that pin. Each card has a star to **save** the court; the sidebar has **Nearby** / **Saved** tabs, and favorites persist across sessions in `localStorage` (`useFavorites`). Note: the Saved tab lives inside the results sidebar, so it's reachable after a search; a pre-search favorites entry point is a documented follow-up. Court cards also show inferred **amenity badges** (indoor/outdoor/lighted/free) — heuristically derived from the listing name and Place `types` (`amenities.ts`), since the Places API carries no structured amenity signal; only high-confidence guesses show by default. See `docs/amenities-tagging-plan.md`.

## Feature backlog / TODO

Candidate work, not yet scheduled. Detailed designs live in `docs/` where noted.

- **`displayedCourts` refactor → filtering & sorting** — central source-of-truth
  array for both sidebar and map markers; unlocks amenity filters, sort-by-rating,
  distance sort, and an open-now filter in one stroke. Gating dependency for the
  next two. See `docs/amenities-tagging-plan.md` (Phase 2).
- **Distance display & sort** — haversine from search center using
  `Court.location`; show miles on cards. No new API calls.
- **Pre-search favorites entry point** — Saved courts are only reachable after a
  search today; add a Saved entry point on the pre-search canvas.
- **Shareable search URLs** — encode the location query (`/?q=Austin`) so searches
  are bookmarkable/shareable.
- **Next.js migration (scoped, not committed)** — the app is a pure client-side
  SPA, so this is mostly a framework/tooling swap unless server features are
  wanted. Shape if pursued:
  - Routing: `App.tsx`/`main.tsx`/`BrowserRouter` → file-based `app/page.tsx`
    (FinderPage), `app/not-found.tsx`, `app/layout.tsx`; `react-router-dom` `Link`
    → `next/link`; `basename` → `basePath`. Next's static export emits its own
    `404.html`, so the `public/404.html` + `index.html` SPA shim is deleted.
  - styled-components SSR: add the registry pattern (`useServerInsertedHTML` + SWC
    `styledComponents` compiler flag); move `GlobalStyle` into `layout.tsx`. The
    `--pf-*` CSS-vars approach (no ThemeProvider) eases this.
  - `'use client'` on the client modules (map hook, favorites, styled-components);
    guard `useFavorites`' `localStorage` initializer with `typeof window`.
  - Env: `VITE_*` → `NEXT_PUBLIC_*` (two `import.meta.env` reads in
    `usePickleballMap.ts` → `process.env.*`); update `.env.example` + `deploy.yml`.
  - Tooling: move Vitest config out of `vite.config.ts` into `vitest.config.ts`;
    rewrite/drop the `MemoryRouter` routing tests (`App.test.tsx`,
    `NotFoundPage.styles.test.tsx`); the other 13 test files are unaffected.
  - Hosting fork: static export keeps GitHub Pages but gives no API
    routes/SSR/image-opt. Server features (hide the Maps key behind a route,
    SSR SEO/metadata, future backend) require moving to a Node host (e.g. Vercel).

## Environment

Requires `VITE_GOOGLE_MAPS_API_KEY` in `.env.local` (gitignored). See `.env.example`. The Google Cloud project needs **Maps JavaScript API**, **Places API (New)**, and **Geocoding API** enabled. The key is website-restricted; because GitHub Pages sends an origin-only referer, the prod referer pattern must be `https://punchjay.github.io/*` (an origin, not a subpath).

Optional `VITE_GOOGLE_MAPS_MAP_ID` selects a **Cloud-styled Map ID** for the retro map theme (import `docs/map-style.json` in the Google Cloud console → Map Management → Map styles, attach it to a Map ID, then set the env var locally + as a GitHub Actions secret — `deploy.yml` injects it). Unset → falls back to `DEMO_MAP_ID` (Google's default styling), so dev works without one.

### Billing & quota safeguards

The Maps key lives in GCP project **`project-6f338a57-964a-40ff-b35`** (project number `718145742726`), billing account **`01071C-F88769-A0BD5A`**. Maps APIs bill the card automatically past the monthly free tier — Google does **not** warn or stop on its own — so two safeguards are in place (managed via `gcloud`, not in this repo):

- **Daily quota caps — the hard ceiling.** Each used API is capped per day; past it, requests fail with `OVER_QUERY_LIMIT` instead of billing (resets midnight Pacific). Currently **1,000/day** on each of: `maps-backend.googleapis.com/billable_default` (Map loads), `geocoding-backend.googleapis.com/billable_default` (v3 geocoding), `places.googleapis.com/SearchTextRequest`. Adjust: `gcloud alpha services quota update --service=<svc> --consumer=projects/project-6f338a57-964a-40ff-b35 --metric=<metric> --unit="1/d/{project}" --value=<n> --force` (needs the `alpha` component).
- **Budget alert — early warning email.** A $1 budget named **"Maps API tripwire ($1)"** (`gcloud billing budgets`, requires `billingbudgets.googleapis.com` enabled) emails the billing admins at 50/90/100% of actual spend + forecasted 100%. Since normal usage sits at $0 in the free tier, the 50% ($0.50) alert is effectively a "you've started paying" tripwire. It only warns; it does not stop usage (that's what the quota caps are for).

## Key files

```
public/
  404.html                   # GitHub Pages SPA deep-link shim (redirects to index.html)
src/
  App.tsx                    # route table (<Routes>): / → FinderPage, * → NotFoundPage
  appData.ts                 # centralized UI copy (single source of truth for user-facing strings)
  amenities.ts               # heuristic amenity tagging (indoor/outdoor/lighted/free) w/ confidence, from name + Place types
  types.ts                   # Court view-model (decoupled from google.maps types)
  theme.ts                   # typed design tokens (palette/semantic/fonts/radii/shadows) — source of truth
  GlobalStyle.ts             # createGlobalStyle: emits --pf-* CSS vars on :root + base type
  index.css                  # global reset only (box-sizing, html/body height)
  pages/
    backdrop.styles.ts       # shared striped-backdrop + fade-in keyframes (FinderPage + NotFoundPage)
    FinderPage.tsx           # the finder: composes map + overlay UI from the hook
    FinderPage.styles.ts     # styled-components for FinderPage
    NotFoundPage.tsx         # 404 page (themed, links back home)
    NotFoundPage.styles.ts   # styled-components for NotFoundPage
  hooks/
    usePickleballMap.ts      # map init, geocoding, Places search, marker state
    useFavorites.ts          # star/unstar courts, persisted to localStorage
  components/
    LocationInput.tsx        # search pill: free-text location input + "Near me" geolocation
    LocationInput.styles.ts  # styled-components for LocationInput
    CourtList.tsx            # sidebar list of nearby courts
    CourtList.styles.ts      # styled-components for CourtList
    ErrorBoundary.tsx        # top-level fallback (wraps App in main.tsx)
    ErrorBoundary.styles.ts  # styled-components for ErrorBoundary
    Spinner.tsx              # RouteFallback: centered loader for the <Suspense> fallback
    Spinner.styles.ts        # shared Spinner indicator (also used inline by LocationInput) + FullPageCenter
    Footer.tsx               # credit footer (© year + email + GitHub icon); shown on the pre-search canvas
    Footer.styles.ts         # styled-components for Footer
  Tests/
    App.test.tsx             # routing tests (finder at /, 404 at unknown route) via MemoryRouter
    LocationInput.test.tsx   # interaction tests
    CourtList.test.tsx       # behavior tests (count, selection, rating, open/closed)
    usePickleballMap.test.tsx # hook tests against a faked google.maps global
    useFavorites.test.tsx     # favorites hook: add/remove/persist/rehydrate (renderHook)
    appData.test.ts          # courtList.heading(count) singular/plural/zero
    amenities.test.ts        # inferAmenities heuristic: tags + confidence from name/types
    Footer.test.tsx          # wordmark/year, mailto + GitHub links
    FinderPage.styles.test.tsx    # per-styled-component render smoke tests
    LocationInput.styles.test.tsx # per-styled-component render smoke tests
    CourtList.styles.test.tsx     # per-styled-component render smoke tests
    ErrorBoundary.styles.test.tsx # per-styled-component render smoke tests
    NotFoundPage.styles.test.tsx  # per-styled-component render smoke tests
    Spinner.styles.test.tsx       # per-styled-component render smoke tests
    Footer.styles.test.tsx        # per-styled-component render smoke tests
```

All map/search logic lives in `usePickleballMap.ts`; `FinderPage.tsx` is a thin
composition layer. Components and tests depend on the `Court` interface in
`types.ts`, not on the Google Maps SDK shape.

## Routing

React Router v7. `main.tsx` wraps the app in `<BrowserRouter basename={import.meta.env.BASE_URL}>` — `BASE_URL` is `/tickle-my-pickle/` in the GitHub Actions build and `/` locally (set by Vite's `base`), so the router and the deploy path always agree. `App.tsx` is the route table; route-level components live in `src/pages/` (one `*.tsx` + sibling `*.styles.ts` each), other UI in `src/components/`.

`FinderPage` (the primary route) is eager; `NotFoundPage` is **lazy-loaded** (`React.lazy` → its own build chunk) behind a `<Suspense>` whose fallback is `RouteFallback` (`components/Spinner.tsx`, a centered shared `Spinner`). Because the 404 is async, `App.test.tsx` awaits it with `findByRole`.

**GitHub Pages has no SPA fallback** — it 404s on any path that isn't a real file, so client routes (and deep links / refreshes on them) break without a shim. `public/404.html` redirects unknown paths to `index.html` with the original path encoded in the query string; a small script at the top of `index.html`'s `<head>` restores it before the router mounts (the [spa-github-pages](https://github.com/rafgraph/spa-github-pages) trick). `404.html` uses `pathSegmentsToKeep = 1` to preserve the `/tickle-my-pickle/` base segment. When adding routes, no shim changes are needed; just keep `404.html` shipping from `public/`.

## Styling

All component styles use **styled-components** (no CSS modules, no utility classes). Conditional styles use transient props (`$propName`) to avoid leaking custom props to the DOM.

**Theme tokens are CSS custom properties (`--pf-*`).** `theme.ts` is the typed source of truth (palette/semantic/fonts/radii/shadows); `GlobalStyle.ts` (`createGlobalStyle`) emits them on `:root` plus the base typography; styled-components reference them via `var(--pf-*)`. This was chosen over a styled-components `ThemeProvider` so tests need no provider wrapping. `index.css` is reset-only — `GlobalStyle` carries the themed globals. Non-CSS consumers (e.g. the map `PinElement` colors) import the `palette` object from `theme.ts`.

**Each component/page keeps its styled-components in a sibling `*.styles.ts`** (`LocationInput.styles.ts`, `CourtList.styles.ts`, `ErrorBoundary.styles.ts`, `pages/FinderPage.styles.ts`, `pages/NotFoundPage.styles.ts`). The component file imports them by name. Prefer a token over a raw hex; a couple of genuine one-offs remain inline (the search pill's white background and placeholder color).

**Text inputs must use `font-size: 1rem` (≥16px) or larger.** iOS Safari auto-zooms (and re-centers the viewport on) any focused form control whose font is under 16px — on the finder that zoom shoved the header card off the top of the screen when the keyboard opened. The base rem is 16px, so `1rem` is the floor; don't drop a focusable input below it. `SearchInput` in `LocationInput.styles.ts` carries an inline comment to this effect.

## TypeScript

Strict mode with `noUnusedLocals`, `noUnusedParameters`, and `erasableSyntaxOnly` enforced. Two tsconfig files: `tsconfig.app.json` covers `src/`, `tsconfig.node.json` covers `vite.config.ts`. Both include `"google.maps"` in the `types` array so the `google.maps.*` global namespace is available without explicit imports.

## Google Maps

Uses `@googlemaps/js-api-loader` functional API (`setOptions` + `importLibrary`). `setOptions` is called **once at module load** (not in the init effect) — StrictMode re-runs effects in dev and a second `setOptions` call warns. The SDK is **loaded lazily, not at startup**: the init effect (which `importLibrary`s `maps`, `places`, `geocoding`, `marker` and builds the map) is gated on an `activated` flag that the hook flips only when the user first engages the search pill (`activateMaps`, wired to the pill's focus/click via `onActivate`). This keeps the map from churning under the backdrop on first paint. A search or "Near me" fired before the SDK finishes loading is stashed in `pendingRef` and replayed by an effect once `mapsReady` turns true; a load failure sets a terminal `loadFailed` flag that re-disables the input. Court search uses the **new Places API** `google.maps.places.Place.searchByText` (text query "pickleball court" with a `locationBias`). Map pins use **`AdvancedMarkerElement`** (the map needs a `mapId` — `VITE_GOOGLE_MAPS_MAP_ID` if set, else `DEMO_MAP_ID`) with numbered `PinElement` glyphs; use the **current**, non-deprecated API: `PinElement({ glyphText })`, pass the `PinElement` directly as `content` (not `pin.element`), and listen via `addEventListener('gmp-click', …)` (not `addListener('click', …)`). Pins are built by the `makePin(index, selected)` helper; an effect re-skins them on selection change so the selected court's pin renders dark (`midnight`) at a larger scale with a raised `zIndex`. Google `Place` results are mapped into the local `Court` interface in the hook, so the rest of the app never touches the SDK shape.

**Map theming:** because the map uses a `mapId`, the legacy inline `styles: [...]` JSON option is ignored — color styling must be **Cloud-based**, attached to the Map ID. The retro style lives in `docs/map-style.json` (theme-derived: ivory land, court-blue water, warm roads, POI/transit hidden); import it in the console and point `VITE_GOOGLE_MAPS_MAP_ID` at the styled Map ID.

## Testing

Tests live in `src/Tests/` and run with Vitest + Testing Library (jsdom). Fifteen test files. The suite is **snapshot-free** — tests assert behavior and structure directly (queries, element types, `fireEvent` interactions), not serialized DOM, so there is no `__snapshots__/` to maintain or review.

- **Routing** (`App.test.tsx`) — renders `<App />` inside a `MemoryRouter` and asserts the finder renders at `/` (header title/tagline + search input) and the 404 page renders at an unknown route (awaited with `findByRole` since `NotFoundPage` is lazy).
- **Copy** (`appData.test.ts`) — unit-tests the only logic in `appData.ts`, `courtList.heading(count)` (singular/plural/zero). The other entries are constant strings, covered indirectly by the component/routing tests.
- **Amenities** (`amenities.test.ts`) — unit-tests the `inferAmenities` heuristic: which tags fire from a listing's name + Place `types`, and the `high`/`low` confidence assigned to each.
- **Behavior** (`CourtList.test.tsx`) — renders with mock court data and asserts the Nearby/Saved tab counts, `onSelect` on click, scroll-into-view on selection change, conditional rating / open-closed rendering, the directions link, the star toggle (calls `onToggleFavorite`, doesn't select the row, reflects `aria-pressed`), and the Saved tab (lists favorites, empty state).
- **Interaction** (`LocationInput.test.tsx`) — the search is a free-text pill (no ZIP/numeric gate); interaction tests use `fireEvent` (not `userEvent` — not installed) to verify submit (via the magnifying-glass submit button), the "Near me" geolocation action, and the disabled + loading states. The trim/guard tests dispatch `fireEvent.submit` on the form directly.
- **Styled-components smoke** (`FinderPage.styles.test.tsx`, `LocationInput.styles.test.tsx`, `CourtList.styles.test.tsx`, `ErrorBoundary.styles.test.tsx`, `NotFoundPage.styles.test.tsx`, `Spinner.styles.test.tsx`, `Footer.styles.test.tsx`) — one per `*.styles.ts` file; each renders every export and asserts it mounts as the expected element type (and, where a child is passed, its text). Conditional styled-components are rendered in both prop states; `NotFoundPage`'s `HomeLink` (a `styled(Link)`) is wrapped in a `MemoryRouter`.
- **Footer** (`Footer.test.tsx`) — query-based: asserts the wordmark + current year, the `mailto:` email link, and the GitHub link (new tab, `rel="noopener noreferrer"`).
- **Hook** (`usePickleballMap.test.tsx`) — drives the hook through a `Harness` component against a faked `google.maps` global (the fake `AdvancedMarkerElement` exposes `addEventListener`, matching the real HTMLElement). Captures the hook return in an effect (not during render) to satisfy `react-hooks` lint rules.

`google.maps` types are globally available in tests via the `"google.maps"` entry in `src/Tests/tsconfig.json`. Mock court objects are plain `Court[]` literals (the `Court` interface in `types.ts` is a small view-model, so no casting is needed). `Element.prototype.scrollIntoView` is mocked with `vi.fn()` in `CourtList.test.tsx` since jsdom doesn't implement it. `src/setupTests.ts` registers `@testing-library/jest-dom` and installs an in-memory `localStorage` (Node 22+ ships a disabled native `localStorage` global that shadows jsdom's and throws).

## CI

`.github/workflows/ci.yml` (named **CI**) runs on every pull request and push to `main`: `lint`, `typecheck`, `test`, `build`. `main` is **branch-protected** — the `verify` check must pass before merge (`enforce_admins: false`, so admins can still bypass).

`.github/workflows/deploy.yml` deploys to GitHub Pages **only after CI succeeds** — it triggers via `workflow_run` on the CI workflow completing on `main` and runs only when the conclusion is `success` (plus a manual `workflow_dispatch` escape hatch). It builds with the `VITE_GOOGLE_MAPS_API_KEY` secret and publishes `dist/`.

`.github/workflows/release-please.yml` automates releases: it opens/updates a release PR aggregating Conventional Commits on `main`; merging that PR cuts the tag + GitHub release and bumps `package.json`/`CHANGELOG.md`. Config in `release-please-config.json` + `.release-please-manifest.json`. Release PRs are **auto-merged** — the workflow's `Auto-merge the release PR` step merges the freshly-opened release PR with `gh pr merge --squash --admin`, so a version ships on every feature/fix merge without a manual step. That merge uses a **`RELEASE_PLEASE_PAT`** secret (a fine-grained PAT with Contents + Pull-requests read/write), **not** the default `GITHUB_TOKEN`: GitHub won't trigger new workflow runs from `GITHUB_TOKEN` actions, so a `GITHUB_TOKEN` merge would neither re-run release-please to cut the tag/release nor run CI on the merge commit (which gates the Pages deploy). The `--admin` flag is needed because release-please's own PRs are created by `GITHUB_TOKEN`, so CI does **not** run on them and the required `verify` check never reports. If the `RELEASE_PLEASE_PAT` secret is absent the auto-merge step skips cleanly and you merge the release PR by hand with `gh pr merge <num> --squash --admin`.

Dependabot (`.github/dependabot.yml`) opens grouped weekly npm + actions update PRs.

## Claude API

Default model for any Claude API integrations in this project: `claude-opus-4-8`.

## Code style

Prettier config (`.prettierrc`): single quotes, no semicolons, trailing commas, 80-char print width, 2-space indent.

ESLint uses the modern flat config (`eslint.config.js`) with `typescript-eslint`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh`. The `react-hooks/set-state-in-effect` rule is active — initialize state from a lazy initializer rather than calling `setState` synchronously inside `useEffect`.

**Components are arrow functions.** Define React components as arrow-function consts with a trailing `export default Name` (`const Foo = (props: Props) => { … }` then `export default Foo`), not `function` declarations — this is the consistent style across the codebase, including inner sub-components (e.g. icon helpers) and test components like `Harness`. The sole exception is `ErrorBoundary`, which must stay a class (error boundaries require `componentDidCatch`/`getDerivedStateFromError`). Plain (non-component) helpers — including test utilities like `makePlace`/`installGoogle` — may keep `function` declarations where hoisting is convenient.
