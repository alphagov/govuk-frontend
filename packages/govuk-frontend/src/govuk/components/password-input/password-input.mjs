import { ElementError } from '../../errors/index.mjs'
import { GOVUKFrontendComponent } from '../../govuk-frontend-component.mjs'

/**
 * Password input component
 *
 * @preserve
 */
export class PasswordInput extends GOVUKFrontendComponent {
  /** @private */
  $module

  /** @private */
  $input

  /** @private */
  $buttonShow

  /** @private */
  $buttonHide

  /**
   * @param {Element} $module - HTML element to use for password input
   */
  constructor($module) {
    super()

    if (!($module instanceof HTMLElement)) {
      throw new ElementError({
        componentName: 'Password input',
        element: $module,
        identifier: 'Root element (`$module`)'
      })
    }

    const $input = $module.querySelector('.govuk-js-password-input')
    if (!($input instanceof HTMLInputElement)) {
      throw new ElementError({
        componentName: 'Password input',
        element: $input,
        expectedType: 'HTMLInputElement',
        identifier: 'Form field (`.govuk-js-password-input`)'
      })
    }

    const $buttonShow = $module.querySelector('.govuk-js-password-input-show')
    if (!($buttonShow instanceof HTMLButtonElement)) {
      throw new ElementError({
        componentName: 'Password input',
        element: $buttonShow,
        expectedType: 'HTMLButtonElement',
        identifier: 'Button (`.govuk-js-password-input-show`)'
      })
    }

    const $buttonHide = $module.querySelector('.govuk-js-password-input-hide')
    if (!($buttonHide instanceof HTMLButtonElement)) {
      throw new ElementError({
        componentName: 'Password input',
        element: $buttonHide,
        expectedType: 'HTMLButtonElement',
        identifier: 'Button (`.govuk-js-password-input-hide`)'
      })
    }

    this.$module = $module
    this.$input = $input
    this.$buttonShow = $buttonShow
    this.$buttonHide = $buttonHide

    // Toggle between buttons on click
    this.$buttonShow.addEventListener('click', (event) => this.show(event))
    this.$buttonHide.addEventListener('click', (event) => this.hide(event))

    // Hide password on form submit
    this.$input.form?.addEventListener('submit', () => this.hide())

    // Default to hide password
    this.hide()
  }

  /**
   * Show password
   *
   * @param {MouseEvent} [event] - Click event (optional)
   */
  show(event) {
    event?.preventDefault()

    // Show password
    this.$input.setAttribute('type', 'text')

    // Switch to the hide button
    this.$buttonShow.setAttribute('hidden', '')
    this.$buttonHide.removeAttribute('hidden')
  }

  /**
   * Hide password
   *
   * @param {MouseEvent} [event] - Click event (optional)
   */
  hide(event) {
    event?.preventDefault()

    // Hide password
    this.$input.setAttribute('type', 'password')

    // Switch to the show button
    this.$buttonHide.setAttribute('hidden', '')
    this.$buttonShow.removeAttribute('hidden')
  }

  /**
   * Name for the component used when initialising using data-module attributes.
   */
  static moduleName = 'govuk-password-input'
}
