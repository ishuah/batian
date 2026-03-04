import { test, expect } from '@playwright/test'

test('app loads and shows step 1', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Batian')).toBeVisible()
  await expect(page.getByText('Upload Data')).toBeVisible()
})

test('progress indicator shows 5 steps', async ({ page }) => {
  await page.goto('/')
  const steps = page.locator('[data-testid="step-indicator"]')
  await expect(steps).toHaveCount(5)
})
