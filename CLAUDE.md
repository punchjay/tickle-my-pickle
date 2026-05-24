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

React 19 + TypeScript 6 + Vite 8. Entry point is `src/main.tsx` → `src/App.tsx`.

## TypeScript

Strict mode with `noUnusedLocals`, `noUnusedParameters`, and `erasableSyntaxOnly` enforced. Two tsconfig files: `tsconfig.app.json` covers `src/`, `tsconfig.node.json` covers `vite.config.ts`.

## Code style

Prettier config (`.prettierrc`): single quotes, no semicolons, trailing commas, 80-char print width, 2-space indent.

ESLint uses the modern flat config (`eslint.config.js`) with `typescript-eslint`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh`.
