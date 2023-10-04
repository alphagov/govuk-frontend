(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define('GOVUKFrontend.Button', ['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.GOVUKFrontend = global.GOVUKFrontend || {}, global.GOVUKFrontend.Button = {})));
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

  exports.Button = Button;

}));
//# sourceMappingURL=button.bundle.js.map
