(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('all', factory) :
	(global.all = factory());
}(this, (function () { 'use strict';

(function(undefined) {

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

/**
* Add event construct for modern browsers or IE8
* which fires the callback with a pre-converted target reference
* @param {object} node element
* @param {string} type event type (e.g. click, load, or error)
* @param {function} callback function
*/
function addEvent (node, type, callback) {
  // Support: IE9+ and other browsers
  if (node.addEventListener) {
    node.addEventListener(type, function (event) {
      callback(event, event.target);
    }, false);
  // Support: IE8
  } else if (node.attachEvent) {
    node.attachEvent('on' + type, function (event) {
      callback(event, event.srcElement);
    });
  }
}

/**
* Remove event utility for modern browsers or IE8
* @param {object} node element
* @param {string} type event type (e.g. click, load, or error)
* @param {function} callback function
*/
function removeEvent (node, type, callback) {
  // Support: IE9+ and other browsers
  if (node.removeEventListener) {
    node.removeEventListener(type, function (event) {
      callback(event, event.target);
    }, false);
  // Support: IE8
  } else if (node.detachEvent) {
    node.detachEvent('on' + type, function (event) {
      callback(event, event.srcElement);
    });
  }
}

/**
* Cross-browser character code / key pressed
* @param {object} event event
* @returns {number} character code
*/
function charCode (event) {
  return (typeof event.which === 'number') ? event.which : event.keyCode
}

/**
* Cross-browser preventing default action
* @param {object} event event
*/
function preventDefault (event) {
  // Support: IE9+ and other browsers
  if (event.preventDefault) {
    event.preventDefault();
  // Support: IE8
  } else {
    event.returnValue = false;
  }
}

/**
 * JavaScript 'polyfill' for HTML5's <details> and <summary> elements
 * and 'shim' to add accessiblity enhancements for all browsers
 *
 * http://caniuse.com/#feat=details
 *
 * Usage instructions:
 * the 'polyfill' will be automatically initialised
 */

var KEY_ENTER = 13;
var KEY_SPACE = 32;

// Create a flag to know if the browser supports navtive details
var NATIVE_DETAILS = typeof document.createElement('details').open === 'boolean';

function Details () {
  // Create a flag so we can prevent the initialisation
  // function firing from both DOMContentLoaded and window.onload
  this.INITIALISED = false;
}

/**
* Handle cross-modal click events
* @param {object} node element
* @param {function} callback function
*/
Details.prototype.handleKeyDown = function (node, callback) {
  addEvent(node, 'keypress', function (event, target) {
    // When the key gets pressed - check if it is enter or space
    if (charCode(event) === KEY_ENTER || charCode(event) === KEY_SPACE) {
      if (target.nodeName.toLowerCase() === 'summary') {
        // Prevent space from scrolling the page
        // and enter from submitting a form
        preventDefault(event);
        // Click to let the click event do all the necessary action
        if (target.click) {
          target.click();
        } else {
          // except Safari 5.1 and under don't support .click() here
          callback(event, target);
        }
      }
    }
  });

  // Prevent keyup to prevent clicking twice in Firefox when using space key
  addEvent(node, 'keyup', function (event, target) {
    if (charCode(event) === KEY_SPACE) {
      if (target.nodeName.toLowerCase() === 'summary') {
        preventDefault(event);
      }
    }
  });

  addEvent(node, 'click', function (event, target) {
    callback(event, target);
  });
};

/**
* Get the nearest ancestor element of a node that matches a given tag name
* @param {object} node element
* @param {string} match tag name (e.g. div)
*/
Details.prototype.getAncestor = function (node, match) {
  do {
    if (!node || node.nodeName.toLowerCase() === match) {
      break
    }
    node = node.parentNode;
  } while (node)

  return node
};

/**
* Initialise the script on a list of details elements in a container
* @param {object} list of details elements
* @param {string} container where to look for details elements
*/
Details.prototype.initDetails = function (list, container) {
  container = container || document.body;
  // If this has already happened, just return
  // else set the flag so it doesn't happen again
  if (this.INITIALISED) {
    return
  }
  this.INITIALISED = true;
  // Get the collection of details elements, but if that's empty
  // then we don't need to bother with the rest of the scripting
  if ((list = container.getElementsByTagName('details')).length === 0) {
    return
  }
  // else iterate through them to apply their initial state
  var n = list.length;
  var i = 0;
  for (i; i < n; i++) {
    var details = list[i];

    // Save shortcuts to the inner summary and content elements
    details.__summary = details.getElementsByTagName('summary').item(0);
    details.__content = details.getElementsByTagName('div').item(0);

    // If <details> doesn't have a <summary> and a <div> representing the content
    // it means the required HTML structure is not met so the script will stop
    if (!details.__summary || !details.__content) {
      return
    }

    // If the content doesn't have an ID, assign it one now
    // which we'll need for the summary's aria-controls assignment
    if (!details.__content.id) {
      details.__content.id = 'details-content-' + i;
    }

    // Add ARIA role="group" to details
    details.setAttribute('role', 'group');

    // Add role=button to summary
    details.__summary.setAttribute('role', 'button');

    // Add aria-controls
    details.__summary.setAttribute('aria-controls', details.__content.id);

    // Set tabIndex so the summary is keyboard accessible for non-native elements
    // http://www.saliences.com/browserBugs/tabIndex.html
    if (!NATIVE_DETAILS) {
      details.__summary.tabIndex = 0;
    }

    // Detect initial open state
    var openAttr = details.getAttribute('open') !== null;
    if (openAttr === true) {
      details.__summary.setAttribute('aria-expanded', 'true');
      details.__content.setAttribute('aria-hidden', 'false');
    } else {
      details.__summary.setAttribute('aria-expanded', 'false');
      details.__content.setAttribute('aria-hidden', 'true');
      if (!NATIVE_DETAILS) {
        details.__content.style.display = 'none';
      }
    }

    // Create a circular reference from the summary back to its
    // parent details element, for convenience in the click handler
    details.__summary.__details = details;
  }

  // Bind an event to handle summary elements
  this.handleKeyDown(container, function (event, summary) {
    if (!(summary = this.getAncestor(summary, 'summary'))) {
      return true
    }
    return this.stateChange(summary)
  }.bind(this));
};

/**
* Define a statechange function that updates aria-expanded and style.display
* @param {object} summary element
*/
Details.prototype.stateChange = function (summary) {
  var expanded = summary.__details.__summary.getAttribute('aria-expanded') === 'true';
  var hidden = summary.__details.__content.getAttribute('aria-hidden') === 'true';

  summary.__details.__summary.setAttribute('aria-expanded', (expanded ? 'false' : 'true'));
  summary.__details.__content.setAttribute('aria-hidden', (hidden ? 'false' : 'true'));

  if (!NATIVE_DETAILS) {
    summary.__details.__content.style.display = (expanded ? 'none' : '');

    var hasOpenAttr = summary.__details.getAttribute('open') !== null;
    if (!hasOpenAttr) {
      summary.__details.setAttribute('open', 'open');
    } else {
      summary.__details.removeAttribute('open');
    }
  }
  return true
};

/**
* Remove the click event from the node element
* @param {object} node element
*/
Details.prototype.destroy = function (node) {
  removeEvent(node, 'click');
};

/**
* Initialise an event listener for DOMContentLoaded at document level
* and load at window level
*
* If the first one fires it will set a flag to block the second one
* but if it's not supported then the second one will fire
*/
Details.prototype.init = function () {
  addEvent(document, 'DOMContentLoaded', this.initDetails.bind(this));
  addEvent(window, 'load', this.initDetails.bind(this));
};

return Details;

})));
