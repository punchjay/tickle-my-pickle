# Tickle My Pickle

Find pickleball courts near you. Enter a zip code or use your device's location — the app drops numbered markers on a Google Map and lists nearby courts with ratings and hours.

## Setup

**1. Get a Google Maps API key**

Create a project in [Google Cloud Console](https://console.cloud.google.com) and enable:
- Maps JavaScript API
- Places API
- Geocoding API

**2. Add your key**

```bash
cp .env.example .env.local
# then edit .env.local and replace YOUR_KEY_HERE
```

**3. Run it**

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`.

## Stack

React 19 · TypeScript 6 · Vite 8 · styled-components v6 · Google Maps JS API

## Commands

```bash
npm run dev        # dev server
npm run build      # type-check + production build
npm test           # run tests
npm run lint       # ESLint
npm run format     # Prettier
```
