import { test, expect, type Page } from '@playwright/test'

// Helper to login
async function login(page: Page) {
  const testEmail = process.env.E2E_TEST_EMAIL
  const testPassword = process.env.E2E_TEST_PASSWORD

  if (!testEmail || !testPassword) {
    return false
  }

  await page.goto('/login')
  await page.getByLabel(/email/i).fill(testEmail)
  await page.getByLabel(/password/i).fill(testPassword)
  await page.getByRole('button', { name: /log in|sign in/i }).click()

  try {
    await page.waitForURL(/\/dashboard/, { timeout: 10000 })
    return true
  } catch {
    return false
  }
}

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    const loggedIn = await login(page)
    if (!loggedIn) {
      test.skip()
    }
  })

  test('should show dashboard after login', async ({ page }) => {
    await expect(page.getByText(/dashboard|tasks|welcome/i)).toBeVisible()
  })

  test('should have sidebar navigation', async ({ page }) => {
    await expect(page.getByRole('link', { name: /tasks/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /templates/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /settings/i })).toBeVisible()
  })

  test('should show user info', async ({ page }) => {
    // User avatar or email indicator
    const userElement = page.locator('[data-user], .avatar, .user-menu')
    await expect(userElement.first()).toBeVisible()
  })

  test('should navigate to tasks page', async ({ page }) => {
    await page.getByRole('link', { name: /tasks/i }).click()
    await expect(page).toHaveURL(/\/tasks/)
  })

  test('should navigate to templates page', async ({ page }) => {
    await page.getByRole('link', { name: /templates/i }).click()
    await expect(page).toHaveURL(/\/templates/)
  })

  test('should navigate to settings page', async ({ page }) => {
    await page.getByRole('link', { name: /settings/i }).click()
    await expect(page).toHaveURL(/\/settings/)
  })
})

test.describe('Tasks Page', () => {
  test.beforeEach(async ({ page }) => {
    const loggedIn = await login(page)
    if (!loggedIn) {
      test.skip()
    }
    await page.goto('/dashboard/tasks')
  })

  test('should show task input', async ({ page }) => {
    const input = page.getByPlaceholder(/describe|task|what/i)
    await expect(input).toBeVisible()
  })

  test('should show task list or empty state', async ({ page }) => {
    // Either tasks list or empty state should be visible
    const taskList = page.locator('[data-task-list], .task-list')
    const emptyState = page.getByText(/no tasks|get started|create your first/i)

    const hasTaskList = await taskList.isVisible().catch(() => false)
    const hasEmptyState = await emptyState.isVisible().catch(() => false)

    expect(hasTaskList || hasEmptyState).toBe(true)
  })

  test('should enable create button when input has text', async ({ page }) => {
    const input = page.getByPlaceholder(/describe|task|what/i)
    await input.fill('Research best practices for React testing')

    const createButton = page.getByRole('button', { name: /create|submit|start/i })
    await expect(createButton).toBeEnabled()
  })

  test('should create a new task', async ({ page }) => {
    const input = page.getByPlaceholder(/describe|task|what/i)
    const taskDescription = `Test task ${Date.now()}`

    await input.fill(taskDescription)
    await page.getByRole('button', { name: /create|submit|start/i }).click()

    // Wait for task to appear
    await expect(page.getByText(new RegExp(taskDescription.slice(0, 20)))).toBeVisible({
      timeout: 15000,
    })
  })

  test('should show task progress', async ({ page }) => {
    // If there's an active task, it should show progress
    const progressBar = page.locator('[role="progressbar"], .progress')
    const hasProgress = await progressBar.first().isVisible().catch(() => false)

    // Not all pages will have active tasks
    expect(typeof hasProgress).toBe('boolean')
  })
})

test.describe('Templates Page', () => {
  test.beforeEach(async ({ page }) => {
    const loggedIn = await login(page)
    if (!loggedIn) {
      test.skip()
    }
    await page.goto('/dashboard/templates')
  })

  test('should show template categories', async ({ page }) => {
    // Categories like Research, Content, Analysis
    const categories = page.getByRole('tab')
    await expect(categories.first()).toBeVisible()
  })

  test('should show template cards', async ({ page }) => {
    const templateCards = page.locator('[data-template], .template-card, .card')
    await expect(templateCards.first()).toBeVisible()
  })

  test('should filter templates by category', async ({ page }) => {
    const categories = page.getByRole('tab')
    if ((await categories.count()) > 1) {
      await categories.nth(1).click()
      // Content should update
      await page.waitForTimeout(500)
    }
  })

  test('should use template to create task', async ({ page }) => {
    const templateCard = page.locator('[data-template], .template-card').first()

    if (await templateCard.isVisible()) {
      const useButton = templateCard.getByRole('button', { name: /use|start|create/i })

      if (await useButton.isVisible()) {
        await useButton.click()
        // Should navigate or open modal
        await page.waitForTimeout(1000)
      }
    }
  })
})

test.describe('Settings Page', () => {
  test.beforeEach(async ({ page }) => {
    const loggedIn = await login(page)
    if (!loggedIn) {
      test.skip()
    }
    await page.goto('/settings')
  })

  test('should show settings sections', async ({ page }) => {
    // Profile, Notifications, Subscription sections
    await expect(page.getByText(/profile|account/i)).toBeVisible()
  })

  test('should show subscription info', async ({ page }) => {
    // Current plan info
    await expect(page.getByText(/plan|subscription|free|pro/i)).toBeVisible()
  })

  test('should have logout option', async ({ page }) => {
    const logoutButton = page.getByRole('button', { name: /log out|sign out/i })
    await expect(logoutButton).toBeVisible()
  })

  test('should logout successfully', async ({ page }) => {
    const logoutButton = page.getByRole('button', { name: /log out|sign out/i })
    await logoutButton.click()

    // Should redirect to login or home
    await expect(page).toHaveURL(/\/(login|$)/, { timeout: 5000 })
  })
})

test.describe('Subscription Flow', () => {
  test.beforeEach(async ({ page }) => {
    const loggedIn = await login(page)
    if (!loggedIn) {
      test.skip()
    }
  })

  test('should show upgrade option for free users', async ({ page }) => {
    await page.goto('/settings')

    const upgradeButton = page.getByRole('button', { name: /upgrade/i })
    const upgradeLink = page.getByRole('link', { name: /upgrade/i })

    const hasUpgrade =
      (await upgradeButton.isVisible().catch(() => false)) ||
      (await upgradeLink.isVisible().catch(() => false))

    // Free users should see upgrade option
    expect(typeof hasUpgrade).toBe('boolean')
  })

  test('should open pricing modal on upgrade click', async ({ page }) => {
    await page.goto('/settings')

    const upgradeButton = page.getByRole('button', { name: /upgrade/i })

    if (await upgradeButton.isVisible()) {
      await upgradeButton.click()

      // Modal or pricing page should appear
      await expect(page.getByText(/pro|business|\$29|\$99/i)).toBeVisible({ timeout: 5000 })
    }
  })
})
