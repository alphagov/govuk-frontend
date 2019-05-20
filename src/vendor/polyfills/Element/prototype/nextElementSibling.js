import '../../Object/defineProperty'
import '../../Element'

(function(undefined) {

    // Detection from https://github.com/Financial-Times/polyfill-service/pull/1062/files#diff-b09a5d2acf3314b46a6c8f8d0c31b85c
    var detect = (
      'Element' in this && "nextElementSibling" in document.documentElement
    )

    if (detect) return


    (function (global) {

      // Polyfill from https://github.com/Financial-Times/polyfill-service/pull/1062/files#diff-404b69b4750d18dea4174930a49170fd
      Object.defineProperty(Element.prototype, "nextElementSibling", {
        get: function(){
          var el = this.nextSibling;
          while (el && el.nodeType !== 1) { el = el.nextSibling; }
          return (el.nodeType === 1) ? el : null;
        }
      });

    }(this));

}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});
