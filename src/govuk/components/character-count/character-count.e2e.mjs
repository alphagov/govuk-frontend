import { getExamples } from '../../../../lib/jest-helpers.js'
import { goToComponent, renderAndInitialise } from '../../../../lib/webdriver-helpers.js'

const debouncedWaitTime = 1500

describe('Character count', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('character-count')
  })

  describe('when JavaScript is available', () => {
    describe('on page load', () => {
      beforeAll(async () => {
        await goToComponent(browser, 'character-count')
      })

      it('injects the visual counter', async () => {
        const message = await $('.govuk-character-count__status') !== null
        expect(message).toBeTruthy()
      })
    })

    describe('counting characters', () => {
      it('counts down to the character limit', async () => {
        await goToComponent(browser, 'character-count')

        // Using `aria/Can you provide more detail?` retrieves the label
        // rather than the field itself so we need to keep using the class
        await $('.govuk-js-character-count').setValue('A')

        const message = await $('.govuk-character-count__status').getProperty('innerHTML')
        expect(message.trim()).toEqual('You have 9 characters remaining')

        // Wait for debounced update to happen
        await new Promise((resolve) => setTimeout(resolve, debouncedWaitTime))

        const srMessage = await $('.govuk-character-count__sr-status').getProperty('innerHTML')
        expect(srMessage.trim()).toEqual('You have 9 characters remaining')
      })
    })

    describe('JavaScript configuration', () => {
      describe('at instantiation', () => {
        it('configures the number of characters', async () => {
          await renderAndInitialise(browser, 'character-count', {
            nunjucksParams: examples['to configure in JavaScript'],
            javascriptConfig: {
              maxlength: 10
            }
          })

          await $('.govuk-js-character-count').setValue('A'.repeat(11))

          const message = await $('.govuk-character-count__status').getProperty('innerHTML')
          expect(message.trim()).toEqual('You have 1 character too many')
        })
      })
    })
  })
})
