/* eslint-disable no-new */

const { setTimeout } = require('timers/promises')

const {
  getAttribute,
  getHtml,
  getText,
  isVisible,
  render
} = require('@govuk-frontend/helpers/puppeteer')
const { getExamples } = require('@govuk-frontend/lib/components')

const { CharacterCount } = require('./character-count.mjs')

describe('Character count', () => {
  /** @type {Awaited<ReturnType<typeof getExamples>>} */
  let examples

  const focusIntervalTime = 1000 // ms
  const lastInputOffsetTime = 500 // ms

  // The longest possible time from a keyboard user ending input and the screen
  // reader counter being updated (+ 100ms to stay outside the total wait time)
  const debouncedWaitTime = focusIntervalTime + lastInputOffsetTime + 100

  /** @type {ElementHandle} */
  let $component

  /** @type {ElementHandle} */
  let $screenReaderCountMessage

  /** @type {ElementHandle} */
  let $textarea

  /** @type {ElementHandle} */
  let $textareaDescription

  /** @type {ElementHandle<HTMLElement>} */
  let $visibleCountMessage

  /**
   * @template {object} HandlerContext
   * @param {keyof typeof examples} example
   * @param {BrowserRenderOptions<HandlerContext>} [browserOptions] - Puppeteer browser render options
   */
  async function initExample(example, browserOptions) {
    await render(page, 'character-count', examples[example], browserOptions)

    $component = /** @type {ElementHandle<HTMLElement>} */ (
      await page.$(`[data-module="${CharacterCount.moduleName}"]`)
    )

    $screenReaderCountMessage = /** @type {ElementHandle<HTMLElement>} */ (
      await $component.$('div.govuk-character-count__sr-status')
    )

    $textarea = /** @type {ElementHandle<HTMLElement>} */ (
      await $component.$('textarea.govuk-textarea')
    )

    $textareaDescription = /** @type {ElementHandle<HTMLElement>} */ (
      await $component.$('div.govuk-character-count__message')
    )

    $visibleCountMessage = /** @type {ElementHandle<HTMLElement>} */ (
      await $component.$('div.govuk-character-count__status')
    )
  }

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
      await initExample('default')

      expect((await getText($textareaDescription)).trim()).toBe(
        'You can enter up to 10 characters'
      )
    })
  })

  describe('when JavaScript is available', () => {
    describe('on page load', () => {
      beforeEach(async () => {
        await initExample('default')
      })

      it('injects the visual counter', async () => {
        expect(await isVisible($visibleCountMessage)).toBe(true)
      })

      it('injects the screen reader counter', async () => {
        expect(await isVisible($screenReaderCountMessage)).toBe(true)
      })

      it('hides the textarea description', async () => {
        expect(await getAttribute($textareaDescription, 'class')).toContain(
          'govuk-visually-hidden'
        )
      })

      it('retains error class if there is already an error', async () => {
        await initExample('custom classes with error message')

        expect(await getAttribute($textarea, 'class')).toContain(
          'govuk-textarea--error'
        )
      })
    })

    describe('when counting characters', () => {
      it('shows the dynamic message', async () => {
        await initExample('default')

        expect(await getText($visibleCountMessage)).toBe(
          'You have 10 characters remaining'
        )

        expect(await getText($screenReaderCountMessage)).toBe(
          'You have 10 characters remaining'
        )
      })

      it('shows the characters remaining if the field is pre-filled', async () => {
        await initExample('with default value')

        expect(await getText($visibleCountMessage)).toBe(
          'You have 67 characters remaining'
        )

        expect(await getText($screenReaderCountMessage)).toBe(
          'You have 67 characters remaining'
        )
      })

      it('counts down to the character limit', async () => {
        await initExample('default')

        await $textarea.type('A')

        expect(await getText($visibleCountMessage)).toBe(
          'You have 9 characters remaining'
        )

        // Wait for debounced update to happen
        await setTimeout(debouncedWaitTime)

        expect(await getText($screenReaderCountMessage)).toBe(
          'You have 9 characters remaining'
        )
      })

      it('uses the singular when there is only one character remaining', async () => {
        await initExample('default')

        await $textarea.type('A'.repeat(9))

        expect(await getText($visibleCountMessage)).toBe(
          'You have 1 character remaining'
        )

        // Wait for debounced update to happen
        await setTimeout(debouncedWaitTime)

        expect(await getText($screenReaderCountMessage)).toBe(
          'You have 1 character remaining'
        )
      })

      it('retains error class if there is already an error', async () => {
        await initExample('custom classes with error message')

        await $textarea.type('A')

        expect(await getAttribute($textarea, 'class')).toContain(
          'govuk-textarea--error'
        )
      })

      describe('when the character limit is exceeded', () => {
        beforeEach(async () => {
          await initExample('default')

          await $textarea.type('A'.repeat(11))
        })

        it('shows the number of characters over the limit', async () => {
          expect(await getText($visibleCountMessage)).toBe(
            'You have 1 character too many'
          )

          // Wait for debounced update to happen
          await setTimeout(debouncedWaitTime)

          expect(await getText($screenReaderCountMessage)).toBe(
            'You have 1 character too many'
          )
        })

        it('uses the plural when the limit is exceeded by 2 or more', async () => {
          await $textarea.type('A')

          expect(await getText($visibleCountMessage)).toBe(
            'You have 2 characters too many'
          )

          // Wait for debounced update to happen
          await setTimeout(debouncedWaitTime)

          expect(await getText($screenReaderCountMessage)).toBe(
            'You have 2 characters too many'
          )
        })

        it('adds error styles to the textarea', async () => {
          expect(await getAttribute($textarea, 'class')).toContain(
            'govuk-textarea--error'
          )
        })

        it('adds error styles to the count message', async () => {
          expect(await getAttribute($visibleCountMessage, 'class')).toContain(
            'govuk-error-message'
          )
        })
      })

      describe('when the character limit is exceeded on page load', () => {
        beforeEach(async () => {
          await initExample('with default value exceeding limit')
        })

        it('shows the number of characters over the limit', async () => {
          expect(await getText($visibleCountMessage)).toBe(
            'You have 23 characters too many'
          )

          expect(await getText($screenReaderCountMessage)).toBe(
            'You have 23 characters too many'
          )
        })

        it('adds error styles to the textarea', async () => {
          expect(await getAttribute($textarea, 'class')).toContain(
            'govuk-textarea--error'
          )
        })

        it('adds error styles to the count message', async () => {
          expect(await getAttribute($visibleCountMessage, 'class')).toContain(
            'govuk-error-message'
          )
        })
      })

      describe('when a threshold is set', () => {
        beforeEach(async () => {
          await initExample('with threshold')
        })

        it('does not show the limit until the threshold is reached', async () => {
          expect(await isVisible($visibleCountMessage)).toBe(false)

          // Ensure threshold is hidden for users of assistive technologies
          expect(
            await getAttribute($screenReaderCountMessage, 'aria-hidden')
          ).toBe('true')
        })

        it('becomes visible once the threshold is reached', async () => {
          await $textarea.type('A'.repeat(8))

          expect(await isVisible($visibleCountMessage)).toBe(true)

          // Wait for debounced update to happen
          await setTimeout(debouncedWaitTime)

          // Ensure threshold is visible for users of assistive technologies
          expect(
            await getAttribute($screenReaderCountMessage, 'aria-hidden')
          ).toBeNull()
        })
      })

      // Errors logged to the console will cause these tests to fail
      describe('when the textarea ID starts with a number', () => {
        beforeAll(async () => {
          await initExample('with id starting with number')
        })

        it('still works correctly', async () => {
          expect(await getText($visibleCountMessage)).toBe(
            'You have 10 characters remaining'
          )

          expect(await getText($screenReaderCountMessage)).toBe(
            'You have 10 characters remaining'
          )
        })
      })

      describe('when the textarea ID contains CSS syntax characters', () => {
        beforeAll(async () => {
          await initExample('with id with special characters')
        })

        it('still works correctly', async () => {
          expect(await getText($visibleCountMessage)).toBe(
            'You have 10 characters remaining'
          )

          expect(await getText($screenReaderCountMessage)).toBe(
            'You have 10 characters remaining'
          )
        })
      })

      describe('when a maxlength attribute is specified on the textarea', () => {
        beforeEach(async () => {
          await initExample('with textarea maxlength attribute')
        })

        it('should not have a maxlength attribute once the JS has run', async () => {
          expect(await getAttribute($textarea, 'maxlength')).toBeNull()
        })
      })
    })

    describe('when counting words', () => {
      it('shows the dynamic message', async () => {
        await initExample('with word count')

        expect(await getText($visibleCountMessage)).toBe(
          'You have 10 words remaining'
        )

        expect(await getText($screenReaderCountMessage)).toBe(
          'You have 10 words remaining'
        )
      })

      it('counts down to the word limit', async () => {
        await initExample('with word count')

        await $textarea.type('Hello world')

        expect(await getText($visibleCountMessage)).toBe(
          'You have 8 words remaining'
        )

        // Wait for debounced update to happen
        await setTimeout(debouncedWaitTime)

        expect(await getText($screenReaderCountMessage)).toBe(
          'You have 8 words remaining'
        )
      })

      it('uses the singular when there is only one word remaining', async () => {
        await initExample('with word count')

        await $textarea.type('Hello '.repeat(9))

        expect(await getText($visibleCountMessage)).toBe(
          'You have 1 word remaining'
        )

        // Wait for debounced update to happen
        await setTimeout(debouncedWaitTime)

        expect(await getText($screenReaderCountMessage)).toBe(
          'You have 1 word remaining'
        )
      })

      describe('when the word limit is exceeded', () => {
        beforeEach(async () => {
          await initExample('with word count')

          await $textarea.type('Hello '.repeat(11))
        })

        it('shows the number of words over the limit', async () => {
          expect(await getText($visibleCountMessage)).toBe(
            'You have 1 word too many'
          )

          // Wait for debounced update to happen
          await setTimeout(debouncedWaitTime)

          expect(await getText($screenReaderCountMessage)).toBe(
            'You have 1 word too many'
          )
        })

        it('uses the plural when the limit is exceeded by 2 or more', async () => {
          await $textarea.type('World')

          expect(await getText($visibleCountMessage)).toBe(
            'You have 2 words too many'
          )

          // Wait for debounced update to happen
          await setTimeout(debouncedWaitTime)

          expect(await getText($screenReaderCountMessage)).toBe(
            'You have 2 words too many'
          )
        })

        it('adds error styles to the textarea', async () => {
          expect(await getAttribute($textarea, 'class')).toContain(
            'govuk-textarea--error'
          )
        })

        it('adds error styles to the count message', async () => {
          expect(await getAttribute($visibleCountMessage, 'class')).toContain(
            'govuk-error-message'
          )
        })
      })
    })

    describe('JavaScript configuration', () => {
      describe('at instantiation', () => {
        it('configures the number of characters', async () => {
          await initExample('to configure in JavaScript', {
            config: {
              maxlength: 10
            }
          })

          await $textarea.type('A'.repeat(11))

          expect(await getText($visibleCountMessage)).toBe(
            'You have 1 character too many'
          )
        })

        it('configures the number of words', async () => {
          await initExample('to configure in JavaScript', {
            config: {
              maxwords: 10
            }
          })

          await $textarea.type('Hello '.repeat(11))

          expect(await getText($visibleCountMessage)).toBe(
            'You have 1 word too many'
          )
        })

        it('configures the threshold', async () => {
          await initExample('to configure in JavaScript', {
            config: {
              maxlength: 10,
              threshold: 75
            }
          })

          await $textarea.type('A'.repeat(8))

          expect(await isVisible($visibleCountMessage)).toBe(true)
        })

        it('configures the description of the textarea', async () => {
          // This tests that a description can be provided through JavaScript attributes
          // and interpolated with the limit provided to the character count in JS.

          await initExample(
            'when neither maxlength/maxwords nor textarea description are set',
            {
              config: {
                maxlength: 10,
                i18n: {
                  textareaDescription: {
                    other: 'No more than %{count} characters'
                  }
                }
              }
            }
          )

          expect(await getText($textareaDescription)).toBe(
            'No more than 10 characters'
          )
        })
      })

      describe('when data-attributes are present', () => {
        it('uses `maxlength` data attribute instead of the JS one', async () => {
          await initExample('default', {
            config: {
              maxlength: 12 // JS configuration that would tell 1 character remaining
            }
          })

          await $textarea.type('A'.repeat(11))

          expect(await getText($visibleCountMessage)).toBe(
            'You have 1 character too many'
          )
        })

        it("uses `maxlength` data attribute instead of JS's `maxwords`", async () => {
          await initExample('default', {
            config: {
              maxwords: 12
            }
          })

          await $textarea.type('A'.repeat(11))

          expect(await getText($visibleCountMessage)).toBe(
            'You have 1 character too many'
          )
        })

        it('uses `maxwords` data attribute instead of the JS one', async () => {
          await initExample('with word count', {
            config: {
              maxwords: 12 // JS configuration that would tell 1 word remaining
            }
          })

          await $textarea.type('Hello '.repeat(11))

          expect(await getText($visibleCountMessage)).toBe(
            'You have 1 word too many'
          )
        })

        it("uses `maxwords` data attribute instead of the JS's `maxlength`", async () => {
          await initExample('with word count', {
            config: {
              maxlength: 10
            }
          })

          await $textarea.type('Hello '.repeat(11))

          expect(await getText($visibleCountMessage)).toBe(
            'You have 1 word too many'
          )
        })

        it('interpolates the textarea description in data attributes with the maximum set in JavaScript', async () => {
          // This tests that any textarea description provided through data-attributes
          // (or the Nunjucks macro), waiting for a maximum to be provided in
          // JavaScript config, will lead to the message being injected in the
          // element holding the textarea's accessible description
          // (and interpolated to replace `%{count}` with the maximum)

          await initExample('when neither maxlength nor maxwords are set', {
            config: {
              maxlength: 10
            }
          })

          expect(await getText($textareaDescription)).toBe(
            'No more than 10 characters'
          )
        })
      })
    })

    describe('Cross Side Scripting prevention', () => {
      it('injects the localised strings as text not HTML', async () => {
        await initExample('to configure in JavaScript', {
          config: {
            maxlength: 10,
            i18n: {
              charactersUnderLimit: {
                other: '<strong>%{count}</strong> characters left'
              }
            }
          }
        })

        expect((await getHtml($visibleCountMessage)).trim()).toBe(
          '&lt;strong&gt;10&lt;/strong&gt; characters left'
        )
      })
    })

    describe('errors at instantiation', () => {
      it('can throw a SupportError if appropriate', async () => {
        await expect(
          initExample('default', {
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

      it('throws when initialised twice', async () => {
        await expect(
          initExample('default', {
            async afterInitialisation($root) {
              const { CharacterCount } = await import('govuk-frontend')
              new CharacterCount($root)
            }
          })
        ).rejects.toMatchObject({
          name: 'InitError',
          message:
            'govuk-character-count: Root element (`$root`) already initialised'
        })
      })

      it('throws when $root is not set', async () => {
        await expect(
          initExample('default', {
            beforeInitialisation($root) {
              $root.remove()
            }
          })
        ).rejects.toMatchObject({
          cause: {
            name: 'ElementError',
            message: 'govuk-character-count: Root element (`$root`) not found'
          }
        })
      })

      it('throws when receiving the wrong type for $root', async () => {
        await expect(
          initExample('default', {
            beforeInitialisation($root) {
              // Replace with an `<svg>` element which is not an `HTMLElement` in the DOM (but an `SVGElement`)
              $root.outerHTML = `<svg data-module="govuk-character-count"></svg>`
            }
          })
        ).rejects.toMatchObject({
          cause: {
            name: 'ElementError',
            message:
              'govuk-character-count: Root element (`$root`) is not of type HTMLElement'
          }
        })
      })

      it('throws when the textarea is missing', async () => {
        await expect(
          initExample('default', {
            beforeInitialisation($root, { selector }) {
              $root.querySelector(selector).remove()
            },
            context: {
              selector: '.govuk-js-character-count'
            }
          })
        ).rejects.toMatchObject({
          cause: {
            name: 'ElementError',
            message:
              'govuk-character-count: Form field (`.govuk-js-character-count`) not found'
          }
        })
      })

      it('throws when the textarea is not the right type', async () => {
        await expect(
          initExample('default', {
            beforeInitialisation($root, { selector }) {
              // Replace with a tag that's neither an `<input>` or `<textarea>`
              $root.querySelector(selector).outerHTML =
                '<div class="govuk-js-character-count"></div>'
            },
            context: {
              selector: '.govuk-js-character-count'
            }
          })
        ).rejects.toMatchObject({
          cause: {
            name: 'ElementError',
            message:
              'govuk-character-count: Form field (`.govuk-js-character-count`) is not of type HTMLTextareaElement or HTMLInputElement'
          }
        })
      })

      it('throws when the textarea description is missing', async () => {
        await expect(
          initExample('default', {
            beforeInitialisation($root, { selector }) {
              $root.querySelector(selector).remove()
            },
            context: {
              selector: '#more-detail-info'
            }
          })
        ).rejects.toMatchObject({
          cause: {
            name: 'ElementError',
            message:
              'govuk-character-count: Count message (`id="more-detail-info"`) not found'
          }
        })
      })

      it('throws when receiving invalid JavaScript configuration', async () => {
        await expect(
          initExample('to configure in JavaScript')
        ).rejects.toMatchObject({
          cause: {
            name: 'ConfigError',
            message:
              'govuk-character-count: Either "maxlength" or "maxwords" must be provided'
          }
        })
      })
    })
  })

  describe('in mismatched locale', () => {
    it('does not error', async () => {
      // Create a listener for the page error event that we can assert on later
      const pageErrorListener = jest.fn()
      page.on('pageerror', pageErrorListener)

      await initExample('default', {
        config: {
          // Override maxlength to 10
          maxlength: 10
        },
        beforeInitialisation($root) {
          // Set locale to Welsh, which expects translations for 'one', 'two',
          // 'few' 'many' and 'other' forms – with the default English strings
          // provided we only have translations for 'one' and 'other'.
          //
          // We want to make sure we handle this gracefully in case users have
          // an existing character count inside an incorrect locale.
          $root.setAttribute('lang', 'cy')
        }
      })

      // Type 10 characters so we go 'through' all the different forms as we
      // approach 0 characters remaining.
      await $textarea.type('A'.repeat(10))

      // Expect the page error event not to have been fired
      expect(pageErrorListener).not.toHaveBeenCalled()
    })
  })
})

/**
 * @import { BrowserRenderOptions } from '@govuk-frontend/helpers/puppeteer'
 * @import { ElementHandle } from 'puppeteer'
 */
