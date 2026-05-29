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
