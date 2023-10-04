(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define('GOVUKFrontend.ErrorSummary', ['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.GOVUKFrontend = global.GOVUKFrontend || {}, global.GOVUKFrontend.ErrorSummary = {})));
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

  exports.ErrorSummary = ErrorSummary;

}));
//# sourceMappingURL=error-summary.bundle.js.map
