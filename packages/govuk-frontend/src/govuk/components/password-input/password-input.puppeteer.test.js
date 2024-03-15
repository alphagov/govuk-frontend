const { render, goTo } = require('@govuk-frontend/helpers/puppeteer')
const { getExamples } = require('@govuk-frontend/lib/components')

const inputSelector = '.govuk-js-password-input-input'
const buttonSelector = '.govuk-js-password-input-toggle'
const statusSelector = '.govuk-password-input__sr-status'

describe('/components/password-input', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('password-input')
  })

  describe('/components/password-input/preview', () => {
    describe('when JavaScript is unavailable or fails', () => {
      beforeAll(async () => {
        await page.setJavaScriptEnabled(false)
      })

      afterAll(async () => {
        await page.setJavaScriptEnabled(true)
      })

      it('still renders an unmodified password input', async () => {
        await render(page, 'password-input', examples.default)

        const inputType = await page.$eval(inputSelector, (el) =>
          el.getAttribute('type')
        )
        expect(inputType).toBe('password')
      })

      it('renders the toggle button hidden', async () => {
        await render(page, 'password-input', examples.default)

        const buttonHiddenAttribute = await page.$eval(buttonSelector, (el) =>
          el.hasAttribute('hidden')
        )
        expect(buttonHiddenAttribute).toBeTruthy()
      })
    })

    describe('when JavaScript is available', () => {
      describe('on page load', () => {
        beforeAll(async () => {
          await render(page, 'password-input', examples.default)
        })

        it('renders the status element', async () => {
          const statusElement = await page.$eval(statusSelector, (el) => el)

          expect(statusElement).toBeDefined()
        })

        it('renders the status element with aria-live', async () => {
          const statusAriaLiveAttribute = await page.$eval(
            statusSelector,
            (el) => el.getAttribute('aria-live')
          )

          expect(statusAriaLiveAttribute).toBe('polite')
        })

        it('renders the status element empty', async () => {
          const statusText = await page.$eval(statusSelector, (el) =>
            el.innerHTML.trim()
          )

          expect(statusText).toBe('')
        })

        it('shows the toggle button', async () => {
          const buttonHiddenAttribute = await page.$eval(buttonSelector, (el) =>
            el.hasAttribute('hidden')
          )

          expect(buttonHiddenAttribute).toBeFalsy()
        })
      })

      describe.each([
        [1, itShowsThePassword],
        [2, itHidesThePassword],
        [3, itShowsThePassword]
      ])('when clicked %i time(s)', (clicks, expectation) => {
        beforeAll(async () => {
          await render(page, 'password-input', examples.default)
          for (let i = 0; i < clicks; i++) {
            await page.click(buttonSelector)
          }
        })

        expectation()
      })

      describe('when the form is submitted', () => {
        it('reverts the input back to password type', async () => {
          // Go to the full-page example
          await goTo(page, `/full-page-examples/update-your-account-details`)

          // Prevent form submissions so that we don't navigate away during the test
          await page.evaluate(() => {
            document.addEventListener('submit', (e) => e.preventDefault())
          })

          // Type something into the email field
          await page.type('[type="email"]', 'test@example.com')

          // Type something into the password field
          await page.type('[type="password"]', 'Hunter2')

          // Click the "show" button so the password is visible in plain text
          await page.click(buttonSelector)

          // Check that the type change has occurred as expected
          const beforeSubmitType = await page.$eval(inputSelector, (el) =>
            el.getAttribute('type')
          )

          // Submit the form
          await page.click('[type="submit"]')

          // Check the input type again
          const afterSubmitType = await page.$eval(inputSelector, (el) =>
            el.getAttribute('type')
          )

          expect(beforeSubmitType).toBe('text')
          expect(afterSubmitType).toBe('password')
        })
      })

      describe('i18n', () => {
        it('uses the correct translations when the password is visible', async () => {
          await render(page, 'password-input', examples['with translations'])
          await page.click(buttonSelector)

          const statusText = await page.$eval(statusSelector, (el) =>
            el.innerHTML.trim()
          )
          const buttonText = await page.$eval(buttonSelector, (el) =>
            el.innerHTML.trim()
          )
          const buttonAriaLabel = await page.$eval(buttonSelector, (el) =>
            el.getAttribute('aria-label')
          )

          // Expect: passwordShownAnnouncementText
          expect(statusText).toBe('Mae eich cyfrinair yn weladwy.')

          // Expect: hidePasswordText
          expect(buttonText).toBe('Cuddio')

          // Expect: hidePasswordAriaLabelText
          expect(buttonAriaLabel).toBe('Cuddio cyfrinair')
        })

        it('uses the correct translations when the password is hidden', async () => {
          await render(page, 'password-input', examples['with translations'])

          // This test clicks the toggle twice because the status element is not populated when
          // the component is initialised, it only becomes populated after the first toggle.
          await page.click(buttonSelector)
          await page.click(buttonSelector)

          const statusText = await page.$eval(statusSelector, (el) =>
            el.innerHTML.trim()
          )
          const buttonText = await page.$eval(buttonSelector, (el) =>
            el.innerHTML.trim()
          )
          const buttonAriaLabel = await page.$eval(buttonSelector, (el) =>
            el.getAttribute('aria-label')
          )

          // Expect: passwordHiddenAnnouncementText
          expect(statusText).toBe("Mae eich cyfrinair wedi'i guddio.")

          // Expect: showPasswordText
          expect(buttonText).toBe('Datguddia')

          // Expect: showPasswordAriaLabelText
          expect(buttonAriaLabel).toBe('Datgelu cyfrinair')
        })
      })

      describe('errors at instantiation', () => {
        it('can throw a SupportError if appropriate', async () => {
          await expect(
            render(page, 'password-input', examples.default, {
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
            render(page, 'password-input', examples.default, {
              beforeInitialisation($module) {
                $module.remove()
              }
            })
          ).rejects.toMatchObject({
            cause: {
              name: 'ElementError',
              message: 'Password input: Root element (`$module`) not found'
            }
          })
        })

        it('throws when receiving the wrong type for $module', async () => {
          await expect(
            render(page, 'password-input', examples.default, {
              beforeInitialisation($module) {
                // Replace with an `<svg>` element which is not an `HTMLElement` in the DOM (but an `SVGElement`)
                $module.outerHTML = `<svg data-module="govuk-password-input"></svg>`
              }
            })
          ).rejects.toMatchObject({
            cause: {
              name: 'ElementError',
              message:
                'Password input: Root element (`$module`) is not of type HTMLElement'
            }
          })
        })

        it('throws when the input element is missing', async () => {
          await expect(
            render(page, 'password-input', examples.default, {
              beforeInitialisation($module, { selector }) {
                $module.querySelector(selector).remove()
              },
              context: {
                selector: inputSelector
              }
            })
          ).rejects.toMatchObject({
            cause: {
              name: 'ElementError',
              message:
                'Password input: Form field (`.govuk-js-password-input-input`) not found'
            }
          })
        })

        it('throws when the input is not an <input> element', async () => {
          await expect(
            render(page, 'password-input', examples.default, {
              beforeInitialisation($module, { selector }) {
                // Replace the input with a textarea
                $module.querySelector(selector).outerHTML =
                  '<textarea class="govuk-js-password-input-input"></textarea>'
              },
              context: {
                selector: inputSelector
              }
            })
          ).rejects.toMatchObject({
            cause: {
              name: 'ElementError',
              message:
                'Password input: Form field (`.govuk-js-password-input-input`) is not of type HTMLInputElement'
            }
          })
        })

        it('throws when the input is not a `password` type', async () => {
          await expect(
            render(page, 'password-input', examples.default, {
              beforeInitialisation($module, { selector }) {
                // Make the input a number input instead
                $module.querySelector(selector).setAttribute('type', 'number')
              },
              context: {
                selector: inputSelector
              }
            })
          ).rejects.toMatchObject({
            cause: {
              name: 'ElementError',
              message:
                'Password input: Form field (`.govuk-js-password-input-input`) must be of type `password`.'
            }
          })
        })

        it('throws when the button is missing', async () => {
          await expect(
            render(page, 'password-input', examples.default, {
              beforeInitialisation($module, { selector }) {
                $module.querySelector(selector).remove()
              },
              context: {
                selector: buttonSelector
              }
            })
          ).rejects.toMatchObject({
            cause: {
              name: 'ElementError',
              message:
                'Password input: Button (`.govuk-js-password-input-toggle`) not found'
            }
          })
        })

        it('throws when the button is not a <button> element', async () => {
          await expect(
            render(page, 'password-input', examples.default, {
              beforeInitialisation($module, { selector }) {
                // Replace the button with a <div>
                $module.querySelector(selector).outerHTML =
                  '<div class="govuk-js-password-input-toggle"></div>'
              },
              context: {
                selector: buttonSelector
              }
            })
          ).rejects.toMatchObject({
            cause: {
              name: 'ElementError',
              message:
                'Password input: Button (`.govuk-js-password-input-toggle`) is not of type HTMLButtonElement'
            }
          })
        })

        it('throws when the button is not a `button` type', async () => {
          await expect(
            render(page, 'password-input', examples.default, {
              beforeInitialisation($module, { selector }) {
                // Make the button a submit button
                $module.querySelector(selector).setAttribute('type', 'submit')
              },
              context: {
                selector: buttonSelector
              }
            })
          ).rejects.toMatchObject({
            cause: {
              name: 'ElementError',
              message:
                'Password input: Button (`.govuk-js-password-input-toggle`) must be of type `button`.'
            }
          })
        })
      })
    })
  })
})

// A bundle of tests for when the password has been shown via a user interaction.
// It's been extracted out as multiple tests check for this state.
function itShowsThePassword() {
  it('changes the input to type="text"', async () => {
    const inputType = await page.$eval(inputSelector, (el) =>
      el.getAttribute('type')
    )

    expect(inputType).toBe('text')
  })

  it('changes the status to aria-live="polite"', async () => {
    const statusAriaLiveAttribute = await page.$eval(statusSelector, (el) =>
      el.getAttribute('aria-live')
    )

    expect(statusAriaLiveAttribute).toBe('polite')
  })

  it('changes the status to say the password is visible', async () => {
    const statusText = await page.$eval(statusSelector, (el) =>
      el.innerHTML.trim()
    )

    expect(statusText).toBe('Your password is visible')
  })

  it('changes the button text to "hide"', async () => {
    const buttonText = await page.$eval(buttonSelector, (el) =>
      el.innerHTML.trim()
    )

    expect(buttonText).toBe('Hide')
  })

  it('changes the button aria-label to "hide password"', async () => {
    const buttonAriaLabel = await page.$eval(buttonSelector, (el) =>
      el.getAttribute('aria-label')
    )

    expect(buttonAriaLabel).toBe('Hide password')
  })
}

// A bundle of tests for when the password has been hidden via a user interaction.
// (Note: NOT when the component is initially loaded.)
// It's been extracted out as multiple tests check for this state.
function itHidesThePassword() {
  it('changes the input to type="password"', async () => {
    const inputType = await page.$eval(inputSelector, (el) =>
      el.getAttribute('type')
    )

    expect(inputType).toBe('password')
  })

  it('changes the status to say the password is hidden', async () => {
    const statusText = await page.$eval(statusSelector, (el) =>
      el.innerHTML.trim()
    )

    expect(statusText).toBe('Your password is hidden')
  })

  it('changes the button text to "show"', async () => {
    const buttonText = await page.$eval(buttonSelector, (el) =>
      el.innerHTML.trim()
    )

    expect(buttonText).toBe('Show')
  })

  it('changes the button aria-label to "show password"', async () => {
    const buttonAriaLabel = await page.$eval(buttonSelector, (el) =>
      el.getAttribute('aria-label')
    )

    expect(buttonAriaLabel).toBe('Show password')
  })
}
