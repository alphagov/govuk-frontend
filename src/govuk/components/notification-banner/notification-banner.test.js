/* eslint-env jest */

const configPaths = require('../../../../config/paths.json')
const PORT = configPaths.ports.test

const baseUrl = 'http://localhost:' + PORT

describe('/components/notification-banner/with-type-as-success', () => {
  it('has the correct tabindex to be focused with JavaScript', async () => {
    await page.goto(baseUrl + '/components/notification-banner/with-type-as-success/preview', { waitUntil: 'load' })

    const tabindex = await page.$eval('.govuk-notification-banner', el => el.getAttribute('tabindex'))

    expect(tabindex).toEqual('-1')
  })

  it('is automatically focused when the page loads', async () => {
    await page.goto(baseUrl + '/components/notification-banner/with-type-as-success/preview', { waitUntil: 'load' })

    const activeElement = await page.evaluate(() => document.activeElement.dataset.module)

    expect(activeElement).toBe('govuk-notification-banner')
  })
})

describe('components/notification-banner/auto-focus-disabled,-with-type-as-success/', () => {
  describe('when auto-focus is disabled', () => {
    it('does not have a tabindex attribute', async () => {
      await page.goto(`${baseUrl}/components/notification-banner/auto-focus-disabled,-with-type-as-success/preview`, { waitUntil: 'load' })

      const tabindex = await page.$eval('.govuk-notification-banner', el => el.getAttribute('tabindex'))

      expect(tabindex).toBeFalsy()
    })

    it('does not focus the notification banner', async () => {
      await page.goto(`${baseUrl}/components/notification-banner/auto-focus-disabled,-with-type-as-success/preview`, { waitUntil: 'load' })

      const activeElement = await page.evaluate(() => document.activeElement.dataset.module)

      expect(activeElement).not.toBe('govuk-notification-banner')
    })
  })
})

describe('components/notification-banner/role=alert-overridden-to-role=region,-with-type-as-success', () => {
  describe('when role is not alert', () => {
    it('does not have a tabindex attribute', async () => {
      await page.goto(`${baseUrl}/components/notification-banner/role=alert-overridden-to-role=region,-with-type-as-success/preview`, { waitUntil: 'load' })

      const tabindex = await page.$eval('.govuk-notification-banner', el => el.getAttribute('tabindex'))

      expect(tabindex).toBeFalsy()
    })

    it('does not focus the notification banner', async () => {
      await page.goto(`${baseUrl}/components/notification-banner/role=alert-overridden-to-role=region,-with-type-as-success/preview`, { waitUntil: 'load' })

      const activeElement = await page.evaluate(() => document.activeElement.dataset.module)

      expect(activeElement).not.toBe('govuk-notification-banner')
    })
  })
})
