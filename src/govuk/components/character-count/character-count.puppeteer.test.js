const { setTimeout } = require('timers/promises')

const { render } = require('@govuk-frontend/helpers/puppeteer')
const { getExamples } = require('@govuk-frontend/lib/components')

describe('Character count', () => {
  let examples

  const focusIntervalTime = 1000 // ms
  const lastInputOffsetTime = 500 // ms

  // The longest possible time from a keyboard user ending input and the screen
  // reader counter being updated (+ 100ms to stay outside the total wait time)
  const debouncedWaitTime = focusIntervalTime + lastInputOffsetTime + 100

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
      await render(page, 'character-count', examples.default)

      const message = await page.$eval(
        '.govuk-character-count__message',
        (el) => el.innerHTML.trim()
      )

      expect(message).toEqual('You can enter up to 10 characters')
    })
  })

  describe('when JavaScript is available', () => {
    describe('on page load', () => {
      beforeAll(async () => {
        await render(page, 'character-count', examples.default)
      })

      it('injects the visual counter', async () => {
        const message =
          (await page.$('.govuk-character-count__status')) !== null
        expect(message).toBeTruthy()
      })

      it('injects the screen reader counter', async () => {
        const srMessage =
          (await page.$('.govuk-character-count__sr-status')) !== null
        expect(srMessage).toBeTruthy()
      })

      it('hides the textarea description', async () => {
        const messageClasses = await page.$eval(
          '.govuk-character-count__message',
          (el) => el.className
        )
        expect(messageClasses).toContain('govuk-visually-hidden')
      })
    })

    describe('when counting characters', () => {
      it('shows the dynamic message', async () => {
        await render(page, 'character-count', examples.default)

        const message = await page.$eval(
          '.govuk-character-count__status',
          (el) => el.innerHTML.trim()
        )
        expect(message).toEqual('You have 10 characters remaining')

        const srMessage = await page.$eval(
          '.govuk-character-count__sr-status',
          (el) => el.innerHTML.trim()
        )
        expect(srMessage).toEqual('You have 10 characters remaining')
      })

      it('shows the characters remaining if the field is pre-filled', async () => {
        await render(page, 'character-count', examples['with default value'])

        const message = await page.$eval(
          '.govuk-character-count__status',
          (el) => el.innerHTML.trim()
        )
        expect(message).toEqual('You have 67 characters remaining')

        const srMessage = await page.$eval(
          '.govuk-character-count__sr-status',
          (el) => el.innerHTML.trim()
        )
        expect(srMessage).toEqual('You have 67 characters remaining')
      })

      it('counts down to the character limit', async () => {
        await render(page, 'character-count', examples.default)

        await page.type('.govuk-js-character-count', 'A', {
          delay: 50
        })

        const message = await page.$eval(
          '.govuk-character-count__status',
          (el) => el.innerHTML.trim()
        )
        expect(message).toEqual('You have 9 characters remaining')

        // Wait for debounced update to happen
        await setTimeout(debouncedWaitTime)

        const srMessage = await page.$eval(
          '.govuk-character-count__sr-status',
          (el) => el.innerHTML.trim()
        )
        expect(srMessage).toEqual('You have 9 characters remaining')
      })

      it('uses the singular when there is only one character remaining', async () => {
        await render(page, 'character-count', examples.default)

        await page.type('.govuk-js-character-count', 'A'.repeat(9), {
          delay: 50
        })

        const message = await page.$eval(
          '.govuk-character-count__status',
          (el) => el.innerHTML.trim()
        )
        expect(message).toEqual('You have 1 character remaining')

        // Wait for debounced update to happen
        await setTimeout(debouncedWaitTime)

        const srMessage = await page.$eval(
          '.govuk-character-count__sr-status',
          (el) => el.innerHTML.trim()
        )
        expect(srMessage).toEqual('You have 1 character remaining')
      })

      describe('when the character limit is exceeded', () => {
        beforeAll(async () => {
          await render(page, 'character-count', examples.default)

          await page.type('.govuk-js-character-count', 'A'.repeat(11), {
            delay: 50
          })
        })

        it('shows the number of characters over the limit', async () => {
          const message = await page.$eval(
            '.govuk-character-count__status',
            (el) => el.innerHTML.trim()
          )
          expect(message).toEqual('You have 1 character too many')

          // Wait for debounced update to happen
          await setTimeout(debouncedWaitTime)

          const srMessage = await page.$eval(
            '.govuk-character-count__sr-status',
            (el) => el.innerHTML.trim()
          )
          expect(srMessage).toEqual('You have 1 character too many')
        })

        it('uses the plural when the limit is exceeded by 2 or more', async () => {
          await page.type('.govuk-js-character-count', 'A', {
            delay: 50
          })

          const message = await page.$eval(
            '.govuk-character-count__status',
            (el) => el.innerHTML.trim()
          )
          expect(message).toEqual('You have 2 characters too many')

          // Wait for debounced update to happen
          await setTimeout(debouncedWaitTime)

          const srMessage = await page.$eval(
            '.govuk-character-count__sr-status',
            (el) => el.innerHTML.trim()
          )
          expect(srMessage).toEqual('You have 2 characters too many')
        })

        it('adds error styles to the textarea', async () => {
          const textareaClasses = await page.$eval(
            '.govuk-js-character-count',
            (el) => el.className
          )
          expect(textareaClasses).toContain('govuk-textarea--error')
        })

        it('adds error styles to the count message', async () => {
          const messageClasses = await page.$eval(
            '.govuk-character-count__status',
            (el) => el.className
          )
          expect(messageClasses).toContain('govuk-error-message')
        })
      })

      describe('when the character limit is exceeded on page load', () => {
        beforeAll(async () => {
          await render(
            page,
            'character-count',
            examples['with default value exceeding limit']
          )
        })

        it('shows the number of characters over the limit', async () => {
          const message = await page.$eval(
            '.govuk-character-count__status',
            (el) => el.innerHTML.trim()
          )
          expect(message).toEqual('You have 23 characters too many')

          const srMessage = await page.$eval(
            '.govuk-character-count__sr-status',
            (el) => el.innerHTML.trim()
          )
          expect(srMessage).toEqual('You have 23 characters too many')
        })

        it('adds error styles to the textarea', async () => {
          const textareaClasses = await page.$eval(
            '.govuk-js-character-count',
            (el) => el.className
          )
          expect(textareaClasses).toContain('govuk-textarea--error')
        })

        it('adds error styles to the count message', async () => {
          const messageClasses = await page.$eval(
            '.govuk-character-count__status',
            (el) => el.className
          )
          expect(messageClasses).toContain('govuk-error-message')
        })
      })

      describe('when a threshold is set', () => {
        beforeAll(async () => {
          await render(page, 'character-count', examples['with threshold'])
        })

        it('does not show the limit until the threshold is reached', async () => {
          const visibility = await page.$eval(
            '.govuk-character-count__status',
            (el) => window.getComputedStyle(el).visibility
          )
          expect(visibility).toEqual('hidden')

          // Wait for debounced update to happen
          await setTimeout(debouncedWaitTime)

          // Ensure threshold is hidden for users of assistive technologies
          const ariaHidden = await page.$eval(
            '.govuk-character-count__sr-status',
            (el) => el.getAttribute('aria-hidden')
          )
          expect(ariaHidden).toEqual('true')
        })

        it('becomes visible once the threshold is reached', async () => {
          await page.type('.govuk-js-character-count', 'A'.repeat(8), {
            delay: 50
          })

          const visibility = await page.$eval(
            '.govuk-character-count__status',
            (el) => window.getComputedStyle(el).visibility
          )
          expect(visibility).toEqual('visible')

          // Wait for debounced update to happen
          await setTimeout(debouncedWaitTime)

          // Ensure threshold is visible for users of assistive technologies
          const ariaHidden = await page.$eval(
            '.govuk-character-count__sr-status',
            (el) => el.getAttribute('aria-hidden')
          )
          expect(ariaHidden).toBeFalsy()
        })
      })

      // Errors logged to the console will cause these tests to fail
      describe('when the textarea ID starts with a number', () => {
        beforeAll(async () => {
          await render(
            page,
            'character-count',
            examples['with id starting with number']
          )
        })

        it('still works correctly', async () => {
          const message = await page.$eval(
            '.govuk-character-count__status',
            (el) => el.innerHTML.trim()
          )
          expect(message).toEqual('You have 10 characters remaining')

          const srMessage = await page.$eval(
            '.govuk-character-count__sr-status',
            (el) => el.innerHTML.trim()
          )
          expect(srMessage).toEqual('You have 10 characters remaining')
        })
      })

      describe('when the textarea ID contains CSS syntax characters', () => {
        beforeAll(async () => {
          await render(
            page,
            'character-count',
            examples['with id with special characters']
          )
        })

        it('still works correctly', async () => {
          const message = await page.$eval(
            '.govuk-character-count__status',
            (el) => el.innerHTML.trim()
          )
          expect(message).toEqual('You have 10 characters remaining')

          const srMessage = await page.$eval(
            '.govuk-character-count__sr-status',
            (el) => el.innerHTML.trim()
          )
          expect(srMessage).toEqual('You have 10 characters remaining')
        })
      })

      describe('when a maxlength attribute is specified on the textarea', () => {
        beforeAll(async () => {
          await render(
            page,
            'character-count',
            examples['with textarea maxlength attribute']
          )
        })

        it('should not have a maxlength attribute once the JS has run', async () => {
          const textareaMaxLength = await page.$eval('.govuk-textarea', (el) =>
            el.getAttribute('maxlength')
          )
          expect(textareaMaxLength).toBeNull()
        })
      })
    })

    describe('when counting words', () => {
      it('shows the dynamic message', async () => {
        await render(page, 'character-count', examples['with word count'])

        const message = await page.$eval(
          '.govuk-character-count__status',
          (el) => el.innerHTML.trim()
        )
        expect(message).toEqual('You have 10 words remaining')

        const srMessage = await page.$eval(
          '.govuk-character-count__sr-status',
          (el) => el.innerHTML.trim()
        )
        expect(srMessage).toEqual('You have 10 words remaining')
      })

      it('counts down to the word limit', async () => {
        await render(page, 'character-count', examples['with word count'])

        await page.type('.govuk-js-character-count', 'Hello world', {
          delay: 50
        })

        const message = await page.$eval(
          '.govuk-character-count__status',
          (el) => el.innerHTML.trim()
        )
        expect(message).toEqual('You have 8 words remaining')

        // Wait for debounced update to happen
        await setTimeout(debouncedWaitTime)

        const srMessage = await page.$eval(
          '.govuk-character-count__sr-status',
          (el) => el.innerHTML.trim()
        )
        expect(srMessage).toEqual('You have 8 words remaining')
      })

      it('uses the singular when there is only one word remaining', async () => {
        await render(page, 'character-count', examples['with word count'])

        await page.type('.govuk-js-character-count', 'Hello '.repeat(9), {
          delay: 50
        })

        const message = await page.$eval(
          '.govuk-character-count__status',
          (el) => el.innerHTML.trim()
        )
        expect(message).toEqual('You have 1 word remaining')

        // Wait for debounced update to happen
        await setTimeout(debouncedWaitTime)

        const srMessage = await page.$eval(
          '.govuk-character-count__sr-status',
          (el) => el.innerHTML.trim()
        )
        expect(srMessage).toEqual('You have 1 word remaining')
      })

      describe('when the word limit is exceeded', () => {
        beforeAll(async () => {
          await render(page, 'character-count', examples['with word count'])

          await page.type('.govuk-js-character-count', 'Hello '.repeat(11), {
            delay: 50
          })
        })

        it('shows the number of words over the limit', async () => {
          const message = await page.$eval(
            '.govuk-character-count__status',
            (el) => el.innerHTML.trim()
          )
          expect(message).toEqual('You have 1 word too many')

          // Wait for debounced update to happen
          await setTimeout(debouncedWaitTime)

          const srMessage = await page.$eval(
            '.govuk-character-count__sr-status',
            (el) => el.innerHTML.trim()
          )
          expect(srMessage).toEqual('You have 1 word too many')
        })

        it('uses the plural when the limit is exceeded by 2 or more', async () => {
          await page.type('.govuk-js-character-count', 'World', {
            delay: 50
          })

          const message = await page.$eval(
            '.govuk-character-count__status',
            (el) => el.innerHTML.trim()
          )
          expect(message).toEqual('You have 2 words too many')

          // Wait for debounced update to happen
          await setTimeout(debouncedWaitTime)

          const srMessage = await page.$eval(
            '.govuk-character-count__sr-status',
            (el) => el.innerHTML.trim()
          )
          expect(srMessage).toEqual('You have 2 words too many')
        })

        it('adds error styles to the textarea', async () => {
          const textareaClasses = await page.$eval(
            '.govuk-js-character-count',
            (el) => el.className
          )
          expect(textareaClasses).toContain('govuk-textarea--error')
        })

        it('adds error styles to the count message', async () => {
          const messageClasses = await page.$eval(
            '.govuk-character-count__status',
            (el) => el.className
          )
          expect(messageClasses).toContain('govuk-error-message')
        })
      })
    })

    describe('JavaScript configuration', () => {
      describe('at instantiation', () => {
        it('configures the number of characters', async () => {
          await render(
            page,
            'character-count',
            examples['to configure in JavaScript'],
            {
              config: {
                maxlength: 10
              }
            }
          )

          await page.type('.govuk-js-character-count', 'A'.repeat(11), {
            delay: 50
          })

          const message = await page.$eval(
            '.govuk-character-count__status',
            (el) => el.innerHTML.trim()
          )
          expect(message).toEqual('You have 1 character too many')
        })

        it('configures the number of words', async () => {
          await render(
            page,
            'character-count',
            examples['to configure in JavaScript'],
            {
              config: {
                maxwords: 10
              }
            }
          )

          await page.type('.govuk-js-character-count', 'Hello '.repeat(11), {
            delay: 50
          })

          const message = await page.$eval(
            '.govuk-character-count__status',
            (el) => el.innerHTML.trim()
          )
          expect(message).toEqual('You have 1 word too many')
        })

        it('configures the threshold', async () => {
          await render(
            page,
            'character-count',
            examples['to configure in JavaScript'],
            {
              config: {
                maxlength: 10,
                threshold: 75
              }
            }
          )

          await page.type('.govuk-js-character-count', 'A'.repeat(8), {
            delay: 50
          })

          const visibility = await page.$eval(
            '.govuk-character-count__status',
            (el) => window.getComputedStyle(el).visibility
          )
          expect(visibility).toEqual('visible')
        })

        it('configures the description of the textarea', async () => {
          // This tests that a description can be provided through JavaScript attributes
          // and interpolated with the limit provided to the character count in JS.

          await render(
            page,
            'character-count',
            examples[
              'when neither maxlength/maxwords nor textarea description are set'
            ],
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

          const message = await page.$eval(
            '.govuk-character-count__message',
            (el) => el.innerHTML.trim()
          )
          expect(message).toEqual('No more than 10 characters')
        })
      })

      describe('via `initAll`', () => {
        it('configures the number of characters', async () => {
          await render(
            page,
            'character-count',
            examples['to configure in JavaScript'],
            {
              config: {
                maxlength: 10
              }
            }
          )

          await page.type('.govuk-js-character-count', 'A'.repeat(11), {
            delay: 50
          })

          const message = await page.$eval(
            '.govuk-character-count__status',
            (el) => el.innerHTML.trim()
          )
          expect(message).toEqual('You have 1 character too many')
        })

        it('configures the number of words', async () => {
          await render(
            page,
            'character-count',
            examples['to configure in JavaScript'],
            {
              config: {
                maxwords: 10
              }
            }
          )

          await page.type('.govuk-js-character-count', 'Hello '.repeat(11), {
            delay: 50
          })

          const message = await page.$eval(
            '.govuk-character-count__status',
            (el) => el.innerHTML.trim()
          )
          expect(message).toEqual('You have 1 word too many')
        })

        it('configures the threshold', async () => {
          await render(
            page,
            'character-count',
            examples['to configure in JavaScript'],
            {
              config: {
                maxlength: 10,
                threshold: 75
              }
            }
          )

          await page.type('.govuk-js-character-count', 'A'.repeat(8), {
            delay: 50
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
          await render(page, 'character-count', examples.default, {
            config: {
              maxlength: 12 // JS configuration that would tell 1 character remaining
            }
          })

          await page.type('.govuk-js-character-count', 'A'.repeat(11), {
            delay: 50
          })

          const message = await page.$eval(
            '.govuk-character-count__status',
            (el) => el.innerHTML.trim()
          )
          expect(message).toEqual('You have 1 character too many')
        })

        it("uses `maxlength` data attribute instead of JS's `maxwords`", async () => {
          await render(page, 'character-count', examples.default, {
            config: {
              maxwords: 12
            }
          })

          await page.type('.govuk-js-character-count', 'A'.repeat(11), {
            delay: 50
          })

          const message = await page.$eval(
            '.govuk-character-count__status',
            (el) => el.innerHTML.trim()
          )
          expect(message).toEqual('You have 1 character too many')
        })

        it('uses `maxwords` data attribute instead of the JS one', async () => {
          await render(page, 'character-count', examples['with word count'], {
            config: {
              maxwords: 12 // JS configuration that would tell 1 word remaining
            }
          })

          await page.type('.govuk-js-character-count', 'Hello '.repeat(11), {
            delay: 50
          })

          const message = await page.$eval(
            '.govuk-character-count__status',
            (el) => el.innerHTML.trim()
          )
          expect(message).toEqual('You have 1 word too many')
        })

        it("uses `maxwords` data attribute instead of the JS's `maxlength`", async () => {
          await render(page, 'character-count', examples['with word count'], {
            config: {
              maxlength: 10
            }
          })

          await page.type('.govuk-js-character-count', 'Hello '.repeat(11), {
            delay: 50
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

          await render(
            page,
            'character-count',
            examples['when neither maxlength nor maxwords are set'],
            {
              config: {
                maxlength: 10
              }
            }
          )

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
        await render(
          page,
          'character-count',
          examples['to configure in JavaScript'],
          {
            config: {
              maxlength: 10,
              i18n: {
                charactersUnderLimit: {
                  other: '<strong>%{count}</strong> characters left'
                }
              }
            }
          }
        )

        const message = await page.$eval(
          '.govuk-character-count__status',
          (el) => el.innerHTML.trim()
        )
        expect(message).toEqual(
          '&lt;strong&gt;10&lt;/strong&gt; characters left'
        )
      })
    })

    describe('errors at instantiation', () => {
      let examples

      beforeAll(async () => {
        examples = await getExamples('character-count')
      })

      it('can throw a SupportError if appropriate', async () => {
        await expect(
          render(page, 'character-count', examples.default, {
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
          render(page, 'character-count', examples.default, {
            beforeInitialisation($module) {
              $module.remove()
            }
          })
        ).rejects.toMatchObject({
          cause: {
            name: 'ElementError',
            message: 'Character count: Root element (`$module`) not found'
          }
        })
      })

      it('throws when receiving the wrong type for $module', async () => {
        await expect(
          render(page, 'character-count', examples.default, {
            beforeInitialisation($module) {
              // Replace with an `<svg>` element which is not an `HTMLElement` in the DOM (but an `SVGElement`)
              $module.outerHTML = `<svg data-module="govuk-character-count"></svg>`
            }
          })
        ).rejects.toMatchObject({
          cause: {
            name: 'ElementError',
            message:
              'Character count: Root element (`$module`) is not of type HTMLElement'
          }
        })
      })

      it('throws when the textarea is missing', async () => {
        await expect(
          render(page, 'character-count', examples.default, {
            beforeInitialisation($module, { selector }) {
              $module.querySelector(selector).remove()
            },
            context: {
              selector: '.govuk-js-character-count'
            }
          })
        ).rejects.toMatchObject({
          cause: {
            name: 'ElementError',
            message:
              'Character count: Form field (`.govuk-js-character-count`) not found'
          }
        })
      })

      it('throws when the textarea is not the right type', async () => {
        await expect(
          render(page, 'character-count', examples.default, {
            beforeInitialisation($module, { selector }) {
              // Replace with a tag that's neither an `<input>` or `<textarea>`
              $module.querySelector(selector).outerHTML =
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
              'Character count: Form field (`.govuk-js-character-count`) is not of type HTMLTextareaElement or HTMLInputElement'
          }
        })
      })

      it('throws when the textarea description is missing', async () => {
        await expect(
          render(page, 'character-count', examples.default, {
            beforeInitialisation($module, { selector }) {
              $module.querySelector(selector).remove()
            },
            context: {
              selector: '#more-detail-info'
            }
          })
        ).rejects.toMatchObject({
          cause: {
            name: 'ElementError',
            message:
              'Character count: Count message (`id="more-detail-info"`) not found'
          }
        })
      })

      it('throws when receiving invalid JavaScript configuration', async () => {
        await expect(
          render(
            page,
            'character-count',
            examples['to configure in JavaScript']
          )
        ).rejects.toMatchObject({
          cause: {
            name: 'ConfigError',
            message:
              'Character count: Either "maxlength" or "maxwords" must be provided'
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

      await render(page, 'character-count', examples.default, {
        config: {
          // Override maxlength to 10
          maxlength: 10
        },
        beforeInitialisation($module) {
          // Set locale to Welsh, which expects translations for 'one', 'two',
          // 'few' 'many' and 'other' forms – with the default English strings
          // provided we only have translations for 'one' and 'other'.
          //
          // We want to make sure we handle this gracefully in case users have
          // an existing character count inside an incorrect locale.
          $module.setAttribute('lang', 'cy')
        }
      })

      // Type 10 characters so we go 'through' all the different forms as we
      // approach 0 characters remaining.
      await page.type('.govuk-js-character-count', 'A'.repeat(10), {
        delay: 50
      })

      // Expect the page error event not to have been fired
      expect(pageErrorListener).not.toHaveBeenCalled()
    })
  })
})
