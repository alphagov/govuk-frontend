import { fetchPath } from '@govuk-frontend/helpers/tests'
import { load } from 'cheerio'

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
