/* eslint-env jest */

const request = require('request')
const cheerio = require('cheerio')

const configPaths = require('../config/paths.json')
const PORT = configPaths.ports.test

const expectedPages = [
  'bank-holidays',
  'check-your-answers',
  'feedback',
  'how-do-you-want-to-sign-in',
  'news-and-communications',
  'passport-details',
  'service-manual-topic',
  'start-page',
  'update-your-account-details',
  'upload-your-photo',
  'what-is-your-nationality',
  'what-is-your-postcode'
]

// Returns a wrapper for `request` which applies these options by default
const requestPath = request.defaults({
  baseUrl: `http://localhost:${PORT}/full-page-examples/`,
  headers: {
    'Content-Type': 'text/plain'
  }
})

describe(`http://localhost:${PORT}/full-page-examples/`, () => {
  describe.each(expectedPages)('%s', path => {
    it('should resolve with a http status code of 200', done => {
      requestPath.get(path, (err, res) => {
        expect(res.statusCode).toEqual(200)
        done(err)
      })
    })

    it('should resolve with a ‘Content-Type’ header of "text/html"', done => {
      requestPath.get(path, (err, res) => {
        expect(res.headers['content-type']).toContain('text/html')
        done(err)
      })
    })

    it('should prevent search indexing', done => {
      requestPath.get(path, (err, res) => {
        expect(res.headers['x-robots-tag']).toEqual('none')
        done(err)
      })
    })
  })

  describe('/full-page-examples/', () => {
    describe('feedback', () => {
      it('should not show errors if submit with no input', (done) => {
        requestPath.get('feedback', (err, res) => {
          let $ = cheerio.load(res.body)

          // Check the page responded correctly
          expect(res.statusCode).toBe(200)
          expect($.html()).toContain('Send your feedback to GOV.UK Verify')

          // Check that the error summary is not visible
          let $errorSummary = $('[data-module="error-summary"]')
          expect($errorSummary.length).toBeFalsy()
          done(err)
        })
      })
      it('should show errors if form is submitted with no input', (done) => {
        requestPath.post(`feedback`, (err, res) => {
          let $ = cheerio.load(res.body)

          // Check the page responded correctly
          expect(res.statusCode).toBe(200)
          expect($.html()).toContain('Send your feedback to GOV.UK Verify')

          // Check that the error summary is visible
          let $errorSummary = $('[data-module="error-summary"]')
          expect($errorSummary.length).toBeTruthy()
          done(err)
        })
      })
    })

    describe('passport-details', () => {
      it('should not show errors if submit with no input', (done) => {
        requestPath.get('passport-details', (err, res) => {
          let $ = cheerio.load(res.body)

          // Check the page responded correctly
          expect(res.statusCode).toBe(200)
          expect($.html()).toContain('Passport details')

          // Check that the error summary is not visible
          let $errorSummary = $('[data-module="error-summary"]')
          expect($errorSummary.length).toBeFalsy()
          done(err)
        })
      })
      it('should show errors if form is submitted with no input', (done) => {
        requestPath.post(`passport-details`, (err, res) => {
          let $ = cheerio.load(res.body)

          // Check the page responded correctly
          expect(res.statusCode).toBe(200)
          expect($.html()).toContain('Passport details')

          // Check that the error summary is visible
          let $errorSummary = $('[data-module="error-summary"]')
          expect($errorSummary.length).toBeTruthy()
          done(err)
        })
      })
    })

    describe('update-your-account-details', () => {
      it('should not show errors if submit with no input', (done) => {
        requestPath.get('update-your-account-details', (err, res) => {
          let $ = cheerio.load(res.body)

          // Check the page responded correctly
          expect(res.statusCode).toBe(200)
          expect($.html()).toContain('Update your account details')

          // Check that the error summary is not visible
          let $errorSummary = $('[data-module="error-summary"]')
          expect($errorSummary.length).toBeFalsy()
          done(err)
        })
      })
      it('should show errors if form is submitted with no input', (done) => {
        requestPath.post(`update-your-account-details`, (err, res) => {
          let $ = cheerio.load(res.body)

          // Check the page responded correctly
          expect(res.statusCode).toBe(200)
          expect($.html()).toContain('Update your account details')

          // Check that the error summary is visible
          let $errorSummary = $('[data-module="error-summary"]')
          expect($errorSummary.length).toBeTruthy()
          done(err)
        })
      })
    })

    describe('upload-your-photo', () => {
      it('should not show errors if submit with no input', (done) => {
        requestPath.get('upload-your-photo', (err, res) => {
          let $ = cheerio.load(res.body)

          // Check the page responded correctly
          expect(res.statusCode).toBe(200)
          expect($.html()).toContain('Upload your photo')

          // Check that the error summary is not visible
          let $errorSummary = $('[data-module="error-summary"]')
          expect($errorSummary.length).toBeFalsy()
          done(err)
        })
      })
      it('should show errors if form is submitted with no input', (done) => {
        requestPath.post(`upload-your-photo`, (err, res) => {
          let $ = cheerio.load(res.body)

          // Check the page responded correctly
          expect(res.statusCode).toBe(200)
          expect($.html()).toContain('Upload your photo')

          // Check that the error summary is visible
          let $errorSummary = $('[data-module="error-summary"]')
          expect($errorSummary.length).toBeTruthy()
          done(err)
        })
      })
    })

    describe('how-do-you-want-to-sign-in', () => {
      it('should not show errors if submit with no input', (done) => {
        requestPath.get('how-do-you-want-to-sign-in', (err, res) => {
          let $ = cheerio.load(res.body)

          // Check the page responded correctly
          expect(res.statusCode).toBe(200)
          expect($.html()).toContain('How do you want to sign in?')

          // Check that the error summary is not visible
          let $errorSummary = $('[data-module="error-summary"]')
          expect($errorSummary.length).toBeFalsy()
          done(err)
        })
      })
      it('should show errors if form is submitted with no input', (done) => {
        requestPath.post(`how-do-you-want-to-sign-in`, (err, res) => {
          let $ = cheerio.load(res.body)

          // Check the page responded correctly
          expect(res.statusCode).toBe(200)
          expect($.html()).toContain('How do you want to sign in?')

          // Check that the error summary is visible
          let $errorSummary = $('[data-module="error-summary"]')
          expect($errorSummary.length).toBeTruthy()
          done(err)
        })
      })
    })

    describe('what-is-your-nationality', () => {
      it('should not show errors if submit with no input', (done) => {
        requestPath.get('what-is-your-nationality', (err, res) => {
          let $ = cheerio.load(res.body)

          // Check the page responded correctly
          expect(res.statusCode).toBe(200)
          expect($.html()).toContain('What is your nationality?')

          // Check that the error summary is not visible
          let $errorSummary = $('[data-module="error-summary"]')
          expect($errorSummary.length).toBeFalsy()
          done(err)
        })
      })
      it('should show errors if form is submitted with no input', (done) => {
        requestPath.post(`what-is-your-nationality`, (err, res) => {
          let $ = cheerio.load(res.body)

          // Check the page responded correctly
          expect(res.statusCode).toBe(200)
          expect($.html()).toContain('What is your nationality?')

          // Check that the error summary is visible
          let $errorSummary = $('[data-module="error-summary"]')
          expect($errorSummary.length).toBeTruthy()
          done(err)
        })
      })
    })

    describe('what-is-your-postcode', () => {
      it('should not show errors if submit with no input', (done) => {
        requestPath.get('what-is-your-postcode', (err, res) => {
          let $ = cheerio.load(res.body)

          // Check the page responded correctly
          expect(res.statusCode).toBe(200)
          expect($.html()).toContain('What is your home postcode?')

          // Check that the error summary is not visible
          let $errorSummary = $('[data-module="error-summary"]')
          expect($errorSummary.length).toBeFalsy()
          done(err)
        })
      })
      it('should show errors if form is submitted with no input', (done) => {
        requestPath.post(`what-is-your-postcode`, (err, res) => {
          let $ = cheerio.load(res.body)

          // Check the page responded correctly
          expect(res.statusCode).toBe(200)
          expect($.html()).toContain('What is your home postcode?')

          // Check that the error summary is visible
          let $errorSummary = $('[data-module="error-summary"]')
          expect($errorSummary.length).toBeTruthy()
          done(err)
        })
      })
    })

    describe('news-and-communications', () => {
      it('should show most wanted results by default', (done) => {
        requestPath.get('news-and-communications', (err, res) => {
          let $ = cheerio.load(res.body)
          // Check the results are correct
          expect($.html()).toContain('128,124 results')
          done(err)
        })
      })
      it('should show sorted results when selected', (done) => {
        requestPath.get('news-and-communications?order=updated-newest', (err, res) => {
          let $ = cheerio.load(res.body)
          // Check the results are correct
          expect($.html()).toContain('128,123 results')
          done(err)
        })
      })
      it('should show brexit results when checked', (done) => {
        requestPath.get('news-and-communications?order=most-viewed&brexit=true', (err, res) => {
          let $ = cheerio.load(res.body)
          // Check the results are correct
          expect($.html()).toContain('586 results')
          done(err)
        })
      })
    })
  })
})
