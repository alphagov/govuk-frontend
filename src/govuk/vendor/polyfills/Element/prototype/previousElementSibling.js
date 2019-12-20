import '../../Object/defineProperty'
import '../../Element'

(function(undefined) {

    // Detection from https://github.com/Financial-Times/polyfill-service/pull/1062/files#diff-a162235fbc9c0dd40d4032265f44942e
    var detect = (
      'Element' in this && 'previousElementSibling' in document.documentElement
    )

    if (detect) return

    (function (global) {
      // There is no polyfill in polyfill-library (https://github.com/Financial-Times/polyfill-library/issues/338)
      // So we source this from https://github.com/Alhadis/Snippets/blob/e09b4dfb7ffc9e250bc28319051e39ead3e5f70a/js/polyfills/IE8-child-elements.js#L35-L40
      Object.defineProperty(Element.prototype, 'previousElementSibling', {
        get: function(){
          var el = this.previousSibling;
          while (el && el.nodeType !== 1) { el = el.previousSibling; }
          return el;
        }
      });

    }(this));

}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});
