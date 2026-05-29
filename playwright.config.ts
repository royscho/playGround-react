import { defineConfig, devices } from 'playwright/test'

export default defineConfig({
  testDir: './e2e',
  baseURL: 'http://localhost:5173/playGround-react/',
  use: {
    ...devices['Desktop Chrome'],
  },
})
