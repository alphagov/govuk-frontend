const { render, goTo } = require('@govuk-frontend/helpers/puppeteer')
const { getExamples } = require('@govuk-frontend/lib/components')

const inputClass = '.govuk-js-password-input-input'
const buttonClass = '.govuk-js-password-input-toggle'
const statusClass = '.govuk-password-input__sr-status'

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

        const inputType = await page.evaluate(
          (inputClass) =>
            document.querySelector(inputClass).getAttribute('type'),
          inputClass
        )

        expect(inputType).toEqual('password')
      })

      it('renders the toggle button hidden', async () => {
        await render(page, 'password-input', examples.default)

        const buttonHiddenAttribute = await page.evaluate(
          (buttonClass) =>
            document.querySelector(buttonClass).hasAttribute('hidden'),
          buttonClass
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
          const statusElement = await page.evaluate(
            (statusClass) => document.querySelector(statusClass),
            statusClass
          )

          expect(statusElement).not.toBeUndefined()
        })

        it('renders the status element without aria-live', async () => {
          const statusAriaLiveAttribute = await page.evaluate(
            (statusClass) =>
              document.querySelector(statusClass).hasAttribute('aria-live'),
            statusClass
          )

          expect(statusAriaLiveAttribute).toBeFalsy()
        })

        it('renders the status element empty', async () => {
          const statusText = await page.evaluate(
            (statusClass) =>
              document.querySelector(statusClass).innerHTML.trim(),
            statusClass
          )

          expect(statusText).toEqual('')
        })

        it('shows the toggle button', async () => {
          const buttonHiddenAttribute = await page.evaluate(
            (buttonClass) =>
              document.querySelector(buttonClass).hasAttribute('hidden'),
            buttonClass
          )

          expect(buttonHiddenAttribute).toBeFalsy()
        })
      })

      describe('when the toggle button is clicked once', () => {
        beforeAll(async () => {
          await render(page, 'password-input', examples.default)
          await page.click(buttonClass)
        })

        it('changes the input to type="text"', async () => {
          const inputType = await page.evaluate(
            (inputClass) =>
              document.querySelector(inputClass).getAttribute('type'),
            inputClass
          )

          expect(inputType).toEqual('text')
        })

        it('changes the status to aria-live="assertive"', async () => {
          const statusAriaLiveAttribute = await page.evaluate(
            (statusClass) =>
              document.querySelector(statusClass).getAttribute('aria-live'),
            statusClass
          )

          expect(statusAriaLiveAttribute).toEqual('assertive')
        })

        it('changes the status to say the password is visible', async () => {
          const statusText = await page.evaluate(
            (statusClass) =>
              document.querySelector(statusClass).innerHTML.trim(),
            statusClass
          )

          expect(statusText).toEqual('Your password is visible')
        })

        it('changes the button text to "hide"', async () => {
          const buttonText = await page.evaluate(
            (buttonClass) =>
              document.querySelector(buttonClass).innerHTML.trim(),
            buttonClass
          )

          expect(buttonText).toEqual('Hide')
        })

        it('changes the button aria-label to "hide password"', async () => {
          const buttonAriaLabel = await page.evaluate(
            (buttonClass) =>
              document.querySelector(buttonClass).getAttribute('aria-label'),
            buttonClass
          )

          expect(buttonAriaLabel).toEqual('Hide password')
        })
      })

      describe('when the toggle button is clicked twice', () => {
        beforeAll(async () => {
          await render(page, 'password-input', examples.default)
          await page.click(buttonClass)
          await page.click(buttonClass)
        })

        it('changes the input to type="password"', async () => {
          const inputType = await page.evaluate(
            (inputClass) =>
              document.querySelector(inputClass).getAttribute('type'),
            inputClass
          )

          expect(inputType).toEqual('password')
        })

        it('changes the status to say the password is hidden', async () => {
          const statusText = await page.evaluate(
            (statusClass) =>
              document.querySelector(statusClass).innerHTML.trim(),
            statusClass
          )

          expect(statusText).toEqual('Your password is hidden')
        })

        it('changes the button text to "show"', async () => {
          const buttonText = await page.evaluate(
            (buttonClass) =>
              document.querySelector(buttonClass).innerHTML.trim(),
            buttonClass
          )

          expect(buttonText).toEqual('Show')
        })

        it('changes the button aria-label to "show password"', async () => {
          const buttonAriaLabel = await page.evaluate(
            (buttonClass) =>
              document.querySelector(buttonClass).getAttribute('aria-label'),
            buttonClass
          )

          expect(buttonAriaLabel).toEqual('Show password')
        })
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
          await page.click(buttonClass)

          // Check that the type change has occurred as expected
          const beforeSubmitType = await page.evaluate(
            (inputClass) =>
              document.querySelector(inputClass).getAttribute('type'),
            inputClass
          )

          // Submit the form
          await page.click('[type="submit"]')

          // Check the input type again
          const afterSubmitType = await page.evaluate(
            (inputClass) =>
              document.querySelector(inputClass).getAttribute('type'),
            inputClass
          )

          expect(beforeSubmitType).toEqual('text')
          expect(afterSubmitType).toEqual('password')
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
                selector: inputClass
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

        it('throws when the input element is not the right type', async () => {
          await expect(
            render(page, 'password-input', examples.default, {
              beforeInitialisation($module, { selector }) {
                // Replace the input with a textarea
                $module.querySelector(selector).outerHTML =
                  '<textarea class="govuk-js-password-input-input"></textarea>'
              },
              context: {
                selector: inputClass
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

        it('throws when the button is missing', async () => {
          await expect(
            render(page, 'password-input', examples.default, {
              beforeInitialisation($module, { selector }) {
                $module.querySelector(selector).remove()
              },
              context: {
                selector: buttonClass
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

        it('throws when the button is not the right type', async () => {
          await expect(
            render(page, 'password-input', examples.default, {
              beforeInitialisation($module, { selector }) {
                // Replace the button with a <div>
                $module.querySelector(selector).outerHTML =
                  '<div class="govuk-js-password-input-toggle"></div>'
              },
              context: {
                selector: buttonClass
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
      })
    })
  })
})
