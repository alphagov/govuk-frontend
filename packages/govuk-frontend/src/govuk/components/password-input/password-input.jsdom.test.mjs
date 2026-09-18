import { ElementError } from '../../errors/index.mjs'

import { PasswordInput } from './password-input.mjs'

describe('PasswordInput', () => {
  beforeEach(() => {
    // Jest does not tidy the JSDOM document between tests
    // so we need to take care of that ourselves
    document.documentElement.innerHTML = ''
    document.body.classList.add('govuk-frontend-supported')
  })

  describe('errors at instantiation', () => {
    it('throws when the input is not a `password` type', () => {
      document.body.innerHTML = `
        <div data-module="govuk-password-input">
          <input class="govuk-js-password-input-input" type="number">
          <button class="govuk-js-password-input-toggle" type="button">Show</button>
        </div>
      `

      expect(
        () =>
          new PasswordInput(
            document.querySelector('[data-module="govuk-password-input"]')
          )
      ).toThrow(
        new ElementError(
          'govuk-password-input: Form field (`.govuk-js-password-input-input`) must be of type `password`.'
        )
      )
    })

    it('throws when the button is not a `button` type', () => {
      document.body.innerHTML = `
        <div data-module="govuk-password-input">
          <input class="govuk-js-password-input-input" type="password">
          <button class="govuk-js-password-input-toggle" type="submit">Show</button>
        </div>
      `

      expect(
        () =>
          new PasswordInput(
            document.querySelector('[data-module="govuk-password-input"]')
          )
      ).toThrow(
        new ElementError(
          'govuk-password-input: Button (`.govuk-js-password-input-toggle`) must be of type `button`.'
        )
      )
    })
  })
})
