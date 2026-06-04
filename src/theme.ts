// Pickle Finder — retro theme tokens, derived from the Dinkly mood board.
// Single source of truth for colors/fonts/radii. GlobalStyle emits these as
// CSS custom properties (`--pf-*`); styled-components reference them via
// `var(--pf-*)`. Raw palette values are also exported for non-CSS consumers
// (e.g. Google Maps PinElement, which takes color strings, not CSS vars).

export const palette = {
  ivory: '#EFE7D3', // canvas / page background
  surface: '#FBF6EA', // cards, panels
  terracotta: '#E07C53', // primary action (grip/border)
  terracottaDark: '#C4633D', // primary hover/active
  marigold: '#E29A33', // ratings, secondary accent
  tomato: '#C8442B', // alerts / strong accent
  courtBlue: '#2E5A86', // links, map UI
  midnight: '#1E2D49', // primary text / dark buttons
  caramel: '#9C6B3C', // muted labels, hairlines
  lime: '#CFE24A', // "free" / open pop
  sunshine: '#F4D62E', // "lighted" / highlight pop
} as const

// Semantic aliases (prefer these in components).
export const semantic = {
  bg: palette.ivory,
  card: palette.surface,
  text: palette.midnight,
  textMuted: palette.caramel,
  primary: palette.terracotta,
  primaryHover: palette.terracottaDark,
  link: palette.courtBlue,
  border: '#DCCFB0',
  borderSoft: '#E2D6BC',
  open: '#3B6D11', // "open now" status (mood board "free" badge text)
  closed: palette.tomato, // "closed" status
} as const

export const fonts = {
  display: "'Bebas Neue', sans-serif", // big headings, court names
  body: "'DM Sans', system-ui, sans-serif",
  accent: "'Fredoka', sans-serif", // wordmark, playful labels
} as const

export const radii = {
  sm: '8px',
  md: '12px',
  pill: '999px',
} as const

export const shadows = {
  card: '0 2px 12px rgba(30, 45, 73, 0.18)', // floating cards/panels
} as const
