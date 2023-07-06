(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('GOVUKFrontend.ExitThisPage', factory) :
	(global.GOVUKFrontend = global.GOVUKFrontend || {}, global.GOVUKFrontend.ExitThisPage = factory());
}(this, (function () { 'use strict';

	// @ts-nocheck
	(function (undefined) {

	// Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Object/defineProperty/detect.js
	var detect = (
	  // In IE8, defineProperty could only act on DOM elements, so full support
	  // for the feature requires the ability to set a property on an arbitrary object
	  'defineProperty' in Object && (function() {
	  	try {
	  		var a = {};
	  		Object.defineProperty(a, 'test', {value:42});
	  		return true;
	  	} catch(e) {
	  		return false
	  	}
	  }())
	);

	if (detect) return

	// Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Object.defineProperty&flags=always
	(function (nativeDefineProperty) {

		var supportsAccessors = Object.prototype.hasOwnProperty('__defineGetter__');
		var ERR_ACCESSORS_NOT_SUPPORTED = 'Getters & setters cannot be defined on this javascript engine';
		var ERR_VALUE_ACCESSORS = 'A property cannot both have accessors and be writable or have a value';

		Object.defineProperty = function defineProperty(object, property, descriptor) {

			// Where native support exists, assume it
			if (nativeDefineProperty && (object === window || object === document || object === Element.prototype || object instanceof Element)) {
				return nativeDefineProperty(object, property, descriptor);
			}

			if (object === null || !(object instanceof Object || typeof object === 'object')) {
				throw new TypeError('Object.defineProperty called on non-object');
			}

			if (!(descriptor instanceof Object)) {
				throw new TypeError('Property description must be an object');
			}

			var propertyString = String(property);
			var hasValueOrWritable = 'value' in descriptor || 'writable' in descriptor;
			var getterType = 'get' in descriptor && typeof descriptor.get;
			var setterType = 'set' in descriptor && typeof descriptor.set;

			// handle descriptor.get
			if (getterType) {
				if (getterType !== 'function') {
					throw new TypeError('Getter must be a function');
				}
				if (!supportsAccessors) {
					throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
				}
				if (hasValueOrWritable) {
					throw new TypeError(ERR_VALUE_ACCESSORS);
				}
				Object.__defineGetter__.call(object, propertyString, descriptor.get);
			} else {
				object[propertyString] = descriptor.value;
			}

			// handle descriptor.set
			if (setterType) {
				if (setterType !== 'function') {
					throw new TypeError('Setter must be a function');
				}
				if (!supportsAccessors) {
					throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
				}
				if (hasValueOrWritable) {
					throw new TypeError(ERR_VALUE_ACCESSORS);
				}
				Object.__defineSetter__.call(object, propertyString, descriptor.set);
			}

			// OK to define value unconditionally - if a getter has been specified as well, an error would be thrown above
			if ('value' in descriptor) {
				object[propertyString] = descriptor.value;
			}

			return object;
		};
	}(Object.defineProperty));
	})
	.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

	// @ts-nocheck
	(function (undefined) {

	// Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Document/detect.js
	var detect = ("Document" in this);

	if (detect) return

	// Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Document&flags=always
	if ((typeof WorkerGlobalScope === "undefined") && (typeof importScripts !== "function")) {

		if (this.HTMLDocument) { // IE8

			// HTMLDocument is an extension of Document.  If the browser has HTMLDocument but not Document, the former will suffice as an alias for the latter.
			this.Document = this.HTMLDocument;

		} else {

			// Create an empty function to act as the missing constructor for the document object, attach the document object as its prototype.  The function needs to be anonymous else it is hoisted and causes the feature detect to prematurely pass, preventing the assignments below being made.
			this.Document = this.HTMLDocument = document.constructor = (new Function('return function Document() {}')());
			this.Document.prototype = document;
		}
	}


	})
	.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

	// @ts-nocheck

	(function(undefined) {

	// Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Element/detect.js
	var detect = ('Element' in this && 'HTMLElement' in this);

	if (detect) return

	// Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Element&flags=always
	(function () {

		// IE8
		if (window.Element && !window.HTMLElement) {
			window.HTMLElement = window.Element;
			return;
		}

		// create Element constructor
		window.Element = window.HTMLElement = new Function('return function Element() {}')();

		// generate sandboxed iframe
		var vbody = document.appendChild(document.createElement('body'));
		var frame = vbody.appendChild(document.createElement('iframe'));

		// use sandboxed iframe to replicate Element functionality
		var frameDocument = frame.contentWindow.document;
		var prototype = Element.prototype = frameDocument.appendChild(frameDocument.createElement('*'));
		var cache = {};

		// polyfill Element.prototype on an element
		var shiv = function (element, deep) {
			var
			childNodes = element.childNodes || [],
			index = -1,
			key, value, childNode;

			if (element.nodeType === 1 && element.constructor !== Element) {
				element.constructor = Element;

				for (key in cache) {
					value = cache[key];
					element[key] = value;
				}
			}

			while (childNode = deep && childNodes[++index]) {
				shiv(childNode, deep);
			}

			return element;
		};

		var elements = document.getElementsByTagName('*');
		var nativeCreateElement = document.createElement;
		var interval;
		var loopLimit = 100;

		prototype.attachEvent('onpropertychange', function (event) {
			var
			propertyName = event.propertyName,
			nonValue = !cache.hasOwnProperty(propertyName),
			newValue = prototype[propertyName],
			oldValue = cache[propertyName],
			index = -1,
			element;

			while (element = elements[++index]) {
				if (element.nodeType === 1) {
					if (nonValue || element[propertyName] === oldValue) {
						element[propertyName] = newValue;
					}
				}
			}

			cache[propertyName] = newValue;
		});

		prototype.constructor = Element;

		if (!prototype.hasAttribute) {
			// <Element>.hasAttribute
			prototype.hasAttribute = function hasAttribute(name) {
				return this.getAttribute(name) !== null;
			};
		}

		// Apply Element prototype to the pre-existing DOM as soon as the body element appears.
		function bodyCheck() {
			if (!(loopLimit--)) clearTimeout(interval);
			if (document.body && !document.body.prototype && /(complete|interactive)/.test(document.readyState)) {
				shiv(document, true);
				if (interval && document.body.prototype) clearTimeout(interval);
				return (!!document.body.prototype);
			}
			return false;
		}
		if (!bodyCheck()) {
			document.onreadystatechange = bodyCheck;
			interval = setInterval(bodyCheck, 25);
		}

		// Apply to any new elements created after load
		document.createElement = function createElement(nodeName) {
			var element = nativeCreateElement(String(nodeName).toLowerCase());
			return shiv(element);
		};

		// remove sandboxed iframe
		document.removeChild(vbody);
	}());

	})
	.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

	// @ts-nocheck

	(function(undefined) {

	  // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-library/13cf7c340974d128d557580b5e2dafcd1b1192d1/polyfills/Element/prototype/dataset/detect.js
	  var detect = (function(){
	    if (!document.documentElement.dataset) {
	      return false;
	    }
	    var el = document.createElement('div');
	    el.setAttribute("data-a-b", "c");
	    return el.dataset && el.dataset.aB == "c";
	  }());

	  if (detect) return

	  // Polyfill derived from  https://raw.githubusercontent.com/Financial-Times/polyfill-library/13cf7c340974d128d557580b5e2dafcd1b1192d1/polyfills/Element/prototype/dataset/polyfill.js
	  Object.defineProperty(Element.prototype, 'dataset', {
	    get: function() {
	      var element = this;
	      var attributes = this.attributes;
	      var map = {};

	      for (var i = 0; i < attributes.length; i++) {
	        var attribute = attributes[i];

	        // This regex has been edited from the original polyfill, to add
	        // support for period (.) separators in data-* attribute names. These
	        // are allowed in the HTML spec, but were not covered by the original
	        // polyfill's regex. We use periods in our i18n implementation.
	        if (attribute && attribute.name && (/^data-\w[.\w-]*$/).test(attribute.name)) {
	          var name = attribute.name;
	          var value = attribute.value;

	          var propName = name.substr(5).replace(/-./g, function (prop) {
	            return prop.charAt(1).toUpperCase();
	          });

	          // If this browser supports __defineGetter__ and __defineSetter__,
	          // continue using defineProperty. If not (like IE 8 and below), we use
	          // a hacky fallback which at least gives an object in the right format
	          if ('__defineGetter__' in Object.prototype && '__defineSetter__' in Object.prototype) {
	            Object.defineProperty(map, propName, {
	              enumerable: true,
	              get: function() {
	                return this.value;
	              }.bind({value: value || ''}),
	              set: function setter(name, value) {
	                if (typeof value !== 'undefined') {
	                  this.setAttribute(name, value);
	                } else {
	                  this.removeAttribute(name);
	                }
	              }.bind(element, name)
	            });
	          } else {
	            map[propName] = value;
	          }

	        }
	      }

	      return map;
	    }
	  });

	}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

	// @ts-nocheck
	(function (undefined) {

	    // Detection from https://github.com/mdn/content/blob/cf607d68522cd35ee7670782d3ee3a361eaef2e4/files/en-us/web/javascript/reference/global_objects/string/trim/index.md#polyfill
	    var detect = ('trim' in String.prototype);

	    if (detect) return

	    // Polyfill from https://github.com/mdn/content/blob/cf607d68522cd35ee7670782d3ee3a361eaef2e4/files/en-us/web/javascript/reference/global_objects/string/trim/index.md#polyfill
	    String.prototype.trim = function () {
	        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
	    };

	}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

	/* eslint-disable es-x/no-string-prototype-trim -- Polyfill imported */

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
	 * @returns {Object<string, unknown>} Normalised dataset
	 */
	function normaliseDataset (dataset) {
	  /** @type {Object<string, unknown>} */
	  var out = {};

	  for (var key in dataset) {
	    out[key] = normaliseString(dataset[key]);
	  }

	  return out
	}

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
	 * TODO: Ideally this would be a NodeList.prototype.forEach polyfill
	 * This seems to fail in IE8, requires more investigation.
	 * See: https://github.com/imagitama/nodelist-foreach-polyfill
	 *
	 * @deprecated Will be made private in v5.0
	 * @template {Node} ElementType
	 * @param {NodeListOf<ElementType>} nodes - NodeList from querySelectorAll()
	 * @param {nodeListIterator<ElementType>} callback - Callback function to run for each node
	 * @returns {void}
	 */
	function nodeListForEach (nodes, callback) {
	  if (window.NodeList.prototype.forEach) {
	    return nodes.forEach(callback)
	  }
	  for (var i = 0; i < nodes.length; i++) {
	    callback.call(window, nodes[i], i, nodes);
	  }
	}

	/**
	 * Config flattening function
	 *
	 * Takes any number of objects, flattens them into namespaced key-value pairs,
	 * (e.g. {'i18n.showSection': 'Show section'}) and combines them together, with
	 * greatest priority on the LAST item passed in.
	 *
	 * @deprecated Will be made private in v5.0
	 * @returns {Object<string, unknown>} A flattened object of key-value pairs.
	 */
	function mergeConfigs (/* configObject1, configObject2, ...configObjects */) {
	  /**
	   * Function to take nested objects and flatten them to a dot-separated keyed
	   * object. Doing this means we don't need to do any deep/recursive merging of
	   * each of our objects, nor transform our dataset from a flat list into a
	   * nested object.
	   *
	   * @param {Object<string, unknown>} configObject - Deeply nested object
	   * @returns {Object<string, unknown>} Flattened object with dot-separated keys
	   */
	  var flattenObject = function (configObject) {
	    // Prepare an empty return object
	    /** @type {Object<string, unknown>} */
	    var flattenedObject = {};

	    /**
	     * Our flattening function, this is called recursively for each level of
	     * depth in the object. At each level we prepend the previous level names to
	     * the key using `prefix`.
	     *
	     * @param {Partial<Object<string, unknown>>} obj - Object to flatten
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
	  /** @type {Object<string, unknown>} */
	  var formattedConfigObject = {};

	  // Loop through each of the remaining passed objects and push their keys
	  // one-by-one into configObject. Any duplicate keys will override the existing
	  // key with the new value.
	  for (var i = 0; i < arguments.length; i++) {
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
	 * Extracts keys starting with a particular namespace from a flattened config
	 * object, removing the namespace in the process.
	 *
	 * @deprecated Will be made private in v5.0
	 * @param {Object<string, unknown>} configObject - The object to extract key-value pairs from.
	 * @param {string} namespace - The namespace to filter keys with.
	 * @returns {Object<string, unknown>} Flattened object with dot-separated key namespace removed
	 * @throws {Error} Config object required
	 * @throws {Error} Namespace string required
	 */
	function extractConfigByNamespace (configObject, namespace) {
	  // Check we have what we need
	  if (!configObject || typeof configObject !== 'object') {
	    throw new Error('Provide a `configObject` of type "object".')
	  }

	  if (!namespace || typeof namespace !== 'string') {
	    throw new Error('Provide a `namespace` of type "string" to filter the `configObject` by.')
	  }

	  /** @type {Object<string, unknown>} */
	  var newObject = {};

	  for (var key in configObject) {
	    // Split the key into parts, using . as our namespace separator
	    var keyParts = key.split('.');
	    // Check if the first namespace matches the configured namespace
	    if (Object.prototype.hasOwnProperty.call(configObject, key) && keyParts[0] === namespace) {
	      // Remove the first item (the namespace) from the parts array,
	      // but only if there is more than one part (we don't want blank keys!)
	      if (keyParts.length > 1) {
	        keyParts.shift();
	      }
	      // Join the remaining parts back together
	      var newKey = keyParts.join('.');
	      // Add them to our new object
	      newObject[newKey] = configObject[key];
	    }
	  }
	  return newObject
	}

	/**
	 * @template {Node} ElementType
	 * @callback nodeListIterator
	 * @param {ElementType} value - The current node being iterated on
	 * @param {number} index - The current index in the iteration
	 * @param {NodeListOf<ElementType>} nodes - NodeList from querySelectorAll()
	 * @returns {void}
	 */

	// Implementation of common function is gathered in the `common` folder

	/**
	 * Internal support for selecting messages to render, with placeholder
	 * interpolation and locale-aware number formatting and pluralisation
	 *
	 * @class
	 * @private
	 * @param {Object<string, unknown>} translations - Key-value pairs of the translation strings to use.
	 * @param {object} [config] - Configuration options for the function.
	 * @param {string} [config.locale] - An overriding locale for the PluralRules functionality.
	 */
	function I18n (translations, config) {
	  // Make list of translations available throughout function
	  this.translations = translations || {};

	  // The locale to use for PluralRules and NumberFormat
	  this.locale = (config && config.locale) || document.documentElement.lang || 'en';
	}

	/**
	 * The most used function - takes the key for a given piece of UI text and
	 * returns the appropriate string.
	 *
	 * @param {string} lookupKey - The lookup key of the string to use.
	 * @param {Object<string, unknown>} [options] - Any options passed with the translation string, e.g: for string interpolation.
	 * @returns {string} The appropriate translation string.
	 * @throws {Error} Lookup key required
	 * @throws {Error} Options required for `${}` placeholders
	 */
	I18n.prototype.t = function (lookupKey, options) {
	  if (!lookupKey) {
	    // Print a console error if no lookup key has been provided
	    throw new Error('i18n: lookup key missing')
	  }

	  // If the `count` option is set, determine which plural suffix is needed and
	  // change the lookupKey to match. We check to see if it's numeric instead of
	  // falsy, as this could legitimately be 0.
	  if (options && typeof options.count === 'number') {
	    // Get the plural suffix
	    lookupKey = lookupKey + '.' + this.getPluralSuffix(lookupKey, options.count);
	  }

	  // Fetch the translation string for that lookup key
	  var translationString = this.translations[lookupKey];

	  if (typeof translationString === 'string') {
	    // Check for ${} placeholders in the translation string
	    if (translationString.match(/%{(.\S+)}/)) {
	      if (!options) {
	        throw new Error('i18n: cannot replace placeholders in string if no option data provided')
	      }

	      return this.replacePlaceholders(translationString, options)
	    } else {
	      return translationString
	    }
	  } else {
	    // If the key wasn't found in our translations object,
	    // return the lookup key itself as the fallback
	    return lookupKey
	  }
	};

	/**
	 * Takes a translation string with placeholders, and replaces the placeholders
	 * with the provided data
	 *
	 * @param {string} translationString - The translation string
	 * @param {Object<string, unknown>} options - Any options passed with the translation string, e.g: for string interpolation.
	 * @returns {string} The translation string to output, with ${} placeholders replaced
	 */
	I18n.prototype.replacePlaceholders = function (translationString, options) {
	  /** @type {Intl.NumberFormat | undefined} */
	  var formatter;

	  if (this.hasIntlNumberFormatSupport()) {
	    formatter = new Intl.NumberFormat(this.locale);
	  }

	  return translationString.replace(
	    /%{(.\S+)}/g,

	    /**
	     * Replace translation string placeholders
	     *
	     * @param {string} placeholderWithBraces - Placeholder with braces
	     * @param {string} placeholderKey - Placeholder key
	     * @returns {string} Placeholder value
	     */
	    function (placeholderWithBraces, placeholderKey) {
	      if (Object.prototype.hasOwnProperty.call(options, placeholderKey)) {
	        var placeholderValue = options[placeholderKey];

	        // If a user has passed `false` as the value for the placeholder
	        // treat it as though the value should not be displayed
	        if (placeholderValue === false || (
	          typeof placeholderValue !== 'number' &&
	          typeof placeholderValue !== 'string')
	        ) {
	          return ''
	        }

	        // If the placeholder's value is a number, localise the number formatting
	        if (typeof placeholderValue === 'number') {
	          return formatter ? formatter.format(placeholderValue) : placeholderValue.toString()
	        }

	        return placeholderValue
	      } else {
	        throw new Error('i18n: no data found to replace ' + placeholderWithBraces + ' placeholder in string')
	      }
	    })
	};

	/**
	 * Check to see if the browser supports Intl and Intl.PluralRules.
	 *
	 * It requires all conditions to be met in order to be supported:
	 * - The browser supports the Intl class (true in IE11)
	 * - The implementation of Intl supports PluralRules (NOT true in IE11)
	 * - The browser/OS has plural rules for the current locale (browser dependent)
	 *
	 * @returns {boolean} Returns true if all conditions are met. Returns false otherwise.
	 */
	I18n.prototype.hasIntlPluralRulesSupport = function () {
	  return Boolean(window.Intl && ('PluralRules' in window.Intl && Intl.PluralRules.supportedLocalesOf(this.locale).length))
	};

	/**
	 * Check to see if the browser supports Intl and Intl.NumberFormat.
	 *
	 * It requires all conditions to be met in order to be supported:
	 * - The browser supports the Intl class (true in IE11)
	 * - The implementation of Intl supports NumberFormat (also true in IE11)
	 * - The browser/OS has number formatting rules for the current locale (browser dependent)
	 *
	 * @returns {boolean} Returns true if all conditions are met. Returns false otherwise.
	 */
	I18n.prototype.hasIntlNumberFormatSupport = function () {
	  return Boolean(window.Intl && ('NumberFormat' in window.Intl && Intl.NumberFormat.supportedLocalesOf(this.locale).length))
	};

	/**
	 * Get the appropriate suffix for the plural form.
	 *
	 * Uses Intl.PluralRules (or our own fallback implementation) to get the
	 * 'preferred' form to use for the given count.
	 *
	 * Checks that a translation has been provided for that plural form – if it
	 * hasn't, it'll fall back to the 'other' plural form (unless that doesn't exist
	 * either, in which case an error will be thrown)
	 *
	 * @param {string} lookupKey - The lookup key of the string to use.
	 * @param {number} count - Number used to determine which pluralisation to use.
	 * @returns {PluralRule} The suffix associated with the correct pluralisation for this locale.
	 * @throws {Error} Plural form `.other` required when preferred plural form is missing
	 */
	I18n.prototype.getPluralSuffix = function (lookupKey, count) {
	  // Validate that the number is actually a number.
	  //
	  // Number(count) will turn anything that can't be converted to a Number type
	  // into 'NaN'. isFinite filters out NaN, as it isn't a finite number.
	  count = Number(count);
	  if (!isFinite(count)) { return 'other' }

	  var preferredForm;

	  // Check to verify that all the requirements for Intl.PluralRules are met.
	  // If so, we can use that instead of our custom implementation. Otherwise,
	  // use the hardcoded fallback.
	  if (this.hasIntlPluralRulesSupport()) {
	    preferredForm = new Intl.PluralRules(this.locale).select(count);
	  } else {
	    preferredForm = this.selectPluralFormUsingFallbackRules(count);
	  }

	  // Use the correct plural form if provided
	  if (lookupKey + '.' + preferredForm in this.translations) {
	    return preferredForm
	  // Fall back to `other` if the plural form is missing, but log a warning
	  // to the console
	  } else if (lookupKey + '.other' in this.translations) {
	    if (console && 'warn' in console) {
	      console.warn('i18n: Missing plural form ".' + preferredForm + '" for "' +
	        this.locale + '" locale. Falling back to ".other".');
	    }

	    return 'other'
	  // If the required `other` plural form is missing, all we can do is error
	  } else {
	    throw new Error(
	      'i18n: Plural form ".other" is required for "' + this.locale + '" locale'
	    )
	  }
	};

	/**
	 * Get the plural form using our fallback implementation
	 *
	 * This is split out into a separate function to make it easier to test the
	 * fallback behaviour in an environment where Intl.PluralRules exists.
	 *
	 * @param {number} count - Number used to determine which pluralisation to use.
	 * @returns {PluralRule} The pluralisation form for count in this locale.
	 */
	I18n.prototype.selectPluralFormUsingFallbackRules = function (count) {
	  // Currently our custom code can only handle positive integers, so let's
	  // make sure our number is one of those.
	  count = Math.abs(Math.floor(count));

	  var ruleset = this.getPluralRulesForLocale();

	  if (ruleset) {
	    return I18n.pluralRules[ruleset](count)
	  }

	  return 'other'
	};

	/**
	 * Work out which pluralisation rules to use for the current locale
	 *
	 * The locale may include a regional indicator (such as en-GB), but we don't
	 * usually care about this part, as pluralisation rules are usually the same
	 * regardless of region. There are exceptions, however, (e.g. Portuguese) so
	 * this searches by both the full and shortened locale codes, just to be sure.
	 *
	 * @returns {string | undefined} The name of the pluralisation rule to use (a key for one
	 *   of the functions in this.pluralRules)
	 */
	I18n.prototype.getPluralRulesForLocale = function () {
	  var locale = this.locale;
	  var localeShort = locale.split('-')[0];

	  // Look through the plural rules map to find which `pluralRule` is
	  // appropriate for our current `locale`.
	  for (var pluralRule in I18n.pluralRulesMap) {
	    if (Object.prototype.hasOwnProperty.call(I18n.pluralRulesMap, pluralRule)) {
	      var languages = I18n.pluralRulesMap[pluralRule];
	      for (var i = 0; i < languages.length; i++) {
	        if (languages[i] === locale || languages[i] === localeShort) {
	          return pluralRule
	        }
	      }
	    }
	  }
	};

	/**
	 * Map of plural rules to languages where those rules apply.
	 *
	 * Note: These groups are named for the most dominant or recognisable language
	 * that uses each system. The groupings do not imply that the languages are
	 * related to one another. Many languages have evolved the same systems
	 * independently of one another.
	 *
	 * Code to support more languages can be found in the i18n spike:
	 * {@link https://github.com/alphagov/govuk-frontend/blob/spike-i18n-support/src/govuk/i18n.mjs}
	 *
	 * Languages currently supported:
	 *
	 * Arabic: Arabic (ar)
	 * Chinese: Burmese (my), Chinese (zh), Indonesian (id), Japanese (ja),
	 *   Javanese (jv), Korean (ko), Malay (ms), Thai (th), Vietnamese (vi)
	 * French: Armenian (hy), Bangla (bn), French (fr), Gujarati (gu), Hindi (hi),
	 *   Persian Farsi (fa), Punjabi (pa), Zulu (zu)
	 * German: Afrikaans (af), Albanian (sq), Azerbaijani (az), Basque (eu),
	 *   Bulgarian (bg), Catalan (ca), Danish (da), Dutch (nl), English (en),
	 *   Estonian (et), Finnish (fi), Georgian (ka), German (de), Greek (el),
	 *   Hungarian (hu), Luxembourgish (lb), Norwegian (no), Somali (so),
	 *   Swahili (sw), Swedish (sv), Tamil (ta), Telugu (te), Turkish (tr),
	 *   Urdu (ur)
	 * Irish: Irish Gaelic (ga)
	 * Russian: Russian (ru), Ukrainian (uk)
	 * Scottish: Scottish Gaelic (gd)
	 * Spanish: European Portuguese (pt-PT), Italian (it), Spanish (es)
	 * Welsh: Welsh (cy)
	 *
	 * @type {Object<string, string[]>}
	 */
	I18n.pluralRulesMap = {
	  arabic: ['ar'],
	  chinese: ['my', 'zh', 'id', 'ja', 'jv', 'ko', 'ms', 'th', 'vi'],
	  french: ['hy', 'bn', 'fr', 'gu', 'hi', 'fa', 'pa', 'zu'],
	  german: [
	    'af', 'sq', 'az', 'eu', 'bg', 'ca', 'da', 'nl', 'en', 'et', 'fi', 'ka',
	    'de', 'el', 'hu', 'lb', 'no', 'so', 'sw', 'sv', 'ta', 'te', 'tr', 'ur'
	  ],
	  irish: ['ga'],
	  russian: ['ru', 'uk'],
	  scottish: ['gd'],
	  spanish: ['pt-PT', 'it', 'es'],
	  welsh: ['cy']
	};

	/**
	 * Different pluralisation rule sets
	 *
	 * Returns the appropriate suffix for the plural form associated with `n`.
	 * Possible suffixes: 'zero', 'one', 'two', 'few', 'many', 'other' (the actual
	 * meaning of each differs per locale). 'other' should always exist, even in
	 * languages without plurals, such as Chinese.
	 * {@link https://cldr.unicode.org/index/cldr-spec/plural-rules}
	 *
	 * The count must be a positive integer. Negative numbers and decimals aren't accounted for
	 *
	 * @type {Object<string, function(number): PluralRule>}
	 */
	I18n.pluralRules = {
	  /* eslint-disable jsdoc/require-jsdoc */
	  arabic: function (n) {
	    if (n === 0) { return 'zero' }
	    if (n === 1) { return 'one' }
	    if (n === 2) { return 'two' }
	    if (n % 100 >= 3 && n % 100 <= 10) { return 'few' }
	    if (n % 100 >= 11 && n % 100 <= 99) { return 'many' }
	    return 'other'
	  },
	  chinese: function () {
	    return 'other'
	  },
	  french: function (n) {
	    return n === 0 || n === 1 ? 'one' : 'other'
	  },
	  german: function (n) {
	    return n === 1 ? 'one' : 'other'
	  },
	  irish: function (n) {
	    if (n === 1) { return 'one' }
	    if (n === 2) { return 'two' }
	    if (n >= 3 && n <= 6) { return 'few' }
	    if (n >= 7 && n <= 10) { return 'many' }
	    return 'other'
	  },
	  russian: function (n) {
	    var lastTwo = n % 100;
	    var last = lastTwo % 10;
	    if (last === 1 && lastTwo !== 11) { return 'one' }
	    if (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) { return 'few' }
	    if (last === 0 || (last >= 5 && last <= 9) || (lastTwo >= 11 && lastTwo <= 14)) { return 'many' }
	    // Note: The 'other' suffix is only used by decimal numbers in Russian.
	    // We don't anticipate it being used, but it's here for consistency.
	    return 'other'
	  },
	  scottish: function (n) {
	    if (n === 1 || n === 11) { return 'one' }
	    if (n === 2 || n === 12) { return 'two' }
	    if ((n >= 3 && n <= 10) || (n >= 13 && n <= 19)) { return 'few' }
	    return 'other'
	  },
	  spanish: function (n) {
	    if (n === 1) { return 'one' }
	    if (n % 1000000 === 0 && n !== 0) { return 'many' }
	    return 'other'
	  },
	  welsh: function (n) {
	    if (n === 0) { return 'zero' }
	    if (n === 1) { return 'one' }
	    if (n === 2) { return 'two' }
	    if (n === 3) { return 'few' }
	    if (n === 6) { return 'many' }
	    return 'other'
	  }
	  /* eslint-enable jsdoc/require-jsdoc */
	};

	/**
	 * Plural rule category mnemonic tags
	 *
	 * @typedef {'zero' | 'one' | 'two' | 'few' | 'many' | 'other'} PluralRule
	 */

	/**
	 * Translated message by plural rule they correspond to.
	 *
	 * Allows to group pluralised messages under a single key when passing
	 * translations to a component's constructor
	 *
	 * @typedef {object} TranslationPluralForms
	 * @property {string} [other] - General plural form
	 * @property {string} [zero] - Plural form used with 0
	 * @property {string} [one] - Plural form used with 1
	 * @property {string} [two] - Plural form used with 2
	 * @property {string} [few] - Plural form used for a few
	 * @property {string} [many] - Plural form used for many
	 */

	// @ts-nocheck
	(function (undefined) {

	    // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-service/master/packages/polyfill-library/polyfills/DOMTokenList/detect.js
	    var detect = (
	      'DOMTokenList' in this && (function (x) {
	        return 'classList' in x ? !x.classList.toggle('x', false) && !x.className : true;
	      })(document.createElement('x'))
	    );

	    if (detect) return

	    // Polyfill from https://raw.githubusercontent.com/Financial-Times/polyfill-service/master/packages/polyfill-library/polyfills/DOMTokenList/polyfill.js
	    (function (global) {
	      var nativeImpl = "DOMTokenList" in global && global.DOMTokenList;

	      if (
	          !nativeImpl ||
	          (
	            !!document.createElementNS &&
	            !!document.createElementNS('http://www.w3.org/2000/svg', 'svg') &&
	            !(document.createElementNS("http://www.w3.org/2000/svg", "svg").classList instanceof DOMTokenList)
	          )
	        ) {
	        global.DOMTokenList = (function() { // eslint-disable-line no-unused-vars
	          var dpSupport = true;
	          var defineGetter = function (object, name, fn, configurable) {
	            if (Object.defineProperty)
	              Object.defineProperty(object, name, {
	                configurable: false === dpSupport ? true : !!configurable,
	                get: fn
	              });

	            else object.__defineGetter__(name, fn);
	          };

	          /** Ensure the browser allows Object.defineProperty to be used on native JavaScript objects. */
	          try {
	            defineGetter({}, "support");
	          }
	          catch (e) {
	            dpSupport = false;
	          }


	          var _DOMTokenList = function (el, prop) {
	            var that = this;
	            var tokens = [];
	            var tokenMap = {};
	            var length = 0;
	            var maxLength = 0;
	            var addIndexGetter = function (i) {
	              defineGetter(that, i, function () {
	                preop();
	                return tokens[i];
	              }, false);

	            };
	            var reindex = function () {

	              /** Define getter functions for array-like access to the tokenList's contents. */
	              if (length >= maxLength)
	                for (; maxLength < length; ++maxLength) {
	                  addIndexGetter(maxLength);
	                }
	            };

	            /** Helper function called at the start of each class method. Internal use only. */
	            var preop = function () {
	              var error;
	              var i;
	              var args = arguments;
	              var rSpace = /\s+/;

	              /** Validate the token/s passed to an instance method, if any. */
	              if (args.length)
	                for (i = 0; i < args.length; ++i)
	                  if (rSpace.test(args[i])) {
	                    error = new SyntaxError('String "' + args[i] + '" ' + "contains" + ' an invalid character');
	                    error.code = 5;
	                    error.name = "InvalidCharacterError";
	                    throw error;
	                  }


	              /** Split the new value apart by whitespace*/
	              if (typeof el[prop] === "object") {
	                tokens = ("" + el[prop].baseVal).replace(/^\s+|\s+$/g, "").split(rSpace);
	              } else {
	                tokens = ("" + el[prop]).replace(/^\s+|\s+$/g, "").split(rSpace);
	              }

	              /** Avoid treating blank strings as single-item token lists */
	              if ("" === tokens[0]) tokens = [];

	              /** Repopulate the internal token lists */
	              tokenMap = {};
	              for (i = 0; i < tokens.length; ++i)
	                tokenMap[tokens[i]] = true;
	              length = tokens.length;
	              reindex();
	            };

	            /** Populate our internal token list if the targeted attribute of the subject element isn't empty. */
	            preop();

	            /** Return the number of tokens in the underlying string. Read-only. */
	            defineGetter(that, "length", function () {
	              preop();
	              return length;
	            });

	            /** Override the default toString/toLocaleString methods to return a space-delimited list of tokens when typecast. */
	            that.toLocaleString =
	              that.toString = function () {
	                preop();
	                return tokens.join(" ");
	              };

	            that.item = function (idx) {
	              preop();
	              return tokens[idx];
	            };

	            that.contains = function (token) {
	              preop();
	              return !!tokenMap[token];
	            };

	            that.add = function () {
	              preop.apply(that, args = arguments);

	              for (var args, token, i = 0, l = args.length; i < l; ++i) {
	                token = args[i];
	                if (!tokenMap[token]) {
	                  tokens.push(token);
	                  tokenMap[token] = true;
	                }
	              }

	              /** Update the targeted attribute of the attached element if the token list's changed. */
	              if (length !== tokens.length) {
	                length = tokens.length >>> 0;
	                if (typeof el[prop] === "object") {
	                  el[prop].baseVal = tokens.join(" ");
	                } else {
	                  el[prop] = tokens.join(" ");
	                }
	                reindex();
	              }
	            };

	            that.remove = function () {
	              preop.apply(that, args = arguments);

	              /** Build a hash of token names to compare against when recollecting our token list. */
	              for (var args, ignore = {}, i = 0, t = []; i < args.length; ++i) {
	                ignore[args[i]] = true;
	                delete tokenMap[args[i]];
	              }

	              /** Run through our tokens list and reassign only those that aren't defined in the hash declared above. */
	              for (i = 0; i < tokens.length; ++i)
	                if (!ignore[tokens[i]]) t.push(tokens[i]);

	              tokens = t;
	              length = t.length >>> 0;

	              /** Update the targeted attribute of the attached element. */
	              if (typeof el[prop] === "object") {
	                el[prop].baseVal = tokens.join(" ");
	              } else {
	                el[prop] = tokens.join(" ");
	              }
	              reindex();
	            };

	            that.toggle = function (token, force) {
	              preop.apply(that, [token]);

	              /** Token state's being forced. */
	              if (undefined !== force) {
	                if (force) {
	                  that.add(token);
	                  return true;
	                } else {
	                  that.remove(token);
	                  return false;
	                }
	              }

	              /** Token already exists in tokenList. Remove it, and return FALSE. */
	              if (tokenMap[token]) {
	                that.remove(token);
	                return false;
	              }

	              /** Otherwise, add the token and return TRUE. */
	              that.add(token);
	              return true;
	            };

	            return that;
	          };

	          return _DOMTokenList;
	        }());
	      }

	      // Add second argument to native DOMTokenList.toggle() if necessary
	      (function () {
	        var e = document.createElement('span');
	        if (!('classList' in e)) return;
	        e.classList.toggle('x', false);
	        if (!e.classList.contains('x')) return;
	        e.classList.constructor.prototype.toggle = function toggle(token /*, force*/) {
	          var force = arguments[1];
	          if (force === undefined) {
	            var add = !this.contains(token);
	            this[add ? 'add' : 'remove'](token);
	            return add;
	          }
	          force = !!force;
	          this[force ? 'add' : 'remove'](token);
	          return force;
	        };
	      }());

	      // Add multiple arguments to native DOMTokenList.add() if necessary
	      (function () {
	        var e = document.createElement('span');
	        if (!('classList' in e)) return;
	        e.classList.add('a', 'b');
	        if (e.classList.contains('b')) return;
	        var native = e.classList.constructor.prototype.add;
	        e.classList.constructor.prototype.add = function () {
	          var args = arguments;
	          var l = arguments.length;
	          for (var i = 0; i < l; i++) {
	            native.call(this, args[i]);
	          }
	        };
	      }());

	      // Add multiple arguments to native DOMTokenList.remove() if necessary
	      (function () {
	        var e = document.createElement('span');
	        if (!('classList' in e)) return;
	        e.classList.add('a');
	        e.classList.add('b');
	        e.classList.remove('a', 'b');
	        if (!e.classList.contains('b')) return;
	        var native = e.classList.constructor.prototype.remove;
	        e.classList.constructor.prototype.remove = function () {
	          var args = arguments;
	          var l = arguments.length;
	          for (var i = 0; i < l; i++) {
	            native.call(this, args[i]);
	          }
	        };
	      }());

	    }(this));

	}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

	// @ts-nocheck

	(function(undefined) {

	    // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-service/8717a9e04ac7aff99b4980fbedead98036b0929a/packages/polyfill-library/polyfills/Element/prototype/classList/detect.js
	    var detect = (
	      'document' in this && "classList" in document.documentElement && 'Element' in this && 'classList' in Element.prototype && (function () {
	        var e = document.createElement('span');
	        e.classList.add('a', 'b');
	        return e.classList.contains('b');
	      }())
	    );

	    if (detect) return

	    // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Element.prototype.classList&flags=always
	    (function (global) {
	      var dpSupport = true;
	      var defineGetter = function (object, name, fn, configurable) {
	        if (Object.defineProperty)
	          Object.defineProperty(object, name, {
	            configurable: false === dpSupport ? true : !!configurable,
	            get: fn
	          });

	        else object.__defineGetter__(name, fn);
	      };
	      /** Ensure the browser allows Object.defineProperty to be used on native JavaScript objects. */
	      try {
	        defineGetter({}, "support");
	      }
	      catch (e) {
	        dpSupport = false;
	      }
	      /** Polyfills a property with a DOMTokenList */
	      var addProp = function (o, name, attr) {

	        defineGetter(o.prototype, name, function () {
	          var tokenList;

	          var THIS = this,

	          /** Prevent this from firing twice for some reason. What the hell, IE. */
	          gibberishProperty = "__defineGetter__" + "DEFINE_PROPERTY" + name;
	          if(THIS[gibberishProperty]) return tokenList;
	          THIS[gibberishProperty] = true;

	          /**
	           * IE8 can't define properties on native JavaScript objects, so we'll use a dumb hack instead.
	           *
	           * What this is doing is creating a dummy element ("reflection") inside a detached phantom node ("mirror")
	           * that serves as the target of Object.defineProperty instead. While we could simply use the subject HTML
	           * element instead, this would conflict with element types which use indexed properties (such as forms and
	           * select lists).
	           */
	          if (false === dpSupport) {

	            var visage;
	            var mirror = addProp.mirror || document.createElement("div");
	            var reflections = mirror.childNodes;
	            var l = reflections.length;

	            for (var i = 0; i < l; ++i)
	              if (reflections[i]._R === THIS) {
	                visage = reflections[i];
	                break;
	              }

	            /** Couldn't find an element's reflection inside the mirror. Materialise one. */
	            visage || (visage = mirror.appendChild(document.createElement("div")));

	            tokenList = DOMTokenList.call(visage, THIS, attr);
	          } else tokenList = new DOMTokenList(THIS, attr);

	          defineGetter(THIS, name, function () {
	            return tokenList;
	          });
	          delete THIS[gibberishProperty];

	          return tokenList;
	        }, true);
	      };

	      addProp(global.Element, "classList", "className");
	      addProp(global.HTMLElement, "classList", "className");
	      addProp(global.HTMLLinkElement, "relList", "rel");
	      addProp(global.HTMLAnchorElement, "relList", "rel");
	      addProp(global.HTMLAreaElement, "relList", "rel");
	    }(this));

	}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

	// @ts-nocheck
	(function (undefined) {

	// Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Window/detect.js
	var detect = ('Window' in this);

	if (detect) return

	// Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Window&flags=always
	if ((typeof WorkerGlobalScope === "undefined") && (typeof importScripts !== "function")) {
		(function (global) {
			if (global.constructor) {
				global.Window = global.constructor;
			} else {
				(global.Window = global.constructor = new Function('return function Window() {}')()).prototype = this;
			}
		}(this));
	}

	})
	.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

	// @ts-nocheck

	(function(undefined) {

	// Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Event/detect.js
	var detect = (
	  (function(global) {

	  	if (!('Event' in global)) return false;
	  	if (typeof global.Event === 'function') return true;

	  	try {

	  		// In IE 9-11, the Event object exists but cannot be instantiated
	  		new Event('click');
	  		return true;
	  	} catch(e) {
	  		return false;
	  	}
	  }(this))
	);

	if (detect) return

	// Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Event&flags=always
	(function () {
		var unlistenableWindowEvents = {
			click: 1,
			dblclick: 1,
			keyup: 1,
			keypress: 1,
			keydown: 1,
			mousedown: 1,
			mouseup: 1,
			mousemove: 1,
			mouseover: 1,
			mouseenter: 1,
			mouseleave: 1,
			mouseout: 1,
			storage: 1,
			storagecommit: 1,
			textinput: 1
		};

		// This polyfill depends on availability of `document` so will not run in a worker
		// However, we asssume there are no browsers with worker support that lack proper
		// support for `Event` within the worker
		if (typeof document === 'undefined' || typeof window === 'undefined') return;

		function indexOf(array, element) {
			var
			index = -1,
			length = array.length;

			while (++index < length) {
				if (index in array && array[index] === element) {
					return index;
				}
			}

			return -1;
		}

		var existingProto = (window.Event && window.Event.prototype) || null;
		window.Event = Window.prototype.Event = function Event(type, eventInitDict) {
			if (!type) {
				throw new Error('Not enough arguments');
			}

			var event;
			// Shortcut if browser supports createEvent
			if ('createEvent' in document) {
				event = document.createEvent('Event');
				var bubbles = eventInitDict && eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false;
				var cancelable = eventInitDict && eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : false;

				event.initEvent(type, bubbles, cancelable);

				return event;
			}

			event = document.createEventObject();

			event.type = type;
			event.bubbles = eventInitDict && eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false;
			event.cancelable = eventInitDict && eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : false;

			return event;
		};
		if (existingProto) {
			Object.defineProperty(window.Event, 'prototype', {
				configurable: false,
				enumerable: false,
				writable: true,
				value: existingProto
			});
		}

		if (!('createEvent' in document)) {
			window.addEventListener = Window.prototype.addEventListener = Document.prototype.addEventListener = Element.prototype.addEventListener = function addEventListener() {
				var
				element = this,
				type = arguments[0],
				listener = arguments[1];

				if (element === window && type in unlistenableWindowEvents) {
					throw new Error('In IE8 the event: ' + type + ' is not available on the window object. Please see https://github.com/Financial-Times/polyfill-service/issues/317 for more information.');
				}

				if (!element._events) {
					element._events = {};
				}

				if (!element._events[type]) {
					element._events[type] = function (event) {
						var
						list = element._events[event.type].list,
						events = list.slice(),
						index = -1,
						length = events.length,
						eventElement;

						event.preventDefault = function preventDefault() {
							if (event.cancelable !== false) {
								event.returnValue = false;
							}
						};

						event.stopPropagation = function stopPropagation() {
							event.cancelBubble = true;
						};

						event.stopImmediatePropagation = function stopImmediatePropagation() {
							event.cancelBubble = true;
							event.cancelImmediate = true;
						};

						event.currentTarget = element;
						event.relatedTarget = event.fromElement || null;
						event.target = event.target || event.srcElement || element;
						event.timeStamp = new Date().getTime();

						if (event.clientX) {
							event.pageX = event.clientX + document.documentElement.scrollLeft;
							event.pageY = event.clientY + document.documentElement.scrollTop;
						}

						while (++index < length && !event.cancelImmediate) {
							if (index in events) {
								eventElement = events[index];

								if (indexOf(list, eventElement) !== -1 && typeof eventElement === 'function') {
									eventElement.call(element, event);
								}
							}
						}
					};

					element._events[type].list = [];

					if (element.attachEvent) {
						element.attachEvent('on' + type, element._events[type]);
					}
				}

				element._events[type].list.push(listener);
			};

			window.removeEventListener = Window.prototype.removeEventListener = Document.prototype.removeEventListener = Element.prototype.removeEventListener = function removeEventListener() {
				var
				element = this,
				type = arguments[0],
				listener = arguments[1],
				index;

				if (element._events && element._events[type] && element._events[type].list) {
					index = indexOf(element._events[type].list, listener);

					if (index !== -1) {
						element._events[type].list.splice(index, 1);

						if (!element._events[type].list.length) {
							if (element.detachEvent) {
								element.detachEvent('on' + type, element._events[type]);
							}
							delete element._events[type];
						}
					}
				}
			};

			window.dispatchEvent = Window.prototype.dispatchEvent = Document.prototype.dispatchEvent = Element.prototype.dispatchEvent = function dispatchEvent(event) {
				if (!arguments.length) {
					throw new Error('Not enough arguments');
				}

				if (!event || typeof event.type !== 'string') {
					throw new Error('DOM Events Exception 0');
				}

				var element = this, type = event.type;

				try {
					if (!event.bubbles) {
						event.cancelBubble = true;

						var cancelBubbleEvent = function (event) {
							event.cancelBubble = true;

							(element || window).detachEvent('on' + type, cancelBubbleEvent);
						};

						this.attachEvent('on' + type, cancelBubbleEvent);
					}

					this.fireEvent('on' + type, event);
				} catch (error) {
					event.target = element;

					do {
						event.currentTarget = element;

						if ('_events' in element && typeof element._events[type] === 'function') {
							element._events[type].call(element, event);
						}

						if (typeof element['on' + type] === 'function') {
							element['on' + type].call(element, event);
						}

						element = element.nodeType === 9 ? element.parentWindow : element.parentNode;
					} while (element && !event.cancelBubble);
				}

				return true;
			};

			// Add the DOMContentLoaded Event
			document.attachEvent('onreadystatechange', function() {
				if (document.readyState === 'complete') {
					document.dispatchEvent(new Event('DOMContentLoaded', {
						bubbles: true
					}));
				}
			});
		}
	}());

	})
	.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

	// @ts-nocheck

	(function(undefined) {
	  // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Function/prototype/bind/detect.js
	  var detect = 'bind' in Function.prototype;

	  if (detect) return

	  // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Function.prototype.bind&flags=always
	  Object.defineProperty(Function.prototype, 'bind', {
	      value: function bind(that) { // .length is 1
	          // add necessary es5-shim utilities
	          var $Array = Array;
	          var $Object = Object;
	          var ObjectPrototype = $Object.prototype;
	          var ArrayPrototype = $Array.prototype;
	          var Empty = function Empty() {};
	          var to_string = ObjectPrototype.toString;
	          var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
	          var isCallable; /* inlined from https://npmjs.com/is-callable */ var fnToStr = Function.prototype.toString, tryFunctionObject = function tryFunctionObject(value) { try { fnToStr.call(value); return true; } catch (e) { return false; } }, fnClass = '[object Function]', genClass = '[object GeneratorFunction]'; isCallable = function isCallable(value) { if (typeof value !== 'function') { return false; } if (hasToStringTag) { return tryFunctionObject(value); } var strClass = to_string.call(value); return strClass === fnClass || strClass === genClass; };
	          var array_slice = ArrayPrototype.slice;
	          var array_concat = ArrayPrototype.concat;
	          var array_push = ArrayPrototype.push;
	          var max = Math.max;
	          // /add necessary es5-shim utilities

	          // 1. Let Target be the this value.
	          var target = this;
	          // 2. If IsCallable(Target) is false, throw a TypeError exception.
	          if (!isCallable(target)) {
	              throw new TypeError('Function.prototype.bind called on incompatible ' + target);
	          }
	          // 3. Let A be a new (possibly empty) internal list of all of the
	          //   argument values provided after thisArg (arg1, arg2 etc), in order.
	          // XXX slicedArgs will stand in for "A" if used
	          var args = array_slice.call(arguments, 1); // for normal call
	          // 4. Let F be a new native ECMAScript object.
	          // 11. Set the [[Prototype]] internal property of F to the standard
	          //   built-in Function prototype object as specified in 15.3.3.1.
	          // 12. Set the [[Call]] internal property of F as described in
	          //   15.3.4.5.1.
	          // 13. Set the [[Construct]] internal property of F as described in
	          //   15.3.4.5.2.
	          // 14. Set the [[HasInstance]] internal property of F as described in
	          //   15.3.4.5.3.
	          var bound;
	          var binder = function () {

	              if (this instanceof bound) {
	                  // 15.3.4.5.2 [[Construct]]
	                  // When the [[Construct]] internal method of a function object,
	                  // F that was created using the bind function is called with a
	                  // list of arguments ExtraArgs, the following steps are taken:
	                  // 1. Let target be the value of F's [[TargetFunction]]
	                  //   internal property.
	                  // 2. If target has no [[Construct]] internal method, a
	                  //   TypeError exception is thrown.
	                  // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
	                  //   property.
	                  // 4. Let args be a new list containing the same values as the
	                  //   list boundArgs in the same order followed by the same
	                  //   values as the list ExtraArgs in the same order.
	                  // 5. Return the result of calling the [[Construct]] internal
	                  //   method of target providing args as the arguments.

	                  var result = target.apply(
	                      this,
	                      array_concat.call(args, array_slice.call(arguments))
	                  );
	                  if ($Object(result) === result) {
	                      return result;
	                  }
	                  return this;

	              } else {
	                  // 15.3.4.5.1 [[Call]]
	                  // When the [[Call]] internal method of a function object, F,
	                  // which was created using the bind function is called with a
	                  // this value and a list of arguments ExtraArgs, the following
	                  // steps are taken:
	                  // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
	                  //   property.
	                  // 2. Let boundThis be the value of F's [[BoundThis]] internal
	                  //   property.
	                  // 3. Let target be the value of F's [[TargetFunction]] internal
	                  //   property.
	                  // 4. Let args be a new list containing the same values as the
	                  //   list boundArgs in the same order followed by the same
	                  //   values as the list ExtraArgs in the same order.
	                  // 5. Return the result of calling the [[Call]] internal method
	                  //   of target providing boundThis as the this value and
	                  //   providing args as the arguments.

	                  // equiv: target.call(this, ...boundArgs, ...args)
	                  return target.apply(
	                      that,
	                      array_concat.call(args, array_slice.call(arguments))
	                  );

	              }

	          };

	          // 15. If the [[Class]] internal property of Target is "Function", then
	          //     a. Let L be the length property of Target minus the length of A.
	          //     b. Set the length own property of F to either 0 or L, whichever is
	          //       larger.
	          // 16. Else set the length own property of F to 0.

	          var boundLength = max(0, target.length - args.length);

	          // 17. Set the attributes of the length own property of F to the values
	          //   specified in 15.3.5.1.
	          var boundArgs = [];
	          for (var i = 0; i < boundLength; i++) {
	              array_push.call(boundArgs, '$' + i);
	          }

	          // XXX Build a dynamic function with desired amount of arguments is the only
	          // way to set the length property of a function.
	          // In environments where Content Security Policies enabled (Chrome extensions,
	          // for ex.) all use of eval or Function costructor throws an exception.
	          // However in all of these environments Function.prototype.bind exists
	          // and so this code will never be executed.
	          bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this, arguments); }')(binder);

	          if (target.prototype) {
	              Empty.prototype = target.prototype;
	              bound.prototype = new Empty();
	              // Clean up dangling references.
	              Empty.prototype = null;
	          }

	          // TODO
	          // 18. Set the [[Extensible]] internal property of F to true.

	          // TODO
	          // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
	          // 20. Call the [[DefineOwnProperty]] internal method of F with
	          //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
	          //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
	          //   false.
	          // 21. Call the [[DefineOwnProperty]] internal method of F with
	          //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
	          //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
	          //   and false.

	          // TODO
	          // NOTE Function objects created using Function.prototype.bind do not
	          // have a prototype property or the [[Code]], [[FormalParameters]], and
	          // [[Scope]] internal properties.
	          // XXX can't delete prototype in pure-js.

	          // 22. Return F.
	          return bound;
	      }
	  });
	})
	.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

	/* eslint-disable es-x/no-function-prototype-bind -- Polyfill imported */

	/**
	 * @constant
	 * @type {ExitThisPageTranslations}
	 * @see Default value for {@link ExitThisPageConfig.i18n}
	 * @default
	 */
	var EXIT_THIS_PAGE_TRANSLATIONS = {
	  activated: 'Loading.',
	  timedOut: 'Exit this page expired.',
	  pressTwoMoreTimes: 'Shift, press 2 more times to exit.',
	  pressOneMoreTime: 'Shift, press 1 more time to exit.'
	};

	/**
	 * Exit This Page component
	 *
	 * @class
	 * @param {HTMLElement} $module - HTML element that wraps the Exit This Page button
	 * @param {ExitThisPageConfig} [config] - Exit This Page config
	 */
	function ExitThisPage ($module, config) {
	  /** @type {ExitThisPageConfig} */
	  var defaultConfig = {
	    i18n: EXIT_THIS_PAGE_TRANSLATIONS
	  };

	  if (!($module instanceof HTMLElement)) {
	    return this
	  }

	  var $button = $module.querySelector('.govuk-exit-this-page__button');
	  if (!($button instanceof HTMLElement)) {
	    return this
	  }

	  /**
	   * @deprecated Will be made private in v5.0
	   * @type {ExitThisPageConfig}
	   */
	  this.config = mergeConfigs(
	    defaultConfig,
	    config || {},
	    normaliseDataset($module.dataset)
	  );

	  this.i18n = new I18n(extractConfigByNamespace(this.config, 'i18n'));

	  /** @deprecated Will be made private in v5.0 */
	  this.$module = $module;

	  /** @deprecated Will be made private in v5.0 */
	  this.$button = $button;

	  /** @deprecated Will be made private in v5.0 */
	  this.$skiplinkButton = document.querySelector('.govuk-js-exit-this-page-skiplink');

	  /** @deprecated Will be made private in v5.0 */
	  this.$updateSpan = null;

	  /** @deprecated Will be made private in v5.0 */
	  this.$indicatorContainer = null;

	  /** @deprecated Will be made private in v5.0 */
	  this.$overlay = null;

	  /** @deprecated Will be made private in v5.0 */
	  this.keypressCounter = 0;

	  /** @deprecated Will be made private in v5.0 */
	  this.lastKeyWasModified = false;

	  /** @deprecated Will be made private in v5.0 */
	  this.timeoutTime = 5000; // milliseconds

	  // Store the timeout events so that we can clear them to avoid user keypresses overlapping
	  // setTimeout returns an id that we can use to clear it with clearTimeout,
	  // hence the 'Id' suffix

	  /** @deprecated Will be made private in v5.0 */
	  this.keypressTimeoutId = null;

	  /** @deprecated Will be made private in v5.0 */
	  this.timeoutMessageId = null;
	}

	/**
	 * Create the <span> we use for screen reader announcements.
	 *
	 * @deprecated Will be made private in v5.0
	 */
	ExitThisPage.prototype.initUpdateSpan = function () {
	  this.$updateSpan = document.createElement('span');
	  this.$updateSpan.setAttribute('role', 'status');
	  this.$updateSpan.className = 'govuk-visually-hidden';

	  this.$module.appendChild(this.$updateSpan);
	};

	/**
	 * Create button click handlers.
	 *
	 * @deprecated Will be made private in v5.0
	 */
	ExitThisPage.prototype.initButtonClickHandler = function () {
	  // Main EtP button
	  this.$button.addEventListener('click', this.handleClick.bind(this));

	  // EtP skiplink
	  if (this.$skiplinkButton) {
	    this.$skiplinkButton.addEventListener('click', this.handleClick.bind(this));
	  }
	};

	/**
	 * Create the HTML for the 'three lights' indicator on the button.
	 *
	 * @deprecated Will be made private in v5.0
	 */
	ExitThisPage.prototype.buildIndicator = function () {
	  // Build container
	  // Putting `aria-hidden` on it as it won't contain any readable information
	  this.$indicatorContainer = document.createElement('div');
	  this.$indicatorContainer.className = 'govuk-exit-this-page__indicator';
	  this.$indicatorContainer.setAttribute('aria-hidden', 'true');

	  // Create three 'lights' and place them within the container
	  for (var i = 0; i < 3; i++) {
	    var $indicator = document.createElement('div');
	    $indicator.className = 'govuk-exit-this-page__indicator-light';
	    this.$indicatorContainer.appendChild($indicator);
	  }

	  // Append it all to the module
	  this.$button.appendChild(this.$indicatorContainer);
	};

	/**
	 * Update whether the lights are visible and which ones are lit up depending on
	 * the value of `keypressCounter`.
	 *
	 * @deprecated Will be made private in v5.0
	 */
	ExitThisPage.prototype.updateIndicator = function () {
	  // Show or hide the indicator container depending on keypressCounter value
	  if (this.keypressCounter > 0) {
	    this.$indicatorContainer.classList.add('govuk-exit-this-page__indicator--visible');
	  } else {
	    this.$indicatorContainer.classList.remove('govuk-exit-this-page__indicator--visible');
	  }

	  // Turn on only the indicators we want on
	  var $indicators = this.$indicatorContainer.querySelectorAll(
	    '.govuk-exit-this-page__indicator-light'
	  );
	  nodeListForEach($indicators, function ($indicator, index) {
	    $indicator.classList.toggle(
	      'govuk-exit-this-page__indicator-light--on',
	      index < this.keypressCounter
	    );
	  }.bind(this));
	};

	/**
	 * Initiates the redirection away from the current page.
	 * Includes the loading overlay functionality, which covers the current page with a
	 * white overlay so that the contents are not visible during the loading
	 * process. This is particularly important on slow network connections.
	 *
	 * @deprecated Will be made private in v5.0
	 */
	ExitThisPage.prototype.exitPage = function () {
	  this.$updateSpan.innerText = '';

	  // Blank the page
	  // As well as creating an overlay with text, we also set the body to hidden
	  // to prevent screen reader and sequential navigation users potentially
	  // navigating through the page behind the overlay during loading
	  document.body.classList.add('govuk-exit-this-page-hide-content');
	  this.$overlay = document.createElement('div');
	  this.$overlay.className = 'govuk-exit-this-page-overlay';
	  this.$overlay.setAttribute('role', 'alert');

	  // we do these this way round, thus incurring a second paint, because changing
	  // the element text after adding it means that screen readers pick up the
	  // announcement more reliably.
	  document.body.appendChild(this.$overlay);
	  this.$overlay.innerText = this.i18n.t('activated');

	  window.location.href = this.$button.getAttribute('href');
	};

	/**
	 * Pre-activation logic for when the button is clicked/activated via mouse or
	 * pointer.
	 *
	 * We do this to differentiate it from the keyboard activation event because we
	 * need to run `e.preventDefault` as the button or skiplink are both links and we
	 * want to apply some additional logic in `exitPage` before navigating.
	 *
	 * @deprecated Will be made private in v5.0
	 * @param {MouseEvent} event - mouse click event
	 */
	ExitThisPage.prototype.handleClick = function (event) {
	  event.preventDefault();
	  this.exitPage();
	};

	/**
	 * Logic for the 'quick escape' keyboard sequence functionality (pressing the
	 * Shift key three times without interruption, within a time limit).
	 *
	 * @deprecated Will be made private in v5.0
	 * @param {KeyboardEvent} event - keyup event
	 */
	ExitThisPage.prototype.handleKeypress = function (event) {
	  // Detect if the 'Shift' key has been pressed. We want to only do things if it
	  // was pressed by itself and not in a combination with another key—so we keep
	  // track of whether the preceding keyup had shiftKey: true on it, and if it
	  // did, we ignore the next Shift keyup event.
	  //
	  // This works because using Shift as a modifier key (e.g. pressing Shift + A)
	  // will fire TWO keyup events, one for A (with e.shiftKey: true) and the other
	  // for Shift (with e.shiftKey: false).
	  if (
	    (event.key === 'Shift' || event.keyCode === 16 || event.which === 16) &&
	    !this.lastKeyWasModified
	  ) {
	    this.keypressCounter += 1;

	    // Update the indicator before the below if statement can reset it back to 0
	    this.updateIndicator();

	    // Clear the timeout for the keypress timeout message clearing itself
	    if (this.timeoutMessageId !== null) {
	      clearTimeout(this.timeoutMessageId);
	      this.timeoutMessageId = null;
	    }

	    if (this.keypressCounter >= 3) {
	      this.keypressCounter = 0;

	      if (this.keypressTimeoutId !== null) {
	        clearTimeout(this.keypressTimeoutId);
	        this.keypressTimeoutId = null;
	      }

	      this.exitPage();
	    } else {
	      if (this.keypressCounter === 1) {
	        this.$updateSpan.innerText = this.i18n.t('pressTwoMoreTimes');
	      } else {
	        this.$updateSpan.innerText = this.i18n.t('pressOneMoreTime');
	      }
	    }

	    this.setKeypressTimer();
	  } else if (this.keypressTimeoutId !== null) {
	    // If the user pressed any key other than 'Shift', after having pressed
	    // 'Shift' and activating the timer, stop and reset the timer.
	    this.resetKeypressTimer();
	  }

	  // Keep track of whether the Shift modifier key was held during this keypress
	  this.lastKeyWasModified = event.shiftKey;
	};

	/**
	 * Starts the 'quick escape' keyboard sequence timer.
	 *
	 * This can be invoked several times. We want this to be possible so that the
	 * timer is restarted each time the shortcut key is pressed (e.g. the user has
	 * up to n seconds between each keypress, rather than n seconds to invoke the
	 * entire sequence.)
	 *
	 * @deprecated Will be made private in v5.0
	 */
	ExitThisPage.prototype.setKeypressTimer = function () {
	  // Clear any existing timeout. This is so only one timer is running even if
	  // there are multiple keypresses in quick succession.
	  clearTimeout(this.keypressTimeoutId);

	  // Set a fresh timeout
	  this.keypressTimeoutId = setTimeout(
	    this.resetKeypressTimer.bind(this),
	    this.timeoutTime
	  );
	};

	/**
	 * Stops and resets the 'quick escape' keyboard sequence timer.
	 *
	 * @deprecated Will be made private in v5.0
	 */
	ExitThisPage.prototype.resetKeypressTimer = function () {
	  clearTimeout(this.keypressTimeoutId);
	  this.keypressTimeoutId = null;

	  this.keypressCounter = 0;
	  this.$updateSpan.innerText = this.i18n.t('timedOut');

	  this.timeoutMessageId = setTimeout(function () {
	    this.$updateSpan.innerText = '';
	  }.bind(this), this.timeoutTime);

	  this.updateIndicator();
	};

	/**
	 * Reset the page using the EtP button
	 *
	 * We use this in situations where a user may re-enter a page using the browser
	 * back button. In these cases, the browser can choose to restore the state of
	 * the page as it was previously, including restoring the 'ghost page' overlay,
	 * the announcement span having it's role set to "alert" and the keypress
	 * indicator still active, leaving the page in an unusable state.
	 *
	 * By running this check when the page is shown, we can programatically restore
	 * the page and the component to a "default" state
	 *
	 * @deprecated Will be made private in v5.0
	 */
	ExitThisPage.prototype.resetPage = function () {
	  // If an overlay is set, remove it and reset the value
	  document.body.classList.remove('govuk-exit-this-page-hide-content');

	  if (this.$overlay) {
	    this.$overlay.remove();
	    this.$overlay = null;
	  }

	  // Ensure the announcement span's role is status, not alert and clear any text
	  this.$updateSpan.setAttribute('role', 'status');
	  this.$updateSpan.innerText = '';

	  // Sync the keypress indicator lights
	  this.updateIndicator();

	  // If the timeouts are active, clear them
	  if (this.keypressTimeoutId) {
	    clearTimeout(this.keypressTimeoutId);
	  }

	  if (this.timeoutMessageId) {
	    clearTimeout(this.timeoutMessageId);
	  }
	};

	/**
	 * Initialise component
	 */
	ExitThisPage.prototype.init = function () {
	  this.buildIndicator();
	  this.initUpdateSpan();
	  this.initButtonClickHandler();

	  // Check to see if this has already been done by a previous initialisation of ExitThisPage
	  if (!('govukFrontendExitThisPageKeypress' in document.body.dataset)) {
	    document.addEventListener('keyup', this.handleKeypress.bind(this), true);
	    document.body.dataset.govukFrontendExitThisPageKeypress = 'true';
	  }

	  // When the page is restored after navigating 'back' in some browsers the
	  // blank overlay remains present, rendering the page unusable. Here, we check
	  // to see if it's present on page (re)load, and remove it if so.
	  window.addEventListener(
	    'onpageshow' in window ? 'pageshow' : 'DOMContentLoaded',
	    this.resetPage.bind(this)
	  );
	};

	/**
	 * Exit this Page config
	 *
	 * @typedef {object} ExitThisPageConfig
	 * @property {ExitThisPageTranslations} [i18n = EXIT_THIS_PAGE_TRANSLATIONS] - See constant {@link EXIT_THIS_PAGE_TRANSLATIONS}
	 */

	/**
	 * Exit this Page translations
	 *
	 * @typedef {object} ExitThisPageTranslations
	 *
	 * Messages used by the component programatically inserted text, including
	 * overlay text and screen reader announcements.
	 * @property {string} [activated] - Screen reader announcement for when EtP
	 *   keypress functionality has been successfully activated.
	 * @property {string} [timedOut] - Screen reader announcement for when the EtP
	 *   keypress functionality has timed out.
	 * @property {string} [pressTwoMoreTimes] - Screen reader announcement informing
	 *   the user they must press the activation key two more times.
	 * @property {string} [pressOneMoreTime] - Screen reader announcement informing
	 *   the user they must press the activation key one more time.
	 */

	return ExitThisPage;

})));
//# sourceMappingURL=exit-this-page.js.map
