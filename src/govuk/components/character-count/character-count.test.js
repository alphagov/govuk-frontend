/* eslint-env jest */

const configPaths = require('../../../../config/paths.json')
const PORT = configPaths.ports.test
const baseUrl = `http://localhost:${PORT}`

// The longest possible time from a keyboard user ending input and the screen
// reader counter being updated: handleFocus interval time + last input wait time
const debouncedWaitTime = 1500

const goToExample = (exampleName = false) => {
  const url = exampleName
    ? `${baseUrl}/components/character-count/${exampleName}/preview`
    : `${baseUrl}/components/character-count/preview`

  return page.goto(url, { waitUntil: 'load' })
}

describe('Character count', () => {
  describe('when JavaScript is unavailable or fails', () => {
    beforeAll(async () => {
      await page.setJavaScriptEnabled(false)
    })

    afterAll(async () => {
      await page.setJavaScriptEnabled(true)
    })

    it('shows the static message', async () => {
      await goToExample()
      const message = await page.$eval('.govuk-character-count__message', el => el.innerHTML.trim())

      expect(message).toEqual('You can enter up to 10 characters')
    })
  })

  describe('when JavaScript is available', () => {
    describe('on page load', () => {
      beforeAll(async () => {
        await goToExample()
      })

      it('injects the visual counter', async () => {
        const message = await page.$('.govuk-character-count__status') !== null
        expect(message).toBeTruthy()
      })

      it('injects the screen reader counter', async () => {
        const srMessage = await page.$('.govuk-character-count__sr-status') !== null
        expect(srMessage).toBeTruthy()
      })

      it('hides the fallback hint', async () => {
        const messageClasses = await page.$eval('.govuk-character-count__message', el => el.className)
        expect(messageClasses).toContain('govuk-visually-hidden')
      })
    })

    describe('when counting characters', () => {
      it('shows the dynamic message', async () => {
        await goToExample()

        const message = await page.$eval('.govuk-character-count__status', el => el.innerHTML.trim())
        expect(message).toEqual('You have 10 characters remaining')

        const srMessage = await page.$eval('.govuk-character-count__sr-status', el => el.innerHTML.trim())
        expect(srMessage).toEqual('You have 10 characters remaining')
      })

      it('shows the characters remaining if the field is pre-filled', async () => {
        await goToExample('with-default-value')

        const message = await page.$eval('.govuk-character-count__status', el => el.innerHTML.trim())
        expect(message).toEqual('You have 67 characters remaining')

        const srMessage = await page.$eval('.govuk-character-count__sr-status', el => el.innerHTML.trim())
        expect(srMessage).toEqual('You have 67 characters remaining')
      })

      it('counts down to the character limit', async () => {
        await goToExample()
        await page.type('.govuk-js-character-count', 'A')

        const message = await page.$eval('.govuk-character-count__status', el => el.innerHTML.trim())
        expect(message).toEqual('You have 9 characters remaining')

        // Wait for debounced update to happen
        await new Promise((resolve) => setTimeout(resolve, debouncedWaitTime))

        const srMessage = await page.$eval('.govuk-character-count__sr-status', el => el.innerHTML.trim())
        expect(srMessage).toEqual('You have 9 characters remaining')
      })

      it('uses the singular when there is only one character remaining', async () => {
        await goToExample()
        await page.type('.govuk-js-character-count', 'A'.repeat(9))

        const message = await page.$eval('.govuk-character-count__status', el => el.innerHTML.trim())
        expect(message).toEqual('You have 1 character remaining')

        // Wait for debounced update to happen
        await new Promise((resolve) => setTimeout(resolve, debouncedWaitTime))

        const srMessage = await page.$eval('.govuk-character-count__sr-status', el => el.innerHTML.trim())
        expect(srMessage).toEqual('You have 1 character remaining')
      })

      describe('when the character limit is exceeded', () => {
        beforeAll(async () => {
          await goToExample()
          await page.type('.govuk-js-character-count', 'A'.repeat(11))
        })

        it('shows the number of characters over the limit', async () => {
          const message = await page.$eval('.govuk-character-count__status', el => el.innerHTML.trim())
          expect(message).toEqual('You have 1 character too many')

          // Wait for debounced update to happen
          await new Promise((resolve) => setTimeout(resolve, debouncedWaitTime))

          const srMessage = await page.$eval('.govuk-character-count__sr-status', el => el.innerHTML.trim())
          expect(srMessage).toEqual('You have 1 character too many')
        })

        it('uses the plural when the limit is exceeded by 2 or more', async () => {
          await page.type('.govuk-js-character-count', 'A')

          const message = await page.$eval('.govuk-character-count__status', el => el.innerHTML.trim())
          expect(message).toEqual('You have 2 characters too many')

          // Wait for debounced update to happen
          await new Promise((resolve) => setTimeout(resolve, debouncedWaitTime))

          const srMessage = await page.$eval('.govuk-character-count__sr-status', el => el.innerHTML.trim())
          expect(srMessage).toEqual('You have 2 characters too many')
        })

        it('adds error styles to the textarea', async () => {
          const textareaClasses = await page.$eval('.govuk-js-character-count', el => el.className)
          expect(textareaClasses).toContain('govuk-textarea--error')
        })

        it('adds error styles to the count message', async () => {
          const messageClasses = await page.$eval('.govuk-character-count__status', el => el.className)
          expect(messageClasses).toContain('govuk-error-message')
        })
      })

      describe('when the character limit is exceeded on page load', () => {
        beforeAll(async () => {
          await goToExample('with-default-value-exceeding-limit')
        })

        it('shows the number of characters over the limit', async () => {
          const message = await page.$eval('.govuk-character-count__status', el => el.innerHTML.trim())
          expect(message).toEqual('You have 23 characters too many')

          const srMessage = await page.$eval('.govuk-character-count__sr-status', el => el.innerHTML.trim())
          expect(srMessage).toEqual('You have 23 characters too many')
        })

        it('adds error styles to the textarea', async () => {
          const textareaClasses = await page.$eval('.govuk-js-character-count', el => el.className)
          expect(textareaClasses).toContain('govuk-textarea--error')
        })

        it('adds error styles to the count message', async () => {
          const messageClasses = await page.$eval('.govuk-character-count__status', el => el.className)
          expect(messageClasses).toContain('govuk-error-message')
        })
      })

      describe('when a threshold is set', () => {
        beforeAll(async () => {
          await goToExample('with-threshold')
        })

        it('does not show the limit until the threshold is reached', async () => {
          const visibility = await page.$eval('.govuk-character-count__status', el => window.getComputedStyle(el).visibility)
          expect(visibility).toEqual('hidden')

          // Wait for debounced update to happen
          await new Promise((resolve) => setTimeout(resolve, debouncedWaitTime))

          // Ensure threshold is hidden for users of assistive technologies
          const ariaHidden = await page.$eval('.govuk-character-count__sr-status', el => el.getAttribute('aria-hidden'))
          expect(ariaHidden).toEqual('true')
        })

        it('becomes visible once the threshold is reached', async () => {
          await page.type('.govuk-js-character-count', 'A'.repeat(8))

          const visibility = await page.$eval('.govuk-character-count__status', el => window.getComputedStyle(el).visibility)
          expect(visibility).toEqual('visible')

          // Wait for debounced update to happen
          await new Promise((resolve) => setTimeout(resolve, debouncedWaitTime))

          // Ensure threshold is visible for users of assistive technologies
          const ariaHidden = await page.$eval('.govuk-character-count__sr-status', el => el.getAttribute('aria-hidden'))
          expect(ariaHidden).toBeFalsy()
        })
      })

      // Errors logged to the console will cause these tests to fail
      describe('when the textarea ID starts with a number', () => {
        it('still works correctly', async () => {
          await goToExample('with-id-starting-with-number')

          const message = await page.$eval('.govuk-character-count__status', el => el.innerHTML.trim())
          expect(message).toEqual('You have 10 characters remaining')

          const srMessage = await page.$eval('.govuk-character-count__sr-status', el => el.innerHTML.trim())
          expect(srMessage).toEqual('You have 10 characters remaining')
        })
      })

      describe('when the textarea ID contains CSS syntax characters', () => {
        it('still works correctly', async () => {
          await goToExample('with-id-with-special-characters')

          const message = await page.$eval('.govuk-character-count__status', el => el.innerHTML.trim())
          expect(message).toEqual('You have 10 characters remaining')

          const srMessage = await page.$eval('.govuk-character-count__sr-status', el => el.innerHTML.trim())
          expect(srMessage).toEqual('You have 10 characters remaining')
        })
      })

      describe('when a maxlength attribute is specified on the textarea', () => {
        beforeAll(async () => {
          await goToExample('with-textarea-maxlength-attribute')
        })

        it('should not have a maxlength attribute once the JS has run', async () => {
          const textareaMaxLength = await page.$eval('.govuk-textarea', el => el.getAttribute('maxlength'))
          expect(textareaMaxLength).toBeNull()
        })
      })
    })

    describe('when counting words', () => {
      it('shows the dynamic message', async () => {
        await goToExample('with-word-count')

        const message = await page.$eval('.govuk-character-count__status', el => el.innerHTML.trim())
        expect(message).toEqual('You have 10 words remaining')

        const srMessage = await page.$eval('.govuk-character-count__sr-status', el => el.innerHTML.trim())
        expect(srMessage).toEqual('You have 10 words remaining')
      })

      it('counts down to the word limit', async () => {
        await goToExample('with-word-count')
        await page.type('.govuk-js-character-count', 'Hello world')

        const message = await page.$eval('.govuk-character-count__status', el => el.innerHTML.trim())
        expect(message).toEqual('You have 8 words remaining')

        // Wait for debounced update to happen
        await new Promise((resolve) => setTimeout(resolve, debouncedWaitTime))

        const srMessage = await page.$eval('.govuk-character-count__sr-status', el => el.innerHTML.trim())
        expect(srMessage).toEqual('You have 8 words remaining')
      })

      it('uses the singular when there is only one word remaining', async () => {
        await goToExample('with-word-count')
        await page.type('.govuk-js-character-count', 'Hello '.repeat(9))

        const message = await page.$eval('.govuk-character-count__status', el => el.innerHTML.trim())
        expect(message).toEqual('You have 1 word remaining')

        // Wait for debounced update to happen
        await new Promise((resolve) => setTimeout(resolve, debouncedWaitTime))

        const srMessage = await page.$eval('.govuk-character-count__sr-status', el => el.innerHTML.trim())
        expect(srMessage).toEqual('You have 1 word remaining')
      })

      describe('when the word limit is exceeded', () => {
        beforeAll(async () => {
          await goToExample('with-word-count')
          await page.type('.govuk-js-character-count', 'Hello '.repeat(11))
        })

        it('shows the number of words over the limit', async () => {
          const message = await page.$eval('.govuk-character-count__status', el => el.innerHTML.trim())
          expect(message).toEqual('You have 1 word too many')

          // Wait for debounced update to happen
          await new Promise((resolve) => setTimeout(resolve, debouncedWaitTime))

          const srMessage = await page.$eval('.govuk-character-count__sr-status', el => el.innerHTML.trim())
          expect(srMessage).toEqual('You have 1 word too many')
        })

        it('uses the plural when the limit is exceeded by 2 or more', async () => {
          await page.type('.govuk-js-character-count', 'World')

          const message = await page.$eval('.govuk-character-count__status', el => el.innerHTML.trim())
          expect(message).toEqual('You have 2 words too many')

          // Wait for debounced update to happen
          await new Promise((resolve) => setTimeout(resolve, debouncedWaitTime))

          const srMessage = await page.$eval('.govuk-character-count__sr-status', el => el.innerHTML.trim())
          expect(srMessage).toEqual('You have 2 words too many')
        })

        it('adds error styles to the textarea', async () => {
          const textareaClasses = await page.$eval('.govuk-js-character-count', el => el.className)
          expect(textareaClasses).toContain('govuk-textarea--error')
        })

        it('adds error styles to the count message', async () => {
          const messageClasses = await page.$eval('.govuk-character-count__status', el => el.className)
          expect(messageClasses).toContain('govuk-error-message')
        })
      })
    })
  })
})
