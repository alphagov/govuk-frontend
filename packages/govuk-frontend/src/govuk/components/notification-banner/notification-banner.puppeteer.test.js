const { render } = require('@govuk-frontend/helpers/puppeteer')
const { getExamples } = require('@govuk-frontend/lib/components')

describe('Notification banner', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('notification-banner')
  })

  describe('when type is set to "success"', () => {
    it('has the correct tabindex attribute to be focused with JavaScript', async () => {
      await render(
        page,
        'notification-banner',
        examples['with type as success']
      )

      const tabindex = await page.$eval('.govuk-notification-banner', (el) =>
        el.getAttribute('tabindex')
      )

      expect(tabindex).toEqual('-1')
    })

    it('is automatically focused when the page loads', async () => {
      await render(
        page,
        'notification-banner',
        examples['with type as success']
      )

      const activeElement = await page.evaluate(() =>
        document.activeElement.getAttribute('data-module')
      )

      expect(activeElement).toBe('govuk-notification-banner')
    })

    it('removes the tabindex attribute on blur', async () => {
      await render(
        page,
        'notification-banner',
        examples['with type as success']
      )

      await page.$eval(
        '.govuk-notification-banner',
        (el) => el instanceof window.HTMLElement && el.blur()
      )

      const tabindex = await page.$eval('.govuk-notification-banner', (el) =>
        el.getAttribute('tabindex')
      )
      expect(tabindex).toBeNull()
    })

    describe('and auto-focus is disabled using data attributes', () => {
      beforeAll(async () => {
        await render(
          page,
          'notification-banner',
          examples['auto-focus disabled, with type as success']
        )
      })

      it('does not have a tabindex attribute', async () => {
        const tabindex = await page.$eval('.govuk-notification-banner', (el) =>
          el.getAttribute('tabindex')
        )

        expect(tabindex).toBeNull()
      })

      it('does not focus the notification banner', async () => {
        const activeElement = await page.evaluate(() =>
          document.activeElement.getAttribute('data-module')
        )

        expect(activeElement).not.toBe('govuk-notification-banner')
      })
    })

    describe('and auto-focus is disabled using JavaScript configuration', () => {
      beforeAll(async () => {
        await render(
          page,
          'notification-banner',
          examples['with type as success'],
          {
            config: {
              disableAutoFocus: true
            }
          }
        )
      })

      it('does not have a tabindex attribute', async () => {
        const tabindex = await page.$eval('.govuk-notification-banner', (el) =>
          el.getAttribute('tabindex')
        )

        expect(tabindex).toBeNull()
      })

      it('does not focus the notification banner', async () => {
        const activeElement = await page.evaluate(() =>
          document.activeElement.getAttribute('data-module')
        )

        expect(activeElement).not.toBe('govuk-notification-banner')
      })
    })

    describe('and auto-focus is disabled using options passed to initAll', () => {
      beforeAll(async () => {
        await render(
          page,
          'notification-banner',
          examples['with type as success'],
          {
            config: {
              disableAutoFocus: true
            }
          }
        )
      })

      it('does not have a tabindex attribute', async () => {
        const tabindex = await page.$eval('.govuk-notification-banner', (el) =>
          el.getAttribute('tabindex')
        )

        expect(tabindex).toBeNull()
      })

      it('does not focus the notification banner', async () => {
        const activeElement = await page.evaluate(() =>
          document.activeElement.getAttribute('data-module')
        )

        expect(activeElement).not.toBe('govuk-notification-banner')
      })
    })

    describe('and autofocus is disabled in JS but enabled in data attributes', () => {
      beforeAll(async () => {
        await render(
          page,
          'notification-banner',
          examples['auto-focus explicitly enabled, with type as success'],
          {
            config: {
              disableAutoFocus: true
            }
          }
        )
      })

      it('has the correct tabindex attribute to be focused with JavaScript', async () => {
        const tabindex = await page.$eval('.govuk-notification-banner', (el) =>
          el.getAttribute('tabindex')
        )

        expect(tabindex).toEqual('-1')
      })

      it('is automatically focused when the page loads', async () => {
        const activeElement = await page.evaluate(() =>
          document.activeElement.getAttribute('data-module')
        )

        expect(activeElement).toBe('govuk-notification-banner')
      })
    })

    describe('and role is overridden to "region"', () => {
      beforeAll(async () => {
        await render(
          page,
          'notification-banner',
          examples['role=alert overridden to role=region, with type as success']
        )
      })

      it('does not have a tabindex attribute', async () => {
        const tabindex = await page.$eval('.govuk-notification-banner', (el) =>
          el.getAttribute('tabindex')
        )

        expect(tabindex).toBeNull()
      })

      it('does not focus the notification banner', async () => {
        const activeElement = await page.evaluate(() =>
          document.activeElement.getAttribute('data-module')
        )

        expect(activeElement).not.toBe('govuk-notification-banner')
      })
    })

    describe('and a custom tabindex is set', () => {
      beforeAll(async () => {
        await render(page, 'notification-banner', examples['custom tabindex'])
      })

      it('does not remove the tabindex attribute on blur', async () => {
        await page.$eval(
          '.govuk-notification-banner',
          (el) => el instanceof window.HTMLElement && el.blur()
        )

        const tabindex = await page.$eval('.govuk-notification-banner', (el) =>
          el.getAttribute('tabindex')
        )
        expect(tabindex).toEqual('2')
      })
    })
  })

  describe('errors at instantiation', () => {
    it('can throw a SupportError if appropriate', async () => {
      await expect(
        render(page, 'notification-banner', examples.default, {
          beforeInitialisation() {
            document.body.classList.remove('govuk-frontend-supported')
          }
        })
      ).rejects.toMatchObject({
        cause: {
          name: 'SupportError',
          message:
            'GOV.UK Frontend initialised without `<body class="govuk-frontend-supported">` from template `<script>` snippet'
        }
      })
    })

    it('throws when $module is not set', async () => {
      await expect(
        render(page, 'notification-banner', examples.default, {
          beforeInitialisation($module) {
            $module.remove()
          }
        })
      ).rejects.toMatchObject({
        cause: {
          name: 'ElementError',
          message: 'Notification banner: Root element (`$module`) not found'
        }
      })
    })

    it('throws when receiving the wrong type for $module', async () => {
      await expect(
        render(page, 'notification-banner', examples.default, {
          beforeInitialisation($module) {
            // Replace with an `<svg>` element which is not an `HTMLElement` in the DOM (but an `SVGElement`)
            $module.outerHTML = `<svg data-module="govuk-notification-banner"></svg>`
          }
        })
      ).rejects.toMatchObject({
        cause: {
          name: 'ElementError',
          message:
            'Notification banner: Root element (`$module`) is not of type HTMLElement'
        }
      })
    })
  })
})
