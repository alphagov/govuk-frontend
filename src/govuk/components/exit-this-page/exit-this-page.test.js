/**
 * @jest-environment puppeteer
 */

const { goToComponent } = require('../../../../lib/puppeteer-helpers')

const buttonClass = '.govuk-js-exit-this-page-button'

describe('/components/exit-this-page', () => {
  beforeEach(async () => {
    await goToComponent(page, 'exit-this-page')
  })

  it('navigates to the href of the button', async () => {
    const href = await page.evaluate((buttonClass) => document.querySelector(buttonClass).href, buttonClass)

    await Promise.all([
      page.waitForNavigation(),
      page.click(buttonClass)
    ])

    const url = await page.url()
    expect(url).toBe(href)
  })

  it('activates the button functionality when the Shift key is pressed 3 times', async () => {
    const href = await page.evaluate((buttonClass) => document.querySelector(buttonClass).href, buttonClass)

    await Promise.all([
      page.keyboard.press('Shift'),
      page.keyboard.press('Shift'),
      page.keyboard.press('Shift'),
      page.waitForNavigation()
    ])

    const url = await page.url()
    expect(url).toBe(href)
  })
})
