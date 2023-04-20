(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('GOVUKFrontend.NotificationBanner', factory) :
  (global.GOVUKFrontend = global.GOVUKFrontend || {}, global.GOVUKFrontend.NotificationBanner = factory());
}(this, (function () { 'use strict';

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
   * @template {Node} ElementType
   * @callback nodeListIterator
   * @param {ElementType} value - The current node being iterated on
   * @param {number} index - The current index in the iteration
   * @param {NodeListOf<ElementType>} nodes - NodeList from querySelectorAll()
   * @returns {void}
   */

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
   * @property {boolean} [disableAutoFocus = false] - If set to `true` the
   *   notification banner will not be focussed when the page loads. This only
   *   applies if the component has a `role` of `alert` – in other cases the
   *   component will not be focused on page load, regardless of this option.
   */

  return NotificationBanner;

})));
//# sourceMappingURL=notification-banner.js.map
