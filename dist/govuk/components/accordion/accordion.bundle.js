(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.GOVUKFrontend = global.GOVUKFrontend || {}));
})(this, (function (exports) { 'use strict';

  function isInitialised($root, moduleName) {
    return $root instanceof HTMLElement && $root.hasAttribute(`data-${moduleName}-init`);
  }

  /**
   * Checks if GOV.UK Frontend is supported on this page
   *
   * Some browsers will load and run our JavaScript but GOV.UK Frontend
   * won't be supported.
   *
   * @param {HTMLElement | null} [$scope] - (internal) `<body>` HTML element checked for browser support
   * @returns {boolean} Whether GOV.UK Frontend is supported on this page
   */
  function isSupported($scope = document.body) {
    if (!$scope) {
      return false;
    }
    return $scope.classList.contains('govuk-frontend-supported');
  }
  function isArray(option) {
    return Array.isArray(option);
  }
  function isObject(option) {
    return !!option && typeof option === 'object' && !isArray(option);
  }
  function formatErrorMessage(Component, message) {
    return `${Component.moduleName}: ${message}`;
  }
  /**
   * @typedef ComponentWithModuleName
   * @property {string} moduleName - Name of the component
   */

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
          component,
          identifier,
          element,
          expectedType
        } = messageOrOptions;
        message = identifier;
        message += element ? ` is not of type ${expectedType != null ? expectedType : 'HTMLElement'}` : ' not found';
        message = formatErrorMessage(component, message);
      }
      super(message);
      this.name = 'ElementError';
    }
  }
  class InitError extends GOVUKFrontendError {
    constructor(componentOrMessage) {
      const message = typeof componentOrMessage === 'string' ? componentOrMessage : formatErrorMessage(componentOrMessage, `Root element (\`$root\`) already initialised`);
      super(message);
      this.name = 'InitError';
    }
  }
  /**
   * @typedef {import('../common/index.mjs').ComponentWithModuleName} ComponentWithModuleName
   */

  class GOVUKFrontendComponent {
    /**
     * Returns the root element of the component
     *
     * @protected
     * @returns {RootElementType} - the root element of component
     */
    get $root() {
      return this._$root;
    }
    constructor($root) {
      this._$root = void 0;
      const childConstructor = this.constructor;
      if (typeof childConstructor.moduleName !== 'string') {
        throw new InitError(`\`moduleName\` not defined in component`);
      }
      if (!($root instanceof childConstructor.elementType)) {
        throw new ElementError({
          element: $root,
          component: childConstructor,
          identifier: 'Root element (`$root`)',
          expectedType: childConstructor.elementType.name
        });
      } else {
        this._$root = $root;
      }
      childConstructor.checkSupport();
      this.checkInitialised();
      const moduleName = childConstructor.moduleName;
      this.$root.setAttribute(`data-${moduleName}-init`, '');
    }
    checkInitialised() {
      const constructor = this.constructor;
      const moduleName = constructor.moduleName;
      if (moduleName && isInitialised(this.$root, moduleName)) {
        throw new InitError(constructor);
      }
    }
    static checkSupport() {
      if (!isSupported()) {
        throw new SupportError();
      }
    }
  }

  /**
   * @typedef ChildClass
   * @property {string} moduleName - The module name that'll be looked for in the DOM when initialising the component
   */

  /**
   * @typedef {typeof GOVUKFrontendComponent & ChildClass} ChildClassConstructor
   */
  GOVUKFrontendComponent.elementType = HTMLElement;

  const configOverride = Symbol.for('configOverride');
  class ConfigurableComponent extends GOVUKFrontendComponent {
    [configOverride](param) {
      return {};
    }

    /**
     * Returns the root element of the component
     *
     * @protected
     * @returns {ConfigurationType} - the root element of component
     */
    get config() {
      return this._config;
    }
    constructor($root, config) {
      super($root);
      this._config = void 0;
      const childConstructor = this.constructor;
      if (typeof childConstructor.defaults === 'undefined') {
        throw new ConfigError(formatErrorMessage(childConstructor, 'Config passed as parameter into constructor but no defaults defined'));
      }
      const datasetConfig = normaliseDataset(childConstructor, this._$root.dataset);
      this._config = mergeConfigs(childConstructor.defaults, config != null ? config : {}, this[configOverride](datasetConfig), datasetConfig);
    }
  }
  function normaliseString(value, property) {
    const trimmedValue = value ? value.trim() : '';
    let output;
    let outputType = property == null ? void 0 : property.type;
    if (!outputType) {
      if (['true', 'false'].includes(trimmedValue)) {
        outputType = 'boolean';
      }
      if (trimmedValue.length > 0 && isFinite(Number(trimmedValue))) {
        outputType = 'number';
      }
    }
    switch (outputType) {
      case 'boolean':
        output = trimmedValue === 'true';
        break;
      case 'number':
        output = Number(trimmedValue);
        break;
      default:
        output = value;
    }
    return output;
  }
  function normaliseDataset(Component, dataset) {
    if (typeof Component.schema === 'undefined') {
      throw new ConfigError(formatErrorMessage(Component, 'Config passed as parameter into constructor but no schema defined'));
    }
    const out = {};
    for (const [field, property] of Object.entries(Component.schema.properties)) {
      if (field in dataset) {
        out[field] = normaliseString(dataset[field], property);
      }
      if ((property == null ? void 0 : property.type) === 'object') {
        out[field] = extractConfigByNamespace(Component.schema, dataset, field);
      }
    }
    return out;
  }
  function mergeConfigs(...configObjects) {
    const formattedConfigObject = {};
    for (const configObject of configObjects) {
      for (const key of Object.keys(configObject)) {
        const option = formattedConfigObject[key];
        const override = configObject[key];
        if (isObject(option) && isObject(override)) {
          formattedConfigObject[key] = mergeConfigs(option, override);
        } else {
          formattedConfigObject[key] = override;
        }
      }
    }
    return formattedConfigObject;
  }
  function extractConfigByNamespace(schema, dataset, namespace) {
    const property = schema.properties[namespace];
    if ((property == null ? void 0 : property.type) !== 'object') {
      return;
    }
    const newObject = {
      [namespace]: ({})
    };
    for (const [key, value] of Object.entries(dataset)) {
      let current = newObject;
      const keyParts = key.split('.');
      for (const [index, name] of keyParts.entries()) {
        if (typeof current === 'object') {
          if (index < keyParts.length - 1) {
            if (!isObject(current[name])) {
              current[name] = {};
            }
            current = current[name];
          } else if (key !== namespace) {
            current[name] = normaliseString(value);
          }
        }
      }
    }
    return newObject[namespace];
  }
  /**
   * Schema for component config
   *
   * @typedef {object} Schema
   * @property {{ [field: string]: SchemaProperty | undefined }} properties - Schema properties
   * @property {SchemaCondition[]} [anyOf] - List of schema conditions
   */
  /**
   * Schema property for component config
   *
   * @typedef {object} SchemaProperty
   * @property {'string' | 'boolean' | 'number' | 'object'} type - Property type
   */
  /**
   * Schema condition for component config
   *
   * @typedef {object} SchemaCondition
   * @property {string[]} required - List of required config fields
   * @property {string} errorMessage - Error message when required config fields not provided
   */
  /**
   * @template {ObjectNested} [ConfigurationType={}]
   * @typedef ChildClass
   * @property {string} moduleName - The module name that'll be looked for in the DOM when initialising the component
   * @property {Schema} [schema] - The schema of the component configuration
   * @property {ConfigurationType} [defaults] - The default values of the configuration of the component
   */
  /**
   * @template {ObjectNested} [ConfigurationType={}]
   * @typedef {typeof GOVUKFrontendComponent & ChildClass<ConfigurationType>} ChildClassConstructor<ConfigurationType>
   */

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
      let translation = this.translations[lookupKey];
      if (typeof (options == null ? void 0 : options.count) === 'number' && typeof translation === 'object') {
        const translationPluralForm = translation[this.getPluralSuffix(lookupKey, options.count)];
        if (translationPluralForm) {
          translation = translationPluralForm;
        }
      }
      if (typeof translation === 'string') {
        if (translation.match(/%{(.\S+)}/)) {
          if (!options) {
            throw new Error('i18n: cannot replace placeholders in string if no option data provided');
          }
          return this.replacePlaceholders(translation, options);
        }
        return translation;
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
      const translation = this.translations[lookupKey];
      const preferredForm = this.hasIntlPluralRulesSupport() ? new Intl.PluralRules(this.locale).select(count) : this.selectPluralFormUsingFallbackRules(count);
      if (typeof translation === 'object') {
        if (preferredForm in translation) {
          return preferredForm;
        } else if ('other' in translation) {
          console.warn(`i18n: Missing plural form ".${preferredForm}" for "${this.locale}" locale. Falling back to ".other".`);
          return 'other';
        }
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
   * @augments ConfigurableComponent<AccordionConfig>
   */
  class Accordion extends ConfigurableComponent {
    /**
     * @param {Element | null} $root - HTML element to use for accordion
     * @param {AccordionConfig} [config] - Accordion config
     */
    constructor($root, config = {}) {
      super($root, config);
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
      this.$showAllButton = null;
      this.$showAllIcon = null;
      this.$showAllText = null;
      this.i18n = new I18n(this.config.i18n);
      const $sections = this.$root.querySelectorAll(`.${this.sectionClass}`);
      if (!$sections.length) {
        throw new ElementError({
          component: Accordion,
          identifier: `Sections (\`<div class="${this.sectionClass}">\`)`
        });
      }
      this.$sections = $sections;
      this.initControls();
      this.initSectionHeaders();
      this.updateShowAllButton(this.areAllSectionsOpen());
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
      this.$root.insertBefore($accordionControls, this.$root.firstChild);
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
          throw new ElementError({
            component: Accordion,
            identifier: `Section headers (\`<div class="${this.sectionHeaderClass}">\`)`
          });
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
      if (!$heading) {
        throw new ElementError({
          component: Accordion,
          identifier: `Section heading (\`.${this.sectionHeadingClass}\`)`
        });
      }
      if (!$span) {
        throw new ElementError({
          component: Accordion,
          identifier: `Section button placeholder (\`<span class="${this.sectionButtonClass}">\`)`
        });
      }
      const $button = document.createElement('button');
      $button.setAttribute('type', 'button');
      $button.setAttribute('aria-controls', `${this.$root.id}-content-${index + 1}`);
      for (const attr of Array.from($span.attributes)) {
        if (attr.name !== 'id') {
          $button.setAttribute(attr.name, attr.value);
        }
      }
      const $headingText = document.createElement('span');
      $headingText.classList.add(this.sectionHeadingTextClass);
      $headingText.id = $span.id;
      const $headingTextFocus = document.createElement('span');
      $headingTextFocus.classList.add(this.sectionHeadingTextFocusClass);
      $headingText.appendChild($headingTextFocus);
      Array.from($span.childNodes).forEach($child => $headingTextFocus.appendChild($child));
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
        for (const attr of Array.from($summary.attributes)) {
          $summarySpan.setAttribute(attr.name, attr.value);
        }
        Array.from($summary.childNodes).forEach($child => $summarySpanFocus.appendChild($child));
        $summary.remove();
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
      const nowExpanded = !this.isExpanded($section);
      this.setExpanded(nowExpanded, $section);
      this.storeState($section, nowExpanded);
    }
    onShowOrHideAllToggle() {
      const nowExpanded = !this.areAllSectionsOpen();
      this.$sections.forEach($section => {
        this.setExpanded(nowExpanded, $section);
        this.storeState($section, nowExpanded);
      });
      this.updateShowAllButton(nowExpanded);
    }
    setExpanded(expanded, $section) {
      const $showHideIcon = $section.querySelector(`.${this.upChevronIconClass}`);
      const $showHideText = $section.querySelector(`.${this.sectionShowHideTextClass}`);
      const $button = $section.querySelector(`.${this.sectionButtonClass}`);
      const $content = $section.querySelector(`.${this.sectionContentClass}`);
      if (!$content) {
        throw new ElementError({
          component: Accordion,
          identifier: `Section content (\`<div class="${this.sectionContentClass}">\`)`
        });
      }
      if (!$showHideIcon || !$showHideText || !$button) {
        return;
      }
      const newButtonText = expanded ? this.i18n.t('hideSection') : this.i18n.t('showSection');
      $showHideText.textContent = newButtonText;
      $button.setAttribute('aria-expanded', `${expanded}`);
      const ariaLabelParts = [];
      const $headingText = $section.querySelector(`.${this.sectionHeadingTextClass}`);
      if ($headingText) {
        ariaLabelParts.push(`${$headingText.textContent}`.trim());
      }
      const $summary = $section.querySelector(`.${this.sectionSummaryClass}`);
      if ($summary) {
        ariaLabelParts.push(`${$summary.textContent}`.trim());
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
      this.updateShowAllButton(this.areAllSectionsOpen());
    }
    isExpanded($section) {
      return $section.classList.contains(this.sectionExpandedClass);
    }
    areAllSectionsOpen() {
      return Array.from(this.$sections).every($section => this.isExpanded($section));
    }
    updateShowAllButton(expanded) {
      if (!this.$showAllButton || !this.$showAllText || !this.$showAllIcon) {
        return;
      }
      this.$showAllButton.setAttribute('aria-expanded', expanded.toString());
      this.$showAllText.textContent = expanded ? this.i18n.t('hideAllSections') : this.i18n.t('showAllSections');
      this.$showAllIcon.classList.toggle(this.downChevronIconClass, !expanded);
    }

    /**
     * Get the identifier for a section
     *
     * We need a unique way of identifying each content in the Accordion.
     * Since an `#id` should be unique and an `id` is required for `aria-`
     * attributes `id` can be safely used.
     *
     * @param {Element} $section - Section element
     * @returns {string | undefined | null} Identifier for section
     */
    getIdentifier($section) {
      const $button = $section.querySelector(`.${this.sectionButtonClass}`);
      return $button == null ? void 0 : $button.getAttribute('aria-controls');
    }
    storeState($section, isExpanded) {
      if (!this.config.rememberExpanded) {
        return;
      }
      const id = this.getIdentifier($section);
      if (id) {
        try {
          window.sessionStorage.setItem(id, isExpanded.toString());
        } catch (exception) {}
      }
    }
    setInitialState($section) {
      if (!this.config.rememberExpanded) {
        return;
      }
      const id = this.getIdentifier($section);
      if (id) {
        try {
          const state = window.sessionStorage.getItem(id);
          if (state !== null) {
            this.setExpanded(state === 'true', $section);
          }
        } catch (exception) {}
      }
    }
    getButtonPunctuationEl() {
      const $punctuationEl = document.createElement('span');
      $punctuationEl.classList.add('govuk-visually-hidden', this.sectionHeadingDividerClass);
      $punctuationEl.textContent = ', ';
      return $punctuationEl;
    }
  }

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

  /**
   * @typedef {import('../../common/configuration.mjs').Schema} Schema
   */
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
  Accordion.schema = Object.freeze({
    properties: {
      i18n: {
        type: 'object'
      },
      rememberExpanded: {
        type: 'boolean'
      }
    }
  });

  exports.Accordion = Accordion;

}));
//# sourceMappingURL=accordion.bundle.js.map
