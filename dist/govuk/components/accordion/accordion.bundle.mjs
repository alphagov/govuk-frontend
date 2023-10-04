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

export { Accordion };
//# sourceMappingURL=accordion.bundle.mjs.map
