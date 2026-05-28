/// <reference types="cypress" />

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
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
