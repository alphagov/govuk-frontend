(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('GOVUKFrontend.Accordion', factory) :
	(global.GOVUKFrontend = global.GOVUKFrontend || {}, global.GOVUKFrontend.Accordion = factory());
}(this, (function () { 'use strict';

(function (undefined) {
  var detect = (
    'indexOf' in Array.prototype
  );

  if (detect) return

  // Polyfill adapted from https://cdn.polyfill.io/v2/polyfill.js?features=Array.prototype.indexOf&flags=always
  Array.prototype.indexOf = function (searchElement, fromIndex) {
    fromIndex = Number(fromIndex) || 0;

    if (this === undefined || this === null) {
      throw new TypeError(this + ' is not an object')
    }

    var array = this instanceof String ? this.split('') : this;
    var arrayLength = Math.max(Math.min(array.length, 9007199254740991), 0) || 0;
    var loopStartIndex = (fromIndex < 0 ? Math.max(arrayLength + fromIndex, 0) : fromIndex) - 1;

    for (var i = loopStartIndex; ++i < arrayLength;) {
      if (i in array && array[i] === searchElement) {
        return i
      }
    }
    return -1
  };
}).call(typeof window === 'object' && window || typeof self === 'object' && self || typeof global === 'object' && global || {});

/**
 * i18n support initialisation function
 *
 * @constructor
 * @param    {object}  options               - Options object.
 * @param    {string}  options.locale        - The locale to use, currently this is only used for pluralisation rules. If undefined, tries to use html[lang].
 * @param    {object}  options.translations  - Key-value pairs of the translation strings to use.
 */
function I18n (options) {
  options = options || {};

  // Get user-defined locale setting,
  // Otherwise, try and detect it from the document,
  // Otherwise, set to English
  this.locale = options.locale || document.documentElement.lang || 'en';

  // Define the separators used for placeholders.
  // Currently uses the same syntax as GOV.UK (e.g. %{keyName}).
  // e.g. https://github.com/alphagov/govuk_publishing_components/blob/22944a9efaea3ae495a518717415694c71cfdb35/config/locales/en.yml
  this.separators = ['%{', '}'];

  // List of translations
  this.translations = options.translations;
}

/**
 * The most used function - processes translation strings, determining which
 * plural forms to use and running placeholder replacement.
 *
 * ALL properties passed to `options` will be exposed as options for string
 * interpolation, but only `count` initiates special functionality.
 *
 * TODO: Do we want to put string interpolation options in their own object (e.g. `options.data`) to avoid potential conflict in future?
 * TODO: Do we need some context/gendered forms support? Not sure if anything currently in Frontend necessitates this.
 *
 * @param    {string}  lookupKey         - The lookup key of the string to use.
 * @param    {object}  options           - Options object.
 * @param    {number}  options.count     - Number used to determine which pluralisation to use.
 * @returns  {string}                    - The formatted translation string.
 */
I18n.prototype.t = function (lookupKey, options) {
  options = options || {};
  var outputString = lookupKey;

  // Error if no lookup key has been provided
  // Otherwise assign the string to our processing variable
  if (!lookupKey) {
    console.log(new Error('i18n lookup key missing.'));
    return
  } else {
    outputString = this.translations[lookupKey];
  }

  // If the `count` option is set, determine which plural suffix is needed
  // In order of priority:
  // 1. Pluralised lookup key provided in translations
  // 2. Plural object fallback text
  // 3. String fallback text
  if (typeof options.count !== 'undefined') {
    var pluralSuffix = this.getPluralSuffix(options.count);
    var pluralLookupKey = lookupKey + '_' + pluralSuffix;
    if (this.translations[pluralLookupKey]) {
      outputString = this.translations[pluralLookupKey];
    }
  }

  // Replace any placeholders in the string with the actual data
  if (outputString.match(new RegExp(this.separators[0] + '.+' + this.separators[1]))) {
    outputString = this.replacePlaceholders(outputString, options);
  }

  return outputString
};

/**
 * Ingests phrases containing placeholders and spits out the formatted phrase.
 *
 * @param    {string}  phrase          - The phrase containing the placeholder.
 * @param    {object}  placeholderMap  - Key-value pairs of placeholders and the values that replace them.
 */
I18n.prototype.replacePlaceholders = function (phrase, placeholderMap) {
  for (var key in placeholderMap) {
    var value = placeholderMap[key];

    // If the key is `count`, subject the value to number formatting
    // This is limiting, just so we don't accidentally format things like phone numbers
    if (this.hasIntlNumberFormatSupport() && key === 'count') {
      value = Intl.NumberFormat(this.locale).format(value);
    }

    // Perform the replacement
    phrase = phrase.replace(new RegExp(this.separators[0] + key + this.separators[1], 'g'), value);
  }
  return phrase
};

/**
 * Get the appropriate suffix for the plural form.
 *
 * The locale may include a regional indicator (such as en-GB), but we don't
 * usually care about this part, as pluralisation rules are usually the same
 * regardless of region. There are exceptions, however, (e.g. Portuguese) so
 * this searches by both the full and shortened locale codes, just to be sure.
 *
 * @param    {number}  count       - Number used to determine which pluralisation to use.
 * @returns  {string}              - The suffix associated with the correct pluralisation for this locale.
 */
I18n.prototype.getPluralSuffix = function (count) {
  var locale = this.locale;
  var localeShort = (locale.length > 2) ? locale.substring(0, 2) : locale;
  var keySuffix = 'other';

  // Validate that the number is actually a number.
  //
  // Number(count) will turn anything that can't be converted to a Number type
  // into 'NaN'. isFinite filters out NaN, as it isn't a finite number.
  count = Number(count);
  if (!isFinite(count)) { return keySuffix }

  // Check to verify that all the requirements for Intl.PluralRules are met.
  // If so, we can use that instead of our custom implementation. Otherwise,
  // use the hardcoded fallback.
  if (this.hasIntlPluralRulesSupport()) {
    var pluralRules = new Intl.PluralRules(this.locale);
    keySuffix = pluralRules.select(count);
  } else {
    // Currently we only have code to handle positive integers, so let's make sure
    // our number is one of those.
    count = Math.abs(Math.floor(count));

    // Look through the plural rules map to find which `pluralRule` is appropriate
    // for our current `locale`.
    for (var pluralRule in this.pluralRulesMap) {
      if (Object.prototype.hasOwnProperty.call(this.pluralRulesMap, pluralRule)) {
        var languages = this.pluralRulesMap[pluralRule];
        if (languages.indexOf(locale) > -1 || languages.indexOf(localeShort) > -1) {
          keySuffix = this.pluralRules[pluralRule](count);
          break
        }
      }
    }
  }

  return keySuffix
};

/**
 * Check to see if the browser supports Intl and Intl.PluralRules.
 *
 * It requires all conditions to be met in order to be supported:
 * - The browser supports the Intl class (true in IE11)
 * - The implementation of Intl supports PluralRules (NOT true in IE11)
 * - The browser/OS has plural rules for the current locale (browser dependent)
 *
 * @returns  {boolean}  - Returns true if all conditions are met. Returns false otherwise.
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
 * @returns  {boolean}  - Returns true if all conditions are met. Returns false otherwise.
 */
I18n.prototype.hasIntlNumberFormatSupport = function () {
  return Boolean(window.Intl && ('NumberFormat' in window.Intl && Intl.NumberFormat.supportedLocalesOf(this.locale).length))
};

/**
 * Different pluralisation rule sets
 *
 * Returns the appropriate suffix for the plural form associated with `n`.
 * Possible suffixes: 'zero', 'one', 'two', 'few', 'many', 'other' (the actual
 * meaning of each differs per locale). 'other' should always exist, even in
 * languages without plurals, such as Chinese.
 * https://unicode-org.github.io/cldr-staging/charts/latest/supplemental/language_plural_rules.html
 *
 * @param    {number}  n  - The `count` number being passed through. This must be a positive integer. Negative numbers and decimals aren't accounted for.
 * @returns  {string}     - The string that needs to be suffixed to the key (without separator).
 */
I18n.prototype.pluralRules = {
  arabic: function (n) {
    if (n === 0) { return 'zero' }
    if (n === 1) { return 'one' }
    if (n === 2) { return 'two' }
    if (n % 100 >= 3 && n % 100 <= 10) { return 'few' }
    if (n % 100 >= 11 && n % 100 <= 99) { return 'many' }
    return 'other'
  },
  belarusian: function (n) {
    var lastTwo = n % 100;
    var last = lastTwo % 10;
    if (last === 1 && lastTwo !== 11) { return 'one' }
    if (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) { return 'few' }
    if (last === 0 || (last >= 5 && last <= 9) || (lastTwo >= 11 && lastTwo <= 14)) { return 'many' }
    return 'other'
  },
  chinese: function () {
    return 'other'
  },
  cornish: function (n) {
    if (n === 1) { return 'one' }
    if (n === 2) { return 'two' }
    return 'other'
  },
  czech: function (n) {
    if (n === 1) { return 'one' }
    if (n >= 2 && n <= 4) { return 'few' }
    return 'other'
  },
  french: function (n) {
    return n === 0 || n === 1 ? 'one' : 'other'
  },
  german: function (n) {
    return n === 1 ? 'one' : 'other'
  },
  hebrew: function (n) {
    if (n === 1) { return 'one' }
    if (n === 2) { return 'two' }
    if (n % 10 === 0 && !(n >= 0 && n <= 10)) { return 'many' }
    return 'other'
  },
  icelandic: function (n) {
    return n % 10 === 1 && n % 100 !== 11 ? 'one' : 'other'
  },
  irish: function (n) {
    if (n === 1) { return 'one' }
    if (n === 2) { return 'two' }
    if (n >= 3 && n <= 6) { return 'few' }
    if (n >= 7 && n <= 10) { return 'many' }
    return 'other'
  },
  latvian: function (n) {
    if (n % 10 === 0 || (n % 100 >= 11 && n % 100 <= 19)) { return 'zero' }
    if (n % 10 === 1 && n % 100 !== 11) { return 'one' }
    return 'other'
  },
  lithuanian: function (n) {
    var lastTwo = n % 100;
    var last = lastTwo % 10;
    if (last === 1 && !(lastTwo >= 11 && lastTwo <= 19)) { return 'one' }
    if (last >= 2 && last <= 9 && !(lastTwo >= 11 && lastTwo <= 19)) { return 'few' }
    return 'other'
  },
  polish: function (n) {
    if (n === 1) { return 'one' }
    var lastTwo = n % 100;
    var last = lastTwo % 10;
    if (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) { return 'few' }
    if (last === 0 || last === 1 || (last >= 5 && last <= 9) || (lastTwo >= 12 && lastTwo <= 14)) { return 'many' }
    return 'other'
  },
  romanian: function (n) {
    if (n === 1) { return 'one' }
    if (n === 0 || (n % 100 >= 2 && n % 100 <= 19)) { return 'few' }
    return 'other'
  },
  russian: function (n) {
    var lastTwo = n % 100;
    var last = lastTwo % 10;
    if (last === 1 && lastTwo !== 11) { return 'one' }
    if (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) { return 'few' }
    if (last === 0 || (last >= 5 && last <= 9) || (lastTwo >= 11 && lastTwo <= 14)) { return 'many' }
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
};

/**
 * Map of plural rules to languages where those rules apply.
 *
 * Note: These groups are named for the most dominant or recognisable language
 * that uses each system. The groupings do not imply that the languages are
 * related to one another. Many languages have evolved the same systems
 * independently of one another.
 *
 * Spreadsheet of which languages require which plural forms:
 * https://docs.google.com/spreadsheets/d/1sFMhSX-ma7-_myYoRGh6DboHfN0xuN-1VRJ0ClVvNa8/edit
 *
 * Currently supported:
 * Arabic: Arabic (ar)
 * Belarusian: Belarusian (be)
 * Chinese: Burmese (my), Chinese (zh), Indonesian (id), Japanese (ja), Javanese (jv), Korean (ko), Malay (ms), Thai (th), Vietnamese (vi)
 * Cornish: Cornish (kw)
 * Czech: Czech (cs)
 * French: Armenian (hy), French (fr), Hindi (hi), Persian Farsi (fa), Punjabi (pa), Zulu (zu)
 * German: Afrikaans (af), Albanian (sq), Azerbaijani (az), Basque (eu), Bulgarian (bg), Catalan (ca), Danish (da), Dutch (nl), English (en), Estonian (et), Finnish (fi), Georgian (ka), German (de), Greek (el), Hungarian (hu), Luxembourgish (lb), Norwegian (no), Somali (so), Swahili (sw), Swedish (sv), Tamil (ta), Telugu (te), Turkish (tr), Urdu (ur)
 * Hebrew: Hebrew (he)
 * Icelandic: Icelandic (is), Macedonian (mk)
 * Irish: Irish Gaelic (ga)
 * Latvian: Latvian (lv)
 * Lithuanian: Lithuanian (lt)
 * Polish: Bosnian (bs), Croatian (hr), Polish (pl)
 * Romanian: Romanian (ro)
 * Russian: Russian (ru), Ukrainian (uk)
 * Scottish: Scottish Gaelic (gd)
 * Spanish: European Portuguese (pt-PT), Italian (it), Spanish (es)
 * Welsh: Welsh (cy)
 */
I18n.prototype.pluralRulesMap = {
  arabic: ['ar'],
  belarusian: ['be'],
  chinese: ['my', 'zh', 'id', 'ja', 'jv', 'ko', 'ms', 'th', 'vi'],
  cornish: ['kw'],
  czech: ['cs'],
  french: ['hy', 'fr', 'hi', 'fa', 'pa', 'zu'],
  german: ['af', 'sq', 'az', 'eu', 'bg', 'ca', 'da', 'nl', 'en', 'et', 'fi', 'ka', 'de', 'el', 'hu', 'lb', 'no', 'so', 'sw', 'sv', 'ta', 'te', 'tr', 'ur'],
  hebrew: ['he'],
  icelandic: ['is', 'mk'],
  irish: ['ga'],
  latvian: ['lv'],
  lithuanian: ['lt'],
  polish: ['bs', 'hr', 'pl'],
  romanian: ['ro'],
  russian: ['ru', 'uk'],
  scottish: ['gd'],
  spanish: ['pt-PT', 'it', 'es'],
  welsh: ['cy']
};

/**
 * TODO: Ideally this would be a NodeList.prototype.forEach polyfill
 * This seems to fail in IE8, requires more investigation.
 * See: https://github.com/imagitama/nodelist-foreach-polyfill
 */
function nodeListForEach (nodes, callback) {
  if (window.NodeList.prototype.forEach) {
    return nodes.forEach(callback)
  }
  for (var i = 0; i < nodes.length; i++) {
    callback.call(window, nodes[i], i, nodes);
  }
}

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

(function(undefined) {

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

(function(undefined) {

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

(function(undefined) {

  var detect = ('assign' in Object);

  if (detect) return
  
  // Polyfill from https://github.com/christiansany/object-assign-polyfill/blob/master/index.js
  Object.assign = function(target, varArgs) { // .length of function is 2
    if (target == null) { // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object');
    }
  
    var to = Object(target);
  
    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];
  
      if (nextSource != null) { // Skip over if undefined or null
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
  
})
.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

function Accordion ($module, options) {
  this.$module = $module;

  var defaultOptions = {
    i18n: {
      translations: {
        show_this_section: 'Show<span class="govuk-visually-hidden"> this section</span>',
        hide_this_section: 'Hide<span class="govuk-visually-hidden"> this section</span>',
        show_all_sections: 'Show all sections',
        hide_all_sections: 'Hide all sections'
      }
    }
  };
  this.options = Object.assign({}, defaultOptions, options);
  this.i18n = new I18n(this.options.i18n);

  this.moduleId = $module.getAttribute('id');
  this.$sections = $module.querySelectorAll('.govuk-accordion__section');
  this.$showAllButton = '';
  this.browserSupportsSessionStorage = helper.checkForSessionStorage();

  this.controlsClass = 'govuk-accordion__controls';
  this.showAllClass = 'govuk-accordion__show-all';
  this.showAllTextClass = 'govuk-accordion__show-all-text';

  this.sectionExpandedClass = 'govuk-accordion__section--expanded';
  this.sectionButtonClass = 'govuk-accordion__section-button';
  this.sectionHeaderClass = 'govuk-accordion__section-header';
  this.sectionHeadingClass = 'govuk-accordion__section-heading';
  this.sectionHeadingTextClass = 'govuk-accordion__section-heading-text';
  this.sectionHeadingTextFocusClass = 'govuk-accordion__section-heading-text-focus';

  this.sectionShowHideToggleClass = 'govuk-accordion__section-toggle';
  this.sectionShowHideToggleFocusClass = 'govuk-accordion__section-toggle-focus';
  this.sectionShowHideTextClass = 'govuk-accordion__section-toggle-text';
  this.upChevronIconClass = 'govuk-accordion-nav__chevron';
  this.downChevronIconClass = 'govuk-accordion-nav__chevron--down';

  this.sectionSummaryClass = 'govuk-accordion__section-summary';
  this.sectionSummaryFocusClass = 'govuk-accordion__section-summary-focus';
}

// Initialize component
Accordion.prototype.init = function () {
  // Check for module
  if (!this.$module) {
    return
  }

  this.initControls();
  this.initSectionHeaders();

  // See if "Show all sections" button text should be updated
  var areAllSectionsOpen = this.checkIfAllSectionsOpen();
  this.updateShowAllButton(areAllSectionsOpen);
};

// Initialise controls and set attributes
Accordion.prototype.initControls = function () {
  // Create "Show all" button and set attributes
  this.$showAllButton = document.createElement('button');
  this.$showAllButton.setAttribute('type', 'button');
  this.$showAllButton.setAttribute('class', this.showAllClass);
  this.$showAllButton.setAttribute('aria-expanded', 'false');

  // Create icon, add to element
  var $icon = document.createElement('span');
  $icon.classList.add(this.upChevronIconClass);
  this.$showAllButton.appendChild($icon);

  // Create control wrapper and add controls to it
  var $accordionControls = document.createElement('div');
  $accordionControls.setAttribute('class', this.controlsClass);
  $accordionControls.appendChild(this.$showAllButton);
  this.$module.insertBefore($accordionControls, this.$module.firstChild);

  // Build additional wrapper for Show all toggle text and place after icon
  var $wrappershowAllText = document.createElement('span');
  $wrappershowAllText.classList.add(this.showAllTextClass);
  this.$showAllButton.appendChild($wrappershowAllText);

  // Handle click events on the show/hide all button
  this.$showAllButton.addEventListener('click', this.onShowOrHideAllToggle.bind(this));
};

// Initialise section headers
Accordion.prototype.initSectionHeaders = function () {
  // Loop through section headers
  nodeListForEach(this.$sections, function ($section, i) {
    // Set header attributes
    var $header = $section.querySelector('.' + this.sectionHeaderClass);
    this.constructHeaderMarkup($header, i);
    this.setExpanded(this.isExpanded($section), $section);

    // Handle events
    $header.addEventListener('click', this.onSectionToggle.bind(this, $section));

    // See if there is any state stored in sessionStorage and set the sections to
    // open or closed.
    this.setInitialState($section);
  }.bind(this));
};

Accordion.prototype.constructHeaderMarkup = function ($headerWrapper, index) {
  var $span = $headerWrapper.querySelector('.' + this.sectionButtonClass);
  var $heading = $headerWrapper.querySelector('.' + this.sectionHeadingClass);
  var $summary = $headerWrapper.querySelector('.' + this.sectionSummaryClass);

  // Create a button element that will replace the '.govuk-accordion__section-button' span
  var $button = document.createElement('button');
  $button.setAttribute('type', 'button');
  $button.setAttribute('aria-controls', this.moduleId + '-content-' + (index + 1));

  // Copy all attributes (https://developer.mozilla.org/en-US/docs/Web/API/Element/attributes) from $span to $button
  for (var i = 0; i < $span.attributes.length; i++) {
    var attr = $span.attributes.item(i);
    // Add all attributes but not ID as this is being added to
    // the section heading ($headingText)
    if (attr.nodeName !== 'id') {
      $button.setAttribute(attr.nodeName, attr.nodeValue);
    }
  }

  // Create container for heading text so it can be styled
  var $headingText = document.createElement('span');
  $headingText.classList.add(this.sectionHeadingTextClass);
  // Copy the span ID to the heading text to allow it to be referenced by `aria-labelledby` on the
  // hidden content area without "Show this section"
  $headingText.id = $span.id;

  // Create an inner heading text container to limit the width of the focus state
  var $headingTextFocus = document.createElement('span');
  $headingTextFocus.classList.add(this.sectionHeadingTextFocusClass);
  $headingText.appendChild($headingTextFocus);
  // span could contain HTML elements (see https://www.w3.org/TR/2011/WD-html5-20110525/content-models.html#phrasing-content)
  $headingTextFocus.innerHTML = $span.innerHTML;

  // Create container for show / hide icons and text.
  var $showToggle = document.createElement('span');
  $showToggle.classList.add(this.sectionShowHideToggleClass);
  // Tell Google not to index the 'show' text as part of the heading
  // For the snippet to work with JavaScript, it must be added before adding the page element to the
  // page's DOM. See https://developers.google.com/search/docs/advanced/robots/robots_meta_tag#data-nosnippet-attr
  $showToggle.setAttribute('data-nosnippet', '');
  // Create an inner container to limit the width of the focus state
  var $showToggleFocus = document.createElement('span');
  $showToggleFocus.classList.add(this.sectionShowHideToggleFocusClass);
  $showToggle.appendChild($showToggleFocus);
  // Create wrapper for the show / hide text. Append text after the show/hide icon
  var $showToggleText = document.createElement('span');
  var $icon = document.createElement('span');
  $icon.classList.add(this.upChevronIconClass);
  $showToggleFocus.appendChild($icon);
  $showToggleText.classList.add(this.sectionShowHideTextClass);
  $showToggleFocus.appendChild($showToggleText);

  // Append elements to the button:
  // 1. Heading text
  // 2. Punctuation
  // 3. (Optional: Summary line followed by punctuation)
  // 4. Show / hide toggle
  $button.appendChild($headingText);
  $button.appendChild(this.getButtonPunctuationEl());

  // If summary content exists add to DOM in correct order
  if (typeof ($summary) !== 'undefined' && $summary !== null) {
    // Create a new `span` element and copy the summary line content from the original `div` to the
    // new `span`
    // This is because the summary line text is now inside a button element, which can only contain
    // phrasing content
    var $summarySpan = document.createElement('span');
    // Create an inner summary container to limit the width of the summary focus state
    var $summarySpanFocus = document.createElement('span');
    $summarySpanFocus.classList.add(this.sectionSummaryFocusClass);
    $summarySpan.appendChild($summarySpanFocus);

    // Get original attributes, and pass them to the replacement
    for (var j = 0, l = $summary.attributes.length; j < l; ++j) {
      var nodeName = $summary.attributes.item(j).nodeName;
      var nodeValue = $summary.attributes.item(j).nodeValue;
      $summarySpan.setAttribute(nodeName, nodeValue);
    }

    // Copy original contents of summary to the new summary span
    $summarySpanFocus.innerHTML = $summary.innerHTML;

    // Replace the original summary `div` with the new summary `span`
    $summary.parentNode.replaceChild($summarySpan, $summary);

    $button.appendChild($summarySpan);
    $button.appendChild(this.getButtonPunctuationEl());
  }

  $button.appendChild($showToggle);

  $heading.removeChild($span);
  $heading.appendChild($button);
};

// When section toggled, set and store state
Accordion.prototype.onSectionToggle = function ($section) {
  var expanded = this.isExpanded($section);
  this.setExpanded(!expanded, $section);

  // Store the state in sessionStorage when a change is triggered
  this.storeState($section);
};

// When Open/Close All toggled, set and store state
Accordion.prototype.onShowOrHideAllToggle = function () {
  var $module = this;
  var $sections = this.$sections;
  var nowExpanded = !this.checkIfAllSectionsOpen();

  nodeListForEach($sections, function ($section) {
    $module.setExpanded(nowExpanded, $section);
    // Store the state in sessionStorage when a change is triggered
    $module.storeState($section);
  });

  $module.updateShowAllButton(nowExpanded);
};

// Set section attributes when opened/closed
Accordion.prototype.setExpanded = function (expanded, $section) {
  var $icon = $section.querySelector('.' + this.upChevronIconClass);
  var $showHideText = $section.querySelector('.' + this.sectionShowHideTextClass);
  var $button = $section.querySelector('.' + this.sectionButtonClass);
  var $newButtonText = expanded
    ? this.i18n.t('hide_this_section')
    : this.i18n.t('show_this_section');

  $showHideText.innerHTML = $newButtonText;
  $button.setAttribute('aria-expanded', expanded);

  // Swap icon, change class
  if (expanded) {
    $section.classList.add(this.sectionExpandedClass);
    $icon.classList.remove(this.downChevronIconClass);
  } else {
    $section.classList.remove(this.sectionExpandedClass);
    $icon.classList.add(this.downChevronIconClass);
  }

  // See if "Show all sections" button text should be updated
  var areAllSectionsOpen = this.checkIfAllSectionsOpen();
  this.updateShowAllButton(areAllSectionsOpen);
};

// Get state of section
Accordion.prototype.isExpanded = function ($section) {
  return $section.classList.contains(this.sectionExpandedClass)
};

// Check if all sections are open
Accordion.prototype.checkIfAllSectionsOpen = function () {
  // Get a count of all the Accordion sections
  var sectionsCount = this.$sections.length;
  // Get a count of all Accordion sections that are expanded
  var expandedSectionCount = this.$module.querySelectorAll('.' + this.sectionExpandedClass).length;
  var areAllSectionsOpen = sectionsCount === expandedSectionCount;

  return areAllSectionsOpen
};

// Update "Show all sections" button
Accordion.prototype.updateShowAllButton = function (expanded) {
  var $showAllIcon = this.$showAllButton.querySelector('.' + this.upChevronIconClass);
  var $showAllText = this.$showAllButton.querySelector('.' + this.showAllTextClass);
  var newButtonText = expanded
    ? this.i18n.t('hide_all_sections')
    : this.i18n.t('show_all_sections');
  this.$showAllButton.setAttribute('aria-expanded', expanded);
  $showAllText.innerHTML = newButtonText;

  // Swap icon, toggle class
  if (expanded) {
    $showAllIcon.classList.remove(this.downChevronIconClass);
  } else {
    $showAllIcon.classList.add(this.downChevronIconClass);
  }
};

// Check for `window.sessionStorage`, and that it actually works.
var helper = {
  checkForSessionStorage: function () {
    var testString = 'this is the test string';
    var result;
    try {
      window.sessionStorage.setItem(testString, testString);
      result = window.sessionStorage.getItem(testString) === testString.toString();
      window.sessionStorage.removeItem(testString);
      return result
    } catch (exception) {
      if ((typeof console === 'undefined' || typeof console.log === 'undefined')) {
        console.log('Notice: sessionStorage not available.');
      }
    }
  }
};

// Set the state of the accordions in sessionStorage
Accordion.prototype.storeState = function ($section) {
  if (this.browserSupportsSessionStorage) {
    // We need a unique way of identifying each content in the Accordion. Since
    // an `#id` should be unique and an `id` is required for `aria-` attributes
    // `id` can be safely used.
    var $button = $section.querySelector('.' + this.sectionButtonClass);

    if ($button) {
      var contentId = $button.getAttribute('aria-controls');
      var contentState = $button.getAttribute('aria-expanded');

      if (typeof contentId === 'undefined' && (typeof console === 'undefined' || typeof console.log === 'undefined')) {
        console.error(new Error('No aria controls present in accordion section heading.'));
      }

      if (typeof contentState === 'undefined' && (typeof console === 'undefined' || typeof console.log === 'undefined')) {
        console.error(new Error('No aria expanded present in accordion section heading.'));
      }

      // Only set the state when both `contentId` and `contentState` are taken from the DOM.
      if (contentId && contentState) {
        window.sessionStorage.setItem(contentId, contentState);
      }
    }
  }
};

// Read the state of the accordions from sessionStorage
Accordion.prototype.setInitialState = function ($section) {
  if (this.browserSupportsSessionStorage) {
    var $button = $section.querySelector('.' + this.sectionButtonClass);

    if ($button) {
      var contentId = $button.getAttribute('aria-controls');
      var contentState = contentId ? window.sessionStorage.getItem(contentId) : null;

      if (contentState !== null) {
        this.setExpanded(contentState === 'true', $section);
      }
    }
  }
};

/**
* Create an element to improve semantics of the section button with punctuation
* @return {object} DOM element
*
* Used to add pause (with a comma) for assistive technology.
* Example: [heading]Section A ,[pause] Show this section.
* https://accessibility.blog.gov.uk/2017/12/18/what-working-on-gov-uk-navigation-taught-us-about-accessibility/
*
* Adding punctuation to the button can also improve its general semantics by dividing its contents
* into thematic chunks.
* See https://github.com/alphagov/govuk-frontend/issues/2327#issuecomment-922957442
*/
Accordion.prototype.getButtonPunctuationEl = function () {
  var $punctuationEl = document.createElement('span');
  $punctuationEl.classList.add('govuk-visually-hidden', 'govuk-accordion__section-heading-divider');
  $punctuationEl.innerHTML = ', ';
  return $punctuationEl
};

return Accordion;

})));
