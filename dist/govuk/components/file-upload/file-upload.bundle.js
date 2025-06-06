(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.GOVUKFrontend = global.GOVUKFrontend || {}));
})(this, (function (exports) { 'use strict';

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
  /**
   * @import { ObjectNested } from './configuration.mjs'
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
   * @import { ComponentWithModuleName } from '../common/index.mjs'
   */

  class Component {
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
   * @typedef {typeof Component & ChildClass} ChildClassConstructor
   */
  Component.elementType = HTMLElement;

  const configOverride = Symbol.for('configOverride');
  class ConfigurableComponent extends Component {
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
      if (!isObject(childConstructor.defaults)) {
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
    if (!isObject(Component.schema)) {
      throw new ConfigError(formatErrorMessage(Component, 'Config passed as parameter into constructor but no schema defined'));
    }
    const out = {};
    const entries = Object.entries(Component.schema.properties);
    for (const entry of entries) {
      const [namespace, property] = entry;
      const field = namespace.toString();
      if (field in dataset) {
        out[field] = normaliseString(dataset[field], property);
      }
      if ((property == null ? void 0 : property.type) === 'object') {
        out[field] = extractConfigByNamespace(Component.schema, dataset, namespace);
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
      [namespace]: {}
    };
    for (const [key, value] of Object.entries(dataset)) {
      let current = newObject;
      const keyParts = key.split('.');
      for (const [index, name] of keyParts.entries()) {
        if (isObject(current)) {
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
   * @template {Partial<Record<keyof ConfigurationType, unknown>>} ConfigurationType
   * @typedef {object} Schema
   * @property {Record<keyof ConfigurationType, SchemaProperty | undefined>} properties - Schema properties
   * @property {SchemaCondition<ConfigurationType>[]} [anyOf] - List of schema conditions
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
   * @template {Partial<Record<keyof ConfigurationType, unknown>>} ConfigurationType
   * @typedef {object} SchemaCondition
   * @property {(keyof ConfigurationType)[]} required - List of required config fields
   * @property {string} errorMessage - Error message when required config fields not provided
   */
  /**
   * @template {Partial<Record<keyof ConfigurationType, unknown>>} [ConfigurationType=ObjectNested]
   * @typedef ChildClass
   * @property {string} moduleName - The module name that'll be looked for in the DOM when initialising the component
   * @property {Schema<ConfigurationType>} [schema] - The schema of the component configuration
   * @property {ConfigurationType} [defaults] - The default values of the configuration of the component
   */
  /**
   * @template {Partial<Record<keyof ConfigurationType, unknown>>} [ConfigurationType=ObjectNested]
   * @typedef {typeof Component & ChildClass<ConfigurationType>} ChildClassConstructor<ConfigurationType>
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
   * File upload component
   *
   * @preserve
   * @augments ConfigurableComponent<FileUploadConfig>
   */
  class FileUpload extends ConfigurableComponent {
    /**
     * @param {Element | null} $root - File input element
     * @param {FileUploadConfig} [config] - File Upload config
     */
    constructor($root, config = {}) {
      super($root, config);
      this.$input = void 0;
      this.$button = void 0;
      this.$status = void 0;
      this.i18n = void 0;
      this.id = void 0;
      this.$announcements = void 0;
      this.enteredAnotherElement = void 0;
      const $input = this.$root.querySelector('input');
      if ($input === null) {
        throw new ElementError({
          component: FileUpload,
          identifier: 'File inputs (`<input type="file">`)'
        });
      }
      if ($input.type !== 'file') {
        throw new ElementError(formatErrorMessage(FileUpload, 'File input (`<input type="file">`) attribute (`type`) is not `file`'));
      }
      this.$input = $input;
      this.$input.setAttribute('hidden', 'true');
      if (!this.$input.id) {
        throw new ElementError({
          component: FileUpload,
          identifier: 'File input (`<input type="file">`) attribute (`id`)'
        });
      }
      this.id = this.$input.id;
      this.i18n = new I18n(this.config.i18n, {
        locale: closestAttributeValue(this.$root, 'lang')
      });
      const $label = this.findLabel();
      if (!$label.id) {
        $label.id = `${this.id}-label`;
      }
      this.$input.id = `${this.id}-input`;
      const $button = document.createElement('button');
      $button.classList.add('govuk-file-upload-button');
      $button.type = 'button';
      $button.id = this.id;
      $button.classList.add('govuk-file-upload-button--empty');
      const ariaDescribedBy = this.$input.getAttribute('aria-describedby');
      if (ariaDescribedBy) {
        $button.setAttribute('aria-describedby', ariaDescribedBy);
      }
      const $status = document.createElement('span');
      $status.className = 'govuk-body govuk-file-upload-button__status';
      $status.setAttribute('aria-live', 'polite');
      $status.innerText = this.i18n.t('noFileChosen');
      $button.appendChild($status);
      const commaSpan = document.createElement('span');
      commaSpan.className = 'govuk-visually-hidden';
      commaSpan.innerText = ', ';
      commaSpan.id = `${this.id}-comma`;
      $button.appendChild(commaSpan);
      const containerSpan = document.createElement('span');
      containerSpan.className = 'govuk-file-upload-button__pseudo-button-container';
      const buttonSpan = document.createElement('span');
      buttonSpan.className = 'govuk-button govuk-button--secondary govuk-file-upload-button__pseudo-button';
      buttonSpan.innerText = this.i18n.t('chooseFilesButton');
      containerSpan.appendChild(buttonSpan);
      containerSpan.insertAdjacentText('beforeend', ' ');
      const instructionSpan = document.createElement('span');
      instructionSpan.className = 'govuk-body govuk-file-upload-button__instruction';
      instructionSpan.innerText = this.i18n.t('dropInstruction');
      containerSpan.appendChild(instructionSpan);
      $button.appendChild(containerSpan);
      $button.setAttribute('aria-labelledby', `${$label.id} ${commaSpan.id} ${$button.id}`);
      $button.addEventListener('click', this.onClick.bind(this));
      $button.addEventListener('dragover', event => {
        event.preventDefault();
      });
      this.$root.insertAdjacentElement('afterbegin', $button);
      this.$input.setAttribute('tabindex', '-1');
      this.$input.setAttribute('aria-hidden', 'true');
      this.$button = $button;
      this.$status = $status;
      this.$input.addEventListener('change', this.onChange.bind(this));
      this.updateDisabledState();
      this.observeDisabledState();
      this.$announcements = document.createElement('span');
      this.$announcements.classList.add('govuk-file-upload-announcements');
      this.$announcements.classList.add('govuk-visually-hidden');
      this.$announcements.setAttribute('aria-live', 'assertive');
      this.$root.insertAdjacentElement('afterend', this.$announcements);
      this.$button.addEventListener('drop', this.onDrop.bind(this));
      document.addEventListener('dragenter', this.updateDropzoneVisibility.bind(this));
      document.addEventListener('dragenter', () => {
        this.enteredAnotherElement = true;
      });
      document.addEventListener('dragleave', () => {
        if (!this.enteredAnotherElement && !this.$button.disabled) {
          this.hideDraggingState();
          this.$announcements.innerText = this.i18n.t('leftDropZone');
        }
        this.enteredAnotherElement = false;
      });
    }
    updateDropzoneVisibility(event) {
      if (this.$button.disabled) return;
      if (event.target instanceof Node) {
        if (this.$root.contains(event.target)) {
          if (event.dataTransfer && isContainingFiles(event.dataTransfer)) {
            if (!this.$button.classList.contains('govuk-file-upload-button--dragging')) {
              this.showDraggingState();
              this.$announcements.innerText = this.i18n.t('enteredDropZone');
            }
          }
        } else {
          if (this.$button.classList.contains('govuk-file-upload-button--dragging')) {
            this.hideDraggingState();
            this.$announcements.innerText = this.i18n.t('leftDropZone');
          }
        }
      }
    }
    showDraggingState() {
      this.$button.classList.add('govuk-file-upload-button--dragging');
    }
    hideDraggingState() {
      this.$button.classList.remove('govuk-file-upload-button--dragging');
    }
    onDrop(event) {
      event.preventDefault();
      if (event.dataTransfer && isContainingFiles(event.dataTransfer)) {
        this.$input.files = event.dataTransfer.files;
        this.$input.dispatchEvent(new CustomEvent('change'));
        this.hideDraggingState();
      }
    }
    onChange() {
      const fileCount = this.$input.files.length;
      if (fileCount === 0) {
        this.$status.innerText = this.i18n.t('noFileChosen');
        this.$button.classList.add('govuk-file-upload-button--empty');
      } else {
        if (fileCount === 1) {
          this.$status.innerText = this.$input.files[0].name;
        } else {
          this.$status.innerText = this.i18n.t('multipleFilesChosen', {
            count: fileCount
          });
        }
        this.$button.classList.remove('govuk-file-upload-button--empty');
      }
    }
    findLabel() {
      const $label = document.querySelector(`label[for="${this.$input.id}"]`);
      if (!$label) {
        throw new ElementError({
          component: FileUpload,
          identifier: `Field label (\`<label for=${this.$input.id}>\`)`
        });
      }
      return $label;
    }
    onClick() {
      this.$input.click();
    }
    observeDisabledState() {
      const observer = new MutationObserver(mutationList => {
        for (const mutation of mutationList) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
            this.updateDisabledState();
          }
        }
      });
      observer.observe(this.$input, {
        attributes: true
      });
    }
    updateDisabledState() {
      this.$button.disabled = this.$input.disabled;
      this.$root.classList.toggle('govuk-drop-zone--disabled', this.$button.disabled);
    }
  }
  FileUpload.moduleName = 'govuk-file-upload';
  FileUpload.defaults = Object.freeze({
    i18n: {
      chooseFilesButton: 'Choose file',
      dropInstruction: 'or drop file',
      noFileChosen: 'No file chosen',
      multipleFilesChosen: {
        one: '%{count} file chosen',
        other: '%{count} files chosen'
      },
      enteredDropZone: 'Entered drop zone',
      leftDropZone: 'Left drop zone'
    }
  });
  FileUpload.schema = Object.freeze({
    properties: {
      i18n: {
        type: 'object'
      }
    }
  });
  function isContainingFiles(dataTransfer) {
    const hasNoTypesInfo = dataTransfer.types.length === 0;
    const isDraggingFiles = dataTransfer.types.some(type => type === 'Files');
    return hasNoTypesInfo || isDraggingFiles;
  }

  /**
   * @typedef {HTMLInputElement & {files: FileList}} HTMLFileInputElement
   */

  /**
   * File upload config
   *
   * @see {@link FileUpload.defaults}
   * @typedef {object} FileUploadConfig
   * @property {FileUploadTranslations} [i18n=FileUpload.defaults.i18n] - File upload translations
   */

  /**
   * File upload translations
   *
   * @see {@link FileUpload.defaults.i18n}
   * @typedef {object} FileUploadTranslations
   *
   * Messages used by the component
   * @property {string} [chooseFile] - The text of the button that opens the file picker
   * @property {string} [dropInstruction] - The text informing users they can drop files
   * @property {TranslationPluralForms} [multipleFilesChosen] - The text displayed when multiple files
   *   have been chosen by the user
   * @property {string} [noFileChosen] - The text to displayed when no file has been chosen by the user
   * @property {string} [enteredDropZone] - The text announced by assistive technology
   *   when user drags files and enters the drop zone
   * @property {string} [leftDropZone] - The text announced by assistive technology
   *   when user drags files and leaves the drop zone without dropping
   */

  /**
   * @import { Schema } from '../../common/configuration.mjs'
   * @import { TranslationPluralForms } from '../../i18n.mjs'
   */

  exports.FileUpload = FileUpload;

}));
//# sourceMappingURL=file-upload.bundle.js.map
