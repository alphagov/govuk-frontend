import { goToExample } from '@govuk-frontend/helpers/puppeteer'

describe('Example: Error summary', () => {
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
})
