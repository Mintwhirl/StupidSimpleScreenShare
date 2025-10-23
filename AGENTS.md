# Repository Guidelines

## Project Structure & Module Organization

- `src/` — React 19 client (components, hooks, contexts, utils, config). Example: `src/components/HostView.jsx`, `src/hooks/useWebRTC.js`.
- `api/` — Vercel serverless endpoints (signaling, auth, room, diagnostics). Shared logic in `shared/signaling/`.
- `tests/` — Unit/integration (`tests/unit`, `tests/integration`) and Playwright E2E (`tests/e2e`). Some hook tests live near sources (e.g., `src/hooks/useApi.test.js`).
- `docs/` — Architecture and API references. Start with `docs/ARCHITECTURE_DECISIONS.md` and `docs/API.md`.
- `dist/` — Build output (generated). Do not edit.

## Build, Test, and Development Commands

- `npm ci` — Install exact dependencies (Node 22.x required).
- `npm run dev` — Start Vite dev server.
- `npm run build` / `npm run preview` — Production build and local preview.
- `npm run lint` / `npm run lint:fix` — ESLint (Airbnb base) checks and autofix.
- `npm run format` / `npm run format:check` — Prettier write/check.
- `npm run test` / `npm run test:watch` — Vitest unit/integration.
- `npm run test:coverage` — Coverage report (no hard threshold enforced).
- `npm run test:e2e` — Playwright tests (first time: `npx playwright install`).
- `npm run check` — Lint, format check, unit, and E2E in one.

## Coding Style & Naming Conventions

- 2-space indentation; Prettier formatting; semicolons required.
- Components: `PascalCase.jsx` (e.g., `ViewerView.jsx`).
- Hooks: `useX.js` (e.g., `useRoomManagement.js`).
- Utilities/constants: `camelCase.js` / `constants/index.js`.
- Prefer pure functions in `utils/`; keep side effects in hooks/components.

## Testing Guidelines

- Frameworks: Vitest + Testing Library (unit/integration), Playwright (E2E).
- Place new tests under `tests/unit|integration|e2e` mirroring `src/` paths; name `*.test.js` (E2E may use `*.spec.js`).
- Write deterministic tests; avoid network calls—mock signaling/Redis where applicable.
- Run `npm run test:watch` while developing and `npm run test:coverage` before PRs.

## Commit & Pull Request Guidelines

- Commits: concise imperative subject (max ~72 chars), include scope when helpful (e.g., "api: fix offer cleanup").
- Pre-commit runs `lint-staged`; ensure `npm run check` passes locally.
- PRs: clear description, linked issues, screenshots for UI, test plan/coverage notes, and docs updates when behavior or APIs change.

## Security & Configuration Tips

- Never commit secrets; use environment variables. See `docs/API.md` and `api/config.js` for required keys and defaults.
- Review rate limiting and auth in `api/_utils.js` and `shared/signaling/` before changing request flows.
