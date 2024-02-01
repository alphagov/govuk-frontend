(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.GOVUKFrontend = {}));
})(this, (function (exports) { 'use strict';

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
  function setFocus($element, options = {}) {
    var _options$onBeforeFocu;
    const isFocusable = $element.getAttribute('tabindex');
    if (!isFocusable) {
      $element.setAttribute('tabindex', '-1');
    }
    function onFocus() {
      $element.addEventListener('blur', onBlur, {
        once: true
      });
    }
    function onBlur() {
      var _options$onBlur;
      (_options$onBlur = options.onBlur) == null || _options$onBlur.call($element);
      if (!isFocusable) {
        $element.removeAttribute('tabindex');
      }
    }
    $element.addEventListener('focus', onFocus, {
      once: true
    });
    (_options$onBeforeFocu = options.onBeforeFocus) == null || _options$onBeforeFocu.call($element);
    $element.focus();
  }
  function isSupported($scope = document.body) {
    if (!$scope) {
      return false;
    }
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

  /**
   * Notification Banner component
   *
   * @preserve
   */
  class NotificationBanner extends GOVUKFrontendComponent {
    /**
     * @param {Element | null} $module - HTML element to use for notification banner
     * @param {NotificationBannerConfig} [config] - Notification banner config
     */
    constructor($module, config = {}) {
      super();
      this.$module = void 0;
      this.config = void 0;
      if (!($module instanceof HTMLElement)) {
        throw new ElementError({
          componentName: 'Notification banner',
          element: $module,
          identifier: 'Root element (`$module`)'
        });
      }
      this.$module = $module;
      this.config = mergeConfigs(NotificationBanner.defaults, config, normaliseDataset($module.dataset));
      if (this.$module.getAttribute('role') === 'alert' && !this.config.disableAutoFocus) {
        setFocus(this.$module);
      }
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

  exports.NotificationBanner = NotificationBanner;

}));
//# sourceMappingURL=notification-banner.bundle.js.map
