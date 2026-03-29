# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev       # Start dev server (Vite HMR)
pnpm build     # Production build
pnpm preview   # Preview production build locally
pnpm lint      # ESLint check
```

No test framework is configured.

## Architecture

This is a **single-page application** built with React 19 + Vite for a Chinese intangible cultural heritage (非遗) educational website about 梆鼓咚 (Banggu Dong, a traditional Putian drum art). There is no router library — routing is entirely hash-based (`#/home`, `#/works`, etc.) using `window.location.hash` and a `hashchange` event listener.

### Key files

- **`src/App.jsx`** — The entire application lives in one file (~1800 lines). All static data (inheritors, activities, courses, products, etc.), all state, and all render functions are defined here.
- **`src/App.css`** — All styles in one file. CSS custom properties (`--primary`, `--font-display`, etc.) are defined at `:root`.
- **`src/ClickEffect.jsx`** — Standalone decorative click animation component (plum blossom petals + gold sparks). Mounts once in `App`, listens to all document clicks.
- **`src/index.css`** — Global reset/base styles.

### Routing

`getRouteFromHash()` returns a `{ name: string, id?: number }` object. `renderPage()` switches on `route.name` to call the appropriate `render*()` function. All `render*()` functions are nested **inside** the `App` component.

Routes: `home`, `works`, `inheritors`, `activities`, `course`, `mall`, `game`, `product` (with id), `qa`, `announcements`, `login`, `profile`, `heritage`.

### State

All state is in the single `App` component. There is no context, Redux, or external state management. Auth is persisted to `localStorage` (`chuyi_auth_user`, `chuyi_users`).

### Static data

All data (inheritors, activities, courses, products, heritage works, etc.) is defined as `const` arrays at module scope in `App.jsx`. There is no backend.

### Vite plugins (vite.config.js)

- **`unityGzipPlugin`** — Dev middleware that sets correct `Content-Encoding: gzip` headers for Unity WebGL assets under `/game`.
- **`qaProxyPlugin`** — Dev-only POST proxy at `/api/qa` that forwards questions to NVIDIA's LLM API (Llama 3.1 8B). API key is read from `process.env.NVIDIA_API_KEY`.

### Audio synthesis

Module-scope functions (`playDrum`, `playBangzi`, `playZhuban`, `playXingmu`) use the Web Audio API to synthesize traditional instrument sounds. Mapped via `INSTR_SOUNDS` and `INSTR_NAMES` objects.

### Scroll reveal animations

`useScrollReveal(selector, routeName)` is a custom hook defined at module scope (outside `App`). It uses `IntersectionObserver` to add a `.revealed` class to matching elements once they enter the viewport. Called four times inside `App` with selectors `.section-heading`, `.reveal-up`, `.reveal-left`, `.reveal-scale`. The `routeName` dependency causes the observer to rebind after route changes.

### Images

All images are served from `public/pptx-imgs/`. Referenced via the `IMG` constant object at the top of `App.jsx`.

### CSS conventions

- Card hover effects use `transition: box-shadow 0.2s, transform 0.2s` on the base rule.
- `.news-card` is an alias for media report cards that shares all `.activity-card` CSS rules.
- `prefers-reduced-motion` media query disables all scroll reveal animations.

## ESLint

`no-unused-vars` ignores variables matching `/^[A-Z_]/` (screaming snake case), so module-level constants won't trigger warnings.
