# Playwright E2E Setup — Design

## Goal

Add a minimal Playwright e2e setup alongside the existing Cypress tests. Shows how Playwright works by mirroring the existing Cypress auth tests so both APIs can be compared side-by-side.

## Approach

Single test file covering the same auth scenarios already in `cypress/e2e/auth.cy.ts`. No new dependencies — Playwright is already in `devDependencies`. Chromium only (matches CI setup).

## Tech Stack

- `playwright` (already installed)
- `playwright.config.ts` at project root
- `e2e/` directory for Playwright tests (separate from `cypress/`)

## File Structure

```
playwright.config.ts          ← new: Playwright config
e2e/
  auth.spec.ts                ← new: auth flow tests (mirrors cypress/e2e/auth.cy.ts)
```

**Modified:**
- `package.json` — add `"pw:run": "playwright test"` script

## Config

`playwright.config.ts`:
- `baseURL`: `http://localhost:5173/playGround-react/`
- `testDir`: `./e2e`
- Browser: Chromium only
- No `webServer` block — developer starts `npm run dev` manually (same as Cypress workflow)

## Tests (`e2e/auth.spec.ts`)

Mirrors all 4 Cypress auth scenarios:

1. **Shows Sign in heading on login page** — `page.goto('/login')`, assert `h1` contains "Sign in"
2. **Shows error on invalid credentials** — mock `POST /api/auth/login` → 401, fill form, click Sign in, assert error message
3. **Redirects to dashboard on valid login** — mock `POST /api/auth/login` → 200 with user data, fill + submit, assert `h1` contains "Dashboard"
4. **Logout redirects to login page** — login (via mock), click Logout, assert URL includes `/login`

Network mocking uses `page.route()` (Playwright's equivalent of `cy.intercept()`).

## Scripts

```json
"pw:run": "playwright test"
```

No `start-server-and-test` wrapper — keep it simple. Developer runs `npm run dev` first, then `npm run pw:run`.

## Out of Scope

- CI integration for Playwright e2e
- `webServer` auto-start in config
- Firefox/WebKit browsers
- Page Object Model
- Playwright fixtures/helpers
