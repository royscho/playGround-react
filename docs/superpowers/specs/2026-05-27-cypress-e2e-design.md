# Cypress E2E — Design Spec

**Date:** 2026-05-27
**Status:** Approved

## Overview

Add Cypress e2e tests covering the three critical user journeys:
1. Login with valid credentials → dashboard
2. Login with invalid credentials → error message
3. Authenticated session → logout → back to login

API mocking strategy: `cy.intercept()` only. MSW service worker disabled in Cypress context via `window.Cypress` guard.

---

## Install

```
npm install --save-dev cypress start-server-and-test
```

---

## File Structure

```
cypress/
  e2e/
    auth.cy.ts          # all 4 tests
  support/
    commands.ts         # cy.login() custom command
    e2e.ts              # imports commands
cypress.config.ts       # baseUrl, specPattern, video off
src/main.tsx            # add window.Cypress guard around MSW init
```

---

## cypress.config.ts

```ts
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173/playGround-react/',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    video: false,
    setupNodeEvents() {},
  },
})
```

---

## MSW Guard in src/main.tsx

Prevent MSW service worker from intercepting requests during Cypress runs (cy.intercept takes over):

```tsx
if (!('Cypress' in window)) {
  const { worker } = await import('./mocks/browser')
  await worker.start({ onUnhandledRequest: 'bypass' })
}
```

---

## cypress/support/e2e.ts

```ts
import './commands'
```

## cypress/support/commands.ts

```ts
declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>
    }
  }
}

Cypress.Commands.add('login', () => {
  cy.intercept('POST', '/api/auth/login', {
    statusCode: 200,
    body: {
      data: { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
      token: 'mock-jwt-token',
    },
  }).as('loginRequest')
  cy.visit('/login')
  cy.get('#email').type('admin@example.com')
  cy.get('#password').type('password')
  cy.contains('button', 'Sign in').click()
  cy.wait('@loginRequest')
  cy.url().should('include', '/dashboard')
})
```

---

## cypress/e2e/auth.cy.ts

```ts
describe('Auth flows', () => {
  it('shows Sign in heading on login page', () => {
    cy.visit('/login')
    cy.contains('h1', 'Sign in').should('be.visible')
  })

  it('shows error on invalid credentials', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: { message: 'Invalid credentials' },
    }).as('loginFail')
    cy.visit('/login')
    cy.get('#email').type('wrong@example.com')
    cy.get('#password').type('wrongpass')
    cy.contains('button', 'Sign in').click()
    cy.wait('@loginFail')
    cy.contains('Invalid credentials').should('be.visible')
  })

  it('redirects to dashboard on valid login', () => {
    cy.login()
    cy.contains('h1', 'Dashboard').should('be.visible')
  })

  it('logout redirects to login page', () => {
    cy.login()
    cy.intercept('POST', '/api/auth/logout', { statusCode: 200, body: { message: 'Logged out' } })
    cy.contains('button', 'Logout').click()
    cy.url().should('include', '/login')
  })
})
```

---

## package.json Scripts

```json
"cy:open": "cypress open",
"cy:run":  "cypress run",
"e2e":     "start-server-and-test dev http://localhost:5173/playGround-react/ cy:run"
```

---

## Selectors Used

| Element | Selector | Source |
|---------|----------|--------|
| Email input | `#email` | `<Input id="email">` in LoginForm |
| Password input | `#password` | `<Input id="password">` in LoginForm |
| Submit button | `cy.contains('button', 'Sign in')` | Button text in LoginForm |
| Logout button | `cy.contains('button', 'Logout')` | Button text in TopBar |
| Dashboard heading | `cy.contains('h1', 'Dashboard')` | h1 in DashboardPage |

---

## Out of Scope

- CI integration (GitHub Actions step for e2e)
- Tests for non-auth pages
- Visual regression testing
- Accessibility audits via axe-cypress
