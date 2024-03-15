import { closestAttributeValue } from '../../common/closest-attribute-value.mjs'
import { mergeConfigs } from '../../common/index.mjs'
import { normaliseDataset } from '../../common/normalise-dataset.mjs'
import { ElementError } from '../../errors/index.mjs'
import { GOVUKFrontendComponent } from '../../govuk-frontend-component.mjs'
import { I18n } from '../../i18n.mjs'

/**
 * Password input component
 *
 * @preserve
 */
export class PasswordInput extends GOVUKFrontendComponent {
  /** @private */
  $module

  /**
   * @private
   * @type {PasswordInputConfig}
   */
  config

  /** @private */
  i18n

  /**
   * @private
   * @type {HTMLInputElement}
   */
  $input

  /**
   * @private
   * @type {HTMLButtonElement}
   */
  $showHideButton

  /** @private */
  $screenReaderStatusMessage

  /**
   * @param {Element | null} $module - HTML element to use for password input
   * @param {PasswordInputConfig} [config] - Password input config
   */
  constructor($module, config = {}) {
    super()

    if (!($module instanceof HTMLElement)) {
      throw new ElementError({
        componentName: 'Password input',
        element: $module,
        identifier: 'Root element (`$module`)'
      })
    }

    const $input = $module.querySelector('.govuk-js-password-input-input')
    if (!($input instanceof HTMLInputElement)) {
      throw new ElementError({
        componentName: 'Password input',
        element: $input,
        expectedType: 'HTMLInputElement',
        identifier: 'Form field (`.govuk-js-password-input-input`)'
      })
    }

    if ($input.type !== 'password') {
      throw new ElementError(
        'Password input: Form field (`.govuk-js-password-input-input`) must be of type `password`.'
      )
    }

    const $showHideButton = $module.querySelector(
      '.govuk-js-password-input-toggle'
    )
    if (!($showHideButton instanceof HTMLButtonElement)) {
      throw new ElementError({
        componentName: 'Password input',
        element: $showHideButton,
        expectedType: 'HTMLButtonElement',
        identifier: 'Button (`.govuk-js-password-input-toggle`)'
      })
    }

    if ($showHideButton.type !== 'button') {
      throw new ElementError(
        'Password input: Button (`.govuk-js-password-input-toggle`) must be of type `button`.'
      )
    }

    this.$module = $module
    this.$input = $input
    this.$showHideButton = $showHideButton

    this.config = mergeConfigs(
      PasswordInput.defaults,
      config,
      normaliseDataset(PasswordInput, $module.dataset)
    )

    this.i18n = new I18n(this.config.i18n, {
      // Read the fallback if necessary rather than have it set in the defaults
      locale: closestAttributeValue($module, 'lang')
    })

    // Show the toggle button element
    this.$showHideButton.removeAttribute('hidden')

    // Create and append the status text for screen readers.
    // This is injected between the input and button so that users get a sensible reading order if
    // moving through the page content linearly:
    // [password input] -> [your password is visible/hidden] -> [show/hide password]
    const $screenReaderStatusMessage = document.createElement('div')
    $screenReaderStatusMessage.className =
      'govuk-password-input__sr-status govuk-visually-hidden'
    $screenReaderStatusMessage.setAttribute('aria-live', 'polite')
    this.$screenReaderStatusMessage = $screenReaderStatusMessage
    this.$input.insertAdjacentElement('afterend', $screenReaderStatusMessage)

    // Bind toggle button
    this.$showHideButton.addEventListener('click', this.toggle.bind(this))

    // Bind event to revert the password visibility to hidden
    if (this.$input.form) {
      this.$input.form.addEventListener('submit', () => this.hide())
    }

    // If the page is restored from bfcache and the password is visible, hide it again
    window.addEventListener('pageshow', (event) => {
      if (event.persisted && this.$input.type !== 'password') {
        this.hide()
      }
    })

    // Default the component to having the password hidden.
    this.hide()
  }

  /**
   * Toggle the visibility of the password input
   *
   * @private
   * @param {MouseEvent} event - Click event
   */
  toggle(event) {
    event.preventDefault()

    // If on this click, the field is type="password", show the value
    if (this.$input.type === 'password') {
      this.show()
      return
    }

    // Otherwise, hide it
    // Being defensive - hiding should always be the default
    this.hide()
  }

  /**
   * Show the password input value in plain text.
   *
   * @private
   */
  show() {
    this.setType('text')
  }

  /**
   * Hide the password input value.
   *
   * @private
   */
  hide() {
    this.setType('password')
  }

  /**
   * Set the password input type
   *
   * @param {'text' | 'password'} type - Input type
   * @private
   */
  setType(type) {
    if (type === this.$input.type) {
      return
    }

    // Update input type
    this.$input.setAttribute('type', type)

    const isHidden = type === 'password'
    const prefixButton = isHidden ? 'show' : 'hide'
    const prefixStatus = isHidden ? 'passwordHidden' : 'passwordShown'

    // Update button text
    this.$showHideButton.innerHTML = this.i18n.t(`${prefixButton}Password`)

    // Update button aria-label
    this.$showHideButton.setAttribute(
      'aria-label',
      this.i18n.t(`${prefixButton}PasswordAriaLabel`)
    )

    // Update status change text
    this.$screenReaderStatusMessage.innerText = this.i18n.t(
      `${prefixStatus}Announcement`
    )
  }

  /**
   * Name for the component used when initialising using data-module attributes.
   */
  static moduleName = 'govuk-password-input'

  /**
   * Password input default config
   *
   * @see {@link PasswordInputConfig}
   * @constant
   * @default
   * @type {PasswordInputConfig}
   */
  static defaults = Object.freeze({
    i18n: {
      showPassword: 'Show',
      hidePassword: 'Hide',
      showPasswordAriaLabel: 'Show password',
      hidePasswordAriaLabel: 'Hide password',
      passwordShownAnnouncement: 'Your password is visible',
      passwordHiddenAnnouncement: 'Your password is hidden'
    }
  })

  /**
   * Password input config schema
   *
   * @constant
   * @satisfies {Schema}
   */
  static schema = Object.freeze({
    properties: {
      i18n: { type: 'object' }
    }
  })
}

/**
 * Password input config
 *
 * @typedef {object} PasswordInputConfig
 * @property {PasswordInputTranslations} [i18n=PasswordInput.defaults.i18n] - Password input translations
 */

/**
 * Password input translations
 *
 * @see {@link PasswordInput.defaults.i18n}
 * @typedef {object} PasswordInputTranslations
 *
 * Messages displayed to the user indicating the state of the show/hide toggle.
 * @property {string} [showPassword] - Visible text of the button when the
 *   password is currently hidden. HTML is acceptable.
 * @property {string} [hidePassword] - Visible text of the button when the
 *   password is currently visible. HTML is acceptable.
 * @property {string} [showPasswordAriaLabel] - aria-label of the button when
 *   the password is currently hidden. Plain text only.
 * @property {string} [hidePasswordAriaLabel] - aria-label of the button when
 *   the password is currently visible. Plain text only.
 * @property {string} [passwordShownAnnouncement] - Screen reader
 *   announcement to make when the password has just become visible.
 *   Plain text only.
 * @property {string} [passwordHiddenAnnouncement] - Screen reader
 *   announcement to make when the password has just been hidden.
 *   Plain text only.
 */

/**
 * @typedef {import('../../common/index.mjs').Schema} Schema
 * @typedef {import('../../i18n.mjs').TranslationPluralForms} TranslationPluralForms
 */
