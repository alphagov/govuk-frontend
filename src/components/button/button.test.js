/**
 * @jest-environment ./lib/puppeteer/environment.js
 */
/* eslint-env jest */

const configPaths = require('../../../config/paths.json')
const PORT = configPaths.ports.test

let browser
let page
let baseUrl = 'http://localhost:' + PORT

beforeAll(async (done) => {
  browser = global.__BROWSER__
  page = await browser.newPage()
  done()
})

afterAll(async (done) => {
  await page.close()
  done()
})

describe('/components/button', () => {
  describe('/components/button/link', () => {
    it('triggers the click event when the space key is pressed', async () => {
      await page.goto(baseUrl + '/components/button/link/preview', { waitUntil: 'load' })

      const href = await page.evaluate(() => document.body.getElementsByTagName('a')[0].getAttribute('href'))

      await page.focus('a[role="button"]')

      // we need to start the waitForNavigation() before the keyboard action
      // so we return a promise that is fulfilled when the navigation and the keyboard action are respectively fulfilled
      // this is somewhat counter intuitive, as we humans expect to act and then wait for something.
      await Promise.all([
        page.waitForNavigation(),
        page.keyboard.press('Space')
      ])

      const url = await page.url()
      expect(url).toBe(baseUrl + href)
    })
    describe('debouncing', () => {
      it('does not block button links', async () => {
        // Links should take a user to another part of the page or url, so debouncing it wouldnt have any impact.
        // But we can check that we're not blocking any initial clicks.

        await page.goto(baseUrl + '/components/button/link/preview', { waitUntil: 'load' })

        const href = await page.evaluate(() => document.body.getElementsByTagName('a')[0].getAttribute('href'))

        // we need to start the waitForNavigation() before we click on the button
        // so we return a promise that is fulfilled when the navigation and the click is respectively fulfilled
        // this is somewhat counter intuitive, as we humans expect to act and then wait for something.
        await Promise.all([
          page.waitForNavigation(),
          await page.click('a[role="button"]')
        ])

        const url = await page.url()
        expect(url).toBe(baseUrl + href)
      })
      it('does not trigger on buttons with type=button', async () => {
        await page.goto(baseUrl + '/components/button/type=button/preview', { waitUntil: 'load' })

        // Our examples don't have form wrappers so we need to overwrite it.
        await page.evaluate(() => {
          const $button = document.querySelector('button')
          $button.outerHTML = `<form>${$button.outerHTML}</form>`

          window.__BUTTON_CLICK_EVENTS = 0
          document.addEventListener('click', () => {
            window.__BUTTON_CLICK_EVENTS++
          })
        })

        await page.click('button')
        await page.click('button')

        const buttonPressedCount = await page.evaluate(() => window.__BUTTON_CLICK_EVENTS)

        expect(buttonPressedCount).toBe(2)
      })
      it('prevents repeat submissions when in a form', async () => {
        await page.goto(baseUrl + '/components/button/preview', { waitUntil: 'load' })

        // Our examples don't have form wrappers so we need to overwrite it.
        await page.evaluate(() => {
          const $button = document.querySelector('button')
          $button.outerHTML = `<form>${$button.outerHTML}</form>`

          window.__SUBMIT_EVENTS = 0
          document.querySelector('form').addEventListener('submit', event => {
            window.__SUBMIT_EVENTS++
            // Don't refresh the page, which will destroy the context to test against.
            event.preventDefault()
          })
        })

        await page.click('button')
        await page.click('button')

        const submitCount = await page.evaluate(() => window.__SUBMIT_EVENTS)

        expect(submitCount).toBe(1)
      })
      it('when a user clicks again intentionally it is not prevented', async () => {
        await page.goto(baseUrl + '/components/button/preview', { waitUntil: 'load' })

        // Our examples don't have form wrappers so we need to overwrite it.
        await page.evaluate(() => {
          const $button = document.querySelector('button')
          $button.outerHTML = `<form>${$button.outerHTML}</form>`

          window.__SUBMIT_EVENTS = 0
          document.querySelector('form').addEventListener('submit', event => {
            window.__SUBMIT_EVENTS++
            // Don't refresh the page, which will destroy the context to test against.
            event.preventDefault()
          })
        })

        await page.click('button')
        await page.click('button', { delay: 1000 })

        const submitCount = await page.evaluate(() => window.__SUBMIT_EVENTS)

        expect(submitCount).toBe(2)
      })
    })
  })
})
