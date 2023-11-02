import { goToExample } from '@govuk-frontend/helpers/puppeteer'

describe('Example: Scoped initialisation', () => {
  /** @type {globalThis.page} */
  let page

  beforeEach(async () => {
    page = await goToExample(browser, 'scoped-initialisation')
  })

  it('GOV.UK Frontend can be scoped to initialise certain sections of the page', async () => {
    // To test that certain parts of the page are scoped we have two similar components
    // that we can interact with to check if they're interactive.

    // Check that the conditional reveal component has a conditional section that would open if enhanced.
    await page.waitForSelector('#conditional-not-scoped', { hidden: true })

    await page.click('[for="not-scoped"]')

    // Check that when it is clicked that nothing opens, which shows that it has not been enhanced.
    await page.waitForSelector('#conditional-not-scoped', { hidden: true })

    // Check the other conditional reveal which has been enhanced based on it's scope.
    await page.waitForSelector('#conditional-scoped', { hidden: true })

    await page.click('[for="scoped"]')

    // Check that it has opened as expected.
    await page.waitForSelector('#conditional-scoped', { hidden: false })
  })
})
