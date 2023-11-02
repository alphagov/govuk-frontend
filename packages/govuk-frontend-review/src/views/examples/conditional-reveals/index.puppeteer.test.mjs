import {
  getAttribute,
  getProperty,
  goToExample,
  isVisible
} from '@govuk-frontend/helpers/puppeteer'

describe('Example: Conditional reveals', () => {
  describe('with multiple groups and conditional reveals', () => {
    /** @type {globalThis.page} */
    let page

    beforeEach(async () => {
      page = await goToExample(browser, 'conditional-reveals')
    })

    describe('Radios', () => {
      let $inputsPrimary
      let $inputsOther

      beforeEach(async () => {
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

    describe('Checkboxes', () => {
      let $inputsPrimary
      let $inputsSecondary
      let $inputsOther

      beforeEach(async () => {
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
    })
  })
})
