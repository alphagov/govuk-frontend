(function(undefined) {

  // Detection from https://github.com/Financial-Times/polyfill-library/blob/master/polyfills/Object/keys/detect.js
  var detect = (
    'keys' in Object && (function () {
      // Safari 5.0 bug where Object.keys doesn't work with arguments
      return (Object.keys(arguments)).length === 2;
    }(1, 2)) && (function () {
      try {
        // In ES6 Object.keys works on all object except `null` and `undefined`.
        Object.keys('');
        return true;
      } catch (e) {
        return false;
      }
    }())
  )
  
  if (detect) return
  
  // Polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
  Object.keys = (function() {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;
  
    return function(obj) {
      if (typeof obj !== 'function' && (typeof obj !== 'object' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }
  
      var result = [], prop, i;
  
      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }
  
      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());

})
.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});