import { load } from 'cheerio'
import { ports } from 'govuk-frontend-config'

// Returns Fetch API wrapper which applies these options by default
const fetchPath = (path, options) => {
  return fetch(`http://localhost:${ports.app}${path}`, options)
}

describe('Banner', () => {
  it('is visible by default', async () => {
    const response = await fetchPath('/')
    const body = await response.text()
    const $ = load(body)

    // Check the page responded correctly
    expect(response.status).toBe(200)
    expect($.html()).toContain('GOV.UK Frontend')

    // Check that the banner is visible
    const appBanner = $('[data-module="app-banner"]')
    expect(appBanner.length).toBeTruthy()
  })

  it('can be hidden using a url parameter', async () => {
    const response = await fetchPath('/?hide-banner')
    const body = await response.text()
    const $ = load(body)

    // Check the page responded correctly
    expect(response.status).toBe(200)
    expect($.html()).toContain('GOV.UK Frontend')

    // Check that the banner is visible
    const appBanner = $('[data-module="app-banner"]')
    expect(appBanner.length).toBeFalsy()
  })
})
