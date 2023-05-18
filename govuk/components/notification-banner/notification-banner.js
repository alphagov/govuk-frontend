(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('GOVUKFrontend.NotificationBanner', factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (global.GOVUKFrontend = global.GOVUKFrontend || {}, global.GOVUKFrontend.NotificationBanner = factory()));
})(this, (function () { 'use strict';

  /**
   * Common helpers which do not require polyfill.
   *
   * IMPORTANT: If a helper require a polyfill, please isolate it in its own module
   * so that the polyfill can be properly tree-shaken and does not burden
   * the components that do not need that helper
   *
   * @module common/index
   */


  /**
   * Config flattening function
   *
   * Takes any number of objects, flattens them into namespaced key-value pairs,
   * (e.g. \{'i18n.showSection': 'Show section'\}) and combines them together, with
   * greatest priority on the LAST item passed in.
   *
   * @deprecated Will be made private in v5.0
   * @returns {{ [key: string]: unknown }} A flattened object of key-value pairs.
   */
  function mergeConfigs (/* configObject1, configObject2, ...configObjects */) {
    /**
     * Function to take nested objects and flatten them to a dot-separated keyed
     * object. Doing this means we don't need to do any deep/recursive merging of
     * each of our objects, nor transform our dataset from a flat list into a
     * nested object.
     *
     * @param {{ [key: string]: unknown }} configObject - Deeply nested object
     * @returns {{ [key: string]: unknown }} Flattened object with dot-separated keys
     */
    var flattenObject = function (configObject) {
      // Prepare an empty return object
      /** @type {{ [key: string]: unknown }} */
      var flattenedObject = {};

      /**
       * Our flattening function, this is called recursively for each level of
       * depth in the object. At each level we prepend the previous level names to
       * the key using `prefix`.
       *
       * @param {Partial<{ [key: string]: unknown }>} obj - Object to flatten
       * @param {string} [prefix] - Optional dot-separated prefix
       */
      var flattenLoop = function (obj, prefix) {
        // Loop through keys...
        for (var key in obj) {
          // Check to see if this is a prototypical key/value,
          // if it is, skip it.
          if (!Object.prototype.hasOwnProperty.call(obj, key)) {
            continue
          }
          var value = obj[key];
          var prefixedKey = prefix ? prefix + '.' + key : key;
          if (typeof value === 'object') {
            // If the value is a nested object, recurse over that too
            flattenLoop(value, prefixedKey);
          } else {
            // Otherwise, add this value to our return object
            flattenedObject[prefixedKey] = value;
          }
        }
      };

      // Kick off the recursive loop
      flattenLoop(configObject);
      return flattenedObject
    };

    // Start with an empty object as our base
    /** @type {{ [key: string]: unknown }} */
    var formattedConfigObject = {};

    // Loop through each of the remaining passed objects and push their keys
    // one-by-one into configObject. Any duplicate keys will override the existing
    // key with the new value.
    for (var i = 0; i < arguments.length; i++) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- Ignore mismatch between arguments types
      var obj = flattenObject(arguments[i]);
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          formattedConfigObject[key] = obj[key];
        }
      }
    }

    return formattedConfigObject
  }

  /**
   * Normalise string
   *
   * 'If it looks like a duck, and it quacks like a duck…' 🦆
   *
   * If the passed value looks like a boolean or a number, convert it to a boolean
   * or number.
   *
   * Designed to be used to convert config passed via data attributes (which are
   * always strings) into something sensible.
   *
   * @deprecated Will be made private in v5.0
   * @param {string} value - The value to normalise
   * @returns {string | boolean | number | undefined} Normalised data
   */
  function normaliseString (value) {
    if (typeof value !== 'string') {
      return value
    }

    var trimmedValue = value.trim();

    if (trimmedValue === 'true') {
      return true
    }

    if (trimmedValue === 'false') {
      return false
    }

    // Empty / whitespace-only strings are considered finite so we need to check
    // the length of the trimmed string as well
    if (trimmedValue.length > 0 && isFinite(Number(trimmedValue))) {
      return Number(trimmedValue)
    }

    return value
  }

  /**
   * Normalise dataset
   *
   * Loop over an object and normalise each value using normaliseData function
   *
   * @deprecated Will be made private in v5.0
   * @param {DOMStringMap} dataset - HTML element dataset
   * @returns {{ [key: string]: unknown }} Normalised dataset
   */
  function normaliseDataset (dataset) {
    /** @type {{ [key: string]: unknown }} */
    var out = {};

    for (var key in dataset) {
      out[key] = normaliseString(dataset[key]);
    }

    return out
  }

  /**
   * Notification Banner component
   *
   * @class
   * @param {Element} $module - HTML element to use for notification banner
   * @param {NotificationBannerConfig} [config] - Notification banner config
   */
  function NotificationBanner ($module, config) {
    if (!($module instanceof HTMLElement)) {
      return this
    }

    /** @deprecated Will be made private in v5.0 */
    this.$module = $module;

    /** @type {NotificationBannerConfig} */
    var defaultConfig = {
      disableAutoFocus: false
    };

    /**
     * @deprecated Will be made private in v5.0
     * @type {NotificationBannerConfig}
     */
    this.config = mergeConfigs(
      defaultConfig,
      config || {},
      normaliseDataset($module.dataset)
    );
  }

  /**
   * Initialise component
   */
  NotificationBanner.prototype.init = function () {
    // Check that required elements are present
    if (!this.$module) {
      return
    }

    this.setFocus();
  };

  /**
   * Focus the element
   *
   * If `role="alert"` is set, focus the element to help some assistive technologies
   * prioritise announcing it.
   *
   * You can turn off the auto-focus functionality by setting `data-disable-auto-focus="true"` in the
   * component HTML. You might wish to do this based on user research findings, or to avoid a clash
   * with another element which should be focused when the page loads.
   *
   * @deprecated Will be made private in v5.0
   */
  NotificationBanner.prototype.setFocus = function () {
    var $module = this.$module;

    if (this.config.disableAutoFocus) {
      return
    }

    if ($module.getAttribute('role') !== 'alert') {
      return
    }

    // Set tabindex to -1 to make the element focusable with JavaScript.
    // Remove the tabindex on blur as the component doesn't need to be focusable after the page has
    // loaded.
    if (!$module.getAttribute('tabindex')) {
      $module.setAttribute('tabindex', '-1');

      $module.addEventListener('blur', function () {
        $module.removeAttribute('tabindex');
      });
    }

    $module.focus();
  };

  /**
   * Notification banner config
   *
   * @typedef {object} NotificationBannerConfig
   * @property {boolean} [disableAutoFocus=false] - If set to `true` the
   *   notification banner will not be focussed when the page loads. This only
   *   applies if the component has a `role` of `alert` – in other cases the
   *   component will not be focused on page load, regardless of this option.
   */

  return NotificationBanner;

}));
//# sourceMappingURL=notification-banner.js.map
