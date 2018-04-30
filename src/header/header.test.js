/**
 * @jest-environment ./lib/puppeteer/environment.js
 */
/* eslint-env jest */

const devices = require('puppeteer/DeviceDescriptors')
const iPhone = devices['iPhone 6']
const configPaths = require('../../config/paths.json')
const PORT = configPaths.ports.test

let browser
let page
let baseUrl = 'http://localhost:' + PORT

beforeAll(async (done) => {
  browser = global.__BROWSER__
  page = await browser.newPage()
  await page.emulate(iPhone)
  done()
})

afterAll(async (done) => {
  await page.close()
  done()
})

describe('/components/header', () => {
  describe('/components/header/with-navigation/preview', () => {
    describe('when menu button is pressed', () => {
      it('should indicate the open state of the toggle button', async () => {
        await page.goto(baseUrl + '/components/header/with-navigation/preview', { waitUntil: 'load' })

        await page.click('.js-header-toggle')

        const toggleButtonIsOpen = await page.evaluate(() => document.body.querySelector('.govuk-header__menu-button').classList.contains('govuk-header__menu-button--open'))
        expect(toggleButtonIsOpen).toBeTruthy()
      })

      it('should indicate the expanded state of the toggle button using aria-expanded', async () => {
        await page.goto(baseUrl + '/components/header/with-navigation/preview', { waitUntil: 'load' })

        await page.click('.js-header-toggle')

        const toggleButtonAriaExpanded = await page.evaluate(() => document.body.querySelector('.govuk-header__menu-button').getAttribute('aria-expanded'))
        expect(toggleButtonAriaExpanded).toBe('true')
      })

      it('should indicate the open state of the navigation', async () => {
        await page.goto(baseUrl + '/components/header/with-navigation/preview', { waitUntil: 'load' })

        await page.click('.js-header-toggle')

        const navigationIsOpen = await page.evaluate(() => document.body.querySelector('.govuk-header__navigation').classList.contains('govuk-header__navigation--open'))
        expect(navigationIsOpen).toBeTruthy()
      })

      it('should indicate the visible state of the navigation using aria-hidden', async () => {
        await page.goto(baseUrl + '/components/header/with-navigation/preview', { waitUntil: 'load' })

        await page.click('.js-header-toggle')

        const navigationAriaHidden = await page.evaluate(() => document.body.querySelector('.govuk-header__navigation').getAttribute('aria-hidden'))
        expect(navigationAriaHidden).toBe('false')
      })
    })

    describe('when menu button is pressed twice', () => {
      it('should indicate the open state of the toggle button', async () => {
        await page.goto(baseUrl + '/components/header/with-navigation/preview', { waitUntil: 'load' })

        await page.click('.js-header-toggle')
        await page.click('.js-header-toggle')

        const toggleButtonIsOpen = await page.evaluate(() => document.body.querySelector('.govuk-header__menu-button').classList.contains('govuk-header__menu-button--open'))
        expect(toggleButtonIsOpen).toBeFalsy()
      })

      it('should indicate the expanded state of the toggle button using aria-expanded', async () => {
        await page.goto(baseUrl + '/components/header/with-navigation/preview', { waitUntil: 'load' })

        await page.click('.js-header-toggle')
        await page.click('.js-header-toggle')

        const toggleButtonAriaExpanded = await page.evaluate(() => document.body.querySelector('.govuk-header__menu-button').getAttribute('aria-expanded'))
        expect(toggleButtonAriaExpanded).toBe('false')
      })

      it('should indicate the open state of the navigation', async () => {
        await page.goto(baseUrl + '/components/header/with-navigation/preview', { waitUntil: 'load' })

        await page.click('.js-header-toggle')
        await page.click('.js-header-toggle')

        const navigationIsOpen = await page.evaluate(() => document.body.querySelector('.govuk-header__navigation').classList.contains('govuk-header__navigation--open'))
        expect(navigationIsOpen).toBeFalsy()
      })

      it('should indicate the visible state of the navigation using aria-hidden', async () => {
        await page.goto(baseUrl + '/components/header/with-navigation/preview', { waitUntil: 'load' })

        await page.click('.js-header-toggle')
        await page.click('.js-header-toggle')

        const navigationAriaHidden = await page.evaluate(() => document.body.querySelector('.govuk-header__navigation').getAttribute('aria-hidden'))
        expect(navigationAriaHidden).toBe('true')
      })
    })
  })
})
