const { render } = require('@govuk-frontend/helpers/puppeteer')
const { getExamples } = require('@govuk-frontend/lib/components')

describe('Error Summary', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('error-summary')
  })

  it('adds the tabindex attribute on page load', async () => {
    await render(page, 'error-summary', examples.default)

    const tabindex = await page.$eval('.govuk-error-summary', (el) =>
      el.getAttribute('tabindex')
    )

    expect(tabindex).toEqual('-1')
  })

  it('is automatically focused when the page loads', async () => {
    await render(page, 'error-summary', examples.default)

    const moduleName = await page.evaluate(() =>
      document.activeElement.getAttribute('data-module')
    )

    expect(moduleName).toBe('govuk-error-summary')
  })

  it('removes the tabindex attribute on blur', async () => {
    await render(page, 'error-summary', examples.default)

    await page.$eval(
      '.govuk-error-summary',
      (el) => el instanceof window.HTMLElement && el.blur()
    )

    const tabindex = await page.$eval('.govuk-error-summary', (el) =>
      el.getAttribute('tabindex')
    )

    expect(tabindex).toBeNull()
  })

  describe('when auto-focus is disabled', () => {
    describe('using data-attributes', () => {
      beforeAll(async () => {
        await render(page, 'error-summary', examples['autofocus disabled'])
      })

      it('does not have a tabindex attribute', async () => {
        const tabindex = await page.$eval('.govuk-error-summary', (el) =>
          el.getAttribute('tabindex')
        )

        expect(tabindex).toBeNull()
      })

      it('does not focus on page load', async () => {
        const activeElement = await page.evaluate(() =>
          document.activeElement.getAttribute('data-module')
        )

        expect(activeElement).not.toBe('govuk-error-summary')
      })
    })

    describe('using JavaScript configuration', () => {
      beforeAll(async () => {
        await render(page, 'error-summary', examples.default, {
          config: {
            disableAutoFocus: true
          }
        })
      })

      it('does not have a tabindex attribute', async () => {
        const tabindex = await page.$eval('.govuk-error-summary', (el) =>
          el.getAttribute('tabindex')
        )

        expect(tabindex).toBeNull()
      })

      it('does not focus on page load', async () => {
        const activeElement = await page.evaluate(() =>
          document.activeElement.getAttribute('data-module')
        )

        expect(activeElement).not.toBe('govuk-error-summary')
      })
    })

    describe('using JavaScript configuration, but enabled via data-attributes', () => {
      beforeAll(async () => {
        await render(
          page,
          'error-summary',
          examples['autofocus explicitly enabled']
        )
      })

      it('adds the tabindex attribute on page load', async () => {
        const tabindex = await page.$eval('.govuk-error-summary', (el) =>
          el.getAttribute('tabindex')
        )
        expect(tabindex).toEqual('-1')
      })

      it('is automatically focused when the page loads', async () => {
        const moduleName = await page.evaluate(() =>
          document.activeElement.getAttribute('data-module')
        )
        expect(moduleName).toBe('govuk-error-summary')
      })
    })

    describe('using `initAll`', () => {
      beforeAll(async () => {
        await render(page, 'error-summary', examples.default, {
          config: {
            disableAutoFocus: true
          }
        })
      })

      it('does not have a tabindex attribute', async () => {
        const tabindex = await page.$eval('.govuk-error-summary', (el) =>
          el.getAttribute('tabindex')
        )

        expect(tabindex).toBeNull()
      })

      it('does not focus on page load', async () => {
        const activeElement = await page.evaluate(() =>
          document.activeElement.getAttribute('data-module')
        )

        expect(activeElement).not.toBe('govuk-error-summary')
      })
    })
  })

  describe('errors at instantiation', () => {
    let examples

    beforeAll(async () => {
      examples = await getExamples('error-summary')
    })

    it('can throw a SupportError if appropriate', async () => {
      await expect(
        render(page, 'error-summary', examples.default, {
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
        render(page, 'error-summary', examples.default, {
          beforeInitialisation($module) {
            $module.remove()
          }
        })
      ).rejects.toMatchObject({
        cause: {
          name: 'ElementError',
          message: 'Error summary: Root element (`$module`) not found'
        }
      })
    })

    it('throws when receiving the wrong type for $module', async () => {
      await expect(
        render(page, 'error-summary', examples.default, {
          beforeInitialisation($module) {
            // Replace with an `<svg>` element which is not an `HTMLElement` in the DOM (but an `SVGElement`)
            $module.outerHTML = `<svg data-module="govuk-error-summary"></svg>`
          }
        })
      ).rejects.toMatchObject({
        cause: {
          name: 'ElementError',
          message:
            'Error summary: Root element (`$module`) is not of type HTMLElement'
        }
      })
    })
  })
})
