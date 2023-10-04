(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define('GOVUKFrontend', ['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.GOVUKFrontend = {}));
})(this, (function (exports) { 'use strict';

  const version = '5.0.0';

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
  class ConfigError extends GOVUKFrontendError {
    constructor(...args) {
      super(...args);
      this.name = 'ConfigError';
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
   * Accordion component
   *
   * This allows a collection of sections to be collapsed by default, showing only
   * their headers. Sections can be expanded or collapsed individually by clicking
   * their headers. A "Show all sections" button is also added to the top of the
   * accordion, which switches to "Hide all sections" when all the sections are
   * expanded.
   *
   * The state of each section is saved to the DOM via the `aria-expanded`
   * attribute, which also provides accessibility.
   *
   * @preserve
   */
  class Accordion extends GOVUKFrontendComponent {
    /**
     * @param {Element} $module - HTML element to use for accordion
     * @param {AccordionConfig} [config] - Accordion config
     */
    constructor($module, config) {
      super();
      this.$module = void 0;
      this.config = void 0;
      this.i18n = void 0;
      this.controlsClass = 'govuk-accordion__controls';
      this.showAllClass = 'govuk-accordion__show-all';
      this.showAllTextClass = 'govuk-accordion__show-all-text';
      this.sectionClass = 'govuk-accordion__section';
      this.sectionExpandedClass = 'govuk-accordion__section--expanded';
      this.sectionButtonClass = 'govuk-accordion__section-button';
      this.sectionHeaderClass = 'govuk-accordion__section-header';
      this.sectionHeadingClass = 'govuk-accordion__section-heading';
      this.sectionHeadingDividerClass = 'govuk-accordion__section-heading-divider';
      this.sectionHeadingTextClass = 'govuk-accordion__section-heading-text';
      this.sectionHeadingTextFocusClass = 'govuk-accordion__section-heading-text-focus';
      this.sectionShowHideToggleClass = 'govuk-accordion__section-toggle';
      this.sectionShowHideToggleFocusClass = 'govuk-accordion__section-toggle-focus';
      this.sectionShowHideTextClass = 'govuk-accordion__section-toggle-text';
      this.upChevronIconClass = 'govuk-accordion-nav__chevron';
      this.downChevronIconClass = 'govuk-accordion-nav__chevron--down';
      this.sectionSummaryClass = 'govuk-accordion__section-summary';
      this.sectionSummaryFocusClass = 'govuk-accordion__section-summary-focus';
      this.sectionContentClass = 'govuk-accordion__section-content';
      this.$sections = void 0;
      this.browserSupportsSessionStorage = false;
      this.$showAllButton = null;
      this.$showAllIcon = null;
      this.$showAllText = null;
      if (!($module instanceof HTMLElement)) {
        throw new ElementError($module, {
          componentName: 'Accordion',
          identifier: '$module'
        });
      }
      this.$module = $module;
      this.config = mergeConfigs(Accordion.defaults, config || {}, normaliseDataset($module.dataset));
      this.i18n = new I18n(extractConfigByNamespace(this.config, 'i18n'));
      const $sections = this.$module.querySelectorAll(`.${this.sectionClass}`);
      if (!$sections.length) {
        return this;
      }
      this.$sections = $sections;
      this.browserSupportsSessionStorage = helper.checkForSessionStorage();
      this.initControls();
      this.initSectionHeaders();
      const areAllSectionsOpen = this.checkIfAllSectionsOpen();
      this.updateShowAllButton(areAllSectionsOpen);
    }
    initControls() {
      this.$showAllButton = document.createElement('button');
      this.$showAllButton.setAttribute('type', 'button');
      this.$showAllButton.setAttribute('class', this.showAllClass);
      this.$showAllButton.setAttribute('aria-expanded', 'false');
      this.$showAllIcon = document.createElement('span');
      this.$showAllIcon.classList.add(this.upChevronIconClass);
      this.$showAllButton.appendChild(this.$showAllIcon);
      const $accordionControls = document.createElement('div');
      $accordionControls.setAttribute('class', this.controlsClass);
      $accordionControls.appendChild(this.$showAllButton);
      this.$module.insertBefore($accordionControls, this.$module.firstChild);
      this.$showAllText = document.createElement('span');
      this.$showAllText.classList.add(this.showAllTextClass);
      this.$showAllButton.appendChild(this.$showAllText);
      this.$showAllButton.addEventListener('click', () => this.onShowOrHideAllToggle());
      if ('onbeforematch' in document) {
        document.addEventListener('beforematch', event => this.onBeforeMatch(event));
      }
    }
    initSectionHeaders() {
      this.$sections.forEach(($section, i) => {
        const $header = $section.querySelector(`.${this.sectionHeaderClass}`);
        if (!$header) {
          return;
        }
        this.constructHeaderMarkup($header, i);
        this.setExpanded(this.isExpanded($section), $section);
        $header.addEventListener('click', () => this.onSectionToggle($section));
        this.setInitialState($section);
      });
    }
    constructHeaderMarkup($header, index) {
      const $span = $header.querySelector(`.${this.sectionButtonClass}`);
      const $heading = $header.querySelector(`.${this.sectionHeadingClass}`);
      const $summary = $header.querySelector(`.${this.sectionSummaryClass}`);
      if (!$span || !$heading) {
        return;
      }
      const $button = document.createElement('button');
      $button.setAttribute('type', 'button');
      $button.setAttribute('aria-controls', `${this.$module.id}-content-${index + 1}`);
      for (let i = 0; i < $span.attributes.length; i++) {
        const attr = $span.attributes.item(i);
        if (attr.nodeName !== 'id') {
          $button.setAttribute(attr.nodeName, attr.nodeValue);
        }
      }
      const $headingText = document.createElement('span');
      $headingText.classList.add(this.sectionHeadingTextClass);
      $headingText.id = $span.id;
      const $headingTextFocus = document.createElement('span');
      $headingTextFocus.classList.add(this.sectionHeadingTextFocusClass);
      $headingText.appendChild($headingTextFocus);
      $headingTextFocus.innerHTML = $span.innerHTML;
      const $showHideToggle = document.createElement('span');
      $showHideToggle.classList.add(this.sectionShowHideToggleClass);
      $showHideToggle.setAttribute('data-nosnippet', '');
      const $showHideToggleFocus = document.createElement('span');
      $showHideToggleFocus.classList.add(this.sectionShowHideToggleFocusClass);
      $showHideToggle.appendChild($showHideToggleFocus);
      const $showHideText = document.createElement('span');
      const $showHideIcon = document.createElement('span');
      $showHideIcon.classList.add(this.upChevronIconClass);
      $showHideToggleFocus.appendChild($showHideIcon);
      $showHideText.classList.add(this.sectionShowHideTextClass);
      $showHideToggleFocus.appendChild($showHideText);
      $button.appendChild($headingText);
      $button.appendChild(this.getButtonPunctuationEl());
      if ($summary) {
        const $summarySpan = document.createElement('span');
        const $summarySpanFocus = document.createElement('span');
        $summarySpanFocus.classList.add(this.sectionSummaryFocusClass);
        $summarySpan.appendChild($summarySpanFocus);
        for (let j = 0, l = $summary.attributes.length; j < l; ++j) {
          const nodeName = $summary.attributes.item(j).nodeName;
          const nodeValue = $summary.attributes.item(j).nodeValue;
          $summarySpan.setAttribute(nodeName, nodeValue);
        }
        $summarySpanFocus.innerHTML = $summary.innerHTML;
        $summary.parentNode.replaceChild($summarySpan, $summary);
        $button.appendChild($summarySpan);
        $button.appendChild(this.getButtonPunctuationEl());
      }
      $button.appendChild($showHideToggle);
      $heading.removeChild($span);
      $heading.appendChild($button);
    }
    onBeforeMatch(event) {
      const $fragment = event.target;
      if (!($fragment instanceof Element)) {
        return;
      }
      const $section = $fragment.closest(`.${this.sectionClass}`);
      if ($section) {
        this.setExpanded(true, $section);
      }
    }
    onSectionToggle($section) {
      const expanded = this.isExpanded($section);
      this.setExpanded(!expanded, $section);
      this.storeState($section);
    }
    onShowOrHideAllToggle() {
      const nowExpanded = !this.checkIfAllSectionsOpen();
      this.$sections.forEach($section => {
        this.setExpanded(nowExpanded, $section);
        this.storeState($section);
      });
      this.updateShowAllButton(nowExpanded);
    }
    setExpanded(expanded, $section) {
      const $showHideIcon = $section.querySelector(`.${this.upChevronIconClass}`);
      const $showHideText = $section.querySelector(`.${this.sectionShowHideTextClass}`);
      const $button = $section.querySelector(`.${this.sectionButtonClass}`);
      const $content = $section.querySelector(`.${this.sectionContentClass}`);
      if (!$showHideIcon || !($showHideText instanceof HTMLElement) || !$button || !$content) {
        return;
      }
      const newButtonText = expanded ? this.i18n.t('hideSection') : this.i18n.t('showSection');
      $showHideText.textContent = newButtonText;
      $button.setAttribute('aria-expanded', `${expanded}`);
      const ariaLabelParts = [];
      const $headingText = $section.querySelector(`.${this.sectionHeadingTextClass}`);
      if ($headingText instanceof HTMLElement) {
        ariaLabelParts.push($headingText.textContent.trim());
      }
      const $summary = $section.querySelector(`.${this.sectionSummaryClass}`);
      if ($summary instanceof HTMLElement) {
        ariaLabelParts.push($summary.textContent.trim());
      }
      const ariaLabelMessage = expanded ? this.i18n.t('hideSectionAriaLabel') : this.i18n.t('showSectionAriaLabel');
      ariaLabelParts.push(ariaLabelMessage);
      $button.setAttribute('aria-label', ariaLabelParts.join(' , '));
      if (expanded) {
        $content.removeAttribute('hidden');
        $section.classList.add(this.sectionExpandedClass);
        $showHideIcon.classList.remove(this.downChevronIconClass);
      } else {
        $content.setAttribute('hidden', 'until-found');
        $section.classList.remove(this.sectionExpandedClass);
        $showHideIcon.classList.add(this.downChevronIconClass);
      }
      const areAllSectionsOpen = this.checkIfAllSectionsOpen();
      this.updateShowAllButton(areAllSectionsOpen);
    }
    isExpanded($section) {
      return $section.classList.contains(this.sectionExpandedClass);
    }
    checkIfAllSectionsOpen() {
      const sectionsCount = this.$sections.length;
      const expandedSectionCount = this.$module.querySelectorAll(`.${this.sectionExpandedClass}`).length;
      const areAllSectionsOpen = sectionsCount === expandedSectionCount;
      return areAllSectionsOpen;
    }
    updateShowAllButton(expanded) {
      const newButtonText = expanded ? this.i18n.t('hideAllSections') : this.i18n.t('showAllSections');
      this.$showAllButton.setAttribute('aria-expanded', expanded.toString());
      this.$showAllText.textContent = newButtonText;
      if (expanded) {
        this.$showAllIcon.classList.remove(this.downChevronIconClass);
      } else {
        this.$showAllIcon.classList.add(this.downChevronIconClass);
      }
    }
    storeState($section) {
      if (this.browserSupportsSessionStorage && this.config.rememberExpanded) {
        const $button = $section.querySelector(`.${this.sectionButtonClass}`);
        if ($button) {
          const contentId = $button.getAttribute('aria-controls');
          const contentState = $button.getAttribute('aria-expanded');
          if (contentId && contentState) {
            window.sessionStorage.setItem(contentId, contentState);
          }
        }
      }
    }
    setInitialState($section) {
      if (this.browserSupportsSessionStorage && this.config.rememberExpanded) {
        const $button = $section.querySelector(`.${this.sectionButtonClass}`);
        if ($button) {
          const contentId = $button.getAttribute('aria-controls');
          const contentState = contentId ? window.sessionStorage.getItem(contentId) : null;
          if (contentState !== null) {
            this.setExpanded(contentState === 'true', $section);
          }
        }
      }
    }
    getButtonPunctuationEl() {
      const $punctuationEl = document.createElement('span');
      $punctuationEl.classList.add('govuk-visually-hidden', this.sectionHeadingDividerClass);
      $punctuationEl.innerHTML = ', ';
      return $punctuationEl;
    }
  }
  Accordion.moduleName = 'govuk-accordion';
  Accordion.defaults = Object.freeze({
    i18n: {
      hideAllSections: 'Hide all sections',
      hideSection: 'Hide',
      hideSectionAriaLabel: 'Hide this section',
      showAllSections: 'Show all sections',
      showSection: 'Show',
      showSectionAriaLabel: 'Show this section'
    },
    rememberExpanded: true
  });
  const helper = {
    /**
     * Check for `window.sessionStorage`, and that it actually works.
     *
     * @returns {boolean} True if session storage is available
     */
    checkForSessionStorage: function () {
      const testString = 'this is the test string';
      let result;
      try {
        window.sessionStorage.setItem(testString, testString);
        result = window.sessionStorage.getItem(testString) === testString.toString();
        window.sessionStorage.removeItem(testString);
        return result;
      } catch (exception) {
        return false;
      }
    }
  };

  /**
   * Accordion config
   *
   * @see {@link Accordion.defaults}
   * @typedef {object} AccordionConfig
   * @property {AccordionTranslations} [i18n=Accordion.defaults.i18n] - Accordion translations
   * @property {boolean} [rememberExpanded] - Whether the expanded and collapsed
   *   state of each section is remembered and restored when navigating.
   */

  /**
   * Accordion translations
   *
   * @see {@link Accordion.defaults.i18n}
   * @typedef {object} AccordionTranslations
   *
   * Messages used by the component for the labels of its buttons. This includes
   * the visible text shown on screen, and text to help assistive technology users
   * for the buttons toggling each section.
   * @property {string} [hideAllSections] - The text content for the 'Hide all
   *   sections' button, used when at least one section is expanded.
   * @property {string} [hideSection] - The text content for the 'Hide'
   *   button, used when a section is expanded.
   * @property {string} [hideSectionAriaLabel] - The text content appended to the
   *   'Hide' button's accessible name when a section is expanded.
   * @property {string} [showAllSections] - The text content for the 'Show all
   *   sections' button, used when all sections are collapsed.
   * @property {string} [showSection] - The text content for the 'Show'
   *   button, used when a section is collapsed.
   * @property {string} [showSectionAriaLabel] - The text content appended to the
   *   'Show' button's accessible name when a section is expanded.
   */

  const KEY_SPACE = 32;
  const DEBOUNCE_TIMEOUT_IN_SECONDS = 1;

  /**
   * JavaScript enhancements for the Button component
   *
   * @preserve
   */
  class Button extends GOVUKFrontendComponent {
    /**
     * @param {Element} $module - HTML element to use for button
     * @param {ButtonConfig} [config] - Button config
     */
    constructor($module, config) {
      super();
      this.$module = void 0;
      this.config = void 0;
      this.debounceFormSubmitTimer = null;
      if (!($module instanceof HTMLElement)) {
        throw new ElementError($module, {
          componentName: 'Button',
          identifier: '$module'
        });
      }
      this.$module = $module;
      this.config = mergeConfigs(Button.defaults, config || {}, normaliseDataset($module.dataset));
      this.$module.addEventListener('keydown', event => this.handleKeyDown(event));
      this.$module.addEventListener('click', event => this.debounce(event));
    }
    handleKeyDown(event) {
      const $target = event.target;
      if (event.keyCode !== KEY_SPACE) {
        return;
      }
      if ($target instanceof HTMLElement && $target.getAttribute('role') === 'button') {
        event.preventDefault();
        $target.click();
      }
    }
    debounce(event) {
      if (!this.config.preventDoubleClick) {
        return;
      }
      if (this.debounceFormSubmitTimer) {
        event.preventDefault();
        return false;
      }
      this.debounceFormSubmitTimer = window.setTimeout(() => {
        this.debounceFormSubmitTimer = null;
      }, DEBOUNCE_TIMEOUT_IN_SECONDS * 1000);
    }
  }

  /**
   * Button config
   *
   * @typedef {object} ButtonConfig
   * @property {boolean} [preventDoubleClick=false] - Prevent accidental double
   *   clicks on submit buttons from submitting forms multiple times.
   */
  Button.moduleName = 'govuk-button';
  Button.defaults = Object.freeze({
    preventDoubleClick: false
  });

  function closestAttributeValue($element, attributeName) {
    const $closestElementWithAttribute = $element.closest(`[${attributeName}]`);
    return $closestElementWithAttribute ? $closestElementWithAttribute.getAttribute(attributeName) : null;
  }

  /**
   * Character count component
   *
   * Tracks the number of characters or words in the `.govuk-js-character-count`
   * `<textarea>` inside the element. Displays a message with the remaining number
   * of characters/words available, or the number of characters/words in excess.
   *
   * You can configure the message to only appear after a certain percentage
   * of the available characters/words has been entered.
   *
   * @preserve
   */
  class CharacterCount extends GOVUKFrontendComponent {
    /**
     * @param {Element} $module - HTML element to use for character count
     * @param {CharacterCountConfig} [config] - Character count config
     */
    constructor($module, config) {
      super();
      this.$module = void 0;
      this.$textarea = void 0;
      this.$visibleCountMessage = null;
      this.$screenReaderCountMessage = null;
      this.lastInputTimestamp = null;
      this.lastInputValue = '';
      this.valueChecker = null;
      this.config = void 0;
      this.i18n = void 0;
      this.maxLength = Infinity;
      if (!($module instanceof HTMLElement)) {
        throw new ElementError($module, {
          componentName: 'Character count',
          identifier: '$module'
        });
      }
      const $textarea = $module.querySelector('.govuk-js-character-count');
      if (!($textarea instanceof HTMLTextAreaElement || $textarea instanceof HTMLInputElement)) {
        throw new ElementError($textarea, {
          componentName: 'Character count',
          identifier: '.govuk-js-character-count',
          expectedType: 'HTMLTextareaElement or HTMLInputElement'
        });
      }
      const datasetConfig = normaliseDataset($module.dataset);
      let configOverrides = {};
      if ('maxwords' in datasetConfig || 'maxlength' in datasetConfig) {
        configOverrides = {
          maxlength: undefined,
          maxwords: undefined
        };
      }
      this.config = mergeConfigs(CharacterCount.defaults, config || {}, configOverrides, datasetConfig);
      const errors = validateConfig(CharacterCount.schema, this.config);
      if (errors[0]) {
        throw new ConfigError(`Character count: ${errors[0]}`);
      }
      this.i18n = new I18n(extractConfigByNamespace(this.config, 'i18n'), {
        locale: closestAttributeValue($module, 'lang')
      });
      this.maxLength = this.config.maxwords || this.config.maxlength;
      this.$module = $module;
      this.$textarea = $textarea;
      const textareaDescriptionId = `${this.$textarea.id}-info`;
      const $textareaDescription = document.getElementById(textareaDescriptionId);
      if (!$textareaDescription) {
        throw new ElementError($textareaDescription, {
          componentName: 'Character count',
          identifier: `#${textareaDescriptionId}`
        });
      }
      if ($textareaDescription.textContent.match(/^\s*$/)) {
        $textareaDescription.textContent = this.i18n.t('textareaDescription', {
          count: this.maxLength
        });
      }
      this.$textarea.insertAdjacentElement('afterend', $textareaDescription);
      const $screenReaderCountMessage = document.createElement('div');
      $screenReaderCountMessage.className = 'govuk-character-count__sr-status govuk-visually-hidden';
      $screenReaderCountMessage.setAttribute('aria-live', 'polite');
      this.$screenReaderCountMessage = $screenReaderCountMessage;
      $textareaDescription.insertAdjacentElement('afterend', $screenReaderCountMessage);
      const $visibleCountMessage = document.createElement('div');
      $visibleCountMessage.className = $textareaDescription.className;
      $visibleCountMessage.classList.add('govuk-character-count__status');
      $visibleCountMessage.setAttribute('aria-hidden', 'true');
      this.$visibleCountMessage = $visibleCountMessage;
      $textareaDescription.insertAdjacentElement('afterend', $visibleCountMessage);
      $textareaDescription.classList.add('govuk-visually-hidden');
      this.$textarea.removeAttribute('maxlength');
      this.bindChangeEvents();
      window.addEventListener('pageshow', () => this.updateCountMessage());
      this.updateCountMessage();
    }
    bindChangeEvents() {
      this.$textarea.addEventListener('keyup', () => this.handleKeyUp());
      this.$textarea.addEventListener('focus', () => this.handleFocus());
      this.$textarea.addEventListener('blur', () => this.handleBlur());
    }
    handleKeyUp() {
      this.updateVisibleCountMessage();
      this.lastInputTimestamp = Date.now();
    }
    handleFocus() {
      this.valueChecker = window.setInterval(() => {
        if (!this.lastInputTimestamp || Date.now() - 500 >= this.lastInputTimestamp) {
          this.updateIfValueChanged();
        }
      }, 1000);
    }
    handleBlur() {
      clearInterval(this.valueChecker);
    }
    updateIfValueChanged() {
      if (this.$textarea.value !== this.lastInputValue) {
        this.lastInputValue = this.$textarea.value;
        this.updateCountMessage();
      }
    }
    updateCountMessage() {
      this.updateVisibleCountMessage();
      this.updateScreenReaderCountMessage();
    }
    updateVisibleCountMessage() {
      const remainingNumber = this.maxLength - this.count(this.$textarea.value);
      if (this.isOverThreshold()) {
        this.$visibleCountMessage.classList.remove('govuk-character-count__message--disabled');
      } else {
        this.$visibleCountMessage.classList.add('govuk-character-count__message--disabled');
      }
      if (remainingNumber < 0) {
        this.$textarea.classList.add('govuk-textarea--error');
        this.$visibleCountMessage.classList.remove('govuk-hint');
        this.$visibleCountMessage.classList.add('govuk-error-message');
      } else {
        this.$textarea.classList.remove('govuk-textarea--error');
        this.$visibleCountMessage.classList.remove('govuk-error-message');
        this.$visibleCountMessage.classList.add('govuk-hint');
      }
      this.$visibleCountMessage.textContent = this.getCountMessage();
    }
    updateScreenReaderCountMessage() {
      if (this.isOverThreshold()) {
        this.$screenReaderCountMessage.removeAttribute('aria-hidden');
      } else {
        this.$screenReaderCountMessage.setAttribute('aria-hidden', 'true');
      }
      this.$screenReaderCountMessage.textContent = this.getCountMessage();
    }
    count(text) {
      if (this.config.maxwords) {
        const tokens = text.match(/\S+/g) || [];
        return tokens.length;
      } else {
        return text.length;
      }
    }
    getCountMessage() {
      const remainingNumber = this.maxLength - this.count(this.$textarea.value);
      const countType = this.config.maxwords ? 'words' : 'characters';
      return this.formatCountMessage(remainingNumber, countType);
    }
    formatCountMessage(remainingNumber, countType) {
      if (remainingNumber === 0) {
        return this.i18n.t(`${countType}AtLimit`);
      }
      const translationKeySuffix = remainingNumber < 0 ? 'OverLimit' : 'UnderLimit';
      return this.i18n.t(`${countType}${translationKeySuffix}`, {
        count: Math.abs(remainingNumber)
      });
    }
    isOverThreshold() {
      if (!this.config.threshold) {
        return true;
      }
      const currentLength = this.count(this.$textarea.value);
      const maxLength = this.maxLength;
      const thresholdValue = maxLength * this.config.threshold / 100;
      return thresholdValue <= currentLength;
    }
  }

  /**
   * Character count config
   *
   * @see {@link CharacterCount.defaults}
   * @typedef {object} CharacterCountConfig
   * @property {number} [maxlength] - The maximum number of characters.
   *   If maxwords is provided, the maxlength option will be ignored.
   * @property {number} [maxwords] - The maximum number of words. If maxwords is
   *   provided, the maxlength option will be ignored.
   * @property {number} [threshold=0] - The percentage value of the limit at
   *   which point the count message is displayed. If this attribute is set, the
   *   count message will be hidden by default.
   * @property {CharacterCountTranslations} [i18n=CharacterCount.defaults.i18n] - Character count translations
   */

  /**
   * Character count translations
   *
   * @see {@link CharacterCount.defaults.i18n}
   * @typedef {object} CharacterCountTranslations
   *
   * Messages shown to users as they type. It provides feedback on how many words
   * or characters they have remaining or if they are over the limit. This also
   * includes a message used as an accessible description for the textarea.
   * @property {TranslationPluralForms} [charactersUnderLimit] - Message displayed
   *   when the number of characters is under the configured maximum, `maxlength`.
   *   This message is displayed visually and through assistive technologies. The
   *   component will replace the `%{count}` placeholder with the number of
   *   remaining characters. This is a [pluralised list of
   *   messages](https://frontend.design-system.service.gov.uk/localise-govuk-frontend).
   * @property {string} [charactersAtLimit] - Message displayed when the number of
   *   characters reaches the configured maximum, `maxlength`. This message is
   *   displayed visually and through assistive technologies.
   * @property {TranslationPluralForms} [charactersOverLimit] - Message displayed
   *   when the number of characters is over the configured maximum, `maxlength`.
   *   This message is displayed visually and through assistive technologies. The
   *   component will replace the `%{count}` placeholder with the number of
   *   remaining characters. This is a [pluralised list of
   *   messages](https://frontend.design-system.service.gov.uk/localise-govuk-frontend).
   * @property {TranslationPluralForms} [wordsUnderLimit] - Message displayed when
   *   the number of words is under the configured maximum, `maxlength`. This
   *   message is displayed visually and through assistive technologies. The
   *   component will replace the `%{count}` placeholder with the number of
   *   remaining words. This is a [pluralised list of
   *   messages](https://frontend.design-system.service.gov.uk/localise-govuk-frontend).
   * @property {string} [wordsAtLimit] - Message displayed when the number of
   *   words reaches the configured maximum, `maxlength`. This message is
   *   displayed visually and through assistive technologies.
   * @property {TranslationPluralForms} [wordsOverLimit] - Message displayed when
   *   the number of words is over the configured maximum, `maxlength`. This
   *   message is displayed visually and through assistive technologies. The
   *   component will replace the `%{count}` placeholder with the number of
   *   remaining words. This is a [pluralised list of
   *   messages](https://frontend.design-system.service.gov.uk/localise-govuk-frontend).
   * @property {TranslationPluralForms} [textareaDescription] - Message made
   *   available to assistive technologies, if none is already present in the
   *   HTML, to describe that the component accepts only a limited amount of
   *   content. It is visible on the page when JavaScript is unavailable. The
   *   component will replace the `%{count}` placeholder with the value of the
   *   `maxlength` or `maxwords` parameter.
   */

  /**
   * @typedef {import('../../common/index.mjs').Schema} Schema
   * @typedef {import('../../i18n.mjs').TranslationPluralForms} TranslationPluralForms
   */
  CharacterCount.moduleName = 'govuk-character-count';
  CharacterCount.defaults = Object.freeze({
    threshold: 0,
    i18n: {
      charactersUnderLimit: {
        one: 'You have %{count} character remaining',
        other: 'You have %{count} characters remaining'
      },
      charactersAtLimit: 'You have 0 characters remaining',
      charactersOverLimit: {
        one: 'You have %{count} character too many',
        other: 'You have %{count} characters too many'
      },
      wordsUnderLimit: {
        one: 'You have %{count} word remaining',
        other: 'You have %{count} words remaining'
      },
      wordsAtLimit: 'You have 0 words remaining',
      wordsOverLimit: {
        one: 'You have %{count} word too many',
        other: 'You have %{count} words too many'
      },
      textareaDescription: {
        other: ''
      }
    }
  });
  CharacterCount.schema = Object.freeze({
    anyOf: [{
      required: ['maxwords'],
      errorMessage: 'Either "maxlength" or "maxwords" must be provided'
    }, {
      required: ['maxlength'],
      errorMessage: 'Either "maxlength" or "maxwords" must be provided'
    }]
  });

  /**
   * Checkboxes component
   *
   * @preserve
   */
  class Checkboxes extends GOVUKFrontendComponent {
    /**
     * Checkboxes can be associated with a 'conditionally revealed' content block –
     * for example, a checkbox for 'Phone' could reveal an additional form field for
     * the user to enter their phone number.
     *
     * These associations are made using a `data-aria-controls` attribute, which is
     * promoted to an aria-controls attribute during initialisation.
     *
     * We also need to restore the state of any conditional reveals on the page (for
     * example if the user has navigated back), and set up event handlers to keep
     * the reveal in sync with the checkbox state.
     *
     * @param {Element} $module - HTML element to use for checkboxes
     */
    constructor($module) {
      super();
      this.$module = void 0;
      this.$inputs = void 0;
      if (!($module instanceof HTMLElement)) {
        throw new ElementError($module, {
          componentName: 'Checkboxes',
          identifier: `[data-module="${Checkboxes.moduleName}"]`
        });
      }
      const $inputs = $module.querySelectorAll('input[type="checkbox"]');
      if (!$inputs.length) {
        throw new ElementError(null, {
          componentName: 'Checkboxes',
          identifier: 'input[type="checkbox"]'
        });
      }
      this.$module = $module;
      this.$inputs = $inputs;
      this.$inputs.forEach($input => {
        const targetId = $input.getAttribute('data-aria-controls');
        if (!targetId) {
          return;
        }
        if (!document.getElementById(targetId)) {
          throw new ElementError(null, {
            componentName: 'Checkboxes',
            identifier: `#${targetId}`
          });
        }
        $input.setAttribute('aria-controls', targetId);
        $input.removeAttribute('data-aria-controls');
      });
      window.addEventListener('pageshow', () => this.syncAllConditionalReveals());
      this.syncAllConditionalReveals();
      this.$module.addEventListener('click', event => this.handleClick(event));
    }
    syncAllConditionalReveals() {
      this.$inputs.forEach($input => this.syncConditionalRevealWithInputState($input));
    }
    syncConditionalRevealWithInputState($input) {
      const targetId = $input.getAttribute('aria-controls');
      if (!targetId) {
        return;
      }
      const $target = document.getElementById(targetId);
      if ($target && $target.classList.contains('govuk-checkboxes__conditional')) {
        const inputIsChecked = $input.checked;
        $input.setAttribute('aria-expanded', inputIsChecked.toString());
        $target.classList.toggle('govuk-checkboxes__conditional--hidden', !inputIsChecked);
      }
    }
    unCheckAllInputsExcept($input) {
      const allInputsWithSameName = document.querySelectorAll(`input[type="checkbox"][name="${$input.name}"]`);
      allInputsWithSameName.forEach($inputWithSameName => {
        const hasSameFormOwner = $input.form === $inputWithSameName.form;
        if (hasSameFormOwner && $inputWithSameName !== $input) {
          $inputWithSameName.checked = false;
          this.syncConditionalRevealWithInputState($inputWithSameName);
        }
      });
    }
    unCheckExclusiveInputs($input) {
      const allInputsWithSameNameAndExclusiveBehaviour = document.querySelectorAll(`input[data-behaviour="exclusive"][type="checkbox"][name="${$input.name}"]`);
      allInputsWithSameNameAndExclusiveBehaviour.forEach($exclusiveInput => {
        const hasSameFormOwner = $input.form === $exclusiveInput.form;
        if (hasSameFormOwner) {
          $exclusiveInput.checked = false;
          this.syncConditionalRevealWithInputState($exclusiveInput);
        }
      });
    }
    handleClick(event) {
      const $clickedInput = event.target;
      if (!($clickedInput instanceof HTMLInputElement) || $clickedInput.type !== 'checkbox') {
        return;
      }
      const hasAriaControls = $clickedInput.getAttribute('aria-controls');
      if (hasAriaControls) {
        this.syncConditionalRevealWithInputState($clickedInput);
      }
      if (!$clickedInput.checked) {
        return;
      }
      const hasBehaviourExclusive = $clickedInput.getAttribute('data-behaviour') === 'exclusive';
      if (hasBehaviourExclusive) {
        this.unCheckAllInputsExcept($clickedInput);
      } else {
        this.unCheckExclusiveInputs($clickedInput);
      }
    }
  }
  Checkboxes.moduleName = 'govuk-checkboxes';

  /**
   * Error summary component
   *
   * Takes focus on initialisation for accessible announcement, unless disabled in configuration.
   *
   * @preserve
   */
  class ErrorSummary extends GOVUKFrontendComponent {
    /**
     * @param {Element} $module - HTML element to use for error summary
     * @param {ErrorSummaryConfig} [config] - Error summary config
     */
    constructor($module, config) {
      super();
      this.$module = void 0;
      this.config = void 0;
      if (!($module instanceof HTMLElement)) {
        throw new ElementError($module, {
          componentName: 'Error summary',
          identifier: '$module'
        });
      }
      this.$module = $module;
      this.config = mergeConfigs(ErrorSummary.defaults, config || {}, normaliseDataset($module.dataset));
      this.setFocus();
      this.$module.addEventListener('click', event => this.handleClick(event));
    }
    setFocus() {
      if (this.config.disableAutoFocus) {
        return;
      }
      this.$module.setAttribute('tabindex', '-1');
      this.$module.addEventListener('blur', () => {
        this.$module.removeAttribute('tabindex');
      });
      this.$module.focus();
    }
    handleClick(event) {
      const $target = event.target;
      if (this.focusTarget($target)) {
        event.preventDefault();
      }
    }
    focusTarget($target) {
      if (!($target instanceof HTMLAnchorElement)) {
        return false;
      }
      const inputId = this.getFragmentFromUrl($target.href);
      if (!inputId) {
        return false;
      }
      const $input = document.getElementById(inputId);
      if (!$input) {
        return false;
      }
      const $legendOrLabel = this.getAssociatedLegendOrLabel($input);
      if (!$legendOrLabel) {
        return false;
      }
      $legendOrLabel.scrollIntoView();
      $input.focus({
        preventScroll: true
      });
      return true;
    }
    getFragmentFromUrl(url) {
      if (url.indexOf('#') === -1) {
        return undefined;
      }
      return url.split('#').pop();
    }
    getAssociatedLegendOrLabel($input) {
      const $fieldset = $input.closest('fieldset');
      if ($fieldset) {
        const $legends = $fieldset.getElementsByTagName('legend');
        if ($legends.length) {
          const $candidateLegend = $legends[0];
          if ($input instanceof HTMLInputElement && ($input.type === 'checkbox' || $input.type === 'radio')) {
            return $candidateLegend;
          }
          const legendTop = $candidateLegend.getBoundingClientRect().top;
          const inputRect = $input.getBoundingClientRect();
          if (inputRect.height && window.innerHeight) {
            const inputBottom = inputRect.top + inputRect.height;
            if (inputBottom - legendTop < window.innerHeight / 2) {
              return $candidateLegend;
            }
          }
        }
      }
      return document.querySelector(`label[for='${$input.getAttribute('id')}']`) || $input.closest('label');
    }
  }

  /**
   * Error summary config
   *
   * @typedef {object} ErrorSummaryConfig
   * @property {boolean} [disableAutoFocus=false] - If set to `true` the error
   *   summary will not be focussed when the page loads.
   */
  ErrorSummary.moduleName = 'govuk-error-summary';
  ErrorSummary.defaults = Object.freeze({
    disableAutoFocus: false
  });

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

  /**
   * Header component
   *
   * @preserve
   */
  class Header extends GOVUKFrontendComponent {
    /**
     * Apply a matchMedia for desktop which will trigger a state sync if the browser
     * viewport moves between states.
     *
     * @param {Element} $module - HTML element to use for header
     */
    constructor($module) {
      super();
      this.$module = void 0;
      this.$menuButton = void 0;
      this.$menu = void 0;
      this.menuIsOpen = false;
      this.mql = null;
      if (!($module instanceof HTMLElement)) {
        throw new ElementError($module, {
          componentName: 'Header',
          identifier: '$module'
        });
      }
      this.$module = $module;
      const $menuButton = $module.querySelector('.govuk-js-header-toggle');
      if (!$menuButton) {
        return this;
      }
      if (!($menuButton instanceof HTMLElement)) {
        throw new ElementError($menuButton, {
          componentName: 'Header',
          identifier: '.govuk-js-header-toggle'
        });
      }
      const menuId = $menuButton.getAttribute('aria-controls');
      if (!menuId) {
        throw new ElementError(null, {
          componentName: 'Header',
          identifier: '.govuk-js-header-toggle[aria-controls]'
        });
      }
      const $menu = document.getElementById(menuId);
      if (!($menu instanceof HTMLElement)) {
        throw new ElementError($menu, {
          componentName: 'Header',
          identifier: `#${menuId}`
        });
      }
      this.$menu = $menu;
      this.$menuButton = $menuButton;
      this.mql = window.matchMedia('(min-width: 48.0625em)');
      if ('addEventListener' in this.mql) {
        this.mql.addEventListener('change', () => this.syncState());
      } else {
        this.mql.addListener(() => this.syncState());
      }
      this.syncState();
      this.$menuButton.addEventListener('click', () => this.handleMenuButtonClick());
    }
    syncState() {
      if (this.mql.matches) {
        this.$menu.removeAttribute('hidden');
        this.$menuButton.setAttribute('hidden', '');
      } else {
        this.$menuButton.removeAttribute('hidden');
        this.$menuButton.setAttribute('aria-expanded', this.menuIsOpen.toString());
        if (this.menuIsOpen) {
          this.$menu.removeAttribute('hidden');
        } else {
          this.$menu.setAttribute('hidden', '');
        }
      }
    }
    handleMenuButtonClick() {
      this.menuIsOpen = !this.menuIsOpen;
      this.syncState();
    }
  }
  Header.moduleName = 'govuk-header';

  /**
   * Notification Banner component
   *
   * @preserve
   */
  class NotificationBanner extends GOVUKFrontendComponent {
    /**
     * @param {Element} $module - HTML element to use for notification banner
     * @param {NotificationBannerConfig} [config] - Notification banner config
     */
    constructor($module, config) {
      super();
      this.$module = void 0;
      this.config = void 0;
      if (!($module instanceof HTMLElement)) {
        throw new ElementError($module, {
          componentName: 'Notification banner',
          identifier: '$module'
        });
      }
      this.$module = $module;
      this.config = mergeConfigs(NotificationBanner.defaults, config || {}, normaliseDataset($module.dataset));
      this.setFocus();
    }
    setFocus() {
      if (this.config.disableAutoFocus) {
        return;
      }
      if (this.$module.getAttribute('role') !== 'alert') {
        return;
      }
      if (!this.$module.getAttribute('tabindex')) {
        this.$module.setAttribute('tabindex', '-1');
        this.$module.addEventListener('blur', () => {
          this.$module.removeAttribute('tabindex');
        });
      }
      this.$module.focus();
    }
  }

  /**
   * Notification banner config
   *
   * @typedef {object} NotificationBannerConfig
   * @property {boolean} [disableAutoFocus=false] - If set to `true` the
   *   notification banner will not be focussed when the page loads. This only
   *   applies if the component has a `role` of `alert` – in other cases the
   *   component will not be focused on page load, regardless of this option.
   */
  NotificationBanner.moduleName = 'govuk-notification-banner';
  NotificationBanner.defaults = Object.freeze({
    disableAutoFocus: false
  });

  /**
   * Radios component
   *
   * @preserve
   */
  class Radios extends GOVUKFrontendComponent {
    /**
     * Radios can be associated with a 'conditionally revealed' content block – for
     * example, a radio for 'Phone' could reveal an additional form field for the
     * user to enter their phone number.
     *
     * These associations are made using a `data-aria-controls` attribute, which is
     * promoted to an aria-controls attribute during initialisation.
     *
     * We also need to restore the state of any conditional reveals on the page (for
     * example if the user has navigated back), and set up event handlers to keep
     * the reveal in sync with the radio state.
     *
     * @param {Element} $module - HTML element to use for radios
     */
    constructor($module) {
      super();
      this.$module = void 0;
      this.$inputs = void 0;
      if (!($module instanceof HTMLElement)) {
        throw new ElementError($module, {
          componentName: 'Radios',
          identifier: `[data-module="${Radios.moduleName}"]`
        });
      }
      const $inputs = $module.querySelectorAll('input[type="radio"]');
      if (!$inputs.length) {
        throw new ElementError(null, {
          componentName: 'Radios',
          identifier: 'input[type="radio"]'
        });
      }
      this.$module = $module;
      this.$inputs = $inputs;
      this.$inputs.forEach($input => {
        const targetId = $input.getAttribute('data-aria-controls');
        if (!targetId) {
          return;
        }
        if (!document.getElementById(targetId)) {
          throw new ElementError(null, {
            componentName: 'Radios',
            identifier: `#${targetId}`
          });
        }
        $input.setAttribute('aria-controls', targetId);
        $input.removeAttribute('data-aria-controls');
      });
      window.addEventListener('pageshow', () => this.syncAllConditionalReveals());
      this.syncAllConditionalReveals();
      this.$module.addEventListener('click', event => this.handleClick(event));
    }
    syncAllConditionalReveals() {
      this.$inputs.forEach($input => this.syncConditionalRevealWithInputState($input));
    }
    syncConditionalRevealWithInputState($input) {
      const targetId = $input.getAttribute('aria-controls');
      if (!targetId) {
        return;
      }
      const $target = document.getElementById(targetId);
      if ($target && $target.classList.contains('govuk-radios__conditional')) {
        const inputIsChecked = $input.checked;
        $input.setAttribute('aria-expanded', inputIsChecked.toString());
        $target.classList.toggle('govuk-radios__conditional--hidden', !inputIsChecked);
      }
    }
    handleClick(event) {
      const $clickedInput = event.target;
      if (!($clickedInput instanceof HTMLInputElement) || $clickedInput.type !== 'radio') {
        return;
      }
      const $allInputs = document.querySelectorAll('input[type="radio"][aria-controls]');
      const $clickedInputForm = $clickedInput.form;
      const $clickedInputName = $clickedInput.name;
      $allInputs.forEach($input => {
        const hasSameFormOwner = $input.form === $clickedInputForm;
        const hasSameName = $input.name === $clickedInputName;
        if (hasSameName && hasSameFormOwner) {
          this.syncConditionalRevealWithInputState($input);
        }
      });
    }
  }
  Radios.moduleName = 'govuk-radios';

  /**
   * Skip link component
   *
   * @preserve
   */
  class SkipLink extends GOVUKFrontendComponent {
    /**
     * @param {Element} $module - HTML element to use for skip link
     * @throws {ElementError} when $module is not set or the wrong type
     * @throws {ElementError} when $module.hash does not contain a hash
     * @throws {ElementError} when the linked element is missing or the wrong type
     */
    constructor($module) {
      super();
      this.$module = void 0;
      this.$linkedElement = void 0;
      this.linkedElementListener = false;
      if (!($module instanceof HTMLAnchorElement)) {
        throw new ElementError($module, {
          componentName: 'Skip link',
          identifier: '$module',
          expectedType: HTMLAnchorElement
        });
      }
      this.$module = $module;
      this.$linkedElement = this.getLinkedElement();
      this.$module.addEventListener('click', () => this.focusLinkedElement());
    }
    getLinkedElement() {
      const linkedElementId = this.getFragmentFromUrl(this.$module.hash);
      if (!linkedElementId) {
        throw new ElementError(this.$module, {
          componentName: 'Skip link',
          identifier: '$module.hash',
          expectedType: 'string'
        });
      }
      const $linkedElement = document.getElementById(linkedElementId);
      if (!($linkedElement instanceof HTMLElement)) {
        throw new ElementError($linkedElement, {
          componentName: 'Skip link',
          identifier: `$module.hash target #${linkedElementId}`
        });
      }
      return $linkedElement;
    }
    focusLinkedElement() {
      if (!this.$linkedElement.getAttribute('tabindex')) {
        this.$linkedElement.setAttribute('tabindex', '-1');
        this.$linkedElement.classList.add('govuk-skip-link-focused-element');
        if (!this.linkedElementListener) {
          this.$linkedElement.addEventListener('blur', () => this.removeFocusProperties());
          this.linkedElementListener = true;
        }
      }
      this.$linkedElement.focus();
    }
    removeFocusProperties() {
      this.$linkedElement.removeAttribute('tabindex');
      this.$linkedElement.classList.remove('govuk-skip-link-focused-element');
    }
    getFragmentFromUrl(url) {
      if (url.indexOf('#') === -1) {
        return undefined;
      }
      return url.split('#').pop();
    }
  }
  SkipLink.moduleName = 'govuk-skip-link';

  /**
   * Tabs component
   *
   * @preserve
   */
  class Tabs extends GOVUKFrontendComponent {
    /**
     * @param {Element} $module - HTML element to use for tabs
     */
    constructor($module) {
      super();
      this.$module = void 0;
      this.$tabs = void 0;
      this.$tabList = void 0;
      this.$tabListItems = void 0;
      this.keys = {
        left: 37,
        right: 39,
        up: 38,
        down: 40
      };
      this.jsHiddenClass = 'govuk-tabs__panel--hidden';
      this.changingHash = false;
      this.boundTabClick = void 0;
      this.boundTabKeydown = void 0;
      this.boundOnHashChange = void 0;
      this.mql = null;
      if (!($module instanceof HTMLElement)) {
        throw new ElementError($module, {
          componentName: 'Tabs',
          identifier: '$module'
        });
      }
      const $tabs = $module.querySelectorAll('a.govuk-tabs__tab');
      if (!$tabs.length) {
        throw new ElementError(null, {
          componentName: 'Tabs',
          identifier: `a.govuk-tabs__tab`
        });
      }
      this.$module = $module;
      this.$tabs = $tabs;
      this.boundTabClick = this.onTabClick.bind(this);
      this.boundTabKeydown = this.onTabKeydown.bind(this);
      this.boundOnHashChange = this.onHashChange.bind(this);
      const $tabList = this.$module.querySelector('.govuk-tabs__list');
      const $tabListItems = this.$module.querySelectorAll('li.govuk-tabs__list-item');
      if (!$tabList) {
        throw new ElementError(null, {
          componentName: 'Tabs',
          identifier: `.govuk-tabs__list`
        });
      }
      if (!$tabListItems.length) {
        throw new ElementError(null, {
          componentName: 'Tabs',
          identifier: `.govuk-tabs__list-item`
        });
      }
      this.$tabList = $tabList;
      this.$tabListItems = $tabListItems;
      this.setupResponsiveChecks();
    }
    setupResponsiveChecks() {
      this.mql = window.matchMedia('(min-width: 40.0625em)');
      if ('addEventListener' in this.mql) {
        this.mql.addEventListener('change', () => {
          this.checkMode();
        });
      } else {
        this.mql.addListener(() => {
          this.checkMode();
        });
      }
      this.checkMode();
    }
    checkMode() {
      if (this.mql.matches) {
        this.setup();
      } else {
        this.teardown();
      }
    }
    setup() {
      this.$tabList.setAttribute('role', 'tablist');
      this.$tabListItems.forEach($item => {
        $item.setAttribute('role', 'presentation');
      });
      this.$tabs.forEach($tab => {
        this.setAttributes($tab);
        $tab.addEventListener('click', this.boundTabClick, true);
        $tab.addEventListener('keydown', this.boundTabKeydown, true);
        this.hideTab($tab);
      });
      const $activeTab = this.getTab(window.location.hash) || this.$tabs[0];
      this.showTab($activeTab);
      window.addEventListener('hashchange', this.boundOnHashChange, true);
    }
    teardown() {
      this.$tabList.removeAttribute('role');
      this.$tabListItems.forEach($item => {
        $item.removeAttribute('role');
      });
      this.$tabs.forEach($tab => {
        $tab.removeEventListener('click', this.boundTabClick, true);
        $tab.removeEventListener('keydown', this.boundTabKeydown, true);
        this.unsetAttributes($tab);
      });
      window.removeEventListener('hashchange', this.boundOnHashChange, true);
    }
    onHashChange() {
      const hash = window.location.hash;
      const $tabWithHash = this.getTab(hash);
      if (!$tabWithHash) {
        return;
      }
      if (this.changingHash) {
        this.changingHash = false;
        return;
      }
      const $previousTab = this.getCurrentTab();
      if (!$previousTab) {
        return;
      }
      this.hideTab($previousTab);
      this.showTab($tabWithHash);
      $tabWithHash.focus();
    }
    hideTab($tab) {
      this.unhighlightTab($tab);
      this.hidePanel($tab);
    }
    showTab($tab) {
      this.highlightTab($tab);
      this.showPanel($tab);
    }
    getTab(hash) {
      return this.$module.querySelector(`a.govuk-tabs__tab[href="${hash}"]`);
    }
    setAttributes($tab) {
      const panelId = this.getHref($tab).slice(1);
      $tab.setAttribute('id', `tab_${panelId}`);
      $tab.setAttribute('role', 'tab');
      $tab.setAttribute('aria-controls', panelId);
      $tab.setAttribute('aria-selected', 'false');
      $tab.setAttribute('tabindex', '-1');
      const $panel = this.getPanel($tab);
      if (!$panel) {
        return;
      }
      $panel.setAttribute('role', 'tabpanel');
      $panel.setAttribute('aria-labelledby', $tab.id);
      $panel.classList.add(this.jsHiddenClass);
    }
    unsetAttributes($tab) {
      $tab.removeAttribute('id');
      $tab.removeAttribute('role');
      $tab.removeAttribute('aria-controls');
      $tab.removeAttribute('aria-selected');
      $tab.removeAttribute('tabindex');
      const $panel = this.getPanel($tab);
      if (!$panel) {
        return;
      }
      $panel.removeAttribute('role');
      $panel.removeAttribute('aria-labelledby');
      $panel.classList.remove(this.jsHiddenClass);
    }
    onTabClick(event) {
      const $currentTab = this.getCurrentTab();
      const $nextTab = event.currentTarget;
      if (!$currentTab || !($nextTab instanceof HTMLAnchorElement)) {
        return;
      }
      event.preventDefault();
      this.hideTab($currentTab);
      this.showTab($nextTab);
      this.createHistoryEntry($nextTab);
    }
    createHistoryEntry($tab) {
      const $panel = this.getPanel($tab);
      if (!$panel) {
        return;
      }
      const panelId = $panel.id;
      $panel.id = '';
      this.changingHash = true;
      window.location.hash = this.getHref($tab).slice(1);
      $panel.id = panelId;
    }
    onTabKeydown(event) {
      switch (event.keyCode) {
        case this.keys.left:
        case this.keys.up:
          this.activatePreviousTab();
          event.preventDefault();
          break;
        case this.keys.right:
        case this.keys.down:
          this.activateNextTab();
          event.preventDefault();
          break;
      }
    }
    activateNextTab() {
      const $currentTab = this.getCurrentTab();
      if (!$currentTab || !$currentTab.parentElement) {
        return;
      }
      const $nextTabListItem = $currentTab.parentElement.nextElementSibling;
      if (!$nextTabListItem) {
        return;
      }
      const $nextTab = $nextTabListItem.querySelector('a.govuk-tabs__tab');
      if (!$nextTab) {
        return;
      }
      this.hideTab($currentTab);
      this.showTab($nextTab);
      $nextTab.focus();
      this.createHistoryEntry($nextTab);
    }
    activatePreviousTab() {
      const $currentTab = this.getCurrentTab();
      if (!$currentTab || !$currentTab.parentElement) {
        return;
      }
      const $previousTabListItem = $currentTab.parentElement.previousElementSibling;
      if (!$previousTabListItem) {
        return;
      }
      const $previousTab = $previousTabListItem.querySelector('a.govuk-tabs__tab');
      if (!$previousTab) {
        return;
      }
      this.hideTab($currentTab);
      this.showTab($previousTab);
      $previousTab.focus();
      this.createHistoryEntry($previousTab);
    }
    getPanel($tab) {
      return this.$module.querySelector(this.getHref($tab));
    }
    showPanel($tab) {
      const $panel = this.getPanel($tab);
      if (!$panel) {
        return;
      }
      $panel.classList.remove(this.jsHiddenClass);
    }
    hidePanel($tab) {
      const $panel = this.getPanel($tab);
      if (!$panel) {
        return;
      }
      $panel.classList.add(this.jsHiddenClass);
    }
    unhighlightTab($tab) {
      if (!$tab.parentElement) {
        return;
      }
      $tab.setAttribute('aria-selected', 'false');
      $tab.parentElement.classList.remove('govuk-tabs__list-item--selected');
      $tab.setAttribute('tabindex', '-1');
    }
    highlightTab($tab) {
      if (!$tab.parentElement) {
        return;
      }
      $tab.setAttribute('aria-selected', 'true');
      $tab.parentElement.classList.add('govuk-tabs__list-item--selected');
      $tab.setAttribute('tabindex', '0');
    }
    getCurrentTab() {
      return this.$module.querySelector('.govuk-tabs__list-item--selected a.govuk-tabs__tab');
    }
    getHref($tab) {
      const href = $tab.getAttribute('href');
      const hash = href.slice(href.indexOf('#'), href.length);
      return hash;
    }
  }
  Tabs.moduleName = 'govuk-tabs';

  /**
   * Initialise all components
   *
   * Use the `data-module` attributes to find, instantiate and init all of the
   * components provided as part of GOV.UK Frontend.
   *
   * @param {Config & { scope?: Element }} [config] - Config for all components (with optional scope)
   */
  function initAll(config) {
    config = typeof config !== 'undefined' ? config : {};
    if (!isSupported()) {
      console.log(new SupportError());
      return;
    }
    const components = [[Accordion, config.accordion], [Button, config.button], [CharacterCount, config.characterCount], [Checkboxes], [ErrorSummary, config.errorSummary], [ExitThisPage, config.exitThisPage], [Header], [NotificationBanner, config.notificationBanner], [Radios], [SkipLink], [Tabs]];
    const $scope = config.scope instanceof HTMLElement ? config.scope : document;
    components.forEach(([Component, config]) => {
      const $elements = $scope.querySelectorAll(`[data-module="${Component.moduleName}"]`);
      $elements.forEach($element => {
        try {
          'defaults' in Component ? new Component($element, config) : new Component($element);
        } catch (error) {
          console.log(error);
        }
      });
    });
  }

  /**
   * Config for all components via `initAll()`
   *
   * @typedef {object} Config
   * @property {AccordionConfig} [accordion] - Accordion config
   * @property {ButtonConfig} [button] - Button config
   * @property {CharacterCountConfig} [characterCount] - Character Count config
   * @property {ErrorSummaryConfig} [errorSummary] - Error Summary config
   * @property {ExitThisPageConfig} [exitThisPage] - Exit This Page config
   * @property {NotificationBannerConfig} [notificationBanner] - Notification Banner config
   */

  /**
   * Config for individual components
   *
   * @typedef {import('./components/accordion/accordion.mjs').AccordionConfig} AccordionConfig
   * @typedef {import('./components/accordion/accordion.mjs').AccordionTranslations} AccordionTranslations
   * @typedef {import('./components/button/button.mjs').ButtonConfig} ButtonConfig
   * @typedef {import('./components/character-count/character-count.mjs').CharacterCountConfig} CharacterCountConfig
   * @typedef {import('./components/character-count/character-count.mjs').CharacterCountTranslations} CharacterCountTranslations
   * @typedef {import('./components/error-summary/error-summary.mjs').ErrorSummaryConfig} ErrorSummaryConfig
   * @typedef {import('./components/exit-this-page/exit-this-page.mjs').ExitThisPageConfig} ExitThisPageConfig
   * @typedef {import('./components/exit-this-page/exit-this-page.mjs').ExitThisPageTranslations} ExitThisPageTranslations
   * @typedef {import('./components/notification-banner/notification-banner.mjs').NotificationBannerConfig} NotificationBannerConfig
   */

  /**
   * Component config keys, e.g. `accordion` and `characterCount`
   *
   * @typedef {keyof Config} ConfigKey
   */

  exports.Accordion = Accordion;
  exports.Button = Button;
  exports.CharacterCount = CharacterCount;
  exports.Checkboxes = Checkboxes;
  exports.ErrorSummary = ErrorSummary;
  exports.ExitThisPage = ExitThisPage;
  exports.Header = Header;
  exports.NotificationBanner = NotificationBanner;
  exports.Radios = Radios;
  exports.SkipLink = SkipLink;
  exports.Tabs = Tabs;
  exports.initAll = initAll;
  exports.version = version;

}));
//# sourceMappingURL=all.bundle.js.map
