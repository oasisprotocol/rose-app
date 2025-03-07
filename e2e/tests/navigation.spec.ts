import { test, expect } from '@playwright/test'

test.describe('navigation', () => {
  test.beforeEach(async ({ page }) => {
    page.on('pageerror', error => {
      throw error
    })
  })

  test.afterEach(async ({ page }) => {
    // Assert that the page is not closed
    expect(page.isClosed()).toBeFalsy()
  })

  test('home page', async ({ page }) => {
    await page.goto('/')
  })

  test('discover page', async ({ page }) => {
    await page.goto('/#/discover')
  })

  test('stake page', async ({ page }) => {
    await page.goto('/#/stake')
  })

  test('move page', async ({ page }) => {
    await page.goto('/#/move')
  })

  test('wrap page', async ({ page }) => {
    await page.goto('/#/wrap')
  })
})
