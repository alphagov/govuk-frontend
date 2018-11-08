/**
 * @jest-environment ./lib/puppeteer/environment.js
 */
/* eslint-env jest */

const configPaths = require('../../../config/paths.json')
const PORT = configPaths.ports.test

let browser
let page
let baseUrl = 'http://localhost:' + PORT

beforeEach(async () => {
  browser = global.__BROWSER__
  page = await browser.newPage()
})

afterEach(async () => {
  await page.close()
})

describe('Character count', () => {
  describe('when JavaScript is unavailable or fails', () => {
    it('shows the static message', async () => {
      await page.setJavaScriptEnabled(false)

      await page.goto(baseUrl + '/components/character-count/preview', { waitUntil: 'load' })
      const message = await page.$eval('.govuk-character-count__message', el => el.innerHTML.trim())

      expect(message).toEqual('You can enter up to 10 characters')
    })
  })
  describe('when JavaScript is available', () => {
    it('shows the dynamic message', async () => {
      await page.goto(baseUrl + '/components/character-count/preview', { waitUntil: 'load' })

      const message = await page.$eval('.govuk-character-count__message', el => el.innerHTML.trim())

      expect(message).toEqual('You have 10 characters remaining')
    })

    it('counts down while typing and within limit', async () => {
      await page.goto(baseUrl + '/components/character-count/preview', { waitUntil: 'load' })

      // Press 1 character
      await page.focus('.js-character-count')
      await page.keyboard.press('A')
      const message = await page.$eval('.govuk-character-count__message', el => el.innerHTML.trim())

      expect(message).toEqual('You have 9 characters remaining')
    })

    it('counts up while typing and the limit is exceeded', async () => {
      await page.goto(baseUrl + '/components/character-count/preview', { waitUntil: 'load' })

      // Press 11 characters
      await page.focus('.js-character-count')
      for (let i = 0; i < 11; i++) {
        await page.keyboard.press('A')
      }

      const message = await page.$eval('.govuk-character-count__message', el => el.innerHTML.trim())

      expect(message).toEqual('You have 1 character too many')
    })

    it('adds error styles to the textarea when the limit is exceeded', async () => {
      await page.goto(baseUrl + '/components/character-count/preview', { waitUntil: 'load' })

      // Press 11 characters
      await page.focus('.js-character-count')
      for (let i = 0; i < 11; i++) {
        await page.keyboard.press('A')
      }

      const textareaClasses = await page.$eval('.js-character-count', el => el.className)

      expect(textareaClasses).toContain('govuk-textarea--error')
    })

    it('adds error styles to the count message when the limit is exceeded', async () => {
      await page.goto(baseUrl + '/components/character-count/preview', { waitUntil: 'load' })

      // Press 11 characters
      await page.focus('.js-character-count')
      for (let i = 0; i < 11; i++) {
        await page.keyboard.press('A')
      }

      const messageClasses = await page.$eval('.govuk-character-count__message', el => el.className)

      expect(messageClasses).toContain('govuk-error-message')
    })
  })
})
