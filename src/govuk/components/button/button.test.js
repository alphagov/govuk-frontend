const { getExamples } = require('govuk-frontend-lib/file-helper')
const { goTo, goToComponent, renderAndInitialise } = require('govuk-frontend-lib/puppeteer-helpers')

describe('/components/button', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('button')
  })

  describe('mis-instantiation', () => {
    it('does not prevent further JavaScript from running', async () => {
      await goTo(page, '/tests/boilerplate')

      const result = await page.evaluate((component) => {
        const namespace = 'GOVUKFrontend' in window
          ? window.GOVUKFrontend
          : {}

        // `undefined` simulates the element being missing,
        // from an unchecked `document.querySelector` for example
        new namespace[component](undefined).init()

        // If our component initialisation breaks, this won't run
        return true
      }, 'Button')

      expect(result).toBe(true)
    })
  })

  describe('/components/button/link', () => {
    beforeAll(async () => {
      await goToComponent(page, 'button', {
        exampleName: 'link'
      })
    })

    it('triggers the click event when the space key is pressed', async () => {
      const pathname = await page.evaluate(() => document.body.getElementsByTagName('a')[0].getAttribute('href'))

      await page.focus('a[role="button"]')

      // we need to start the waitForNavigation() before the keyboard action
      // so we return a promise that is fulfilled when the navigation and the keyboard action are respectively fulfilled
      // this is somewhat counter intuitive, as we humans expect to act and then wait for something.
      await Promise.all([
        page.waitForNavigation(),
        page.keyboard.press('Space')
      ])

      const url = new URL(await page.url())
      expect(url.pathname).toBe(pathname)
    })
  })

  describe('preventing double clicks', () => {
    // Click counting is done through using the button to submit
    // a form and counting submissions. It requires some bits of recurring
    // logic which are wrapped in the following helpers

    /**
     * Wraps the button rendered on the page in a form
     *
     * Examples don't do this and we need it to have something to submit
     *
     * @param {import('puppeteer').Page} page - Puppeteer page object
     * @returns {Promise<void>}
     */
    function trackClicks (page) {
      return page.evaluate(() => {
        const $button = document.querySelector('button')
        const $form = document.createElement('form')
        $button.parentNode.appendChild($form)
        $form.appendChild($button)

        globalThis.__SUBMIT_EVENTS = 0
        $form.addEventListener('submit', (event) => {
          globalThis.__SUBMIT_EVENTS++
          // Don't refresh the page, which will destroy the context to test against.
          event.preventDefault()
        })
      })
    }

    /**
     * Gets the number of times the form was submitted
     *
     * @param {import('puppeteer').Page} page - Puppeteer page object
     * @returns {Promise<number>} Number of times the form was submitted
     */
    function getClicksCount (page) {
      return page.evaluate(() => globalThis.__SUBMIT_EVENTS)
    }

    describe('not enabled', () => {
      beforeEach(async () => {
        await goToComponent(page, 'button')
        await trackClicks(page)
      })

      it('does not prevent multiple submissions', async () => {
        await page.click('button')
        await page.click('button')

        const clicksCount = await getClicksCount(page)

        expect(clicksCount).toBe(2)
      })
    })

    describe('using data-attributes', () => {
      beforeEach(async () => {
        await goToComponent(page, 'button', {
          exampleName: 'prevent-double-click'
        })
        await trackClicks(page)
      })

      it('prevents unintentional submissions when in a form', async () => {
        await page.click('button')
        await page.click('button')

        const clicksCount = await getClicksCount(page)

        expect(clicksCount).toBe(1)
      })

      it('does not prevent intentional multiple clicks', async () => {
        await page.click('button')
        await page.click('button', { delay: 1000 })

        const clicksCount = await getClicksCount(page)

        expect(clicksCount).toBe(2)
      })

      it('does not prevent subsequent clicks on different buttons', async () => {
        // Clone button to have two buttons on the page
        await page.evaluate(() => {
          const $button = document.querySelector('button')
          const $secondButton = $button.cloneNode(true)

          document.querySelector('form').appendChild($secondButton)
        })

        await page.click('button:nth-child(1)')
        await page.click('button:nth-child(2)')

        const clicksCount = await getClicksCount(page)

        expect(clicksCount).toBe(2)
      })
    })

    describe('using JavaScript configuration', () => {
      beforeEach(async () => {
        await renderAndInitialise(page, 'button', {
          params: examples.default,
          config: {
            preventDoubleClick: true
          }
        })

        await trackClicks(page)
      })

      it('prevents unintentional submissions when in a form', async () => {
        await page.click('button')
        await page.click('button')

        const clicksCount = await getClicksCount(page)

        expect(clicksCount).toBe(1)
      })

      it('does not prevent intentional multiple clicks', async () => {
        await page.click('button')
        await page.click('button', { delay: 1000 })

        const clicksCount = await getClicksCount(page)

        expect(clicksCount).toBe(2)
      })

      it('does not prevent subsequent clicks on different buttons', async () => {
        // Clone button to have two buttons on the page
        await page.evaluate(() => {
          const $button = document.querySelector('button')
          const $secondButton = $button.cloneNode(true)

          document.querySelector('form').appendChild($secondButton)
        })

        await page.click('button:nth-child(1)')
        await page.click('button:nth-child(2)')

        const clicksCount = await getClicksCount(page)

        expect(clicksCount).toBe(2)
      })
    })

    describe('using JavaScript configuration, but cancelled by data-attributes', () => {
      beforeEach(async () => {
        await renderAndInitialise(page, 'button', {
          params: examples["don't prevent double click"],
          config: {
            preventDoubleClick: true
          }
        })

        await trackClicks(page)
      })

      it('does not prevent multiple submissions', async () => {
        await page.click('button')
        await page.click('button')

        const clicksCount = await getClicksCount(page)

        expect(clicksCount).toBe(2)
      })
    })

    describe('using `initAll`', () => {
      beforeEach(async () => {
        await renderAndInitialise(page, 'button', {
          params: examples.default,
          config: {
            preventDoubleClick: true
          }
        })

        await trackClicks(page)
      })

      it('prevents unintentional submissions when in a form', async () => {
        await page.click('button')
        await page.click('button')

        const clicksCount = await getClicksCount(page)

        expect(clicksCount).toBe(1)
      })

      it('does not prevent intentional multiple clicks', async () => {
        await page.click('button')
        await page.click('button', { delay: 1000 })

        const clicksCount = await getClicksCount(page)

        expect(clicksCount).toBe(2)
      })

      it('does not prevent subsequent clicks on different buttons', async () => {
        // Clone button to have two buttons on the page
        await page.evaluate(() => {
          const $button = document.querySelector('button')
          const $secondButton = $button.cloneNode(true)

          document.querySelector('form').appendChild($secondButton)
        })

        await page.click('button:nth-child(1)')
        await page.click('button:nth-child(2)')

        const clicksCount = await getClicksCount(page)

        expect(clicksCount).toBe(2)
      })
    })
  })
})
