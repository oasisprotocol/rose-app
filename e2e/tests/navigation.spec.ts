import { test, expect } from '@playwright/test'

test.describe('navigation', () => {
  test.beforeEach(async ({ page }) => {
    page.on('pageerror', error => {
      throw error
    })

    page.on('console', message => {
      if (message.type() === 'error') {
        throw new Error(`Console error: ${message.text()}`)
      }
    })
  })

  test.afterEach(async ({ page }) => {
    // Assert that the page is not closed
    expect(page.isClosed()).toBeFalsy()
  })

  test('home page', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
  })

  test('discover page', async ({ page }) => {
    await page.goto('/#/discover', { waitUntil: 'networkidle' })
  })

  test('stake page', async ({ page }) => {
    await page.goto('/#/stake', { waitUntil: 'networkidle' })
  })

  test('move page', async ({ page }) => {
    await page.goto('/#/move', { waitUntil: 'networkidle' })
  })

  test('wrap page', async ({ page }) => {
    await page.goto('/#/wrap', { waitUntil: 'networkidle' })
  })
})
