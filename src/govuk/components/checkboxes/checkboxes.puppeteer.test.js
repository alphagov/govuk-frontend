const {
  goToExample,
  getAttribute,
  getProperty,
  isVisible,
  render
} = require('@govuk-frontend/helpers/puppeteer')
const { getExamples } = require('@govuk-frontend/lib/components')

describe('Checkboxes with conditional reveals', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('checkboxes')
  })

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
        await render(page, 'checkboxes', examples['with conditional items'])

        $component = await page.$('.govuk-checkboxes')
        $inputs = await $component.$$('.govuk-checkboxes__input')
        $conditionals = await $component.$$('.govuk-checkboxes__conditional')

        expect($inputs.length).toBe(3)
        expect($conditionals.length).toBe(3)
      })

      it('has no ARIA attributes applied', async () => {
        const $inputsWithAriaExpanded = await $component.$$(
          '.govuk-checkboxes__input[aria-expanded]'
        )
        const $inputsWithAriaControls = await $component.$$(
          '.govuk-checkboxes__input[aria-controls]'
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

      beforeAll(async () => {
        await render(
          page,
          'checkboxes',
          examples['with conditional item checked']
        )

        $component = await page.$('.govuk-checkboxes')
        $inputs = await $component.$$('.govuk-checkboxes__input')
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
        await render(page, 'checkboxes', examples['with conditional items'])

        $component = await page.$('.govuk-checkboxes')
        $inputs = await $component.$$('.govuk-checkboxes__input')
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

        // Toggle collapsed
        await $input.click()

        expect(await getProperty($input, 'checked')).toBe(false)
        expect(await getAttribute($input, 'aria-expanded')).toBe('false')
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

        // Toggle collapsed
        await $input.click()

        expect(await getProperty($input, 'checked')).toBe(false)
        expect(await isVisible($conditional)).toBe(false)
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

        // Toggle collapsed
        await page.keyboard.press('Space')

        expect(await getProperty($input, 'checked')).toBe(false)
        expect(await isVisible($conditional)).toBe(false)
      })
    })

    describe('with conditional items with special characters', () => {
      it('does not error when ID of revealed content contains special characters', async () => {
        // Errors logged to the console will cause this test to fail
        await render(
          page,
          'checkboxes',
          examples['with conditional items with special characters']
        )
      })
    })
  })
})

describe('Checkboxes with a "None" checkbox', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('checkboxes')
  })

  describe('when JavaScript is available', () => {
    let $component
    let $inputs

    beforeEach(async () => {
      await render(page, 'checkboxes', examples['with divider and None'])

      $component = await page.$('.govuk-checkboxes')
      $inputs = await $component.$$('.govuk-checkboxes__input')
    })

    it('unchecks other checkboxes when the "None" checkbox is checked', async () => {
      // Check the first 3 checkboxes
      await $inputs[0].click()
      await $inputs[1].click()
      await $inputs[2].click()

      // Check the "None" checkbox
      await $inputs[3].click()

      // Expect first 3 checkboxes to have been unchecked
      expect(await getProperty($inputs[0], 'checked')).toBe(false)
      expect(await getProperty($inputs[1], 'checked')).toBe(false)
      expect(await getProperty($inputs[2], 'checked')).toBe(false)
    })

    it('unchecks the "None" checkbox when any other checkbox is checked', async () => {
      // Check the "None" checkbox
      await $inputs[3].click()

      // Check the first checkbox
      await $inputs[0].click()

      // Expect the "None" checkbox to have been unchecked
      expect(await getProperty($inputs[3], 'checked')).toBe(false)
    })
  })
})

describe('Checkboxes with a "None" checkbox and conditional reveals', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('checkboxes')
  })

  describe('when JavaScript is available', () => {
    let $component
    let $inputs

    beforeEach(async () => {
      await render(
        page,
        'checkboxes',
        examples['with divider, None and conditional items']
      )

      $component = await page.$('.govuk-checkboxes')
      $inputs = await $component.$$('.govuk-checkboxes__input')
    })

    it('unchecks other checkboxes and hides conditional reveals when the "None" checkbox is checked', async () => {
      const $input = $inputs[3]
      const $conditional = await $component.$(
        `[id="${await getAttribute($input, 'aria-controls')}"]`
      )

      // Check the "Another access need" checkbox
      await $inputs[3].click()

      // Expect conditional content to have been revealed
      expect(await isVisible($conditional)).toBe(true)

      // Check the "None" checkbox
      await $inputs[4].click()

      // Expect the "Another access need" checkbox to have been unchecked
      expect(await getProperty($inputs[3], 'checked')).toBe(false)

      // Expect conditional content to have been collapsed
      expect(await isVisible($conditional)).toBe(false)
    })
  })
})

describe('Checkboxes with multiple groups and a "None" checkbox and conditional reveals', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('checkboxes')
  })

  describe('when JavaScript is available', () => {
    /** @type {globalThis.page} */
    let page

    let $inputsPrimary
    let $inputsSecondary
    let $inputsOther

    beforeEach(async () => {
      page = await goToExample(browser, 'conditional-reveals')

      $inputsPrimary = await page.$$(
        '.govuk-checkboxes__input[id^="colour-primary"]'
      )
      $inputsSecondary = await page.$$(
        '.govuk-checkboxes__input[id^="colour-secondary"]'
      )
      $inputsOther = await page.$$(
        '.govuk-checkboxes__input[id^="colour-other"]'
      )
    })

    it('none checkbox unchecks other checkboxes in other groups', async () => {
      // Check some checkboxes in the first and second groups
      await $inputsPrimary[2].click()
      await $inputsSecondary[1].click()

      // Check the "None" checkbox in the third group
      await $inputsOther[1].click()

      // Expect the checkboxes in the first and second groups to be unchecked
      expect(await getProperty($inputsPrimary[2], 'checked')).toBe(false)
      expect(await getProperty($inputsSecondary[1], 'checked')).toBe(false)
    })

    it('hides conditional reveals in other groups', async () => {
      const $conditionalPrimary = await page.$(
        `[id="${await getAttribute($inputsPrimary[1], 'aria-controls')}"]`
      )

      // Check the second checkbox in the first group, which reveals additional content
      await $inputsPrimary[1].click()

      // Assert that conditional content is revealed
      expect(await isVisible($conditionalPrimary)).toBe(true)

      // Check the "None" checkbox in the third group
      await $inputsOther[1].click()

      // Assert that the second checkbox in the first group is unchecked
      expect(await getProperty($inputsPrimary[1], 'checked')).toBe(false)

      // Expect conditional content to have been collapsed
      expect(await isVisible($conditionalPrimary)).toBe(false)
    })

    describe('errors at instantiation', () => {
      it('can throw a SupportError if appropriate', async () => {
        await expect(
          render(page, 'checkboxes', examples.default, {
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
          render(page, 'checkboxes', examples.default, {
            beforeInitialisation($module) {
              $module.remove()
            }
          })
        ).rejects.toMatchObject({
          cause: {
            name: 'ElementError',
            message: 'Checkboxes: Root element (`$module`) not found'
          }
        })
      })

      it('throws when receiving the wrong type for $module', async () => {
        await expect(
          render(page, 'checkboxes', examples.default, {
            beforeInitialisation($module) {
              // Replace with an `<svg>` element which is not an `HTMLElement` in the DOM (but an `SVGElement`)
              $module.outerHTML = `<svg data-module="govuk-checkboxes"></svg>`
            }
          })
        ).rejects.toMatchObject({
          cause: {
            name: 'ElementError',
            message:
              'Checkboxes: Root element (`$module`) is not of type HTMLElement'
          }
        })
      })

      it('throws when the input list is empty', async () => {
        await expect(
          render(page, 'checkboxes', examples.default, {
            beforeInitialisation($module, { selector }) {
              $module
                .querySelectorAll(selector)
                .forEach((item) => item.remove())
            },
            context: {
              selector: '.govuk-checkboxes__item'
            }
          })
        ).rejects.toMatchObject({
          cause: {
            name: 'ElementError',
            message:
              'Checkboxes: Form inputs (`<input type="checkbox">`) not found'
          }
        })
      })

      it('throws when a conditional target element is not found', async () => {
        await expect(
          render(page, 'checkboxes', examples['with conditional items'], {
            beforeInitialisation($module, { selector }) {
              $module.querySelector(selector).remove()
            },
            context: {
              selector: '.govuk-checkboxes__conditional'
            }
          })
        ).rejects.toMatchObject({
          cause: {
            name: 'ElementError',
            message:
              'Checkboxes: Conditional reveal (`id="conditional-how-contacted"`) not found'
          }
        })
      })
    })
  })
})
