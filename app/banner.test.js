/* eslint-env jest */

const request = require('request')
const cheerio = require('cheerio')

const configPaths = require('../config/paths.json')
const PORT = configPaths.ports.test

// Returns a wrapper for `request` which applies these options by default
const requestPath = request.defaults({
  baseUrl: `http://localhost:${PORT}`,
  headers: {
    'Content-Type': 'text/plain'
  }
})

describe('Banner', () => {
  it('should be visible by default', done => {
    requestPath.get('/', (err, res) => {
      let $ = cheerio.load(res.body)

      // Check the page responded correctly
      expect(res.statusCode).toBe(200)
      expect($.html()).toContain('GOV.UK Frontend')

      // Check that the banner is visible
      let appBanner = $('[data-module="app-banner"]')
      expect(appBanner.length).toBeTruthy()
      done(err)
    })
  })
  it('should be dismissable', done => {
    requestPath.post('/hide-banner', {
      followAllRedirects: true,
      jar: true // enable cookies
    }, (err, res) => {
      let $ = cheerio.load(res.body)

      // Check the page responded correctly
      expect(res.statusCode).toBe(200)
      expect($.html()).toContain('GOV.UK Frontend')

      // Check that the banner is not visible
      let appBanner = $('[data-module="app-banner"]')
      expect(appBanner.length).toBeFalsy()
      done(err)
    })
  })
})
