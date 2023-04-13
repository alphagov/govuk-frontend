const jestPuppeteerConfig = require('../../../../jest-puppeteer.config')
const { getExamples } = require('../../../../lib/file-helper')
const { goToComponent, renderAndInitialise } = require('../../../../lib/puppeteer-helpers')

// Detect when browser has been launched headless
const { headless = true } = jestPuppeteerConfig.launch

// The longest possible time from a keyboard user ending input and the screen
// reader counter being updated: handleFocus interval time + last input wait time
// but raised to the nearest whole second when browser is not headless as timers
// in background pages will be aligned, clamped or throttled
const debouncedWaitTime = headless ? 1500 : 2000

// When headless, keydown-to-keyup time appears to affect event throttling,
// affecting `lastInputTimestamp` and screen reader status message updates
const keyupWaitTime = headless ? 0 : 50

describe('Character count', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('character-count')
  })

  describe('when JavaScript is unavailable or fails', () => {
    beforeAll(async () => {
      await page.setJavaScriptEnabled(false)
    })

    afterAll(async () => {
      await page.setJavaScriptEnabled(true)
    })

    it('shows the textarea description', async () => {
      await goToComponent(page, 'character-count')
      const message = await page.$eval('.govuk-character-count__message', el => el.innerHTML.trim())

      expect(message).toEqual('You can enter up to 10 characters')
    })
  })

  describe('when JavaScript is available', () => {
    describe('on page load', () => {
      beforeAll(async () => {
        await goToComponent(page, 'character-count')
      })

      it('injects the visual counter', async () => {
        const message = await page.$('.govuk-character-count__status') !== null
        expect(message).toBeTruthy()
      })

      it('injects the screen reader counter', async () => {
        const srMessage = await page.$('.govuk-character-count__sr-status') !== null
        expect(srMessage).toBeTruthy()
      })

      it('hides the textarea description', async () => {
        const messageClasses = await page.$eval('.govuk-character-count__message', el => el.className)
        expect(messageClasses).toContain('govuk-visually-hidden')
      })
    })

    describe('when counting characters', () => {
      it('shows the dynamic message', async () => {
        await goToComponent(page, 'character-count')

        const message = await page.$eval('.govuk-character-count__status', el => el.innerHTML.trim())
        expect(message).toEqual('You have 10 characters remaining')

        const srMessage = await page.$eval('.govuk-character-count__sr-status', el => el.innerHTML.trim())
        expect(srMessage).toEqual('You have 10 characters remaining')
      })

      it('shows the characters remaining if the field is pre-filled', async () => {
        await goToComponent(page, 'character-count', {
          exampleName: 'with-default-value'
        })

        const message = await page.$eval('.govuk-character-count__status', el => el.innerHTML.trim())
        expect(message).toEqual('You have 67 characters remaining')

        const srMessage = await page.$eval('.govuk-character-count__sr-status', el => el.innerHTML.trim())
        expect(srMessage).toEqual('You have 67 characters remaining')
      })

      it('counts down to the character limit', async () => {
        await goToComponent(page, 'character-count')

        await page.type('.govuk-js-character-count', 'A', {
          delay: keyupWaitTime
        })

        const message = await page.$eval('.govuk-character-count__status', el => el.innerHTML.trim())
        expect(message).toEqual('You have 9 characters remaining')

        // Wait for debounced update to happen
        await new Promise((resolve) => setTimeout(resolve, debouncedWaitTime))

        const srMessage = await page.$eval('.govuk-character-count__sr-status', el => el.innerHTML.trim())
        expect(srMessage).toEqual('You have 9 characters remaining')
      })

      it('uses the singular when there is only one character remaining', async () => {
        await goToComponent(page, 'character-count')

        await page.type('.govuk-js-character-count', 'A'.repeat(9), {
          delay: keyupWaitTime
        })

        const message = await page.$eval('.govuk-character-count__status', el => el.innerHTML.trim())
        expect(message).toEqual('You have 1 character remaining')

        // Wait for debounced update to happen
        await new Promise((resolve) => setTimeout(resolve, debouncedWaitTime))

        const srMessage = await page.$eval('.govuk-character-count__sr-status', el => el.innerHTML.trim())
        expect(srMessage).toEqual('You have 1 character remaining')
      })

      describe('when the character limit is exceeded', () => {
        beforeAll(async () => {
          await goToComponent(page, 'character-count')

          await page.type('.govuk-js-character-count', 'A'.repeat(11), {
            delay: keyupWaitTime
          })
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
          await page.type('.govuk-js-character-count', 'A', {
            delay: keyupWaitTime
          })

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
          await goToComponent(page, 'character-count', {
            exampleName: 'with-default-value-exceeding-limit'
          })
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
          await goToComponent(page, 'character-count', {
            exampleName: 'with-threshold'
          })
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
          await page.type('.govuk-js-character-count', 'A'.repeat(8), {
            delay: keyupWaitTime
          })

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
        beforeAll(async () => {
          await goToComponent(page, 'character-count', {
            exampleName: 'with-id-starting-with-number'
          })
        })

        it('still works correctly', async () => {
          const message = await page.$eval('.govuk-character-count__status', el => el.innerHTML.trim())
          expect(message).toEqual('You have 10 characters remaining')

          const srMessage = await page.$eval('.govuk-character-count__sr-status', el => el.innerHTML.trim())
          expect(srMessage).toEqual('You have 10 characters remaining')
        })
      })

      describe('when the textarea ID contains CSS syntax characters', () => {
        beforeAll(async () => {
          await goToComponent(page, 'character-count', {
            exampleName: 'with-id-with-special-characters'
          })
        })

        it('still works correctly', async () => {
          const message = await page.$eval('.govuk-character-count__status', el => el.innerHTML.trim())
          expect(message).toEqual('You have 10 characters remaining')

          const srMessage = await page.$eval('.govuk-character-count__sr-status', el => el.innerHTML.trim())
          expect(srMessage).toEqual('You have 10 characters remaining')
        })
      })

      describe('when a maxlength attribute is specified on the textarea', () => {
        beforeAll(async () => {
          await goToComponent(page, 'character-count', {
            exampleName: 'with-textarea-maxlength-attribute'
          })
        })

        it('should not have a maxlength attribute once the JS has run', async () => {
          const textareaMaxLength = await page.$eval('.govuk-textarea', el => el.getAttribute('maxlength'))
          expect(textareaMaxLength).toBeNull()
        })
      })
    })

    describe('when counting words', () => {
      it('shows the dynamic message', async () => {
        await goToComponent(page, 'character-count', {
          exampleName: 'with-word-count'
        })

        const message = await page.$eval('.govuk-character-count__status', el => el.innerHTML.trim())
        expect(message).toEqual('You have 10 words remaining')

        const srMessage = await page.$eval('.govuk-character-count__sr-status', el => el.innerHTML.trim())
        expect(srMessage).toEqual('You have 10 words remaining')
      })

      it('counts down to the word limit', async () => {
        await goToComponent(page, 'character-count', {
          exampleName: 'with-word-count'
        })

        await page.type('.govuk-js-character-count', 'Hello world', {
          delay: keyupWaitTime
        })

        const message = await page.$eval('.govuk-character-count__status', el => el.innerHTML.trim())
        expect(message).toEqual('You have 8 words remaining')

        // Wait for debounced update to happen
        await new Promise((resolve) => setTimeout(resolve, debouncedWaitTime))

        const srMessage = await page.$eval('.govuk-character-count__sr-status', el => el.innerHTML.trim())
        expect(srMessage).toEqual('You have 8 words remaining')
      })

      it('uses the singular when there is only one word remaining', async () => {
        await goToComponent(page, 'character-count', {
          exampleName: 'with-word-count'
        })

        await page.type('.govuk-js-character-count', 'Hello '.repeat(9), {
          delay: keyupWaitTime
        })

        const message = await page.$eval('.govuk-character-count__status', el => el.innerHTML.trim())
        expect(message).toEqual('You have 1 word remaining')

        // Wait for debounced update to happen
        await new Promise((resolve) => setTimeout(resolve, debouncedWaitTime))

        const srMessage = await page.$eval('.govuk-character-count__sr-status', el => el.innerHTML.trim())
        expect(srMessage).toEqual('You have 1 word remaining')
      })

      describe('when the word limit is exceeded', () => {
        beforeAll(async () => {
          await goToComponent(page, 'character-count', {
            exampleName: 'with-word-count'
          })

          await page.type('.govuk-js-character-count', 'Hello '.repeat(11), {
            delay: keyupWaitTime
          })
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
          await page.type('.govuk-js-character-count', 'World', {
            delay: keyupWaitTime
          })

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

    describe('JavaScript configuration', () => {
      describe('at instantiation', () => {
        it('configures the number of characters', async () => {
          await renderAndInitialise(page, 'character-count', {
            params: examples['to configure in JavaScript'],
            config: {
              maxlength: 10
            }
          })

          await page.type('.govuk-js-character-count', 'A'.repeat(11), {
            delay: keyupWaitTime
          })

          const message = await page.$eval(
            '.govuk-character-count__status',
            (el) => el.innerHTML.trim()
          )
          expect(message).toEqual('You have 1 character too many')
        })

        it('configures the number of words', async () => {
          await renderAndInitialise(page, 'character-count', {
            params: examples['to configure in JavaScript'],
            config: {
              maxwords: 10
            }
          })

          await page.type('.govuk-js-character-count', 'Hello '.repeat(11), {
            delay: keyupWaitTime
          })

          const message = await page.$eval(
            '.govuk-character-count__status',
            (el) => el.innerHTML.trim()
          )
          expect(message).toEqual('You have 1 word too many')
        })

        it('configures the threshold', async () => {
          await renderAndInitialise(page, 'character-count', {
            params: examples['to configure in JavaScript'],
            config: {
              maxlength: 10,
              threshold: 75
            }
          })

          await page.type('.govuk-js-character-count', 'A'.repeat(8), {
            delay: keyupWaitTime
          })

          const visibility = await page.$eval('.govuk-character-count__status', el => window.getComputedStyle(el).visibility)
          expect(visibility).toEqual('visible')
        })

        it('configures the description of the textarea', async () => {
          // This tests that a description can be provided through JavaScript attributes
          // and interpolated with the limit provided to the character count in JS.

          await renderAndInitialise(page, 'character-count', {
            params:
              examples[
                'when neither maxlength/maxwords nor textarea description are set'
              ],
            config: {
              maxlength: 10,
              i18n: {
                textareaDescription: {
                  other: 'No more than %{count} characters'
                }
              }
            }
          })

          const message = await page.$eval(
            '.govuk-character-count__message',
            (el) => el.innerHTML.trim()
          )
          expect(message).toEqual('No more than 10 characters')
        })
      })

      describe('via `initAll`', () => {
        it('configures the number of characters', async () => {
          await renderAndInitialise(page, 'character-count', {
            params: examples['to configure in JavaScript'],
            config: {
              maxlength: 10
            }
          })

          await page.type('.govuk-js-character-count', 'A'.repeat(11), {
            delay: keyupWaitTime
          })

          const message = await page.$eval(
            '.govuk-character-count__status',
            (el) => el.innerHTML.trim()
          )
          expect(message).toEqual('You have 1 character too many')
        })

        it('configures the number of words', async () => {
          await renderAndInitialise(page, 'character-count', {
            params: examples['to configure in JavaScript'],
            config: {
              maxwords: 10
            }
          })

          await page.type('.govuk-js-character-count', 'Hello '.repeat(11), {
            delay: keyupWaitTime
          })

          const message = await page.$eval(
            '.govuk-character-count__status',
            (el) => el.innerHTML.trim()
          )
          expect(message).toEqual('You have 1 word too many')
        })

        it('configures the threshold', async () => {
          await renderAndInitialise(page, 'character-count', {
            params: examples['to configure in JavaScript'],
            config: {
              maxlength: 10,
              threshold: 75
            }
          })

          await page.type('.govuk-js-character-count', 'A'.repeat(8), {
            delay: keyupWaitTime
          })

          const visibility = await page.$eval(
            '.govuk-character-count__status',
            (el) => window.getComputedStyle(el).visibility
          )
          expect(visibility).toEqual('visible')
        })
      })

      describe('when data-attributes are present', () => {
        it('uses `maxlength` data attribute instead of the JS one', async () => {
          await renderAndInitialise(page, 'character-count', {
            params: examples.default,
            config: {
              maxlength: 12 // JS configuration that would tell 1 character remaining
            }
          })

          await page.type('.govuk-js-character-count', 'A'.repeat(11), {
            delay: keyupWaitTime
          })

          const message = await page.$eval(
            '.govuk-character-count__status',
            (el) => el.innerHTML.trim()
          )
          expect(message).toEqual('You have 1 character too many')
        })

        it("uses `maxlength` data attribute instead of JS's `maxwords`", async () => {
          await renderAndInitialise(page, 'character-count', {
            params: examples.default, // Default example counts characters
            config: {
              maxwords: 12
            }
          })

          await page.type('.govuk-js-character-count', 'A'.repeat(11), {
            delay: keyupWaitTime
          })

          const message = await page.$eval(
            '.govuk-character-count__status',
            (el) => el.innerHTML.trim()
          )
          expect(message).toEqual('You have 1 character too many')
        })

        it('uses `maxwords` data attribute instead of the JS one', async () => {
          await renderAndInitialise(page, 'character-count', {
            params: examples['with word count'],
            config: {
              maxwords: 12 // JS configuration that would tell 1 word remaining
            }
          })

          await page.type('.govuk-js-character-count', 'Hello '.repeat(11), {
            delay: keyupWaitTime
          })

          const message = await page.$eval(
            '.govuk-character-count__status',
            (el) => el.innerHTML.trim()
          )
          expect(message).toEqual('You have 1 word too many')
        })

        it("uses `maxwords` data attribute instead of the JS's `maxlength`", async () => {
          await renderAndInitialise(page, 'character-count', {
            params: examples['with word count'],
            config: {
              maxlength: 10
            }
          })

          await page.type('.govuk-js-character-count', 'Hello '.repeat(11), {
            delay: keyupWaitTime
          })

          const message = await page.$eval(
            '.govuk-character-count__status',
            (el) => el.innerHTML.trim()
          )
          expect(message).toEqual('You have 1 word too many')
        })

        it('interpolates the textarea description in data attributes with the maximum set in JavaScript', async () => {
          // This tests that any textarea description provided through data-attributes
          // (or the Nunjucks macro), waiting for a maximum to be provided in
          // JavaScript config, will lead to the message being injected in the
          // element holding the textarea's accessible description
          // (and interpolated to replace `%{count}` with the maximum)

          await renderAndInitialise(page, 'character-count', {
            params:
              examples['when neither maxlength nor maxwords are set'],
            config: {
              maxlength: 10
            }
          })

          const message = await page.$eval(
            '.govuk-character-count__message',
            (el) => el.innerHTML.trim()
          )
          expect(message).toEqual('No more than 10 characters')
        })
      })
    })

    describe('Cross Side Scripting prevention', () => {
      it('injects the localised strings as text not HTML', async () => {
        await renderAndInitialise(page, 'character-count', {
          params: examples['to configure in JavaScript'],
          config: {
            maxlength: 10,
            i18n: {
              charactersUnderLimit: {
                other: '<strong>%{count}</strong> characters left'
              }
            }
          }
        })

        const message = await page.$eval(
          '.govuk-character-count__status',
          (el) => el.innerHTML.trim()
        )
        expect(message).toEqual(
          '&lt;strong&gt;10&lt;/strong&gt; characters left'
        )
      })
    })
  })

  describe('in mismatched locale', () => {
    it('does not error', async () => {
      // Create a listener for the page error event that we can assert on later
      const pageErrorListener = jest.fn()
      page.on('pageerror', pageErrorListener)

      await renderAndInitialise(page, 'character-count', {
        params: examples.default,
        config: {
          // Override maxlength to 10
          maxlength: 10
        },
        initialiser ({ config, namespace }) {
          const $component = document.querySelector('[data-module]')

          // Set locale to Welsh, which expects translations for 'one', 'two',
          // 'few' 'many' and 'other' forms – with the default English strings
          // provided we only have translations for 'one' and 'other'.
          //
          // We want to make sure we handle this gracefully in case users have
          // an existing character count inside an incorrect locale.
          $component.setAttribute('lang', 'cy')
          new namespace.CharacterCount($component, config).init()
        }
      })

      // Type 10 characters so we go 'through' all the different forms as we
      // approach 0 characters remaining.
      await page.type('.govuk-js-character-count', 'A'.repeat(10), {
        delay: keyupWaitTime
      })

      // Expect the page error event not to have been fired
      expect(pageErrorListener).not.toHaveBeenCalled()
    })
  })
})
