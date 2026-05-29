import { defineConfig, devices } from 'playwright/test'

export default defineConfig({
  testDir: './playwright',
  use: {
    baseURL: 'http://localhost:5173/playGround-react/',
    ...devices['Desktop Chrome'],
  },
})
