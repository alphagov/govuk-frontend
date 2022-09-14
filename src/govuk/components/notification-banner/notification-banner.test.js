/* eslint-env jest */
const { renderHtml, getExamples } = require('../../../../lib/jest-helpers')

const examples = getExamples('notification-banner')

const configPaths = require('../../../../config/paths.json')
const PORT = configPaths.ports.test

const baseUrl = 'http://localhost:' + PORT

describe('/components/notification-banner/with-type-as-success', () => {
  it('has the correct tabindex attribute to be focused with JavaScript', async () => {
    await page.goto(baseUrl + '/components/notification-banner/with-type-as-success/preview', { waitUntil: 'load' })

    const tabindex = await page.$eval('.govuk-notification-banner', el => el.getAttribute('tabindex'))

    expect(tabindex).toEqual('-1')
  })

  it('is automatically focused when the page loads', async () => {
    await page.goto(baseUrl + '/components/notification-banner/with-type-as-success/preview', { waitUntil: 'load' })

    const activeElement = await page.evaluate(() => document.activeElement.dataset.module)

    expect(activeElement).toBe('govuk-notification-banner')
  })

  it('removes the tabindex attribute on blur', async () => {
    await page.goto(baseUrl + '/components/notification-banner/with-type-as-success/preview', { waitUntil: 'load' })

    await page.$eval('.govuk-notification-banner', el => el.blur())

    const tabindex = await page.$eval('.govuk-notification-banner', el => el.getAttribute('tabindex'))
    expect(tabindex).toBeNull()
  })
})

describe('components/notification-banner/auto-focus-disabled,-with-type-as-success/', () => {
  describe('when auto-focus is disabled using data attributes', () => {
    beforeAll(async () => {
      await page.goto(`${baseUrl}/components/notification-banner/auto-focus-disabled,-with-type-as-success/preview`, { waitUntil: 'load' })
    })

    it('does not have a tabindex attribute', async () => {
      const tabindex = await page.$eval('.govuk-notification-banner', el => el.getAttribute('tabindex'))

      expect(tabindex).toBeNull()
    })

    it('does not focus the notification banner', async () => {
      const activeElement = await page.evaluate(() => document.activeElement.dataset.module)

      expect(activeElement).not.toBe('govuk-notification-banner')
    })
  })

  describe('when auto-focus is disabled using JavaScript configuration', () => {
    beforeAll(async () => {
      await page.goto(`${baseUrl}/tests/boilerplate`, { waitUntil: 'load' })

      // Render the notification banner Nunjucks template
      const html = renderHtml('notification-banner', examples['with type as success'])

      // Inject rendered HTML into the slot
      await page.$eval('#slot', (slot, htmlForSlot) => {
        slot.innerHTML = htmlForSlot
      }, html)

      // Run a script to init the JavaScript component
      await page.evaluate(() => {
        var $notificationBanner = document.querySelector('[data-module="govuk-notification-banner"]')
        new window.GOVUKFrontend.NotificationBanner($notificationBanner, {
          disableAutoFocus: true
        }).init()
      })
    })

    it('does not have a tabindex attribute', async () => {
      const tabindex = await page.$eval('.govuk-notification-banner', el => el.getAttribute('tabindex'))

      expect(tabindex).toBeNull()
    })

    it('does not focus the notification banner', async () => {
      const activeElement = await page.evaluate(() => document.activeElement.dataset.module)

      expect(activeElement).not.toBe('govuk-notification-banner')
    })
  })

  describe('when auto-focus is disabled using options passed to initAll', () => {
    beforeAll(async () => {
      await page.goto(`${baseUrl}/tests/boilerplate`, { waitUntil: 'load' })

      // Render the notification banner Nunjucks template
      const html = renderHtml('notification-banner', examples['with type as success'])

      // Inject rendered HTML into the slot
      await page.$eval('#slot', (slot, htmlForSlot) => {
        slot.innerHTML = htmlForSlot
      }, html)

      // Run a script to init the JavaScript component
      await page.evaluate(() => {
        window.GOVUKFrontend.initAll({
          notificationBanner: {
            disableAutoFocus: true
          }
        })
      })
    })

    it('does not have a tabindex attribute', async () => {
      const tabindex = await page.$eval('.govuk-notification-banner', el => el.getAttribute('tabindex'))

      expect(tabindex).toBeNull()
    })

    it('does not focus the notification banner', async () => {
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

      expect(tabindex).toBeNull()
    })

    it('does not focus the notification banner', async () => {
      await page.goto(`${baseUrl}/components/notification-banner/role=alert-overridden-to-role=region,-with-type-as-success/preview`, { waitUntil: 'load' })

      const activeElement = await page.evaluate(() => document.activeElement.dataset.module)

      expect(activeElement).not.toBe('govuk-notification-banner')
    })
  })
})

describe('/components/notification-banner/custom-tabindex', () => {
  describe('when custom tabindex set', () => {
    it('it does not remove the tabindex attribute on blur', async () => {
      await page.goto(baseUrl + '/components/notification-banner/custom-tabindex/preview', { waitUntil: 'load' })

      await page.$eval('.govuk-notification-banner', el => el.blur())

      const tabindex = await page.$eval('.govuk-notification-banner', el => el.getAttribute('tabindex'))
      expect(tabindex).toEqual('2')
    })
  })
})
