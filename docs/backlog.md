# Feature backlog / TODO

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
