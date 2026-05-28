import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173/playGround-react/',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    video: false,
    allowCypressEnv: false,
    setupNodeEvents() {},
  },
})
