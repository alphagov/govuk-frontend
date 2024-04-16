const { render } = require('@govuk-frontend/helpers/puppeteer')
const { getExamples } = require('@govuk-frontend/lib/components')

describe('/components/button', () => {
  let examples

  const clickTimeoutTime = 1000 // ms

  // The longest possible time a button will ignore unintentional clicks for
  // until it can be clicked again (+ 100ms to stay outside the total wait time)
  const debouncedWaitTime = clickTimeoutTime + 100

  beforeAll(async () => {
    examples = await getExamples('button')
  })

  describe('/components/button/link', () => {
    beforeAll(async () => {
      await render(page, 'button', examples.link)
    })

    it('triggers the click event when the space key is pressed', async () => {
      const pathname = await page.evaluate(() =>
        document.body.getElementsByTagName('a')[0].getAttribute('href')
      )

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
    /**
     * Sets the number of times a button was clicked
     *
     * @param {import('puppeteer').ElementHandle<HTMLButtonElement>} $button - Puppeteer button element
     * @returns {Promise<import('puppeteer').ElementHandle<HTMLButtonElement>>} Puppeteer button element
     */
    async function setButtonTracking($button) {
      const counts = {
        click: 0,
        debounce: 0
      }

      // Track number of button clicks
      await $button.evaluate(
        (el, counts) =>
          el.addEventListener(
            'click',
            (event) => {
              counts.click++
              el.dataset.clickCount = `${counts.click}`

              // Track number of button clicks that debounced
              event.preventDefault = () => {
                counts.debounce++
                el.dataset.debounceCount = `${counts.debounce}`
              }

              // Add listener during capture phase to spy on event
            },
            { capture: true }
          ),
        counts
      )

      return $button
    }

    /**
     * Gets the number of times the button was clicked
     *
     * @param {import('puppeteer').ElementHandle<HTMLButtonElement>} $button - Puppeteer button element
     * @returns {Promise<{ click: number; debounce: number; }>} Number of times the button was clicked
     */
    function getButtonTracking($button) {
      return $button.evaluate((el) => ({
        click: parseInt(el.dataset.clickCount ?? '0'),
        debounce: parseInt(el.dataset.debounceCount ?? '0')
      }))
    }

    describe('not enabled', () => {
      /** @type {import('puppeteer').ElementHandle<HTMLButtonElement>} */
      let $button

      beforeEach(async () => {
        await render(page, 'button', examples.default)
        $button = await setButtonTracking(await page.$('button'))
      })

      it('does not prevent multiple clicks', async () => {
        await $button.click()
        await $button.click()

        const counts = await getButtonTracking($button)

        expect(counts.click).toBe(2)
        expect(counts.debounce).toBe(0)
      })
    })

    describe('using data-attributes', () => {
      /** @type {import('puppeteer').ElementHandle<HTMLButtonElement>} */
      let $button

      beforeEach(async () => {
        await render(page, 'button', examples['prevent double click'])
        $button = await setButtonTracking(await page.$('button'))
      })

      it('prevents unintentional clicks', async () => {
        await $button.click({ count: 2 })

        const counts = await getButtonTracking($button)

        expect(counts.click).toBe(2)
        expect(counts.debounce).toBe(1)
      })

      it('does not prevent intentional multiple clicks', async () => {
        await $button.click({ count: 2, delay: debouncedWaitTime })

        const counts = await getButtonTracking($button)

        expect(counts.click).toBe(2)
        expect(counts.debounce).toBe(0)
      })

      it('does not prevent subsequent clicks on different buttons', async () => {
        $button.evaluate((el) => el.parentNode.appendChild(el.cloneNode(true)))

        // Locate original and cloned button
        const $button1 = await setButtonTracking(
          await page.$('button:nth-child(1)')
        )
        const $button2 = await setButtonTracking(
          await page.$('button:nth-child(2)')
        )

        await $button1.click({ count: 2 })
        await $button2.click()

        const button1Counts = await getButtonTracking($button1)
        const button2Counts = await getButtonTracking($button2)

        // 2nd click on button 1 prevented
        expect(button1Counts.click).toBe(2)
        expect(button1Counts.debounce).toBe(1)

        // 3rd click on button 2 not prevented
        expect(button2Counts.click).toBe(1)
        expect(button2Counts.debounce).toBe(0)
      })
    })

    describe('using JavaScript configuration', () => {
      /** @type {import('puppeteer').ElementHandle<HTMLButtonElement>} */
      let $button

      beforeEach(async () => {
        await render(page, 'button', examples.default, {
          config: {
            preventDoubleClick: true
          }
        })

        $button = await setButtonTracking(await page.$('button'))
      })

      it('prevents unintentional clicks', async () => {
        await $button.click({ count: 2 })

        const counts = await getButtonTracking($button)

        expect(counts.click).toBe(2)
        expect(counts.debounce).toBe(1)
      })

      it('does not prevent intentional multiple clicks', async () => {
        await $button.click({ count: 2, delay: debouncedWaitTime })

        const counts = await getButtonTracking($button)

        expect(counts.click).toBe(2)
        expect(counts.debounce).toBe(0)
      })

      it('does not prevent subsequent clicks on different buttons', async () => {
        $button.evaluate((el) => el.parentNode.appendChild(el.cloneNode(true)))

        // Locate original and cloned button
        const $button1 = await setButtonTracking(
          await page.$('button:nth-child(1)')
        )
        const $button2 = await setButtonTracking(
          await page.$('button:nth-child(2)')
        )

        await $button1.click({ count: 2 })
        await $button2.click()

        const button1Counts = await getButtonTracking($button1)
        const button2Counts = await getButtonTracking($button2)

        // 2nd click on button 1 prevented
        expect(button1Counts.click).toBe(2)
        expect(button1Counts.debounce).toBe(1)

        // 3rd click on button 2 not prevented
        expect(button2Counts.click).toBe(1)
        expect(button2Counts.debounce).toBe(0)
      })
    })

    describe('using JavaScript configuration, but cancelled by data-attributes', () => {
      /** @type {import('puppeteer').ElementHandle<HTMLButtonElement>} */
      let $button

      beforeEach(async () => {
        await render(page, 'button', examples["don't prevent double click"], {
          config: {
            preventDoubleClick: true
          }
        })

        $button = await setButtonTracking(await page.$('button'))
      })

      it('does not prevent multiple clicks', async () => {
        await $button.click({ count: 2 })

        const counts = await getButtonTracking($button)

        expect(counts.click).toBe(2)
        expect(counts.debounce).toBe(0)
      })
    })

    describe('using `initAll`', () => {
      /** @type {import('puppeteer').ElementHandle<HTMLButtonElement>} */
      let $button

      beforeEach(async () => {
        await render(page, 'button', examples.default, {
          config: {
            preventDoubleClick: true
          }
        })

        $button = await setButtonTracking(await page.$('button'))
      })

      it('prevents unintentional clicks', async () => {
        await $button.click({ count: 2 })

        const counts = await getButtonTracking($button)

        expect(counts.click).toBe(2)
        expect(counts.debounce).toBe(1)
      })

      it('does not prevent intentional multiple clicks', async () => {
        await $button.click({ count: 2, delay: debouncedWaitTime })

        const counts = await getButtonTracking($button)

        expect(counts.click).toBe(2)
        expect(counts.debounce).toBe(0)
      })

      it('does not prevent subsequent clicks on different buttons', async () => {
        $button.evaluate((el) => el.parentNode.appendChild(el.cloneNode(true)))

        // Locate original and cloned button
        const $button1 = await setButtonTracking(
          await page.$('button:nth-child(1)')
        )
        const $button2 = await setButtonTracking(
          await page.$('button:nth-child(2)')
        )

        await $button1.click({ count: 2 })
        await $button2.click()

        const button1Counts = await getButtonTracking($button1)
        const button2Counts = await getButtonTracking($button2)

        // 2nd click on button 1 prevented
        expect(button1Counts.click).toBe(2)
        expect(button1Counts.debounce).toBe(1)

        // 3rd click on button 2 not prevented
        expect(button2Counts.click).toBe(1)
        expect(button2Counts.debounce).toBe(0)
      })
    })

    describe('errors at instantiation', () => {
      let examples

      beforeAll(async () => {
        examples = await getExamples('button')
      })

      it('can throw a SupportError if appropriate', async () => {
        await expect(
          render(page, 'button', examples.default, {
            beforeInitialisation() {
              document.body.classList.remove('govuk-frontend-supported')
            }
          })
        ).rejects.toMatchObject({
          cause: {
            name: 'SupportError',
            message:
              'GOV.UK Frontend initialised without `<body class="govuk-frontend-supported">` from template `<script>` snippet'
          }
        })
      })

      it('throws when $module is not set', async () => {
        await expect(
          render(page, 'button', examples.default, {
            beforeInitialisation($module) {
              $module.remove()
            }
          })
        ).rejects.toMatchObject({
          cause: {
            name: 'ElementError',
            message: 'Button: Root element (`$module`) not found'
          }
        })
      })

      it('throws when receiving the wrong type for $module', async () => {
        await expect(
          render(page, 'button', examples.default, {
            beforeInitialisation($module) {
              // Replace with an `<svg>` element which is not an `HTMLElement` in the DOM (but an `SVGElement`)
              $module.outerHTML = `<svg data-module="govuk-button"></svg>`
            }
          })
        ).rejects.toMatchObject({
          cause: {
            name: 'ElementError',
            message:
              'Button: Root element (`$module`) is not of type HTMLElement'
          }
        })
      })
    })
  })
})
