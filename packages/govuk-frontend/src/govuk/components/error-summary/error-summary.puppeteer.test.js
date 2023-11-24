const { goToExample, render } = require('@govuk-frontend/helpers/puppeteer')
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

  const inputTypes = [
    // [description, input id, selector for label or legend]
    ['an input', 'input', 'label[for="input"]'],
    ['a textarea', 'textarea', 'label[for="textarea"]'],
    ['a select', 'select', 'label[for="select"]'],
    ['a date input', 'dateinput-day', '.test-date-input-legend'],
    [
      'a specific field in a date input',
      'dateinput2-year',
      '.test-date-input2-legend'
    ],
    ['a file upload', 'file', 'label[for="file"]'],
    ['a group of radio buttons', 'radios', '#test-radios legend'],
    ['a group of checkboxes', 'checkboxes', '#test-checkboxes legend'],
    ['a single checkbox', 'single-checkbox', 'label[for="single-checkbox"]'],
    [
      'a conditionally revealed input',
      'yes-input',
      '#test-conditional-reveal legend'
    ],
    [
      'a group of radio buttons after a particularly long heading',
      'radios-big-heading',
      '.test-radios-big-heading-legend'
    ],
    // Rather than scrolling to the fieldset, we expect to scroll to the label
    // because of the distance between the input and the fieldset
    [
      'an input within a large fieldset',
      'address-postcode',
      'label[for="address-postcode"]'
    ]
  ]

  describe.each(inputTypes)(
    'when linking to %s',
    (_, inputId, legendOrLabelSelector) => {
      /** @type {globalThis.page} */
      let page

      beforeAll(async () => {
        page = await goToExample(browser, 'error-summary')
        await page.click(`.govuk-error-summary a[href="#${inputId}"]`)
      })

      it('focuses the target input', async () => {
        const activeElement = await page.evaluate(
          () => document.activeElement.id
        )
        expect(activeElement).toBe(inputId)
      })

      it('scrolls the label or legend to the top of the screen', async () => {
        const legendOrLabelOffsetFromTop = await page.$eval(
          legendOrLabelSelector,
          ($) => $.getBoundingClientRect().top
        )

        // Allow for high DPI displays (device pixel ratio)
        expect(legendOrLabelOffsetFromTop).toBeGreaterThanOrEqual(0)
        expect(legendOrLabelOffsetFromTop).toBeLessThan(1)
      })

      it('does not include a hash in the URL', async () => {
        const hash = await page.evaluate(() => window.location.hash)
        expect(hash).toBe('')
      })
    }
  )

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
