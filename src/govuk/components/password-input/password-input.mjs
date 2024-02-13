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
  $statusText

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

    const $input = $module.querySelector('.govuk-js-password-input-input')
    if (!($input instanceof HTMLInputElement)) {
      throw new ElementError({
        componentName: 'Password input',
        element: $input,
        expectedType: 'HTMLInputElement',
        identifier: 'Form field (`.govuk-js-password-input-input`)'
      })
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

    this.$module = $module
    this.$input = $input
    this.$showHideButton = $showHideButton

    this.config = mergeConfigs(
      PasswordInput.defaults,
      config,
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

    // Show the toggle button element
    this.$showHideButton.removeAttribute('hidden')

    // Create and append the status text for screen readers.
    // This is injected between the input and button so that users get a sensible reading order if
    // moving through the page content linearly:
    // [password input] -> [your password is visible/hidden] -> [show/hide password]
    this.$statusText = document.createElement('span')
    this.$statusText.className = 'govuk-visually-hidden'
    this.$statusText.innerText = this.i18n.t('passwordHiddenAnnouncement')
    this.$statusText.setAttribute('aria-live', 'polite')
    this.$input.parentNode?.insertBefore(
      this.$statusText,
      this.$input.nextSibling
    )

    // Bind toggle button
    this.$showHideButton.addEventListener('click', this.toggle.bind(this))

    // Bind event to revert the password visibility to hidden, unless it's been explicitly disabled
    if (this.$input.form && !this.config.disableFormSubmitCheck) {
      this.$input.form.addEventListener('submit', () => this.hide())
    }

    // When the page is restored after navigating 'back' in some browsers the value of form
    // controls may be retained. This is undesirable in the case of passwords, as it may allow
    // a bad actor to view a previously entered password.
    //
    // Here we're intentionally clearing and resetting the component upon the page being loaded,
    // unless the input has explicitly had a value set.
    if (!this.$input.hasAttribute('value')) {
      window.addEventListener('pageshow', () => {
        this.hide()
        this.$input.value = ''
      })

      // The component may have been dynamically loaded, in which case `pageshow` may have
      // already passed, so run it again just in case.
      this.hide()
      this.$input.value = ''
    }
  }

  /**
   * Toggle the visibility of the password input
   *
   * @private
   * @param {MouseEvent} event -
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
    this.$input.setAttribute('type', 'text')
    this.$showHideButton.innerHTML = this.i18n.t('hidePassword')
    this.$showHideButton.setAttribute(
      'aria-label',
      this.i18n.t('hidePasswordAriaLabel')
    )
    this.$statusText.innerText = this.i18n.t('passwordShownAnnouncement')
  }

  /**
   * Hide the password input value.
   *
   * @private
   */
  hide() {
    this.$input.setAttribute('type', 'password')
    this.$showHideButton.innerHTML = this.i18n.t('showPassword')
    this.$showHideButton.setAttribute(
      'aria-label',
      this.i18n.t('showPasswordAriaLabel')
    )
    this.$statusText.innerText = this.i18n.t('passwordHiddenAnnouncement')
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
