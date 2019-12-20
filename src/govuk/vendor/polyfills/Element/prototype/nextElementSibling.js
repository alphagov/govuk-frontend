import '../../Object/defineProperty'
import '../../Element'

(function(undefined) {

    // Detection from https://github.com/Financial-Times/polyfill-service/pull/1062/files#diff-b09a5d2acf3314b46a6c8f8d0c31b85c
    var detect = (
      'Element' in this && "nextElementSibling" in document.documentElement
    )

    if (detect) return


    (function (global) {

      // There is no polyfill in polyfill-library (https://github.com/Financial-Times/polyfill-library/issues/338)
      // So we source this from https://github.com/Alhadis/Snippets/blob/e09b4dfb7ffc9e250bc28319051e39ead3e5f70a/js/polyfills/IE8-child-elements.js#L28-L33
      Object.defineProperty(Element.prototype, "nextElementSibling", {
        get: function(){
          var el = this.nextSibling;
          while (el && el.nodeType !== 1) { el = el.nextSibling; }
          return el;
        }
      });

    }(this));

}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});
