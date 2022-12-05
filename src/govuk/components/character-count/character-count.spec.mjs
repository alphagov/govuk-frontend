// @ts-check
import { test, expect } from '@playwright/test'

import { getExamples } from '../../../../lib/jest-helpers.js'
import { goToComponent, renderAndInitialise } from '../../../../lib/playwright-helpers.js'

const debouncedWaitTime = 2000

test.describe('Character Count', () => {
  let examples

  test.beforeAll(async () => {
    examples = await getExamples('character-count')
  })

  test.describe('when JavaScript is unavailable or fails', () => {
    test.use({ javaScriptEnabled: false })

    test('shows the textarea description', async ({ page }) => {
      await goToComponent(page, 'character-count')

      await expect(page.locator('.govuk-character-count__message')).toHaveText('You can enter up to 10 characters')
    })
  })

  test.describe('when JavaScript is available', () => {
    test.describe('on page load', () => {
      test.beforeEach(async ({ page }) => {
        await goToComponent(page, 'character-count')
      })

      test('injects the visual counter', async ({ page }) => {
        const visualCounter = page.locator('.govuk-character-count__status')

        await expect(visualCounter).toHaveText('You have 10 characters remaining')
        await expect(visualCounter).toBeVisible()
      })

      test('injects the screen reader counter', async ({ page }) => {
        await expect(page.locator('.govuk-character-count__sr-status')).toHaveClass(/govuk-visually-hidden/)
      })

      test('hides the textarea description', async ({ page }) => {
        // The `.govuk-character-count__message` is used twice
        // so we need to disambiguate and specify we want the one not displaying the count as people type
        await expect(page.locator('.govuk-character-count__message:not(.govuk-character-count__status)'))
          .toHaveClass(/govuk-visually-hidden/)
      })
    })

    test.describe('when counting characters', () => {
      test('shows the dynamic message', async ({ page }) => {
        await goToComponent(page, 'character-count')

        const message = await page.$eval('.govuk-character-count__status', el => el.innerHTML.trim())
        expect(message).toEqual('You have 10 characters remaining')

        const srMessage = await page.$eval('.govuk-character-count__sr-status', el => el.innerHTML.trim())
        expect(srMessage).toEqual('You have 10 characters remaining')
      })

      test('shows the characters remaining if the field is pre-filled', async ({ page }) => {
        await goToComponent(page, 'character-count', {
          exampleName: 'with-default-value'
        })

        const message = await page.$eval('.govuk-character-count__status', el => el.innerHTML.trim())
        expect(message).toEqual('You have 67 characters remaining')

        const srMessage = await page.$eval('.govuk-character-count__sr-status', el => el.innerHTML.trim())
        expect(srMessage).toEqual('You have 67 characters remaining')
      })

      test('counts down to the character limit', async ({ page }) => {
        await goToComponent(page, 'character-count')

        await page.type('.govuk-js-character-count', 'A')

        const message = await page.$eval('.govuk-character-count__status', el => el.innerHTML.trim())
        expect(message).toEqual('You have 9 characters remaining')

        // Wait for debounced update to happen
        await new Promise((resolve) => setTimeout(resolve, debouncedWaitTime))

        const srMessage = await page.$eval('.govuk-character-count__sr-status', el => el.innerHTML.trim())
        expect(srMessage).toEqual('You have 9 characters remaining')
      })

      test('uses the singular when there is only one character remaining', async ({ page }) => {
        await goToComponent(page, 'character-count')

        await page.type('.govuk-js-character-count', 'A'.repeat(9))

        const message = await page.$eval('.govuk-character-count__status', el => el.innerHTML.trim())
        expect(message).toEqual('You have 1 character remaining')

        // Wait for debounced update to happen
        await new Promise((resolve) => setTimeout(resolve, debouncedWaitTime))

        const srMessage = await page.$eval('.govuk-character-count__sr-status', el => el.innerHTML.trim())
        expect(srMessage).toEqual('You have 1 character remaining')
      })

      test.describe('when the character limit is exceeded', () => {
        test.beforeEach(async ({ page }) => {
          await goToComponent(page, 'character-count')

          await page.type('.govuk-js-character-count', 'A'.repeat(11))
        })

        test('shows the number of characters over the limit', async ({ page }) => {
          const message = await page.$eval('.govuk-character-count__status', el => el.innerHTML.trim())
          expect(message).toEqual('You have 1 character too many')

          // Wait for debounced update to happen
          await new Promise((resolve) => setTimeout(resolve, debouncedWaitTime))

          const srMessage = await page.$eval('.govuk-character-count__sr-status', el => el.innerHTML.trim())
          expect(srMessage).toEqual('You have 1 character too many')
        })

        test('uses the plural when the limit is exceeded by 2 or more', async ({ page }) => {
          await page.type('.govuk-js-character-count', 'A')

          const message = await page.$eval('.govuk-character-count__status', el => el.innerHTML.trim())
          expect(message).toEqual('You have 2 characters too many')

          // Wait for debounced update to happen
          await new Promise((resolve) => setTimeout(resolve, debouncedWaitTime))

          const srMessage = await page.$eval('.govuk-character-count__sr-status', el => el.innerHTML.trim())
          expect(srMessage).toEqual('You have 2 characters too many')
        })

        test('adds error styles to the textarea', async ({ page }) => {
          const textareaClasses = await page.$eval('.govuk-js-character-count', el => el.className)
          expect(textareaClasses).toContain('govuk-textarea--error')
        })

        test('adds error styles to the count message', async ({ page }) => {
          const messageClasses = await page.$eval('.govuk-character-count__status', el => el.className)
          expect(messageClasses).toContain('govuk-error-message')
        })
      })

      test.describe('when the character limit is exceeded on page load', () => {
        test.beforeEach(async ({ page }) => {
          await goToComponent(page, 'character-count', {
            exampleName: 'with-default-value-exceeding-limit'
          })
        })

        test('shows the number of characters over the limit', async ({ page }) => {
          const message = await page.$eval('.govuk-character-count__status', el => el.innerHTML.trim())
          expect(message).toEqual('You have 23 characters too many')

          const srMessage = await page.$eval('.govuk-character-count__sr-status', el => el.innerHTML.trim())
          expect(srMessage).toEqual('You have 23 characters too many')
        })

        test('adds error styles to the textarea', async ({ page }) => {
          const textareaClasses = await page.$eval('.govuk-js-character-count', el => el.className)
          expect(textareaClasses).toContain('govuk-textarea--error')
        })

        test('adds error styles to the count message', async ({ page }) => {
          const messageClasses = await page.$eval('.govuk-character-count__status', el => el.className)
          expect(messageClasses).toContain('govuk-error-message')
        })
      })

      test.describe('when a threshold is set', () => {
        test.beforeEach(async ({ page }) => {
          await goToComponent(page, 'character-count', {
            exampleName: 'with-threshold'
          })
        })

        test('does not show the limit until the threshold is reached', async ({ page }) => {
          const visibility = await page.$eval('.govuk-character-count__status', el => window.getComputedStyle(el).visibility)
          expect(visibility).toEqual('hidden')

          // Wait for debounced update to happen
          await new Promise((resolve) => setTimeout(resolve, debouncedWaitTime))

          // Ensure threshold is hidden for users of assistive technologies
          const ariaHidden = await page.$eval('.govuk-character-count__sr-status', el => el.getAttribute('aria-hidden'))
          expect(ariaHidden).toEqual('true')
        })

        test('becomes visible once the threshold is reached', async ({ page }) => {
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
      test.describe('when the textarea ID starts with a number', () => {
        test.beforeEach(async ({ page }) => {
          await goToComponent(page, 'character-count', {
            exampleName: 'with-id-starting-with-number'
          })
        })

        test('still works correctly', async ({ page }) => {
          const message = await page.$eval('.govuk-character-count__status', el => el.innerHTML.trim())
          expect(message).toEqual('You have 10 characters remaining')

          const srMessage = await page.$eval('.govuk-character-count__sr-status', el => el.innerHTML.trim())
          expect(srMessage).toEqual('You have 10 characters remaining')
        })
      })

      test.describe('when the textarea ID contains CSS syntax characters', () => {
        test.beforeEach(async ({ page }) => {
          await goToComponent(page, 'character-count', {
            exampleName: 'with-id-with-special-characters'
          })
        })

        test('still works correctly', async ({ page }) => {
          const message = await page.$eval('.govuk-character-count__status', el => el.innerHTML.trim())
          expect(message).toEqual('You have 10 characters remaining')

          const srMessage = await page.$eval('.govuk-character-count__sr-status', el => el.innerHTML.trim())
          expect(srMessage).toEqual('You have 10 characters remaining')
        })
      })

      test.describe('when a maxlength attribute is specified on the textarea', () => {
        test.beforeEach(async ({ page }) => {
          await goToComponent(page, 'character-count', {
            exampleName: 'with-textarea-maxlength-attribute'
          })
        })

        test('should not have a maxlength attribute once the JS has run', async ({ page }) => {
          const textareaMaxLength = await page.$eval('.govuk-textarea', el => el.getAttribute('maxlength'))
          expect(textareaMaxLength).toBeNull()
        })
      })
    })

    test.describe('when counting words', () => {
      test('shows the dynamic message', async ({ page }) => {
        await goToComponent(page, 'character-count', {
          exampleName: 'with-word-count'
        })

        const message = await page.$eval('.govuk-character-count__status', el => el.innerHTML.trim())
        expect(message).toEqual('You have 10 words remaining')

        const srMessage = await page.$eval('.govuk-character-count__sr-status', el => el.innerHTML.trim())
        expect(srMessage).toEqual('You have 10 words remaining')
      })

      test('counts down to the word limit', async ({ page }) => {
        await goToComponent(page, 'character-count', {
          exampleName: 'with-word-count'
        })

        await page.type('.govuk-js-character-count', 'Hello world')

        const message = await page.$eval('.govuk-character-count__status', el => el.innerHTML.trim())
        expect(message).toEqual('You have 8 words remaining')

        // Wait for debounced update to happen
        await new Promise((resolve) => setTimeout(resolve, debouncedWaitTime))

        const srMessage = await page.$eval('.govuk-character-count__sr-status', el => el.innerHTML.trim())
        expect(srMessage).toEqual('You have 8 words remaining')
      })

      test('uses the singular when there is only one word remaining', async ({ page }) => {
        await goToComponent(page, 'character-count', {
          exampleName: 'with-word-count'
        })

        await page.type('.govuk-js-character-count', 'Hello '.repeat(9))

        const message = await page.$eval('.govuk-character-count__status', el => el.innerHTML.trim())
        expect(message).toEqual('You have 1 word remaining')

        // Wait for debounced update to happen
        await new Promise((resolve) => setTimeout(resolve, debouncedWaitTime))

        const srMessage = await page.$eval('.govuk-character-count__sr-status', el => el.innerHTML.trim())
        expect(srMessage).toEqual('You have 1 word remaining')
      })

      test.describe('when the word limit is exceeded', () => {
        test.beforeEach(async ({ page }) => {
          await goToComponent(page, 'character-count', {
            exampleName: 'with-word-count'
          })

          await page.type('.govuk-js-character-count', 'Hello '.repeat(11))
        })

        test('shows the number of words over the limit', async ({ page }) => {
          const message = await page.$eval('.govuk-character-count__status', el => el.innerHTML.trim())
          expect(message).toEqual('You have 1 word too many')

          // Wait for debounced update to happen
          await new Promise((resolve) => setTimeout(resolve, debouncedWaitTime))

          const srMessage = await page.$eval('.govuk-character-count__sr-status', el => el.innerHTML.trim())
          expect(srMessage).toEqual('You have 1 word too many')
        })

        test('uses the plural when the limit is exceeded by 2 or more', async ({ page }) => {
          await page.type('.govuk-js-character-count', 'World')

          const message = await page.$eval('.govuk-character-count__status', el => el.innerHTML.trim())
          expect(message).toEqual('You have 2 words too many')

          // Wait for debounced update to happen
          await new Promise((resolve) => setTimeout(resolve, debouncedWaitTime))

          const srMessage = await page.$eval('.govuk-character-count__sr-status', el => el.innerHTML.trim())
          expect(srMessage).toEqual('You have 2 words too many')
        })

        test('adds error styles to the textarea', async ({ page }) => {
          const textareaClasses = await page.$eval('.govuk-js-character-count', el => el.className)
          expect(textareaClasses).toContain('govuk-textarea--error')
        })

        test('adds error styles to the count message', async ({ page }) => {
          const messageClasses = await page.$eval('.govuk-character-count__status', el => el.className)
          expect(messageClasses).toContain('govuk-error-message')
        })
      })
    })

    test.describe('JavaScript configuration', () => {
      test.describe('at instantiation', () => {
        test('configures the number of characters', async ({ page }) => {
          await renderAndInitialise(page, 'character-count', {
            nunjucksParams: examples['to configure in JavaScript'],
            javascriptConfig: {
              maxlength: 10
            }
          })

          await page.type('.govuk-js-character-count', 'A'.repeat(11))

          const message = await page.$eval(
            '.govuk-character-count__status',
            (el) => el.innerHTML.trim()
          )
          expect(message).toEqual('You have 1 character too many')
        })

        test('configures the number of words', async ({ page }) => {
          await renderAndInitialise(page, 'character-count', {
            nunjucksParams: examples['to configure in JavaScript'],
            javascriptConfig: {
              maxwords: 10
            }
          })

          await page.type('.govuk-js-character-count', 'Hello '.repeat(11))

          const message = await page.$eval(
            '.govuk-character-count__status',
            (el) => el.innerHTML.trim()
          )
          expect(message).toEqual('You have 1 word too many')
        })

        test('configures the threshold', async ({ page }) => {
          await renderAndInitialise(page, 'character-count', {
            nunjucksParams: examples['to configure in JavaScript'],
            javascriptConfig: {
              maxlength: 10,
              threshold: 75
            }
          })

          await page.type('.govuk-js-character-count', 'A'.repeat(8))

          const visibility = await page.$eval('.govuk-character-count__status', el => window.getComputedStyle(el).visibility)
          expect(visibility).toEqual('visible')
        })

        test('configures the description of the textarea', async ({ page }) => {
          // This tests that a description can be provided through JavaScript attributes
          // and interpolated with the limit provided to the character count in JS.

          await renderAndInitialise(page, 'character-count', {
            nunjucksParams:
              examples[
                'when neither maxlength/maxwords nor textarea description are set'
              ],
            javascriptConfig: {
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

      test.describe('via `initAll`', () => {
        test('configures the number of characters', async ({ page }) => {
          await renderAndInitialise(page, 'character-count', {
            nunjucksParams: examples['to configure in JavaScript'],
            initialiser () {
              window.GOVUKFrontend.initAll({
                characterCount: {
                  maxlength: 10
                }
              })
            }
          })

          await page.type('.govuk-js-character-count', 'A'.repeat(11))

          const message = await page.$eval(
            '.govuk-character-count__status',
            (el) => el.innerHTML.trim()
          )
          expect(message).toEqual('You have 1 character too many')
        })

        test('configures the number of words', async ({ page }) => {
          await renderAndInitialise(page, 'character-count', {
            nunjucksParams: examples['to configure in JavaScript'],
            initialiser () {
              window.GOVUKFrontend.initAll({
                characterCount: {
                  maxwords: 10
                }
              })
            }
          })

          await page.type('.govuk-js-character-count', 'Hello '.repeat(11))

          const message = await page.$eval(
            '.govuk-character-count__status',
            (el) => el.innerHTML.trim()
          )
          expect(message).toEqual('You have 1 word too many')
        })

        test('configures the threshold', async ({ page }) => {
          await renderAndInitialise(page, 'character-count', {
            nunjucksParams: examples['to configure in JavaScript'],
            initialiser () {
              window.GOVUKFrontend.initAll({
                characterCount: {
                  maxlength: 10,
                  threshold: 75
                }
              })
            }
          })

          await page.type('.govuk-js-character-count', 'A'.repeat(8))

          const visibility = await page.$eval(
            '.govuk-character-count__status',
            (el) => window.getComputedStyle(el).visibility
          )
          expect(visibility).toEqual('visible')
        })
      })

      test.describe('when data-attributes are present', () => {
        test('uses `maxlength` data attribute instead of the JS one', async ({ page }) => {
          await renderAndInitialise(page, 'character-count', {
            nunjucksParams: examples.default,
            javascriptConfig: {
              maxlength: 12 // JS configuration that would tell 1 character remaining
            }
          })

          await page.type('.govuk-js-character-count', 'A'.repeat(11))

          const message = await page.$eval(
            '.govuk-character-count__status',
            (el) => el.innerHTML.trim()
          )
          expect(message).toEqual('You have 1 character too many')
        })

        test("uses `maxlength` data attribute instead of JS's `maxwords`", async ({ page }) => {
          await renderAndInitialise(page, 'character-count', {
            nunjucksParams: examples.default, // Default example counts characters
            javascriptConfig: {
              maxwords: 12
            }
          })

          await page.type('.govuk-js-character-count', 'A'.repeat(11))

          const message = await page.$eval(
            '.govuk-character-count__status',
            (el) => el.innerHTML.trim()
          )
          expect(message).toEqual('You have 1 character too many')
        })

        test('uses `maxwords` data attribute instead of the JS one', async ({ page }) => {
          await renderAndInitialise(page, 'character-count', {
            nunjucksParams: examples['with word count'],
            javascriptConfig: {
              maxwords: 12 // JS configuration that would tell 1 word remaining
            }
          })

          await page.type('.govuk-js-character-count', 'Hello '.repeat(11))

          const message = await page.$eval(
            '.govuk-character-count__status',
            (el) => el.innerHTML.trim()
          )
          expect(message).toEqual('You have 1 word too many')
        })

        test("uses `maxwords` data attribute instead of the JS's `maxlength`", async ({ page }) => {
          await renderAndInitialise(page, 'character-count', {
            nunjucksParams: examples['with word count'],
            javascriptConfig: {
              maxlength: 10
            }
          })

          await page.type('.govuk-js-character-count', 'Hello '.repeat(11))

          const message = await page.$eval(
            '.govuk-character-count__status',
            (el) => el.innerHTML.trim()
          )
          expect(message).toEqual('You have 1 word too many')
        })

        test('interpolates the textarea description in data attributes with the maximum set in JavaScript', async ({ page }) => {
          // This tests that any textarea description provided through data-attributes
          // (or the Nunjucks macro), waiting for a maximum to be provided in
          // JavaScript config, will lead to the message being injected in the
          // element holding the textarea's accessible description
          // (and interpolated to replace `%{count}` with the maximum)

          await renderAndInitialise(page, 'character-count', {
            nunjucksParams:
              examples['when neither maxlength nor maxwords are set'],
            javascriptConfig: {
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

    test.describe('Cross Side Scripting prevention', () => {
      test('injects the localised strings as text not HTML', async ({ page }) => {
        await renderAndInitialise(page, 'character-count', {
          nunjucksParams: examples['to configure in JavaScript'],
          javascriptConfig: {
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
  test.describe('in mismatched locale', () => {
    test('does not error', async ({ page }) => {
      let pageErrorHappened = false
      page.on('pageerror', () => { pageErrorHappened = true })

      await renderAndInitialise(page, 'character-count', {
        nunjucksParams: examples.default,
        javascriptConfig: {
          // Override maxlength to 10
          maxlength: 10
        },
        initialiser: function ({ config }) {
          const $component = document.querySelector('[data-module]')

          // Set locale to Welsh, which expects translations for 'one', 'two',
          // 'few' 'many' and 'other' forms – with the default English strings
          // provided we only have translations for 'one' and 'other'.
          //
          // We want to make sure we handle this gracefully in case users have
          // an existing character count inside an incorrect locale.
          $component.setAttribute('lang', 'cy')
          new window.GOVUKFrontend.CharacterCount($component, config).init()
        }
      })

      // Type 10 characters so we go 'through' all the different forms as we
      // approach 0 characters remaining.
      await page.type('.govuk-js-character-count', 'A'.repeat(10))

      // Expect the page error event not to have been fired
      expect(pageErrorHappened).toBe(false)
    })
  })
})
