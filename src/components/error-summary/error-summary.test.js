/* eslint-env jest */

const configPaths = require('../../../config/paths.json')
const PORT = configPaths.ports.test

let baseUrl = 'http://localhost:' + PORT

describe('Error Summary', () => {
  it('is automatically focused when the page loads', async () => {
    await page.goto(`${baseUrl}/components/error-summary/preview`, { waitUntil: 'load' })

    const moduleName = await page.evaluate(() => document.activeElement.dataset.module)
    expect(moduleName).toBe('error-summary')
  })

  let inputTypes = [
    // [description, input id, selector for label or legend]
    ['an input', 'input', 'label[for="input"]'],
    ['a textarea', 'textarea', 'label[for="textarea"]'],
    ['a select', 'select', 'label[for="select"]'],
    ['a date input', 'dateinput-day', '.test-date-input-legend'],
    ['a specific field in a date input', 'dateinput2-year', '.test-date-input2-legend'],
    ['a file upload', 'file', 'label[for="file"]'],
    ['a group of radio buttons', 'radios', '#test-radios legend'],
    ['a group of checkboxes', 'checkboxes', '#test-checkboxes legend'],
    ['a single checkbox', 'single-checkbox', 'label[for="single-checkbox"]'],
    ['a conditionally revealed input', 'yes-input', '#test-conditional-reveal legend']
  ]

  describe.each(inputTypes)('when linking to %s', (_, inputId, legendOrLabelSelector) => {
    beforeAll(async () => {
      await page.goto(`${baseUrl}/examples/error-summary`, { waitUntil: 'load' })
      await page.click(`.govuk-error-summary a[href="#${inputId}"]`)
    })

    it('focuses the target input', async () => {
      const activeElement = await page.evaluate(() => document.activeElement.id)
      expect(activeElement).toBe(inputId)
    })

    it('scrolls the label or legend to the top of the screen', async () => {
      const legendOrLabelOffsetFromTop = await page.$eval(
        legendOrLabelSelector,
        $ => $.getBoundingClientRect().top
      )

      expect(legendOrLabelOffsetFromTop).toEqual(0)
    })

    it('does not include a hash in the URL', async () => {
      const hash = await page.evaluate(() => window.location.hash)
      expect(hash).toBe('')
    })
  })
})
