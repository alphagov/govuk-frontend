import { closestAttributeValue } from '../../common/closest-attribute-value.mjs'
import {
  extractConfigByNamespace,
  mergeConfigs,
  validateConfig
} from '../../common/index.mjs'
import { normaliseDataset } from '../../common/normalise-dataset.mjs'
import { ConfigError, ElementError } from '../../errors/index.mjs'
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

  /**
   * @private
   * @type {HTMLElement | null}
   */
  $showHideButton = null

  /**
   * @private
   * @type {HTMLElement | null}
   */
  $statusText = null

  /**
   * @param {Element} $module - HTML element to use for password input
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

    this.$wrapper = $module
    this.$input = $module.querySelector('input')

    if (!(this.$input instanceof HTMLInputElement)) {
      throw new ElementError({
        componentName: 'Password input',
        element: this.$input,
        expectedType: 'HTMLInputElement',
        identifier: 'Form field (`.govuk-password-input`)'
      })
    }

    this.config = mergeConfigs(
      PasswordInput.defaults,
      config || {},
      normaliseDataset($module.dataset)
    )

    // Check for valid config
    const errors = validateConfig(PasswordInput.schema, this.config)
    if (errors[0]) {
      throw new ConfigError(`Password input: ${errors[0]}`)
    }

    this.i18n = new I18n(extractConfigByNamespace(this.config, 'i18n'), {
      // Read the fallback if necessary rather than have it set in the defaults
      locale: closestAttributeValue($module, 'lang')
    })

    // Create and append the button element
    const $showHideButton = document.createElement('button')
    $showHideButton.className =
      'govuk-button govuk-button--secondary govuk-password-input__toggle'
    $showHideButton.setAttribute(
      'aria-controls',
      this.$input.getAttribute('id')
    )
    $showHideButton.setAttribute('type', 'button')
    $showHideButton.setAttribute(
      'aria-label',
      this.i18n.t('showPasswordAriaLabel')
    )
    $showHideButton.innerHTML = this.i18n.t('showPassword')
    this.$showHideButton = $showHideButton
    this.$wrapper.insertBefore($showHideButton, this.$input.nextSibling)

    // Create and append the status text for screen readers
    const $statusText = document.createElement('span')
    $statusText.className = 'govuk-visually-hidden'
    $statusText.innerText = this.i18n.t('passwordHiddenAnnouncement')
    $statusText.setAttribute('aria-live', 'polite')
    this.$statusText = $statusText
    this.$wrapper.insertBefore($statusText, this.$input.nextSibling)

    // Bind toggle button
    this.$showHideButton.addEventListener(
      'click',
      this.togglePassword.bind(this)
    )

    // Bind form submit check, unless it's been disabled
    if (this.$input.form && !this.config.disableFormSubmitCheck) {
      this.$input.form.addEventListener('submit', () =>
        this.revertToPasswordOnFormSubmit()
      )
    }
  }

  /**
   * @param {MouseEvent} event -
   */
  togglePassword(event) {
    event.preventDefault()
    this.$input.setAttribute(
      'type',
      this.$input.type === 'password' ? 'text' : 'password'
    )
    const passwordIsHidden = this.$input.type === 'password'
    this.$showHideButton.innerHTML = passwordIsHidden
      ? this.i18n.t('showPassword')
      : this.i18n.t('hidePassword')
    this.$showHideButton.setAttribute(
      'aria-label',
      passwordIsHidden
        ? this.i18n.t('showPasswordAriaLabel')
        : this.i18n.t('hidePasswordAriaLabel')
    )
    this.$statusText.innerText = passwordIsHidden
      ? this.i18n.t('passwordHiddenAnnouncement')
      : this.i18n.t('passwordShownAnnouncement')
  }

  /**
   * Revert the input to type=password when the form is submitted. This prevents
   * user agents potentially saving or caching the plain text password.
   */
  revertToPasswordOnFormSubmit() {
    this.$showHideButton.setAttribute(
      'aria-label',
      this.i18n.t('showPasswordAriaLabel')
    )
    this.$showHideButton.innerHTML = this.i18n.t('showPassword')
    this.$statusText.innerText = this.i18n.t('passwordHiddenAnnouncement')
    this.$input.setAttribute('type', 'password')
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
    disableFormSubmitCheck: false,
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
   * Character count config schema
   *
   * @constant
   * @satisfies {Schema}
   */
  static schema = Object.freeze({})
}

/**
 * Password input config
 *
 * @typedef {object} PasswordInputConfig
 * @property {boolean} [disableFormSubmitCheck=false] - If set to `true` the
 *   password input will not automatically change back to the `password` type
 *   upon submission of the parent form.
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
 */
