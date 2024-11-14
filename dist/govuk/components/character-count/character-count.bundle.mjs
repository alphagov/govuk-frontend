function closestAttributeValue($element, attributeName) {
  const $closestElementWithAttribute = $element.closest(`[${attributeName}]`);
  return $closestElementWithAttribute ? $closestElementWithAttribute.getAttribute(attributeName) : null;
}

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
function validateConfig(schema, config) {
  const validationErrors = [];
  for (const [name, conditions] of Object.entries(schema)) {
    const errors = [];
    if (Array.isArray(conditions)) {
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
  }
  return validationErrors;
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
 * @augments ConfigurableComponent<CharacterCountConfig>
 */
class CharacterCount extends ConfigurableComponent {
  [configOverride](datasetConfig) {
    let configOverrides = {};
    if ('maxwords' in datasetConfig || 'maxlength' in datasetConfig) {
      configOverrides = {
        maxlength: undefined,
        maxwords: undefined
      };
    }
    return configOverrides;
  }

  /**
   * @param {Element | null} $root - HTML element to use for character count
   * @param {CharacterCountConfig} [config] - Character count config
   */
  constructor($root, config = {}) {
    var _ref, _this$config$maxwords;
    super($root, config);
    this.$textarea = void 0;
    this.$visibleCountMessage = void 0;
    this.$screenReaderCountMessage = void 0;
    this.lastInputTimestamp = null;
    this.lastInputValue = '';
    this.valueChecker = null;
    this.i18n = void 0;
    this.maxLength = void 0;
    const $textarea = this.$root.querySelector('.govuk-js-character-count');
    if (!($textarea instanceof HTMLTextAreaElement || $textarea instanceof HTMLInputElement)) {
      throw new ElementError({
        component: CharacterCount,
        element: $textarea,
        expectedType: 'HTMLTextareaElement or HTMLInputElement',
        identifier: 'Form field (`.govuk-js-character-count`)'
      });
    }
    const errors = validateConfig(CharacterCount.schema, this.config);
    if (errors[0]) {
      throw new ConfigError(formatErrorMessage(CharacterCount, errors[0]));
    }
    this.i18n = new I18n(this.config.i18n, {
      locale: closestAttributeValue(this.$root, 'lang')
    });
    this.maxLength = (_ref = (_this$config$maxwords = this.config.maxwords) != null ? _this$config$maxwords : this.config.maxlength) != null ? _ref : Infinity;
    this.$textarea = $textarea;
    const textareaDescriptionId = `${this.$textarea.id}-info`;
    const $textareaDescription = document.getElementById(textareaDescriptionId);
    if (!$textareaDescription) {
      throw new ElementError({
        component: CharacterCount,
        element: $textareaDescription,
        identifier: `Count message (\`id="${textareaDescriptionId}"\`)`
      });
    }
    if (`${$textareaDescription.textContent}`.match(/^\s*$/)) {
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
    if (this.valueChecker) {
      window.clearInterval(this.valueChecker);
    }
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
    const isError = remainingNumber < 0;
    this.$visibleCountMessage.classList.toggle('govuk-character-count__message--disabled', !this.isOverThreshold());
    this.$textarea.classList.toggle('govuk-textarea--error', isError);
    this.$visibleCountMessage.classList.toggle('govuk-error-message', isError);
    this.$visibleCountMessage.classList.toggle('govuk-hint', !isError);
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
      var _text$match;
      const tokens = (_text$match = text.match(/\S+/g)) != null ? _text$match : [];
      return tokens.length;
    }
    return text.length;
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
 * @typedef {import('../../common/configuration.mjs').Schema} Schema
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
  properties: {
    i18n: {
      type: 'object'
    },
    maxwords: {
      type: 'number'
    },
    maxlength: {
      type: 'number'
    },
    threshold: {
      type: 'number'
    }
  },
  anyOf: [{
    required: ['maxwords'],
    errorMessage: 'Either "maxlength" or "maxwords" must be provided'
  }, {
    required: ['maxlength'],
    errorMessage: 'Either "maxlength" or "maxwords" must be provided'
  }]
});

export { CharacterCount };
//# sourceMappingURL=character-count.bundle.mjs.map
