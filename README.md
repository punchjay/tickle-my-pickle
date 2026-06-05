# Tickle My Pickle

Find pickleball courts near you. Enter a free-text location (city, ZIP, or neighborhood) or use your device's location — the app drops numbered markers on a Google Map and lists nearby courts with ratings and hours.

## Setup

### 1. Get a Google Maps API key

Create a project in [Google Cloud Console](https://console.cloud.google.com) and enable:

- Maps JavaScript API
- Places API
- Geocoding API

### 2. Add your key

```bash
cp .env.example .env.local
# then edit .env.local and replace YOUR_KEY_HERE
```

> **Restrict your key.** The key is bundled into the static client and is publicly
> visible. In Google Cloud Console, add an **HTTP referrer restriction** (your
> dev `localhost` and deployed Pages domain) and an **API restriction** limiting
> it to Maps JavaScript, Places, and Geocoding only. This prevents others from
> lifting it from the bundle and burning your quota.

> **Cap spending.** Maps APIs bill a card automatically past the monthly free
> tier — Google does **not** warn you or stop on its own. Two opt-in safeguards:
>
> 1. **Daily quota caps (hard ceiling).** APIs & Services → each API → **Quotas**
>    → set a low "requests per day" limit. Past it, requests **fail instead of
>    billing** — the only thing that actually prevents charges (e.g. if a scraped
>    key gets abused).
> 2. **Budget alert (email warning).** Billing → **Budgets & alerts** → create a
>    small budget (e.g. $1) with 50/90/100% thresholds. Emails you when crossed —
>    informational only; it does **not** stop usage.
>
> A personal-scale deployment stays comfortably within the free tier, but the
> daily cap guarantees a leaked key can't run up a bill.

### 3. Run it

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`.

## Stack

React 19 · TypeScript 6 · Vite 8 · styled-components v6 · React Router v7 · Google Maps JS API

## Commands

```bash
npm run dev        # dev server (localhost:5173)
npm run build      # type-check + production build → dist/
npm run preview    # preview the production build (localhost:4173)
npm run typecheck  # tsc over src/ and src/Tests/ (no emit)
npm run lint       # ESLint
npm run format     # Prettier
npm test           # run tests once
npm run test:watch # tests in watch mode
```
