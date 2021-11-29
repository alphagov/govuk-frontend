/* eslint-env jest */

const configPaths = require('../../../../config/paths.json')
const PORT = configPaths.ports.test

const baseUrl = 'http://localhost:' + PORT

describe('/examples/template-default', () => {
  describe('skip link', () => {
    beforeAll(async () => {
      await page.goto(`${baseUrl}/examples/template-default`, { waitUntil: 'load' })
      await page.keyboard.press('Tab')
      await page.click('.govuk-skip-link')
    })

    it('focuses the target element', async () => {
      const activeElement = await page.evaluate(() => document.activeElement.id)

      expect(activeElement).toBe('main-content')
    })

    it('adds the tabindex attribute to the target', async () => {
      const tabindex = await page.$eval('.govuk-main-wrapper', el => el.getAttribute('tabindex'))

      expect(tabindex).toBe('-1')
    })

    it('adds the class for removing the native focus style to the target', async () => {
      const cssClass = await page.$eval('.govuk-main-wrapper', el => el.getAttribute('class'))

      expect(cssClass).toContain('govuk-skip-link-focused-element')
    })

    it('removes the tabindex attribute from the target on blur', async () => {
      await page.$eval('.govuk-main-wrapper', el => el.blur())

      const tabindex = await page.$eval('.govuk-main-wrapper', el => el.getAttribute('tabindex'))

      expect(tabindex).toBeNull()
    })

    it('removes the class for removing the native focus style from the target on blur', async () => {
      await page.$eval('.govuk-main-wrapper', el => el.blur())

      const cssClass = await page.$eval('.govuk-main-wrapper', el => el.getAttribute('class'))

      expect(cssClass).not.toContain('govuk-skip-link-focused-element')
    })
  })
})
