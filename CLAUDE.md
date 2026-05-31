# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # start dev server at localhost:5173/playGround-react/
npm run build        # typecheck + vite build + copy 404.html
npm run test         # vitest (watch mode)
npm run test -- --run  # vitest single run (used in CI)
npm run lint         # eslint src
npm run typecheck    # tsc --noEmit

# Run a single test file
npx vitest run src/features/react-demos/components/__tests__/TanStackTableSection.test.tsx

# Storybook
npm run storybook    # dev at localhost:6006
```

## Architecture

**Feature-based structure:** `src/features/<name>/components/` holds pages and sections. Each feature owns its tests in `__tests__/` and stories in `__stories__/` co-located under `components/`.

```
src/
  app/
    router.tsx        # BrowserRouter with basename=BASE_URL, all routes lazy + ProtectedRoute + AppLayout
    layout/           # AppLayout, Sidebar, TopBar, BottomNav (mobile-only md:hidden), BottomSheet
    providers.tsx     # React Query + Zustand providers
  features/           # accessibility, analytics, auth, chat, css-examples, dashboard,
                      # notifications, performance, react-demos, settings, users
  shared/
    components/       # Button, Input, Badge, Modal, Table, Skeleton, ErrorBoundary
    utils/testUtils.tsx  # createWrapper() provides QueryClientProvider for tests
  store/
    uiStore.ts        # Zustand global UI state
```

**Routing:** All authenticated pages sit under `<ProtectedRoute><AppLayout>`. Auth state comes from Zustand. Routes are lazy-loaded with `<Suspense>` + `<ErrorBoundary>` wrappers. `basename` is `import.meta.env.BASE_URL` (set to `/playGround-react/` for GitHub Pages).

**State:** Local `useState` for component state. Zustand for global UI (sidebar open, theme). React Query for server data.

## Key Conventions

**Storybook imports:** Always import from `@storybook/react-vite`, never `@storybook/react`. ESLint rule `storybook/no-renderer-packages` enforces this — CI will fail otherwise.

**Tailwind 4:** Use canonical utility classes (`min-w-24` not `min-w-[6rem]`). IDE diagnostics flag bracket notation when a canonical equivalent exists.

**Tests:** Use `createWrapper()` from `src/shared/utils/testUtils.tsx` when a component needs React Query context. Vitest + Testing Library; browser tests (Storybook addon-vitest) run via Playwright Chromium — installed separately in CI (`npx playwright install chromium --with-deps`).

**BottomNav** is `md:hidden` — only visible on mobile. Test or story canvas must be at mobile width to see it.

## CI / Deployment

GitHub Actions (`.github/workflows/ci.yml`): typecheck → lint → playwright install → test → build → upload artifact. Deploys to GitHub Pages on push to `main`.

## Working Style

- Don't ask clarifying questions mid-task — make reasonable assumptions and proceed
- If something is truly ambiguous, note your assumption in a comment and continue
- Complete the full plan before stopping
