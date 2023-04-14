const helpers = require('govuk-frontend-helpers')

const { getExamples } = helpers.files
const { renderAndInitialise, goToComponent } = helpers.puppeteer

describe('Notification banner, when type is set to "success"', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('notification-banner')
  })

  it('has the correct tabindex attribute to be focused with JavaScript', async () => {
    await goToComponent(page, 'notification-banner', {
      exampleName: 'with-type-as-success'
    })

    const tabindex = await page.$eval('.govuk-notification-banner', el => el.getAttribute('tabindex'))

    expect(tabindex).toEqual('-1')
  })

  it('is automatically focused when the page loads', async () => {
    await goToComponent(page, 'notification-banner', {
      exampleName: 'with-type-as-success'
    })

    const activeElement = await page.evaluate(() => document.activeElement.getAttribute('data-module'))

    expect(activeElement).toBe('govuk-notification-banner')
  })

  it('removes the tabindex attribute on blur', async () => {
    await goToComponent(page, 'notification-banner', {
      exampleName: 'with-type-as-success'
    })

    await page.$eval('.govuk-notification-banner', el => el instanceof window.HTMLElement && el.blur())

    const tabindex = await page.$eval('.govuk-notification-banner', el => el.getAttribute('tabindex'))
    expect(tabindex).toBeNull()
  })

  describe('and auto-focus is disabled using data attributes', () => {
    beforeAll(async () => {
      await goToComponent(page, 'notification-banner', {
        exampleName: 'auto-focus-disabled,-with-type-as-success'
      })
    })

    it('does not have a tabindex attribute', async () => {
      const tabindex = await page.$eval('.govuk-notification-banner', el => el.getAttribute('tabindex'))

      expect(tabindex).toBeNull()
    })

    it('does not focus the notification banner', async () => {
      const activeElement = await page.evaluate(() => document.activeElement.getAttribute('data-module'))

      expect(activeElement).not.toBe('govuk-notification-banner')
    })
  })

  describe('and auto-focus is disabled using JavaScript configuration', () => {
    beforeAll(async () => {
      await renderAndInitialise(page, 'notification-banner', {
        params: examples['with type as success'],
        config: {
          disableAutoFocus: true
        }
      })
    })

    it('does not have a tabindex attribute', async () => {
      const tabindex = await page.$eval('.govuk-notification-banner', el => el.getAttribute('tabindex'))

      expect(tabindex).toBeNull()
    })

    it('does not focus the notification banner', async () => {
      const activeElement = await page.evaluate(() => document.activeElement.getAttribute('data-module'))

      expect(activeElement).not.toBe('govuk-notification-banner')
    })
  })

  describe('and auto-focus is disabled using options passed to initAll', () => {
    beforeAll(async () => {
      await renderAndInitialise(page, 'notification-banner', {
        params: examples['with type as success'],
        config: {
          disableAutoFocus: true
        }
      })
    })

    it('does not have a tabindex attribute', async () => {
      const tabindex = await page.$eval('.govuk-notification-banner', el => el.getAttribute('tabindex'))

      expect(tabindex).toBeNull()
    })

    it('does not focus the notification banner', async () => {
      const activeElement = await page.evaluate(() => document.activeElement.getAttribute('data-module'))

      expect(activeElement).not.toBe('govuk-notification-banner')
    })
  })

  describe('and autofocus is disabled in JS but enabled in data attributes', () => {
    beforeAll(async () => {
      await renderAndInitialise(page, 'notification-banner', {
        params: examples['auto-focus explicitly enabled, with type as success'],
        config: {
          disableAutoFocus: true
        }
      })
    })

    it('has the correct tabindex attribute to be focused with JavaScript', async () => {
      const tabindex = await page.$eval('.govuk-notification-banner', el => el.getAttribute('tabindex'))

      expect(tabindex).toEqual('-1')
    })

    it('is automatically focused when the page loads', async () => {
      const activeElement = await page.evaluate(() => document.activeElement.getAttribute('data-module'))

      expect(activeElement).toBe('govuk-notification-banner')
    })
  })

  describe('and role is overridden to "region"', () => {
    beforeAll(async () => {
      await goToComponent(page, 'notification-banner', {
        exampleName: 'role=alert-overridden-to-role=region,-with-type-as-success'
      })
    })

    it('does not have a tabindex attribute', async () => {
      const tabindex = await page.$eval('.govuk-notification-banner', el => el.getAttribute('tabindex'))

      expect(tabindex).toBeNull()
    })

    it('does not focus the notification banner', async () => {
      const activeElement = await page.evaluate(() => document.activeElement.getAttribute('data-module'))

      expect(activeElement).not.toBe('govuk-notification-banner')
    })
  })

  describe('and a custom tabindex is set', () => {
    beforeAll(async () => {
      await goToComponent(page, 'notification-banner', {
        exampleName: 'custom-tabindex'
      })
    })

    it('does not remove the tabindex attribute on blur', async () => {
      await page.$eval('.govuk-notification-banner', el => el instanceof window.HTMLElement && el.blur())

      const tabindex = await page.$eval('.govuk-notification-banner', el => el.getAttribute('tabindex'))
      expect(tabindex).toEqual('2')
    })
  })
})
