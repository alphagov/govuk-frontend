import { closestAttributeValue } from '../../common/closest-attribute-value.mjs';
import { ConfigurableComponent } from '../../common/configuration.mjs';
import { ElementError } from '../../errors/index.mjs';
import { I18n } from '../../i18n.mjs';

/**
 * Password input component
 *
 * @preserve
 * @augments ConfigurableComponent<PasswordInputConfig>
 */
class PasswordInput extends ConfigurableComponent {
  /**
   * @param {Element | null} $root - HTML element to use for password input
   * @param {PasswordInputConfig} [config] - Password input config
   */
  constructor($root, config = {}) {
    super($root, config);
    this.i18n = void 0;
    this.$input = void 0;
    this.$showHideButton = void 0;
    this.$screenReaderStatusMessage = void 0;
    const $input = this.$root.querySelector('.govuk-js-password-input-input');
    if (!($input instanceof HTMLInputElement)) {
      throw new ElementError({
        component: PasswordInput,
        element: $input,
        expectedType: 'HTMLInputElement',
        identifier: 'Form field (`.govuk-js-password-input-input`)'
      });
    }
    if ($input.type !== 'password') {
      throw new ElementError('Password input: Form field (`.govuk-js-password-input-input`) must be of type `password`.');
    }
    const $showHideButton = this.$root.querySelector('.govuk-js-password-input-toggle');
    if (!($showHideButton instanceof HTMLButtonElement)) {
      throw new ElementError({
        component: PasswordInput,
        element: $showHideButton,
        expectedType: 'HTMLButtonElement',
        identifier: 'Button (`.govuk-js-password-input-toggle`)'
      });
    }
    if ($showHideButton.type !== 'button') {
      throw new ElementError('Password input: Button (`.govuk-js-password-input-toggle`) must be of type `button`.');
    }
    this.$input = $input;
    this.$showHideButton = $showHideButton;
    this.i18n = new I18n(this.config.i18n, {
      locale: closestAttributeValue(this.$root, 'lang')
    });
    this.$showHideButton.removeAttribute('hidden');
    const $screenReaderStatusMessage = document.createElement('div');
    $screenReaderStatusMessage.className = 'govuk-password-input__sr-status govuk-visually-hidden';
    $screenReaderStatusMessage.setAttribute('aria-live', 'polite');
    this.$screenReaderStatusMessage = $screenReaderStatusMessage;
    this.$input.insertAdjacentElement('afterend', $screenReaderStatusMessage);
    this.$showHideButton.addEventListener('click', this.toggle.bind(this));
    if (this.$input.form) {
      this.$input.form.addEventListener('submit', () => this.hide());
    }
    window.addEventListener('pageshow', event => {
      if (event.persisted && this.$input.type !== 'password') {
        this.hide();
      }
    });
    this.hide();
  }
  toggle(event) {
    event.preventDefault();
    if (this.$input.type === 'password') {
      this.show();
      return;
    }
    this.hide();
  }
  show() {
    this.setType('text');
  }
  hide() {
    this.setType('password');
  }
  setType(type) {
    if (type === this.$input.type) {
      return;
    }
    this.$input.setAttribute('type', type);
    const isHidden = type === 'password';
    const prefixButton = isHidden ? 'show' : 'hide';
    const prefixStatus = isHidden ? 'passwordHidden' : 'passwordShown';
    this.$showHideButton.innerText = this.i18n.t(`${prefixButton}Password`);
    this.$showHideButton.setAttribute('aria-label', this.i18n.t(`${prefixButton}PasswordAriaLabel`));
    this.$screenReaderStatusMessage.innerText = this.i18n.t(`${prefixStatus}Announcement`);
  }
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
 *   password is currently hidden. Plain text only.
 * @property {string} [hidePassword] - Visible text of the button when the
 *   password is currently visible. Plain text only.
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
 * @typedef {import('../../common/configuration.mjs').Schema} Schema
 * @typedef {import('../../i18n.mjs').TranslationPluralForms} TranslationPluralForms
 */
PasswordInput.moduleName = 'govuk-password-input';
PasswordInput.defaults = Object.freeze({
  i18n: {
    showPassword: 'Show',
    hidePassword: 'Hide',
    showPasswordAriaLabel: 'Show password',
    hidePasswordAriaLabel: 'Hide password',
    passwordShownAnnouncement: 'Your password is visible',
    passwordHiddenAnnouncement: 'Your password is hidden'
  }
});
PasswordInput.schema = Object.freeze({
  properties: {
    i18n: {
      type: 'object'
    }
  }
});

export { PasswordInput };
//# sourceMappingURL=password-input.mjs.map
