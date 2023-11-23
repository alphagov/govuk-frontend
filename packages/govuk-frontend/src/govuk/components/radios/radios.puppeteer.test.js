const {
  goToExample,
  getProperty,
  getAttribute,
  isVisible,
  render
} = require('@govuk-frontend/helpers/puppeteer')
const { getExamples } = require('@govuk-frontend/lib/components')

describe('Radios', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('radios')
  })

  describe('with conditional reveals', () => {
    describe('when JavaScript is unavailable or fails', () => {
      beforeAll(async () => {
        await page.setJavaScriptEnabled(false)
      })

      afterAll(async () => {
        await page.setJavaScriptEnabled(true)
      })

      describe('with conditional items', () => {
        let $component
        let $inputs
        let $conditionals

        beforeAll(async () => {
          await render(page, 'radios', examples['with conditional items'])

          $component = await page.$('.govuk-radios')
          $inputs = await $component.$$('.govuk-radios__input')
          $conditionals = await $component.$$('.govuk-radios__conditional')

          expect($inputs.length).toBe(3)
          expect($conditionals.length).toBe(3)
        })

        it('has no ARIA attributes applied', async () => {
          const $inputsWithAriaExpanded = await $component.$$(
            '.govuk-radios__input[aria-expanded]'
          )
          const $inputsWithAriaControls = await $component.$$(
            '.govuk-radios__input[aria-controls]'
          )

          expect($inputsWithAriaExpanded.length).toBe(0)
          expect($inputsWithAriaControls.length).toBe(0)
        })

        it('falls back to making all conditional content visible', async () => {
          return Promise.all(
            $conditionals.map(async ($conditional) => {
              return expect(await isVisible($conditional)).toBe(true)
            })
          )
        })
      })
    })

    describe('when JavaScript is available', () => {
      describe('with conditional item checked', () => {
        let $component
        let $inputs

        beforeEach(async () => {
          await render(
            page,
            'radios',
            examples['with conditional item checked']
          )

          $component = await page.$('.govuk-radios')
          $inputs = await $component.$$('.govuk-radios__input')
        })

        it('has conditional content revealed that is associated with a checked input', async () => {
          const $input = $inputs[0] // First input, checked
          const $conditional = await $component.$(
            `[id="${await getAttribute($input, 'aria-controls')}"]`
          )

          expect(await getProperty($input, 'checked')).toBe(true)
          expect(await isVisible($conditional)).toBe(true)
        })

        it('has no conditional content revealed that is associated with an unchecked input', async () => {
          const $input = $inputs[$inputs.length - 1] // Last input, unchecked
          const $conditional = await $component.$(
            `[id="${await getAttribute($input, 'aria-controls')}"]`
          )

          expect(await getProperty($input, 'checked')).toBe(false)
          expect(await isVisible($conditional)).toBe(false)
        })
      })

      describe('with conditional items', () => {
        let $component
        let $inputs

        beforeEach(async () => {
          await render(page, 'radios', examples['with conditional items'])

          $component = await page.$('.govuk-radios')
          $inputs = await $component.$$('.govuk-radios__input')
        })

        it('indicates when conditional content is collapsed or revealed', async () => {
          const $input = $inputs[0] // First input, with conditional content

          // Initially collapsed
          expect(await getProperty($input, 'checked')).toBe(false)
          expect(await getAttribute($input, 'aria-expanded')).toBe('false')

          // Toggle revealed
          await $input.click()

          expect(await getProperty($input, 'checked')).toBe(true)
          expect(await getAttribute($input, 'aria-expanded')).toBe('true')

          // Stays revealed (unlike radios)
          await $input.click()

          expect(await getProperty($input, 'checked')).toBe(true)
          expect(await getAttribute($input, 'aria-expanded')).toBe('true')
        })

        it('toggles the conditional content when clicking an input', async () => {
          const $input = $inputs[0] // First input, with conditional content
          const $conditional = await $component.$(
            `[id="${await getAttribute($input, 'aria-controls')}"]`
          )

          // Initially collapsed
          expect(await getProperty($input, 'checked')).toBe(false)
          expect(await isVisible($conditional)).toBe(false)

          // Toggle revealed
          await $input.click()

          expect(await getProperty($input, 'checked')).toBe(true)
          expect(await isVisible($conditional)).toBe(true)

          // Stays revealed (unlike radios)
          await $input.click()

          expect(await getProperty($input, 'checked')).toBe(true)
          expect(await isVisible($conditional)).toBe(true)
        })

        it('toggles the conditional content when using an input with a keyboard', async () => {
          const $input = $inputs[0] // First input, with conditional content
          const $conditional = await $component.$(
            `[id="${await getAttribute($input, 'aria-controls')}"]`
          )

          // Initially collapsed
          expect(await getProperty($input, 'checked')).toBe(false)
          expect(await isVisible($conditional)).toBe(false)

          // Toggle revealed
          await $input.focus()
          await page.keyboard.press('Space')

          expect(await getProperty($input, 'checked')).toBe(true)
          expect(await isVisible($conditional)).toBe(true)

          // Stays revealed (unlike radios)
          await page.keyboard.press('Space')

          expect(await getProperty($input, 'checked')).toBe(true)
          expect(await isVisible($conditional)).toBe(true)
        })
      })

      describe('with conditional items with special characters', () => {
        it('does not error when ID of revealed content contains special characters', async () => {
          // Errors logged to the console will cause this test to fail
          await render(
            page,
            'radios',
            examples['with conditional items with special characters']
          )
        })
      })
    })
  })

  describe('with multiple groups', () => {
    describe('when JavaScript is available', () => {
      /** @type {globalThis.page} */
      let page

      let $inputsWarm
      let $inputsCool
      let $inputsNotInForm

      beforeEach(async () => {
        page = await goToExample(browser, 'multiple-radio-groups')

        $inputsWarm = await page.$$('.govuk-radios__input[id^="warm"]')
        $inputsCool = await page.$$('.govuk-radios__input[id^="cool"]')
        $inputsNotInForm = await page.$$(
          '.govuk-radios__input[id^="question-not-in-form"]'
        )
      })

      it('toggles conditional reveals in other groups', async () => {
        const $conditionalWarm = await page.$(
          `[id="${await getAttribute($inputsWarm[0], 'aria-controls')}"]`
        )
        const $conditionalCool = await page.$(
          `[id="${await getAttribute($inputsCool[0], 'aria-controls')}"]`
        )

        // Select red in warm colours
        await $inputsWarm[0].click()

        expect(await isVisible($conditionalWarm)).toBe(true)
        expect(await isVisible($conditionalCool)).toBe(false)

        // Select blue in cool colours
        await $inputsCool[0].click()

        expect(await isVisible($conditionalWarm)).toBe(false)
        expect(await isVisible($conditionalCool)).toBe(true)
      })

      it('toggles conditional reveals when not in a form', async () => {
        const $conditionalWarm = await page.$(
          `[id="${await getAttribute($inputsWarm[0], 'aria-controls')}"]`
        )

        // Select first input in radios not in a form
        await $inputsNotInForm[0].click()

        expect(await isVisible($conditionalWarm)).toBe(false)
      })
    })
  })

  describe('with multiple groups and conditional reveals', () => {
    describe('when JavaScript is available', () => {
      /** @type {globalThis.page} */
      let page

      let $inputsPrimary
      let $inputsOther

      beforeEach(async () => {
        page = await goToExample(browser, 'conditional-reveals')

        $inputsPrimary = await page.$$(
          '.govuk-radios__input[id^="fave-primary"]'
        )
        $inputsOther = await page.$$('.govuk-radios__input[id^="fave-other"]')
      })

      it('hides conditional reveals in other groups', async () => {
        const $conditionalPrimary = await page.$(
          `[id="${await getAttribute($inputsPrimary[1], 'aria-controls')}"]`
        )

        // Choose the second radio in the first group, which reveals additional content
        await $inputsPrimary[1].click()

        // Assert that conditional content is revealed
        expect(await isVisible($conditionalPrimary)).toBe(true)

        // Choose a different radio with the same name, but in a different group
        await $inputsOther[1].click()

        // Expect conditional content to have been collapsed
        expect(await isVisible($conditionalPrimary)).toBe(false)
      })
    })
  })

  describe('errors at instantiation', () => {
    it('can throw a SupportError if appropriate', async () => {
      await expect(
        render(page, 'radios', examples.default, {
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
        render(page, 'radios', examples.default, {
          beforeInitialisation($module) {
            $module.remove()
          }
        })
      ).rejects.toMatchObject({
        cause: {
          name: 'ElementError',
          message: 'Radios: Root element (`$module`) not found'
        }
      })
    })

    it('throws when receiving the wrong type for $module', async () => {
      await expect(
        render(page, 'radios', examples.default, {
          beforeInitialisation($module) {
            // Replace with an `<svg>` element which is not an `HTMLElement` in the DOM (but an `SVGElement`)
            $module.outerHTML = `<svg data-module="govuk-radios"></svg>`
          }
        })
      ).rejects.toMatchObject({
        cause: {
          name: 'ElementError',
          message: 'Radios: Root element (`$module`) is not of type HTMLElement'
        }
      })
    })

    it('throws when the input list is empty', async () => {
      await expect(
        render(page, 'radios', examples.default, {
          beforeInitialisation($module, { selector }) {
            $module.querySelectorAll(selector).forEach((item) => item.remove())
          },
          context: {
            selector: '.govuk-radios__item'
          }
        })
      ).rejects.toMatchObject({
        cause: {
          name: 'ElementError',
          message: 'Radios: Form inputs (`<input type="radio">`) not found'
        }
      })
    })

    it('throws when a conditional target element is not found', async () => {
      await expect(
        render(page, 'radios', examples['with conditional items'], {
          beforeInitialisation($module) {
            $module.querySelector('.govuk-radios__conditional').remove()
          }
        })
      ).rejects.toMatchObject({
        cause: {
          name: 'ElementError',
          message:
            'Radios: Conditional reveal (`id="conditional-how-contacted"`) not found'
        }
      })
    })
  })
})
