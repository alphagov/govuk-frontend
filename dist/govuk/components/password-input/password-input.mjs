import { closestAttributeValue } from '../../common/closest-attribute-value.mjs';
import { mergeConfigs, validateConfig, extractConfigByNamespace } from '../../common/index.mjs';
import { normaliseDataset } from '../../common/normalise-dataset.mjs';
import { ElementError, ConfigError } from '../../errors/index.mjs';
import { GOVUKFrontendComponent } from '../../govuk-frontend-component.mjs';
import { I18n } from '../../i18n.mjs';

/**
 * Password input component
 *
 * @preserve
 */
class PasswordInput extends GOVUKFrontendComponent {
  /**
   * @param {Element} $module - HTML element to use for password input
   * @param {PasswordInputConfig} [config] - Password input config
   */
  constructor($module, config = {}) {
    super();
    this.config = void 0;
    this.$showHideButton = null;
    this.$statusText = null;
    if (!($module instanceof HTMLElement)) {
      throw new ElementError({
        componentName: 'Password input',
        element: $module,
        identifier: 'Root element (`$module`)'
      });
    }
    this.$wrapper = $module;
    this.$input = $module.querySelector('input');
    if (!(this.$input instanceof HTMLInputElement)) {
      throw new ElementError({
        componentName: 'Password input',
        element: this.$input,
        expectedType: 'HTMLInputElement',
        identifier: 'Form field (`.govuk-password-input`)'
      });
    }
    this.config = mergeConfigs(PasswordInput.defaults, config, normaliseDataset($module.dataset));
    const errors = validateConfig(PasswordInput.schema, this.config);
    if (errors[0]) {
      throw new ConfigError(`Password input: ${errors[0]}`);
    }
    this.i18n = new I18n(extractConfigByNamespace(this.config, 'i18n'), {
      locale: closestAttributeValue($module, 'lang')
    });
    this.$showHideButton = document.createElement('button');
    this.$showHideButton.className = 'govuk-button govuk-button--secondary govuk-password-input__toggle';
    this.$showHideButton.setAttribute('aria-controls', this.$input.id);
    this.$showHideButton.setAttribute('type', 'button');
    this.$showHideButton.setAttribute('aria-label', this.i18n.t('showPasswordAriaLabel'));
    this.$showHideButton.innerHTML = this.i18n.t('showPassword');
    this.$wrapper.insertBefore(this.$showHideButton, this.$input.nextSibling);
    this.$statusText = document.createElement('span');
    this.$statusText.className = 'govuk-visually-hidden';
    this.$statusText.innerText = this.i18n.t('passwordHiddenAnnouncement');
    this.$statusText.setAttribute('aria-live', 'polite');
    this.$wrapper.insertBefore(this.$statusText, this.$input.nextSibling);
    this.$showHideButton.addEventListener('click', this.togglePassword.bind(this));
    if (this.$input.form && !this.config.disableFormSubmitCheck) {
      this.$input.form.addEventListener('submit', () => this.revertToPasswordOnFormSubmit());
    }
  }

  /**
   * @param {MouseEvent} event -
   */
  togglePassword(event) {
    event.preventDefault();
    if (!this.$showHideButton || !this.$statusText) {
      return;
    }
    this.$input.setAttribute('type', this.$input.type === 'password' ? 'text' : 'password');
    const passwordIsHidden = this.$input.type === 'password';
    this.$showHideButton.innerHTML = passwordIsHidden ? this.i18n.t('showPassword') : this.i18n.t('hidePassword');
    this.$showHideButton.setAttribute('aria-label', passwordIsHidden ? this.i18n.t('showPasswordAriaLabel') : this.i18n.t('hidePasswordAriaLabel'));
    this.$statusText.innerText = passwordIsHidden ? this.i18n.t('passwordHiddenAnnouncement') : this.i18n.t('passwordShownAnnouncement');
  }
  revertToPasswordOnFormSubmit() {
    if (!this.$showHideButton || !this.$statusText) {
      return;
    }
    this.$showHideButton.setAttribute('aria-label', this.i18n.t('showPasswordAriaLabel'));
    this.$showHideButton.innerHTML = this.i18n.t('showPassword');
    this.$statusText.innerText = this.i18n.t('passwordHiddenAnnouncement');
    this.$input.setAttribute('type', 'password');
  }
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
PasswordInput.moduleName = 'govuk-password-input';
PasswordInput.defaults = Object.freeze({
  disableFormSubmitCheck: false,
  i18n: {
    showPassword: 'Show',
    hidePassword: 'Hide',
    showPasswordAriaLabel: 'Show password',
    hidePasswordAriaLabel: 'Hide password',
    passwordShownAnnouncement: 'Your password is visible',
    passwordHiddenAnnouncement: 'Your password is hidden'
  }
});
PasswordInput.schema = Object.freeze({});

export { PasswordInput };
//# sourceMappingURL=password-input.mjs.map
