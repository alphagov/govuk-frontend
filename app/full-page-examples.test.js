const cheerio = require('cheerio')

const configPaths = require('../config/paths')
const PORT = configPaths.ports.test

const expectedPages = [
  'bank-holidays',
  'check-your-answers',
  'feedback',
  'have-you-changed-your-name',
  'how-do-you-want-to-sign-in',
  'passport-details',
  'service-manual-topic',
  'start-page',
  'update-your-account-details',
  'upload-your-photo',
  'what-is-your-address',
  'what-is-your-nationality',
  'what-is-your-postcode',
  'what-was-the-last-country-you-visited'
]

// Returns Fetch API wrapper which applies these options by default
const fetchPath = (path, options) => {
  return fetch(`http://localhost:${PORT}/full-page-examples/${path}`, options)
}

describe(`http://localhost:${PORT}/full-page-examples/`, () => {
  describe.each(expectedPages)('%s', path => {
    it('should resolve with a http status code of 200', async () => {
      const { status } = await fetchPath(path, { method: 'HEAD' })
      expect(status).toEqual(200)
    })

    it('should resolve with a ‘Content-Type’ header of "text/html"', async () => {
      const { headers } = await fetchPath(path, { method: 'HEAD' })
      expect(headers.get('content-type')).toContain('text/html')
    })

    it('should prevent search indexing', async () => {
      const { headers } = await fetchPath(path, { method: 'HEAD' })
      expect(headers.get('x-robots-tag')).toEqual('none')
    })
  })

  describe('/full-page-examples/', () => {
    describe('feedback', () => {
      it('should not show errors if submit with no input', async () => {
        const response = await fetchPath('feedback')
        const body = await response.text()
        const $ = cheerio.load(body)

        // Check the page responded correctly
        expect(response.status).toBe(200)
        expect($.html()).toContain('Send your feedback')

        // Check that the error summary is not visible
        const $errorSummary = $('[data-module="govuk-error-summary"]')
        expect($errorSummary.length).toBeFalsy()
      })
      it('should show errors if form is submitted with no input', async () => {
        const response = await fetchPath('feedback', { method: 'POST' })
        const body = await response.text()
        const $ = cheerio.load(body)

        // Check the page responded correctly
        expect(response.status).toBe(200)
        expect($.html()).toContain('Send your feedback')

        // Check the title has an error
        expect($('title').text()).toContain('Error:')

        // Check that the error summary is visible
        const $errorSummary = $('[data-module="govuk-error-summary"]')
        expect($errorSummary.length).toBeTruthy()
      })
    })

    describe('have-you-changed-your-name', () => {
      it('should not show errors if submit with no input', async () => {
        const response = await fetchPath('have-you-changed-your-name')
        const body = await response.text()
        const $ = cheerio.load(body)

        // Check the page responded correctly
        expect(response.status).toBe(200)
        expect($.html()).toContain('Have you changed your name?')

        // Check that the error summary is not visible
        const $errorSummary = $('[data-module="govuk-error-summary"]')
        expect($errorSummary.length).toBeFalsy()
      })
      it('should show errors if form is submitted with no input', async () => {
        const response = await fetchPath('have-you-changed-your-name', { method: 'POST' })
        const body = await response.text()
        const $ = cheerio.load(body)

        // Check the page responded correctly
        expect(response.status).toBe(200)
        expect($.html()).toContain('Have you changed your name?')

        // Check the title has an error
        expect($('title').text()).toContain('Error:')

        // Check that the error summary is visible
        const $errorSummary = $('[data-module="govuk-error-summary"]')
        expect($errorSummary.length).toBeTruthy()
      })
    })

    describe('passport-details', () => {
      it('should not show errors if submit with no input', async () => {
        const response = await fetchPath('passport-details')
        const body = await response.text()
        const $ = cheerio.load(body)

        // Check the page responded correctly
        expect(response.status).toBe(200)
        expect($.html()).toContain('Passport details')

        // Check that the error summary is not visible
        const $errorSummary = $('[data-module="govuk-error-summary"]')
        expect($errorSummary.length).toBeFalsy()
      })
      it('should show errors if form is submitted with no input', async () => {
        const response = await fetchPath('passport-details', { method: 'POST' })
        const body = await response.text()
        const $ = cheerio.load(body)

        // Check the page responded correctly
        expect(response.status).toBe(200)
        expect($.html()).toContain('Passport details')

        // Check the title has an error
        expect($('title').text()).toContain('Error:')

        // Check that the error summary is visible
        const $errorSummary = $('[data-module="govuk-error-summary"]')
        expect($errorSummary.length).toBeTruthy()
      })
    })

    describe('update-your-account-details', () => {
      it('should not show errors if submit with no input', async () => {
        const response = await fetchPath('update-your-account-details')
        const body = await response.text()
        const $ = cheerio.load(body)

        // Check the page responded correctly
        expect(response.status).toBe(200)
        expect($.html()).toContain('Update your account details')

        // Check that the error summary is not visible
        const $errorSummary = $('[data-module="govuk-error-summary"]')
        expect($errorSummary.length).toBeFalsy()
      })
      it('should show errors if form is submitted with no input', async () => {
        const response = await fetchPath('update-your-account-details', { method: 'POST' })
        const body = await response.text()
        const $ = cheerio.load(body)

        // Check the page responded correctly
        expect(response.status).toBe(200)
        expect($.html()).toContain('Update your account details')

        // Check the title has an error
        expect($('title').text()).toContain('Error:')

        // Check that the error summary is visible
        const $errorSummary = $('[data-module="govuk-error-summary"]')
        expect($errorSummary.length).toBeTruthy()
      })
    })

    describe('upload-your-photo', () => {
      it('should not show errors if submit with no input', async () => {
        const response = await fetchPath('upload-your-photo')
        const body = await response.text()
        const $ = cheerio.load(body)

        // Check the page responded correctly
        expect(response.status).toBe(200)
        expect($.html()).toContain('Upload your photo')

        // Check that the error summary is not visible
        const $errorSummary = $('[data-module="govuk-error-summary"]')
        expect($errorSummary.length).toBeFalsy()
      })
      it('should show errors if form is submitted with no input', async () => {
        const response = await fetchPath('upload-your-photo', { method: 'POST' })
        const body = await response.text()
        const $ = cheerio.load(body)

        // Check the page responded correctly
        expect(response.status).toBe(200)
        expect($.html()).toContain('Upload your photo')

        // Check the title has an error
        expect($('title').text()).toContain('Error:')

        // Check that the error summary is visible
        const $errorSummary = $('[data-module="govuk-error-summary"]')
        expect($errorSummary.length).toBeTruthy()
      })
    })

    describe('how-do-you-want-to-sign-in', () => {
      it('should not show errors if submit with no input', async () => {
        const response = await fetchPath('how-do-you-want-to-sign-in')
        const body = await response.text()
        const $ = cheerio.load(body)

        // Check the page responded correctly
        expect(response.status).toBe(200)
        expect($.html()).toContain('How do you want to sign in?')

        // Check that the error summary is not visible
        const $errorSummary = $('[data-module="govuk-error-summary"]')
        expect($errorSummary.length).toBeFalsy()
      })
      it('should show errors if form is submitted with no input', async () => {
        const response = await fetchPath('how-do-you-want-to-sign-in', { method: 'POST' })
        const body = await response.text()
        const $ = cheerio.load(body)

        // Check the page responded correctly
        expect(response.status).toBe(200)
        expect($.html()).toContain('How do you want to sign in?')

        // Check the title has an error
        expect($('title').text()).toContain('Error:')

        // Check that the error summary is visible
        const $errorSummary = $('[data-module="govuk-error-summary"]')
        expect($errorSummary.length).toBeTruthy()
      })
    })

    describe('what-is-your-nationality', () => {
      it('should not show errors if submit with no input', async () => {
        const response = await fetchPath('what-is-your-nationality')
        const body = await response.text()
        const $ = cheerio.load(body)

        // Check the page responded correctly
        expect(response.status).toBe(200)
        expect($.html()).toContain('What is your nationality?')

        // Check that the error summary is not visible
        const $errorSummary = $('[data-module="govuk-error-summary"]')
        expect($errorSummary.length).toBeFalsy()
      })
      it('should show errors if form is submitted with no input', async () => {
        const response = await fetchPath('what-is-your-nationality', { method: 'POST' })
        const body = await response.text()
        const $ = cheerio.load(body)

        // Check the page responded correctly
        expect(response.status).toBe(200)
        expect($.html()).toContain('What is your nationality?')

        // Check the title has an error
        expect($('title').text()).toContain('Error:')

        // Check that the error summary is visible
        const $errorSummary = $('[data-module="govuk-error-summary"]')
        expect($errorSummary.length).toBeTruthy()
      })
    })

    describe('what-is-your-address', () => {
      it('should not show errors if submit with no input', async () => {
        const response = await fetchPath('what-is-your-address')
        const body = await response.text()
        const $ = cheerio.load(body)

        // Check the page responded correctly
        expect(response.status).toBe(200)
        expect($.html()).toContain('What is your address?')

        // Check that the error summary is not visible
        const $errorSummary = $('[data-module="govuk-error-summary"]')
        expect($errorSummary.length).toBeFalsy()
      })
      it('should show errors if form is submitted with no input', async () => {
        const response = await fetchPath('what-is-your-address', { method: 'POST' })
        const body = await response.text()
        const $ = cheerio.load(body)

        // Check the page responded correctly
        expect(response.status).toBe(200)
        expect($.html()).toContain('What is your address?')

        // Check the title has an error
        expect($('title').text()).toContain('Error:')

        // Check that the error summary is visible
        const $errorSummary = $('[data-module="govuk-error-summary"]')
        expect($errorSummary.length).toBeTruthy()
      })
    })

    describe('what-is-your-postcode', () => {
      it('should not show errors if submit with no input', async () => {
        const response = await fetchPath('what-is-your-postcode')
        const body = await response.text()
        const $ = cheerio.load(body)

        // Check the page responded correctly
        expect(response.status).toBe(200)
        expect($.html()).toContain('What is your home postcode?')

        // Check that the error summary is not visible
        const $errorSummary = $('[data-module="govuk-error-summary"]')
        expect($errorSummary.length).toBeFalsy()
      })
      it('should show errors if form is submitted with no input', async () => {
        const response = await fetchPath('what-is-your-postcode', { method: 'POST' })
        const body = await response.text()
        const $ = cheerio.load(body)

        // Check the page responded correctly
        expect(response.status).toBe(200)
        expect($.html()).toContain('What is your home postcode?')

        // Check the title has an error
        expect($('title').text()).toContain('Error:')

        // Check that the error summary is visible
        const $errorSummary = $('[data-module="govuk-error-summary"]')
        expect($errorSummary.length).toBeTruthy()
      })
    })

    describe('search', () => {
      it('should show most wanted results by default', async () => {
        const response = await fetchPath('search')
        const body = await response.text()
        const $ = cheerio.load(body)
        // Check the results are correct
        expect($.html()).toContain('822,411 results')
      })
      it('should show sorted results when selected', async () => {
        const response = await fetchPath('search?order=updated-newest')
        const body = await response.text()
        const $ = cheerio.load(body)
        // Check the results are correct
        expect($.html()).toContain('142,218 results')
      })
      it('should show organisation results when selected', async () => {
        const response = await fetchPath('search?order=updated-newest&organisation=hmrc')
        const body = await response.text()
        const $ = cheerio.load(body)
        // Check the results are correct
        expect($.html()).toContain('421,182 results')
      })
    })

    describe('what-was-the-last-country-you-visited', () => {
      it('should not show errors if submit with no input', async () => {
        const response = await fetchPath('what-was-the-last-country-you-visited')
        const body = await response.text()
        const $ = cheerio.load(body)

        // Check the page responded correctly
        expect(response.status).toBe(200)
        expect($.html()).toContain('What was the last country you visited?')

        // Check that the error summary is not visible
        const $errorSummary = $('[data-module="govuk-error-summary"]')
        expect($errorSummary.length).toBeFalsy()
      })
      it('should show errors if form is submitted with no input', async () => {
        const response = await fetchPath('what-was-the-last-country-you-visited', { method: 'POST' })
        const body = await response.text()
        const $ = cheerio.load(body)

        // Check the page responded correctly
        expect(response.status).toBe(200)
        expect($.html()).toContain('What was the last country you visited?')

        // Check the title has an error
        expect($('title').text()).toContain('Error:')

        // Check that the error summary is visible
        const $errorSummary = $('[data-module="govuk-error-summary"]')
        expect($errorSummary.length).toBeTruthy()
      })
    })
  })
})
