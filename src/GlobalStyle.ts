import { createGlobalStyle } from 'styled-components'
import { palette, semantic, fonts, radii } from './theme'

// Emits the retro theme as CSS custom properties on :root plus the themed
// typographic base. The `--pf-*` names mirror the Dinkly mood board so the
// styled-components elsewhere can reference them directly via `var(--pf-*)`.
// (The reset-only globals stay in index.css; this layer is theme + base type.)
export const GlobalStyle = createGlobalStyle`
  :root {
    /* Brand palette (raw) */
    --pf-ivory: ${palette.ivory};
    --pf-surface: ${palette.surface};
    --pf-terracotta: ${palette.terracotta};
    --pf-terracotta-dark: ${palette.terracottaDark};
    --pf-marigold: ${palette.marigold};
    --pf-tomato: ${palette.tomato};
    --pf-court-blue: ${palette.courtBlue};
    --pf-midnight: ${palette.midnight};
    --pf-caramel: ${palette.caramel};
    --pf-lime: ${palette.lime};
    --pf-sunshine: ${palette.sunshine};

    /* Semantic aliases */
    --pf-bg: ${semantic.bg};
    --pf-card: ${semantic.card};
    --pf-text: ${semantic.text};
    --pf-text-muted: ${semantic.textMuted};
    --pf-primary: ${semantic.primary};
    --pf-primary-hover: ${semantic.primaryHover};
    --pf-link: ${semantic.link};
    --pf-border: ${semantic.border};
    --pf-border-soft: ${semantic.borderSoft};

    /* Typography */
    --pf-font-display: ${fonts.display};
    --pf-font-body: ${fonts.body};
    --pf-font-accent: ${fonts.accent};

    /* Radii */
    --pf-radius-sm: ${radii.sm};
    --pf-radius-md: ${radii.md};
    --pf-radius-pill: ${radii.pill};
  }

  body {
    background: var(--pf-bg);
    color: var(--pf-text);
    font-family: var(--pf-font-body);
    font-size: 16px;
    line-height: 1.55;
  }

  h1, h2, h3 {
    font-family: var(--pf-font-display);
    letter-spacing: 0.02em;
    color: var(--pf-text);
    font-weight: 400;
  }
  h1 { font-size: 2.75rem; line-height: 0.95; }
  h2 { font-size: 2rem; line-height: 1; }
  h3 { font-size: 1.4rem; }

  a { color: var(--pf-link); text-decoration: none; }
  a:hover { text-decoration: underline; }
`
