import { getProperty, goTo } from '@govuk-frontend/helpers/puppeteer'

describe('Banner', () => {
  it('is visible by default', async () => {
    await goTo(page, '/')

    const $title = await page.$('title')

    // Check the page responded correctly
    expect(getProperty($title, 'textContent')).resolves.toEqual(
      `GOV.UK Frontend`
    )

    // Check that the banner is visible
    expect(page.$('[data-module="app-banner"]')).resolves.toBeTruthy()
  })

  it('can be hidden using a URL parameter', async () => {
    await goTo(page, '/?hide-banner')

    const $title = await page.$('title')

    // Check the page responded correctly
    expect(getProperty($title, 'textContent')).resolves.toEqual(
      `GOV.UK Frontend`
    )

    // Check that the banner is hidden
    expect(page.$('[data-module="app-banner"]')).resolves.toBeFalsy()
  })
})
