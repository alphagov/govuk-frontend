(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('GOVUKFrontend.ErrorSummary', factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (global.GOVUKFrontend = global.GOVUKFrontend || {}, global.GOVUKFrontend.ErrorSummary = factory()));
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

  (function (undefined$1) {

    // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-service/1f3c09b402f65bf6e393f933a15ba63f1b86ef1f/packages/polyfill-library/polyfills/Element/prototype/matches/detect.js
    var detect = (
      'document' in this && "matches" in document.documentElement
    );

    if (detect) return

    // Polyfill from https://raw.githubusercontent.com/Financial-Times/polyfill-service/1f3c09b402f65bf6e393f933a15ba63f1b86ef1f/packages/polyfill-library/polyfills/Element/prototype/matches/polyfill.js
    // @ts-expect-error Ignore unknown browser prefixed properties
    Element.prototype.matches = Element.prototype.webkitMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.mozMatchesSelector || function matches(selector) {
      var element = this;
      var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
      var index = 0;

      while (elements[index] && elements[index] !== element) {
        ++index;
      }

      return !!elements[index];
    };

  }).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

  (function(undefined$1) {

    // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-service/1f3c09b402f65bf6e393f933a15ba63f1b86ef1f/packages/polyfill-library/polyfills/Element/prototype/closest/detect.js
    var detect = (
      'document' in this && "closest" in document.documentElement
    );

    if (detect) return

    // Polyfill from https://raw.githubusercontent.com/Financial-Times/polyfill-service/1f3c09b402f65bf6e393f933a15ba63f1b86ef1f/packages/polyfill-library/polyfills/Element/prototype/closest/polyfill.js
    Element.prototype.closest = function closest(selector) {
      var node = this;

      while (node) {
        if (node.matches(selector)) return node;
        // @ts-expect-error Ignore mismatch between Element and ParentNode types
        else node = 'SVGElement' in window && node instanceof SVGElement ? node.parentNode : node.parentElement;
      }

      return null;
    };

  }).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

  /**
   * JavaScript enhancements for the ErrorSummary
   *
   * Takes focus on initialisation for accessible announcement, unless disabled in configuration.
   *
   * @class
   * @param {Element} $module - HTML element to use for error summary
   * @param {ErrorSummaryConfig} [config] - Error summary config
   */
  function ErrorSummary ($module, config) {
    // Some consuming code may not be passing a module,
    // for example if they initialise the component
    // on their own by directly passing the result
    // of `document.querySelector`.
    // To avoid breaking further JavaScript initialisation
    // we need to safeguard against this so things keep
    // working the same now we read the elements data attributes
    if (!($module instanceof HTMLElement)) {
      // Little safety in case code gets ported as-is
      // into and ES6 class constructor, where the return value matters
      return this
    }

    /** @deprecated Will be made private in v5.0 */
    this.$module = $module;

    /** @type {ErrorSummaryConfig} */
    var defaultConfig = {
      disableAutoFocus: false
    };

    /**
     * @deprecated Will be made private in v5.0
     * @type {ErrorSummaryConfig}
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
  ErrorSummary.prototype.init = function () {
    // Check that required elements are present
    if (!this.$module) {
      return
    }

    var $module = this.$module;

    this.setFocus();
    $module.addEventListener('click', this.handleClick.bind(this));
  };

  /**
   * Focus the error summary
   *
   * @deprecated Will be made private in v5.0
   */
  ErrorSummary.prototype.setFocus = function () {
    var $module = this.$module;

    if (this.config.disableAutoFocus) {
      return
    }

    // Set tabindex to -1 to make the element programmatically focusable, but
    // remove it on blur as the error summary doesn't need to be focused again.
    $module.setAttribute('tabindex', '-1');

    $module.addEventListener('blur', function () {
      $module.removeAttribute('tabindex');
    });

    $module.focus();
  };

  /**
   * Click event handler
   *
   * @deprecated Will be made private in v5.0
   * @param {MouseEvent} event - Click event
   */
  ErrorSummary.prototype.handleClick = function (event) {
    var $target = event.target;
    if (this.focusTarget($target)) {
      event.preventDefault();
    }
  };

  /**
   * Focus the target element
   *
   * By default, the browser will scroll the target into view. Because our labels
   * or legends appear above the input, this means the user will be presented with
   * an input without any context, as the label or legend will be off the top of
   * the screen.
   *
   * Manually handling the click event, scrolling the question into view and then
   * focussing the element solves this.
   *
   * This also results in the label and/or legend being announced correctly in
   * NVDA (as tested in 2018.3.2) - without this only the field type is announced
   * (e.g. "Edit, has autocomplete").
   *
   * @deprecated Will be made private in v5.0
   * @param {EventTarget} $target - Event target
   * @returns {boolean} True if the target was able to be focussed
   */
  ErrorSummary.prototype.focusTarget = function ($target) {
    // If the element that was clicked was not a link, return early
    if (!($target instanceof HTMLAnchorElement)) {
      return false
    }

    var inputId = this.getFragmentFromUrl($target.href);
    if (!inputId) {
      return false
    }

    var $input = document.getElementById(inputId);
    if (!$input) {
      return false
    }

    var $legendOrLabel = this.getAssociatedLegendOrLabel($input);
    if (!$legendOrLabel) {
      return false
    }

    // Scroll the legend or label into view *before* calling focus on the input to
    // avoid extra scrolling in browsers that don't support `preventScroll` (which
    // at time of writing is most of them...)
    $legendOrLabel.scrollIntoView();
    $input.focus({ preventScroll: true });

    return true
  };

  /**
   * Get fragment from URL
   *
   * Extract the fragment (everything after the hash) from a URL, but not including
   * the hash.
   *
   * @deprecated Will be made private in v5.0
   * @param {string} url - URL
   * @returns {string | undefined} Fragment from URL, without the hash
   */
  ErrorSummary.prototype.getFragmentFromUrl = function (url) {
    if (url.indexOf('#') === -1) {
      return undefined
    }

    return url.split('#').pop()
  };

  /**
   * Get associated legend or label
   *
   * Returns the first element that exists from this list:
   *
   * - The `<legend>` associated with the closest `<fieldset>` ancestor, as long
   *   as the top of it is no more than half a viewport height away from the
   *   bottom of the input
   * - The first `<label>` that is associated with the input using for="inputId"
   * - The closest parent `<label>`
   *
   * @deprecated Will be made private in v5.0
   * @param {Element} $input - The input
   * @returns {Element | null} Associated legend or label, or null if no associated
   *   legend or label can be found
   */
  ErrorSummary.prototype.getAssociatedLegendOrLabel = function ($input) {
    var $fieldset = $input.closest('fieldset');

    if ($fieldset) {
      var $legends = $fieldset.getElementsByTagName('legend');

      if ($legends.length) {
        var $candidateLegend = $legends[0];

        // If the input type is radio or checkbox, always use the legend if there
        // is one.
        if ($input instanceof HTMLInputElement && ($input.type === 'checkbox' || $input.type === 'radio')) {
          return $candidateLegend
        }

        // For other input types, only scroll to the fieldset’s legend (instead of
        // the label associated with the input) if the input would end up in the
        // top half of the screen.
        //
        // This should avoid situations where the input either ends up off the
        // screen, or obscured by a software keyboard.
        var legendTop = $candidateLegend.getBoundingClientRect().top;
        var inputRect = $input.getBoundingClientRect();

        // If the browser doesn't support Element.getBoundingClientRect().height
        // or window.innerHeight (like IE8), bail and just link to the label.
        if (inputRect.height && window.innerHeight) {
          var inputBottom = inputRect.top + inputRect.height;

          if (inputBottom - legendTop < window.innerHeight / 2) {
            return $candidateLegend
          }
        }
      }
    }

    return document.querySelector("label[for='" + $input.getAttribute('id') + "']") ||
      $input.closest('label')
  };

  /**
   * Error summary config
   *
   * @typedef {object} ErrorSummaryConfig
   * @property {boolean} [disableAutoFocus=false] - If set to `true` the error
   *   summary will not be focussed when the page loads.
   */

  return ErrorSummary;

}));
//# sourceMappingURL=error-summary.js.map
