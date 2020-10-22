/* eslint-env jest */

const configPaths = require('../../../../config/paths.json')
const PORT = configPaths.ports.test

const baseUrl = 'http://localhost:' + PORT

describe('/components/notification-banner', () => {
  describe('/examples/notification-banner', () => {
    describe('when JavaScript is available', () => {
      it('focuses the notification banner', async () => {
        await page.goto(`${baseUrl}/examples/notification-banner`, { waitUntil: 'load' })

        const activeElement = await page.evaluate(() => document.activeElement.dataset.module)

        expect(activeElement).toBe('govuk-notification-banner')
      })

      it('scrolls the notification banner to the top of the screen', async () => {
        // Wait until 'domcontentloaded' to have correct coordinates for element position
        await page.goto(`${baseUrl}/examples/notification-banner`, { waitUntil: 'domcontentloaded' })

        const positionFromTopOfViewport = await page.$eval('.govuk-notification-banner', (elem) => {
          return elem.getBoundingClientRect().top
        })

        expect(positionFromTopOfViewport).toEqual(0)
      })
    })
  })

  describe('/examples/notification-banner-and-error-summary', () => {
    describe('when there is an error summary on the page', () => {
      it('the notification banner is not focused and the error summary is', async () => {
        await page.goto(`${baseUrl}/examples/notification-banner-and-error-summary`, { waitUntil: 'load' })

        const activeElement = await page.evaluate(() => document.activeElement.dataset.module)

        expect(activeElement).toBe('govuk-error-summary')
      })
    })
  })

  describe('/examples/notification-banner-multiple', () => {
    describe('when there are multiple notification banners on the page', () => {
      it('the first one on the page is focused', async () => {
        await page.goto(`${baseUrl}/examples/notification-banner-multiple`, { waitUntil: 'load' })

        const activeElementTextContent = await page.evaluate(() => document.activeElement.textContent)

        expect(activeElementTextContent).toContain('Invite sent to example@email.com')
      })
    })
  })

  describe('components/notification-banner/auto-focus-as-is-set-to-false,-with-type-as-success', () => {
    describe('when auto-focus is set to false', () => {
      it('does not focus the notification banner', async () => {
        await page.goto(`${baseUrl}/components/notification-banner/auto-focus-as-is-set-to-false,-with-type-as-success/preview`, { waitUntil: 'load' })

        const activeElement = await page.evaluate(() => document.activeElement.dataset.module)

        expect(activeElement).not.toBe('govuk-notification-banner')
      })
    })
  })

  describe('components/notification-banner/data-auto-focus-is-set-without-role=alert/', () => {
    describe('when role="alert" is not set', () => {
      it('does not focus the notification banner', async () => {
        await page.goto(`${baseUrl}/components/notification-banner/data-auto-focus-is-set-without-role=alert/preview`, { waitUntil: 'load' })

        const activeElement = await page.evaluate(() => document.activeElement.dataset.module)

        expect(activeElement).not.toBe('govuk-notification-banner')
      })
    })
  })
})
