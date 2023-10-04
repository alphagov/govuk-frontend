(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define('GOVUKFrontend.SkipLink', ['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.GOVUKFrontend = global.GOVUKFrontend || {}, global.GOVUKFrontend.SkipLink = {})));
})(this, (function (exports) { 'use strict';

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

  exports.SkipLink = SkipLink;

}));
//# sourceMappingURL=skip-link.bundle.js.map
