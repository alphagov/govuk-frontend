(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('GOVUKFrontend.Button', factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (global.GOVUKFrontend = global.GOVUKFrontend || {}, global.GOVUKFrontend.Button = factory()));
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

  var KEY_SPACE = 32;
  var DEBOUNCE_TIMEOUT_IN_SECONDS = 1;

  /**
   * JavaScript enhancements for the Button component
   *
   * @class
   * @param {Element} $module - HTML element to use for button
   * @param {ButtonConfig} [config] - Button config
   */
  function Button ($module, config) {
    if (!($module instanceof HTMLElement)) {
      return this
    }

    /** @deprecated Will be made private in v5.0 */
    this.$module = $module;

    /** @deprecated Will be made private in v5.0 */
    this.debounceFormSubmitTimer = null;

    /** @type {ButtonConfig} */
    var defaultConfig = {
      preventDoubleClick: false
    };

    /**
     * @deprecated Will be made private in v5.0
     * @type {ButtonConfig}
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
  Button.prototype.init = function () {
    // Check that required elements are present
    if (!this.$module) {
      return
    }

    this.$module.addEventListener('keydown', this.handleKeyDown);
    this.$module.addEventListener('click', this.debounce.bind(this));
  };

  /**
   * Trigger a click event when the space key is pressed
   *
   * Some screen readers tell users they can activate things with the 'button'
   * role, so we need to match the functionality of native HTML buttons
   *
   * See https://github.com/alphagov/govuk_elements/pull/272#issuecomment-233028270
   *
   * @deprecated Will be made private in v5.0
   * @param {KeyboardEvent} event - Keydown event
   */
  Button.prototype.handleKeyDown = function (event) {
    var $target = event.target;

    // Handle space bar only
    if (event.keyCode !== KEY_SPACE) {
      return
    }

    // Handle elements with [role="button"] only
    if ($target instanceof HTMLElement && $target.getAttribute('role') === 'button') {
      event.preventDefault(); // prevent the page from scrolling
      $target.click();
    }
  };

  /**
   * Debounce double-clicks
   *
   * If the click quickly succeeds a previous click then nothing will happen. This
   * stops people accidentally causing multiple form submissions by double
   * clicking buttons.
   *
   * @deprecated Will be made private in v5.0
   * @param {MouseEvent} event - Mouse click event
   * @returns {undefined | false} Returns undefined, or false when debounced
   */
  Button.prototype.debounce = function (event) {
    // Check the button that was clicked has preventDoubleClick enabled
    if (!this.config.preventDoubleClick) {
      return
    }

    // If the timer is still running, prevent the click from submitting the form
    if (this.debounceFormSubmitTimer) {
      event.preventDefault();
      return false
    }

    this.debounceFormSubmitTimer = setTimeout(/** @this {Button} */ function () {
      this.debounceFormSubmitTimer = null;
    }.bind(this), DEBOUNCE_TIMEOUT_IN_SECONDS * 1000);
  };

  /**
   * Button config
   *
   * @typedef {object} ButtonConfig
   * @property {boolean} [preventDoubleClick=false] - Prevent accidental double
   *   clicks on submit buttons from submitting forms multiple times.
   */

  return Button;

}));
//# sourceMappingURL=button.js.map
