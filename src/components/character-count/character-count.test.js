/**
 * @jest-environment ./lib/puppeteer/environment.js
 */
/* eslint-env jest */

const configPaths = require('../../../config/paths.json')
const PORT = configPaths.ports.test
const componentUrl = `http://localhost:${PORT}/components/character-count/preview`

let browser
let page

beforeAll(async () => {
  browser = global.__BROWSER__
  page = await browser.newPage()
})

afterAll(async () => {
  await page.close()
})

describe('Character count', () => {
  describe('when JavaScript is unavailable or fails', () => {
    beforeAll(async () => {
      await page.setJavaScriptEnabled(false)
    })

    afterAll(async () => {
      await page.setJavaScriptEnabled(true)
    })

    it('shows the static message', async () => {
      await page.goto(componentUrl, { waitUntil: 'load' })
      const message = await page.$eval('.govuk-character-count__message', el => el.innerHTML.trim())

      expect(message).toEqual('You can enter up to 10 characters')
    })
  })

  describe('when JavaScript is available', () => {
    it('shows the dynamic message', async () => {
      await page.goto(componentUrl, { waitUntil: 'load' })

      const message = await page.$eval('.govuk-character-count__message', el => el.innerHTML.trim())

      expect(message).toEqual('You have 10 characters remaining')
    })

    describe('when within the character limit', () => {
      it('counts down to the character limit', async () => {
        await page.goto(componentUrl, { waitUntil: 'load' })
        await page.type('.js-character-count', 'A')

        const message = await page.$eval('.govuk-character-count__message', el => el.innerHTML.trim())

        expect(message).toEqual('You have 9 characters remaining')
      })
    })

    describe('when the character limit is exceeded', () => {
      beforeAll(async () => {
        // Type 11 characters into the character count
        await page.goto(componentUrl, { waitUntil: 'load' })
        await page.type('.js-character-count', 'A'.repeat(11))
      })

      it('shows the number of characters over the limit', async () => {
        const message = await page.$eval('.govuk-character-count__message', el => el.innerHTML.trim())
        expect(message).toEqual('You have 1 character too many')
      })

      it('adds error styles to the textarea', async () => {
        const textareaClasses = await page.$eval('.js-character-count', el => el.className)
        expect(textareaClasses).toContain('govuk-textarea--error')
      })

      it('adds error styles to the count message', async () => {
        const messageClasses = await page.$eval('.govuk-character-count__message', el => el.className)
        expect(messageClasses).toContain('govuk-error-message')
      })
    })
  })
})
