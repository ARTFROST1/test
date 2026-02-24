import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/')

    // Check branding
    await expect(page.getByText('TaskPilot')).toBeVisible()
  })

  test('should have navigation links', async ({ page }) => {
    await page.goto('/')

    // Header navigation
    await expect(page.getByRole('link', { name: /pricing/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /log in|sign in/i })).toBeVisible()
  })

  test('should navigate to login', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: /log in|sign in|get started/i }).first().click()
    await expect(page).toHaveURL(/\/(login|signup)/)
  })

  test('should have call-to-action', async ({ page }) => {
    await page.goto('/')

    // Find CTA button
    const ctaButton = page.getByRole('link', { name: /get started|try|start/i })
    await expect(ctaButton.first()).toBeVisible()
  })

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    await expect(page.getByText('TaskPilot')).toBeVisible()

    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/')

    await expect(page.getByText('TaskPilot')).toBeVisible()
  })
})

test.describe('Pricing Page', () => {
  test('should load pricing page', async ({ page }) => {
    await page.goto('/pricing')

    await expect(page.getByText(/pricing|plans/i)).toBeVisible()
  })

  test('should show all pricing tiers', async ({ page }) => {
    await page.goto('/pricing')

    await expect(page.getByText(/free/i)).toBeVisible()
    await expect(page.getByText(/pro/i)).toBeVisible()
    await expect(page.getByText(/business/i)).toBeVisible()
  })

  test('should show prices', async ({ page }) => {
    await page.goto('/pricing')

    // Free tier
    await expect(page.getByText(/\$0/)).toBeVisible()
    
    // Pro tier ($29)
    await expect(page.getByText(/\$29/)).toBeVisible()
    
    // Business tier ($99)
    await expect(page.getByText(/\$99/)).toBeVisible()
  })

  test('should have feature lists', async ({ page }) => {
    await page.goto('/pricing')

    // Check for feature items (checkmarks or list items)
    const features = page.locator('ul li, [data-feature]')
    await expect(features.first()).toBeVisible()
  })

  test('should have subscription buttons', async ({ page }) => {
    await page.goto('/pricing')

    const buttons = page.getByRole('button', { name: /start|subscribe|get|try/i })
    await expect(buttons.first()).toBeVisible()
  })

  test('should have monthly/annual toggle', async ({ page }) => {
    await page.goto('/pricing')

    const toggle = page.getByText(/monthly|annual|yearly/i)
    await expect(toggle.first()).toBeVisible()
  })
})

test.describe('SEO & Meta', () => {
  test('should have page title', async ({ page }) => {
    await page.goto('/')

    const title = await page.title()
    expect(title).toBeTruthy()
    expect(title.toLowerCase()).toContain('taskpilot')
  })

  test('should have meta description', async ({ page }) => {
    await page.goto('/')

    const metaDescription = page.locator('meta[name="description"]')
    const content = await metaDescription.getAttribute('content')
    expect(content).toBeTruthy()
  })

  test('should have Open Graph tags', async ({ page }) => {
    await page.goto('/')

    const ogTitle = page.locator('meta[property="og:title"]')
    const ogDescription = page.locator('meta[property="og:description"]')

    expect(await ogTitle.getAttribute('content')).toBeTruthy()
    expect(await ogDescription.getAttribute('content')).toBeTruthy()
  })

  test('should have favicon', async ({ page }) => {
    await page.goto('/')

    const favicon = page.locator('link[rel="icon"]')
    await expect(favicon).toHaveAttribute('href')
  })
})

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy on homepage', async ({ page }) => {
    await page.goto('/')

    const h1 = page.locator('h1')
    await expect(h1.first()).toBeVisible()
  })

  test('should have alt text on images', async ({ page }) => {
    await page.goto('/')

    const images = page.locator('img')
    const count = await images.count()

    for (let i = 0; i < count; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      const role = await img.getAttribute('role')

      // Either has alt text or is decorative (role="presentation")
      expect(alt !== null || role === 'presentation').toBe(true)
    }
  })

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/')

    // Tab through the page
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // Something should have focus
    const focused = await page.evaluate(() => document.activeElement?.tagName)
    expect(focused).toBeTruthy()
  })

  test('should have visible focus indicators', async ({ page }) => {
    await page.goto('/')

    await page.keyboard.press('Tab')

    // Check that focused element has visible styles
    const focusedElement = page.locator(':focus')
    await expect(focusedElement.first()).toBeVisible()
  })
})

test.describe('Performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/')
    const loadTime = Date.now() - startTime

    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000)
  })

  test('should have no console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    await page.goto('/')

    // Filter out expected errors (e.g., missing env warnings)
    const criticalErrors = errors.filter(
      (e) => !e.includes('Warning') && !e.includes('env')
    )

    expect(criticalErrors).toHaveLength(0)
  })
})
