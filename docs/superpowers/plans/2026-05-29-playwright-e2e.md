# Playwright E2E Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a minimal Playwright e2e setup with auth flow tests that mirror the existing Cypress tests, so both APIs can be compared side-by-side.

**Architecture:** `playwright.config.ts` at project root pointing to the Vite dev server at `http://localhost:5173/playGround-react/`. Tests live in `e2e/`. Uses `playwright/test` (already installed via the `playwright` package). Network mocking via `page.route()` mirrors Cypress's `cy.intercept()`.

**Tech Stack:** `playwright` v1.60 (already in devDependencies), `playwright/test` subpath.

---

## File Map

| File | Action |
|------|--------|
| `.gitignore` | Modify — add `playwright-report/` and `test-results/` |
| `playwright.config.ts` | Create |
| `e2e/auth.spec.ts` | Create |
| `package.json` | Modify — add `"pw:run"` script |

---

### Task 1: Config and gitignore

**Files:**
- Modify: `.gitignore`
- Create: `playwright.config.ts`
- Modify: `package.json`

- [ ] **Step 1: Add Playwright output dirs to .gitignore**

Append to `.gitignore`:

```
playwright-report/
test-results/
```

- [ ] **Step 2: Create playwright.config.ts**

Create `playwright.config.ts` at project root:

```ts
import { defineConfig, devices } from 'playwright/test'

export default defineConfig({
  testDir: './e2e',
  baseURL: 'http://localhost:5173/playGround-react/',
  use: {
    ...devices['Desktop Chrome'],
  },
})
```

- [ ] **Step 3: Add pw:run script to package.json**

In `package.json`, add to the `"scripts"` block (after the `"cy:run"` line):

```json
"pw:run": "playwright test",
```

- [ ] **Step 4: Verify config is valid**

```bash
npx playwright --version
```

Expected: prints `Version 1.60.x`

- [ ] **Step 5: Commit**

```bash
git add .gitignore playwright.config.ts package.json
git commit -m "feat(e2e): add Playwright config alongside Cypress"
```

---

### Task 2: Auth e2e tests

**Files:**
- Create: `e2e/auth.spec.ts`

These 4 tests mirror `cypress/e2e/auth.cy.ts` exactly — same scenarios, different API — so you can compare Playwright vs Cypress syntax side-by-side.

The app runs at `http://localhost:5173/playGround-react/` (`npm run dev` must be running).
`page.route()` intercepts network requests before MSW (service worker) sees them, same role as `cy.intercept()`.
The login form has `id="email"` and `id="password"` inputs and a "Sign in" button.
The Logout button is in the TopBar.

- [ ] **Step 1: Create e2e/auth.spec.ts**

```ts
import { test, expect } from 'playwright/test'

test.describe('Auth flows', () => {
  test('shows Sign in heading on login page', async ({ page }) => {
    await page.goto('login')
    await expect(page.locator('h1')).toContainText('Sign in')
  })

  test('shows error on invalid credentials', async ({ page }) => {
    await page.route('**/api/auth/login', async route => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Invalid credentials' }),
      })
    })
    await page.goto('login')
    await page.locator('#email').fill('wrong@example.com')
    await page.locator('#password').fill('wrongpass')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page.getByText('Invalid credentials')).toBeVisible()
  })

  test('redirects to dashboard on valid login', async ({ page }) => {
    await page.route('**/api/auth/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
          token: 'mock-jwt-token',
        }),
      })
    })
    await page.goto('login')
    await page.locator('#email').fill('admin@example.com')
    await page.locator('#password').fill('password')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page.locator('h1')).toContainText('Dashboard')
  })

  test('logout redirects to login page', async ({ page }) => {
    await page.route('**/api/auth/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
          token: 'mock-jwt-token',
        }),
      })
    })
    await page.goto('login')
    await page.locator('#email').fill('admin@example.com')
    await page.locator('#password').fill('password')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page.locator('h1')).toContainText('Dashboard')
    await page.getByRole('button', { name: 'Logout' }).click()
    await expect(page).toHaveURL(/\/login/)
  })
})
```

- [ ] **Step 2: Start dev server in background, run Playwright tests**

In one terminal:
```bash
npm run dev
```

In another terminal (wait for dev server to be ready first):
```bash
npm run pw:run
```

Expected output:
```
Running 4 tests using 1 worker

  ✓ Auth flows > shows Sign in heading on login page
  ✓ Auth flows > shows error on invalid credentials
  ✓ Auth flows > redirects to dashboard on valid login
  ✓ Auth flows > logout redirects to login page

  4 passed
```

If any test fails:
- "shows Sign in heading" failing → dev server not running or wrong baseURL
- "shows error on invalid credentials" failing → `page.route()` not intercepting; check the route pattern `**/api/auth/login`
- "redirects to dashboard" failing → check the mock response body matches what the auth store expects (`data.id`, `data.name`, `data.email`, `data.role`, `token`)
- "logout" failing → check the Logout button selector; in TopBar it renders as `<Button>Logout</Button>` which maps to `getByRole('button', { name: 'Logout' })`

- [ ] **Step 3: Commit**

```bash
git add e2e/auth.spec.ts
git commit -m "feat(e2e): add Playwright auth flow tests mirroring Cypress"
```
