/* eslint-env jest */

const devices = require('puppeteer/DeviceDescriptors')
const iPhone = devices['iPhone 6']
const configPaths = require('../../../../config/paths.json')
const PORT = configPaths.ports.test

let baseUrl = 'http://localhost:' + PORT

beforeAll(async (done) => {
  await page.emulate(iPhone)
  done()
})

describe('/components/header', () => {
  describe('/components/header/with-navigation/preview', () => {
    describe('when JavaScript is unavailable or fails', () => {
      beforeAll(async () => {
        await page.setJavaScriptEnabled(false)
      })

      afterAll(async () => {
        await page.setJavaScriptEnabled(true)
      })

      it('falls back to making the navigation visible', async () => {
        await page.goto(baseUrl + '/components/header/with-navigation/preview', { waitUntil: 'load' })
        const isContentVisible = await page.waitForSelector('.govuk-header__navigation', { visible: true, timeout: 1000 })
        expect(isContentVisible).toBeTruthy()
      })
    })

    describe('when JavaScript is available', () => {
      describe('when menu button is pressed', () => {
        it('should indicate the open state of the toggle button', async () => {
          await page.goto(baseUrl + '/components/header/with-navigation/preview', { waitUntil: 'load' })

          await page.click('.govuk-js-header-toggle')

          const toggleButtonIsOpen = await page.evaluate(() => document.body.querySelector('.govuk-header__menu-button').classList.contains('govuk-header__menu-button--open'))
          expect(toggleButtonIsOpen).toBeTruthy()
        })

        it('should indicate the expanded state of the toggle button using aria-expanded', async () => {
          await page.goto(baseUrl + '/components/header/with-navigation/preview', { waitUntil: 'load' })

          await page.click('.govuk-js-header-toggle')

          const toggleButtonAriaExpanded = await page.evaluate(() => document.body.querySelector('.govuk-header__menu-button').getAttribute('aria-expanded'))
          expect(toggleButtonAriaExpanded).toBe('true')
        })

        it('should indicate the open state of the navigation', async () => {
          await page.goto(baseUrl + '/components/header/with-navigation/preview', { waitUntil: 'load' })

          await page.click('.govuk-js-header-toggle')

          const navigationIsOpen = await page.evaluate(() => document.body.querySelector('.govuk-header__navigation').classList.contains('govuk-header__navigation--open'))
          expect(navigationIsOpen).toBeTruthy()
        })

        it('should indicate the visible state of the navigation using aria-hidden', async () => {
          await page.goto(baseUrl + '/components/header/with-navigation/preview', { waitUntil: 'load' })

          await page.click('.govuk-js-header-toggle')

          const navigationAriaHidden = await page.evaluate(() => document.body.querySelector('.govuk-header__navigation').getAttribute('aria-hidden'))
          expect(navigationAriaHidden).toBe('false')
        })
      })

      describe('when menu button is pressed twice', () => {
        it('should indicate the open state of the toggle button', async () => {
          await page.goto(baseUrl + '/components/header/with-navigation/preview', { waitUntil: 'load' })

          await page.click('.govuk-js-header-toggle')
          await page.click('.govuk-js-header-toggle')

          const toggleButtonIsOpen = await page.evaluate(() => document.body.querySelector('.govuk-header__menu-button').classList.contains('govuk-header__menu-button--open'))
          expect(toggleButtonIsOpen).toBeFalsy()
        })

        it('should indicate the expanded state of the toggle button using aria-expanded', async () => {
          await page.goto(baseUrl + '/components/header/with-navigation/preview', { waitUntil: 'load' })

          await page.click('.govuk-js-header-toggle')
          await page.click('.govuk-js-header-toggle')

          const toggleButtonAriaExpanded = await page.evaluate(() => document.body.querySelector('.govuk-header__menu-button').getAttribute('aria-expanded'))
          expect(toggleButtonAriaExpanded).toBe('false')
        })

        it('should indicate the open state of the navigation', async () => {
          await page.goto(baseUrl + '/components/header/with-navigation/preview', { waitUntil: 'load' })

          await page.click('.govuk-js-header-toggle')
          await page.click('.govuk-js-header-toggle')

          const navigationIsOpen = await page.evaluate(() => document.body.querySelector('.govuk-header__navigation').classList.contains('govuk-header__navigation--open'))
          expect(navigationIsOpen).toBeFalsy()
        })

        it('should indicate the visible state of the navigation using aria-hidden', async () => {
          await page.goto(baseUrl + '/components/header/with-navigation/preview', { waitUntil: 'load' })

          await page.click('.govuk-js-header-toggle')
          await page.click('.govuk-js-header-toggle')

          const navigationAriaHidden = await page.evaluate(() => document.body.querySelector('.govuk-header__navigation').getAttribute('aria-hidden'))
          expect(navigationAriaHidden).toBe('true')
        })
      })
    })
  })
})
