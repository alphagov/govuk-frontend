// @ts-check
import { test, expect } from '@playwright/test'

import { goToComponent } from '../../../../lib/playwright-helpers.js'

test.describe('Character Count', () => {
  test.describe('when JavaScript is unavailable or fails', () => {
    test.use({ javaScriptEnabled: false })

    test('shows the textarea description', async ({ page }) => {
      await goToComponent(page, 'character-count')

      await expect(page.locator('.govuk-character-count__message')).toHaveText('You can enter up to 10 characters')
    })
  })

  test.describe('when JavaScript is available', () => {
    test.describe('on page load', () => {
      test.beforeEach(async ({ page }) => {
        await goToComponent(page, 'character-count')
      })

      test('injects the visual counter', async ({ page }) => {
        const visualCounter = page.locator('.govuk-character-count__status')

        await expect(visualCounter).toHaveText('You have 10 characters remaining')
        await expect(visualCounter).toBeVisible()
      })

      test('injects the screen reader counter', async ({ page }) => {
        await expect(page.locator('.govuk-character-count__sr-status')).toHaveClass(/govuk-visually-hidden/)
      })

      test('hides the textarea description', async ({ page }) => {
        // The `.govuk-character-count__message` is used twice
        // so we need to disambiguate and specify we want the one not displaying the count as people type
        await expect(page.locator('.govuk-character-count__message:not(.govuk-character-count__status)'))
          .toHaveClass(/govuk-visually-hidden/)
      })
    })
  })
})
