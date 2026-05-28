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
    cy.contains('button', 'Logout').click()
    cy.url().should('include', '/login')
  })
})
