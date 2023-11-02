const {
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
