import { getProperty, goTo } from '@govuk-frontend/helpers/puppeteer'
import { getComponentNames } from '@govuk-frontend/lib/components'

describe('Other examples', () => {
  describe.each([
    '/examples/form-alignment',
    '/examples/form-elements',
    '/examples/grid',
    '/examples/links',
    '/examples/typography',
    '/examples/template-default',
    '/examples/template-custom'
  ])('%s', (path) => {
    beforeAll(async () => {
      await goTo(page, path)
    })

    it('should load correctly', async () => {
      const $title = await page.$('title')

      // Check the page responded correctly
      await expect(getProperty($title, 'textContent')).resolves.toContain(
        'GOV.UK'
      )
    })
  })
})

describe('Listing pages', () => {
  describe.each([
    '/components', // All component default examples
    '/full-page-examples' // All full page examples
  ])('%s', (path) => {
    it('should load correctly', async () => {
      await goTo(page, path)

      const $title = await page.$('title')

      // Check the page responded correctly
      await expect(getProperty($title, 'textContent')).resolves.toContain(
        'GOV.UK'
      )
    })
  })
})

describe('Home page', () => {
  it('should display the list of components', async () => {
    await goTo(page, '/')

    const componentNames = await getComponentNames()
    const componentsList = await page.$$('li a[href^="/components/"]')

    await expect(componentsList).toHaveLength(componentNames.length)
  })

  it('should display the banner by default', async () => {
    await goTo(page, '/')

    const $title = await page.$('title')

    // Check the page responded correctly
    await expect(getProperty($title, 'textContent')).resolves.toBe(
      `GOV.UK Frontend`
    )

    // Check that the banner is visible
    await expect(page.$('[data-module="app-banner"]')).resolves.toBeTruthy()
  })

  it('should hide the banner using a URL parameter', async () => {
    await goTo(page, '/?hide-banner')

    const $title = await page.$('title')

    // Check the page responded correctly
    await expect(getProperty($title, 'textContent')).resolves.toBe(
      `GOV.UK Frontend`
    )

    // Check that the banner is hidden
    await expect(page.$('[data-module="app-banner"]')).resolves.toBeFalsy()
  })
})
