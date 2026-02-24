import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should show login page', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /log in|sign in/i })).toBeVisible()
  })

  test('should show signup page', async ({ page }) => {
    await page.goto('/signup')

    await expect(page.getByRole('heading', { name: /create|get started/i })).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
  })

  test('should navigate between login and signup', async ({ page }) => {
    await page.goto('/login')

    await page.getByRole('link', { name: /sign up|create account|register/i }).click()
    await expect(page).toHaveURL(/\/signup/)

    await page.getByRole('link', { name: /log in|sign in/i }).click()
    await expect(page).toHaveURL(/\/login/)
  })

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/login')

    const submitButton = page.getByRole('button', { name: /log in|sign in/i })
    await submitButton.click()

    // HTML5 validation should prevent submission
    const emailInput = page.getByLabel(/email/i)
    await expect(emailInput).toHaveAttribute('required')
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel(/email/i).fill('invalid@example.com')
    await page.getByLabel(/password/i).fill('wrongpassword')
    await page.getByRole('button', { name: /log in|sign in/i }).click()

    // Wait for error message
    await expect(page.getByText(/invalid|error|incorrect/i)).toBeVisible({ timeout: 10000 })
  })

  test('should redirect to dashboard after successful login', async ({ page }) => {
    // This test requires valid credentials - skip if not available
    const testEmail = process.env.E2E_TEST_EMAIL
    const testPassword = process.env.E2E_TEST_PASSWORD

    if (!testEmail || !testPassword) {
      test.skip()
      return
    }

    await page.goto('/login')

    await page.getByLabel(/email/i).fill(testEmail)
    await page.getByLabel(/password/i).fill(testPassword)
    await page.getByRole('button', { name: /log in|sign in/i }).click()

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 })
  })

  test('should handle forgot password flow', async ({ page }) => {
    await page.goto('/login')

    const forgotLink = page.getByRole('link', { name: /forgot|reset/i })
    if (await forgotLink.isVisible()) {
      await forgotLink.click()
      await expect(page.getByText(/reset|email|recover/i)).toBeVisible()
    }
  })
})

test.describe('Protected Routes', () => {
  test('should redirect to login when accessing dashboard unauthenticated', async ({ page }) => {
    await page.goto('/dashboard')

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 })
  })

  test('should redirect to login when accessing tasks unauthenticated', async ({ page }) => {
    await page.goto('/dashboard/tasks')

    await expect(page).toHaveURL(/\/login/, { timeout: 5000 })
  })

  test('should redirect to login when accessing settings unauthenticated', async ({ page }) => {
    await page.goto('/settings')

    await expect(page).toHaveURL(/\/login/, { timeout: 5000 })
  })
})
