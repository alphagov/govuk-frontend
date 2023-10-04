(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define('GOVUKFrontend.ExitThisPage', ['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.GOVUKFrontend = global.GOVUKFrontend || {}, global.GOVUKFrontend.ExitThisPage = {})));
})(this, (function (exports) { 'use strict';

  function mergeConfigs() {
    const flattenObject = function flattenObject(configObject) {
      const flattenedObject = {};
      const flattenLoop = function flattenLoop(obj, prefix) {
        for (const key in obj) {
          if (!Object.prototype.hasOwnProperty.call(obj, key)) {
            continue;
          }
          const value = obj[key];
          const prefixedKey = prefix ? `${prefix}.${key}` : key;
          if (typeof value === 'object') {
            flattenLoop(value, prefixedKey);
          } else {
            flattenedObject[prefixedKey] = value;
          }
        }
      };
      flattenLoop(configObject);
      return flattenedObject;
    };
    const formattedConfigObject = {};
    for (let i = 0; i < arguments.length; i++) {
      const obj = flattenObject(arguments[i]);
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          formattedConfigObject[key] = obj[key];
        }
      }
    }
    return formattedConfigObject;
  }
  function extractConfigByNamespace(configObject, namespace) {
    if (!configObject || typeof configObject !== 'object') {
      throw new Error('Provide a `configObject` of type "object".');
    }
    if (!namespace || typeof namespace !== 'string') {
      throw new Error('Provide a `namespace` of type "string" to filter the `configObject` by.');
    }
    const newObject = {};
    for (const key in configObject) {
      const keyParts = key.split('.');
      if (Object.prototype.hasOwnProperty.call(configObject, key) && keyParts[0] === namespace) {
        if (keyParts.length > 1) {
          keyParts.shift();
        }
        const newKey = keyParts.join('.');
        newObject[newKey] = configObject[key];
      }
    }
    return newObject;
  }
  function isSupported($scope = document.body) {
    return $scope.classList.contains('govuk-frontend-supported');
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

  /**
   * @typedef {import('govuk-frontend').Config} Config - Config for all components via `initAll()`
   * @typedef {import('govuk-frontend').ConfigKey} ConfigKey - Component config keys, e.g. `accordion` and `characterCount`
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
    for (const key in dataset) {
      out[key] = normaliseString(dataset[key]);
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
    constructor() {
      super('GOV.UK Frontend is not supported in this browser');
      this.name = 'SupportError';
    }
  }
  class ElementError extends GOVUKFrontendError {
    /**
     * @param {Element | null} element - The element in error
     * @param {object} options - Element error options
     * @param {string} options.componentName - The name of the component throwing the error
     * @param {string} options.identifier - An identifier that'll let the user understand which element has an error (variable name, CSS selector)
     * @param {string | typeof HTMLElement} [options.expectedType] - The type that was expected for the identifier
     */
    constructor(element, {
      componentName,
      identifier,
      expectedType
    }) {
      let reason = `${identifier} not found`;
      if (element) {
        expectedType = expectedType || window.HTMLElement;
        reason = typeof expectedType === 'string' ? `${identifier} is not of type ${expectedType}` : `${identifier} is not an instance of ${expectedType.name}`;
      }
      super(`${componentName}: ${reason}`);
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
    constructor(translations, config) {
      this.translations = void 0;
      this.locale = void 0;
      this.translations = translations || {};
      this.locale = config && config.locale || document.documentElement.lang || 'en';
    }
    t(lookupKey, options) {
      if (!lookupKey) {
        throw new Error('i18n: lookup key missing');
      }
      if (options && typeof options.count === 'number') {
        lookupKey = `${lookupKey}.${this.getPluralSuffix(lookupKey, options.count)}`;
      }
      const translationString = this.translations[lookupKey];
      if (typeof translationString === 'string') {
        if (translationString.match(/%{(.\S+)}/)) {
          if (!options) {
            throw new Error('i18n: cannot replace placeholders in string if no option data provided');
          }
          return this.replacePlaceholders(translationString, options);
        } else {
          return translationString;
        }
      } else {
        return lookupKey;
      }
    }
    replacePlaceholders(translationString, options) {
      let formatter;
      if (this.hasIntlNumberFormatSupport()) {
        formatter = new Intl.NumberFormat(this.locale);
      }
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
        } else {
          throw new Error(`i18n: no data found to replace ${placeholderWithBraces} placeholder in string`);
        }
      });
    }
    hasIntlPluralRulesSupport() {
      return Boolean(window.Intl && 'PluralRules' in window.Intl && Intl.PluralRules.supportedLocalesOf(this.locale).length);
    }
    hasIntlNumberFormatSupport() {
      return Boolean(window.Intl && 'NumberFormat' in window.Intl && Intl.NumberFormat.supportedLocalesOf(this.locale).length);
    }
    getPluralSuffix(lookupKey, count) {
      count = Number(count);
      if (!isFinite(count)) {
        return 'other';
      }
      let preferredForm;
      if (this.hasIntlPluralRulesSupport()) {
        preferredForm = new Intl.PluralRules(this.locale).select(count);
      } else {
        preferredForm = this.selectPluralFormUsingFallbackRules(count);
      }
      if (`${lookupKey}.${preferredForm}` in this.translations) {
        return preferredForm;
      } else if (`${lookupKey}.other` in this.translations) {
        if (console && 'warn' in console) {
          console.warn(`i18n: Missing plural form ".${preferredForm}" for "${this.locale}" locale. Falling back to ".other".`);
        }
        return 'other';
      } else {
        throw new Error(`i18n: Plural form ".other" is required for "${this.locale}" locale`);
      }
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
      const locale = this.locale;
      const localeShort = locale.split('-')[0];
      for (const pluralRule in I18n.pluralRulesMap) {
        if (Object.prototype.hasOwnProperty.call(I18n.pluralRulesMap, pluralRule)) {
          const languages = I18n.pluralRulesMap[pluralRule];
          for (let i = 0; i < languages.length; i++) {
            if (languages[i] === locale || languages[i] === localeShort) {
              return pluralRule;
            }
          }
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
   * Exit this page component
   *
   * @preserve
   */
  class ExitThisPage extends GOVUKFrontendComponent {
    /**
     * @param {Element} $module - HTML element that wraps the Exit This Page button
     * @param {ExitThisPageConfig} [config] - Exit This Page config
     */
    constructor($module, config) {
      super();
      this.$module = void 0;
      this.config = void 0;
      this.i18n = void 0;
      this.$button = void 0;
      this.$skiplinkButton = null;
      this.$updateSpan = null;
      this.$indicatorContainer = null;
      this.$overlay = null;
      this.keypressCounter = 0;
      this.lastKeyWasModified = false;
      this.timeoutTime = 5000;
      this.keypressTimeoutId = null;
      this.timeoutMessageId = null;
      if (!($module instanceof HTMLElement)) {
        throw new ElementError($module, {
          componentName: 'Exit this page',
          identifier: '$module'
        });
      }
      const $button = $module.querySelector('.govuk-exit-this-page__button');
      if (!($button instanceof HTMLElement)) {
        throw new ElementError($button, {
          componentName: 'Exit this page',
          identifier: 'Button',
          expectedType: HTMLElement
        });
      }
      this.config = mergeConfigs(ExitThisPage.defaults, config || {}, normaliseDataset($module.dataset));
      this.i18n = new I18n(extractConfigByNamespace(this.config, 'i18n'));
      this.$module = $module;
      this.$button = $button;
      const $skiplinkButton = document.querySelector('.govuk-js-exit-this-page-skiplink');
      if ($skiplinkButton instanceof HTMLAnchorElement) {
        this.$skiplinkButton = $skiplinkButton;
      }
      this.buildIndicator();
      this.initUpdateSpan();
      this.initButtonClickHandler();
      if (!('govukFrontendExitThisPageKeypress' in document.body.dataset)) {
        document.addEventListener('keyup', this.handleKeypress.bind(this), true);
        document.body.dataset.govukFrontendExitThisPageKeypress = 'true';
      }
      window.addEventListener('pageshow', this.resetPage.bind(this));
    }
    initUpdateSpan() {
      this.$updateSpan = document.createElement('span');
      this.$updateSpan.setAttribute('role', 'status');
      this.$updateSpan.className = 'govuk-visually-hidden';
      this.$module.appendChild(this.$updateSpan);
    }
    initButtonClickHandler() {
      this.$button.addEventListener('click', this.handleClick.bind(this));
      if (this.$skiplinkButton) {
        this.$skiplinkButton.addEventListener('click', this.handleClick.bind(this));
      }
    }
    buildIndicator() {
      this.$indicatorContainer = document.createElement('div');
      this.$indicatorContainer.className = 'govuk-exit-this-page__indicator';
      this.$indicatorContainer.setAttribute('aria-hidden', 'true');
      for (let i = 0; i < 3; i++) {
        const $indicator = document.createElement('div');
        $indicator.className = 'govuk-exit-this-page__indicator-light';
        this.$indicatorContainer.appendChild($indicator);
      }
      this.$button.appendChild(this.$indicatorContainer);
    }
    updateIndicator() {
      if (this.keypressCounter > 0) {
        this.$indicatorContainer.classList.add('govuk-exit-this-page__indicator--visible');
      } else {
        this.$indicatorContainer.classList.remove('govuk-exit-this-page__indicator--visible');
      }
      const $indicators = this.$indicatorContainer.querySelectorAll('.govuk-exit-this-page__indicator-light');
      $indicators.forEach(($indicator, index) => {
        $indicator.classList.toggle('govuk-exit-this-page__indicator-light--on', index < this.keypressCounter);
      });
    }
    exitPage() {
      this.$updateSpan.textContent = '';
      document.body.classList.add('govuk-exit-this-page-hide-content');
      this.$overlay = document.createElement('div');
      this.$overlay.className = 'govuk-exit-this-page-overlay';
      this.$overlay.setAttribute('role', 'alert');
      document.body.appendChild(this.$overlay);
      this.$overlay.textContent = this.i18n.t('activated');
      window.location.href = this.$button.getAttribute('href');
    }
    handleClick(event) {
      event.preventDefault();
      this.exitPage();
    }
    handleKeypress(event) {
      if ((event.key === 'Shift' || event.keyCode === 16 || event.which === 16) && !this.lastKeyWasModified) {
        this.keypressCounter += 1;
        this.updateIndicator();
        if (this.timeoutMessageId !== null) {
          window.clearTimeout(this.timeoutMessageId);
          this.timeoutMessageId = null;
        }
        if (this.keypressCounter >= 3) {
          this.keypressCounter = 0;
          if (this.keypressTimeoutId !== null) {
            window.clearTimeout(this.keypressTimeoutId);
            this.keypressTimeoutId = null;
          }
          this.exitPage();
        } else {
          if (this.keypressCounter === 1) {
            this.$updateSpan.textContent = this.i18n.t('pressTwoMoreTimes');
          } else {
            this.$updateSpan.textContent = this.i18n.t('pressOneMoreTime');
          }
        }
        this.setKeypressTimer();
      } else if (this.keypressTimeoutId !== null) {
        this.resetKeypressTimer();
      }
      this.lastKeyWasModified = event.shiftKey;
    }
    setKeypressTimer() {
      window.clearTimeout(this.keypressTimeoutId);
      this.keypressTimeoutId = window.setTimeout(this.resetKeypressTimer.bind(this), this.timeoutTime);
    }
    resetKeypressTimer() {
      window.clearTimeout(this.keypressTimeoutId);
      this.keypressTimeoutId = null;
      this.keypressCounter = 0;
      this.$updateSpan.textContent = this.i18n.t('timedOut');
      this.timeoutMessageId = window.setTimeout(() => {
        this.$updateSpan.textContent = '';
      }, this.timeoutTime);
      this.updateIndicator();
    }
    resetPage() {
      document.body.classList.remove('govuk-exit-this-page-hide-content');
      if (this.$overlay) {
        this.$overlay.remove();
        this.$overlay = null;
      }
      this.$updateSpan.setAttribute('role', 'status');
      this.$updateSpan.textContent = '';
      this.updateIndicator();
      if (this.keypressTimeoutId) {
        window.clearTimeout(this.keypressTimeoutId);
      }
      if (this.timeoutMessageId) {
        window.clearTimeout(this.timeoutMessageId);
      }
    }
  }

  /**
   * Exit this Page config
   *
   * @see {@link ExitThisPage.defaults}
   * @typedef {object} ExitThisPageConfig
   * @property {ExitThisPageTranslations} [i18n=ExitThisPage.defaults.i18n] - Exit this page translations
   */

  /**
   * Exit this Page translations
   *
   * @see {@link ExitThisPage.defaults.i18n}
   * @typedef {object} ExitThisPageTranslations
   *
   * Messages used by the component programatically inserted text, including
   * overlay text and screen reader announcements.
   * @property {string} [activated] - Screen reader announcement for when EtP
   *   keypress functionality has been successfully activated.
   * @property {string} [timedOut] - Screen reader announcement for when the EtP
   *   keypress functionality has timed out.
   * @property {string} [pressTwoMoreTimes] - Screen reader announcement informing
   *   the user they must press the activation key two more times.
   * @property {string} [pressOneMoreTime] - Screen reader announcement informing
   *   the user they must press the activation key one more time.
   */
  ExitThisPage.moduleName = 'govuk-exit-this-page';
  ExitThisPage.defaults = Object.freeze({
    i18n: {
      activated: 'Loading.',
      timedOut: 'Exit this page expired.',
      pressTwoMoreTimes: 'Shift, press 2 more times to exit.',
      pressOneMoreTime: 'Shift, press 1 more time to exit.'
    }
  });

  exports.ExitThisPage = ExitThisPage;

}));
//# sourceMappingURL=exit-this-page.bundle.js.map
