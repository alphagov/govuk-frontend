/* eslint-env jest */

const configPaths = require('../../../config/paths.json')
const PORT = configPaths.ports.test

let baseUrl = 'http://localhost:' + PORT

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
    describe('preventing double clicks', () => {
      it('prevents unintentional submissions when in a form', async () => {
        await page.goto(baseUrl + '/components/button/prevent-double-click/preview', { waitUntil: 'load' })

        // Our examples don't have form wrappers so we need to overwrite it.
        await page.evaluate(() => {
          const $button = document.querySelector('button')
          const $form = document.createElement('form')
          $button.parentNode.appendChild($form)
          $button.parentNode.removeChild($button)
          $form.appendChild($button)

          window.__SUBMIT_EVENTS = 0
          $form.addEventListener('submit', event => {
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
      it('does not prevent intentional multiple clicks', async () => {
        await page.goto(baseUrl + '/components/button/prevent-double-click/preview', { waitUntil: 'load' })

        // Our examples don't have form wrappers so we need to overwrite it.
        await page.evaluate(() => {
          const $button = document.querySelector('button')
          const $form = document.createElement('form')
          $button.parentNode.appendChild($form)
          $button.parentNode.removeChild($button)
          $form.appendChild($button)

          window.__SUBMIT_EVENTS = 0
          $form.addEventListener('submit', event => {
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
      it('does not prevent multiple submissions when feature is not enabled', async () => {
        await page.goto(baseUrl + '/components/button/preview', { waitUntil: 'load' })

        // Our examples don't have form wrappers so we need to overwrite it.
        await page.evaluate(() => {
          const $button = document.querySelector('button')
          const $form = document.createElement('form')
          $button.parentNode.appendChild($form)
          $button.parentNode.removeChild($button)
          $form.appendChild($button)

          window.__SUBMIT_EVENTS = 0
          $form.addEventListener('submit', event => {
            window.__SUBMIT_EVENTS++
            // Don't refresh the page, which will destroy the context to test against.
            event.preventDefault()
          })
        })

        await page.click('button')
        await page.click('button')

        const submitCount = await page.evaluate(() => window.__SUBMIT_EVENTS)

        expect(submitCount).toBe(2)
      })
    })
  })
})
