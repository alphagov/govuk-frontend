(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.GOVUKFrontend = {}));
})(this, (function (exports) { 'use strict';

  function closestAttributeValue($element, attributeName) {
    const $closestElementWithAttribute = $element.closest(`[${attributeName}]`);
    return $closestElementWithAttribute ? $closestElementWithAttribute.getAttribute(attributeName) : null;
  }

  function mergeConfigs(...configObjects) {
    function flattenObject(configObject) {
      const flattenedObject = {};
      function flattenLoop(obj, prefix) {
        for (const [key, value] of Object.entries(obj)) {
          const prefixedKey = prefix ? `${prefix}.${key}` : key;
          if (value && typeof value === 'object') {
            flattenLoop(value, prefixedKey);
          } else {
            flattenedObject[prefixedKey] = value;
          }
        }
      }
      flattenLoop(configObject);
      return flattenedObject;
    }
    const formattedConfigObject = {};
    for (const configObject of configObjects) {
      const obj = flattenObject(configObject);
      for (const [key, value] of Object.entries(obj)) {
        formattedConfigObject[key] = value;
      }
    }
    return formattedConfigObject;
  }
  function extractConfigByNamespace(configObject, namespace) {
    const newObject = {};
    for (const [key, value] of Object.entries(configObject)) {
      const keyParts = key.split('.');
      if (keyParts[0] === namespace) {
        if (keyParts.length > 1) {
          keyParts.shift();
        }
        const newKey = keyParts.join('.');
        newObject[newKey] = value;
      }
    }
    return newObject;
  }
  function isSupported($scope = document.body) {
    if (!$scope) {
      return false;
    }
    return $scope.classList.contains('govuk-frontend-supported');
  }
  function validateConfig(schema, config) {
    const validationErrors = [];
    for (const [name, conditions] of Object.entries(schema)) {
      const errors = [];
      for (const {
        required,
        errorMessage
      } of conditions) {
        if (!required.every(key => !!config[key])) {
          errors.push(errorMessage);
        }
      }
      if (name === 'anyOf' && !(conditions.length - errors.length >= 1)) {
        validationErrors.push(...errors);
      }
    }
    return validationErrors;
  }

  /**
   * Schema for component config
   *
   * @typedef {object} Schema
   * @property {SchemaCondition[]} [anyOf] - List of schema conditions
   */

  /**
   * Schema condition for component config
   *
   * @typedef {object} SchemaCondition
   * @property {string[]} required - List of required config fields
   * @property {string} errorMessage - Error message when required config fields not provided
   */

  function normaliseString(value) {
    if (typeof value !== 'string') {
      return value;
    }
    const trimmedValue = value.trim();
    if (trimmedValue === 'true') {
      return true;
    }
    if (trimmedValue === 'false') {
      return false;
    }
    if (trimmedValue.length > 0 && isFinite(Number(trimmedValue))) {
      return Number(trimmedValue);
    }
    return value;
  }
  function normaliseDataset(dataset) {
    const out = {};
    for (const [key, value] of Object.entries(dataset)) {
      out[key] = normaliseString(value);
    }
    return out;
  }

  class GOVUKFrontendError extends Error {
    constructor(...args) {
      super(...args);
      this.name = 'GOVUKFrontendError';
    }
  }
  class SupportError extends GOVUKFrontendError {
    /**
     * Checks if GOV.UK Frontend is supported on this page
     *
     * @param {HTMLElement | null} [$scope] - HTML element `<body>` checked for browser support
     */
    constructor($scope = document.body) {
      const supportMessage = 'noModule' in HTMLScriptElement.prototype ? 'GOV.UK Frontend initialised without `<body class="govuk-frontend-supported">` from template `<script>` snippet' : 'GOV.UK Frontend is not supported in this browser';
      super($scope ? supportMessage : 'GOV.UK Frontend initialised without `<script type="module">`');
      this.name = 'SupportError';
    }
  }
  class ConfigError extends GOVUKFrontendError {
    constructor(...args) {
      super(...args);
      this.name = 'ConfigError';
    }
  }
  class ElementError extends GOVUKFrontendError {
    constructor(messageOrOptions) {
      let message = typeof messageOrOptions === 'string' ? messageOrOptions : '';
      if (typeof messageOrOptions === 'object') {
        const {
          componentName,
          identifier,
          element,
          expectedType
        } = messageOrOptions;
        message = `${componentName}: ${identifier}`;
        message += element ? ` is not of type ${expectedType != null ? expectedType : 'HTMLElement'}` : ' not found';
      }
      super(message);
      this.name = 'ElementError';
    }
  }

  class GOVUKFrontendComponent {
    constructor() {
      this.checkSupport();
    }
    checkSupport() {
      if (!isSupported()) {
        throw new SupportError();
      }
    }
  }

  class I18n {
    constructor(translations = {}, config = {}) {
      var _config$locale;
      this.translations = void 0;
      this.locale = void 0;
      this.translations = translations;
      this.locale = (_config$locale = config.locale) != null ? _config$locale : document.documentElement.lang || 'en';
    }
    t(lookupKey, options) {
      if (!lookupKey) {
        throw new Error('i18n: lookup key missing');
      }
      if (typeof (options == null ? void 0 : options.count) === 'number') {
        lookupKey = `${lookupKey}.${this.getPluralSuffix(lookupKey, options.count)}`;
      }
      const translationString = this.translations[lookupKey];
      if (typeof translationString === 'string') {
        if (translationString.match(/%{(.\S+)}/)) {
          if (!options) {
            throw new Error('i18n: cannot replace placeholders in string if no option data provided');
          }
          return this.replacePlaceholders(translationString, options);
        }
        return translationString;
      }
      return lookupKey;
    }
    replacePlaceholders(translationString, options) {
      const formatter = Intl.NumberFormat.supportedLocalesOf(this.locale).length ? new Intl.NumberFormat(this.locale) : undefined;
      return translationString.replace(/%{(.\S+)}/g, function (placeholderWithBraces, placeholderKey) {
        if (Object.prototype.hasOwnProperty.call(options, placeholderKey)) {
          const placeholderValue = options[placeholderKey];
          if (placeholderValue === false || typeof placeholderValue !== 'number' && typeof placeholderValue !== 'string') {
            return '';
          }
          if (typeof placeholderValue === 'number') {
            return formatter ? formatter.format(placeholderValue) : `${placeholderValue}`;
          }
          return placeholderValue;
        }
        throw new Error(`i18n: no data found to replace ${placeholderWithBraces} placeholder in string`);
      });
    }
    hasIntlPluralRulesSupport() {
      return Boolean('PluralRules' in window.Intl && Intl.PluralRules.supportedLocalesOf(this.locale).length);
    }
    getPluralSuffix(lookupKey, count) {
      count = Number(count);
      if (!isFinite(count)) {
        return 'other';
      }
      const preferredForm = this.hasIntlPluralRulesSupport() ? new Intl.PluralRules(this.locale).select(count) : this.selectPluralFormUsingFallbackRules(count);
      if (`${lookupKey}.${preferredForm}` in this.translations) {
        return preferredForm;
      } else if (`${lookupKey}.other` in this.translations) {
        console.warn(`i18n: Missing plural form ".${preferredForm}" for "${this.locale}" locale. Falling back to ".other".`);
        return 'other';
      }
      throw new Error(`i18n: Plural form ".other" is required for "${this.locale}" locale`);
    }
    selectPluralFormUsingFallbackRules(count) {
      count = Math.abs(Math.floor(count));
      const ruleset = this.getPluralRulesForLocale();
      if (ruleset) {
        return I18n.pluralRules[ruleset](count);
      }
      return 'other';
    }
    getPluralRulesForLocale() {
      const localeShort = this.locale.split('-')[0];
      for (const pluralRule in I18n.pluralRulesMap) {
        const languages = I18n.pluralRulesMap[pluralRule];
        if (languages.includes(this.locale) || languages.includes(localeShort)) {
          return pluralRule;
        }
      }
    }
  }
  I18n.pluralRulesMap = {
    arabic: ['ar'],
    chinese: ['my', 'zh', 'id', 'ja', 'jv', 'ko', 'ms', 'th', 'vi'],
    french: ['hy', 'bn', 'fr', 'gu', 'hi', 'fa', 'pa', 'zu'],
    german: ['af', 'sq', 'az', 'eu', 'bg', 'ca', 'da', 'nl', 'en', 'et', 'fi', 'ka', 'de', 'el', 'hu', 'lb', 'no', 'so', 'sw', 'sv', 'ta', 'te', 'tr', 'ur'],
    irish: ['ga'],
    russian: ['ru', 'uk'],
    scottish: ['gd'],
    spanish: ['pt-PT', 'it', 'es'],
    welsh: ['cy']
  };
  I18n.pluralRules = {
    arabic(n) {
      if (n === 0) {
        return 'zero';
      }
      if (n === 1) {
        return 'one';
      }
      if (n === 2) {
        return 'two';
      }
      if (n % 100 >= 3 && n % 100 <= 10) {
        return 'few';
      }
      if (n % 100 >= 11 && n % 100 <= 99) {
        return 'many';
      }
      return 'other';
    },
    chinese() {
      return 'other';
    },
    french(n) {
      return n === 0 || n === 1 ? 'one' : 'other';
    },
    german(n) {
      return n === 1 ? 'one' : 'other';
    },
    irish(n) {
      if (n === 1) {
        return 'one';
      }
      if (n === 2) {
        return 'two';
      }
      if (n >= 3 && n <= 6) {
        return 'few';
      }
      if (n >= 7 && n <= 10) {
        return 'many';
      }
      return 'other';
    },
    russian(n) {
      const lastTwo = n % 100;
      const last = lastTwo % 10;
      if (last === 1 && lastTwo !== 11) {
        return 'one';
      }
      if (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) {
        return 'few';
      }
      if (last === 0 || last >= 5 && last <= 9 || lastTwo >= 11 && lastTwo <= 14) {
        return 'many';
      }
      return 'other';
    },
    scottish(n) {
      if (n === 1 || n === 11) {
        return 'one';
      }
      if (n === 2 || n === 12) {
        return 'two';
      }
      if (n >= 3 && n <= 10 || n >= 13 && n <= 19) {
        return 'few';
      }
      return 'other';
    },
    spanish(n) {
      if (n === 1) {
        return 'one';
      }
      if (n % 1000000 === 0 && n !== 0) {
        return 'many';
      }
      return 'other';
    },
    welsh(n) {
      if (n === 0) {
        return 'zero';
      }
      if (n === 1) {
        return 'one';
      }
      if (n === 2) {
        return 'two';
      }
      if (n === 3) {
        return 'few';
      }
      if (n === 6) {
        return 'many';
      }
      return 'other';
    }
  };

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

  exports.PasswordInput = PasswordInput;

}));
//# sourceMappingURL=password-input.bundle.js.map
