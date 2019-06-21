import '../../Object/defineProperty'
import '../../Element'

(function(undefined) {

    // Detection from https://github.com/Financial-Times/polyfill-service/pull/1062/files#diff-a162235fbc9c0dd40d4032265f44942e
    var detect = (
      'Element' in this && 'previousElementSibling' in document.documentElement
    )

    if (detect) return

    (function (global) {
      // Polyfill from https://github.com/Financial-Times/polyfill-service/pull/1062/files#diff-b45a1197b842728cb76b624b6ba7d739
      Object.defineProperty(Element.prototype, 'previousElementSibling', {
        get: function(){
          var el = this.previousSibling;
          while (el && el.nodeType !== 1) { el = el.previousSibling; }
          return (el.nodeType === 1) ? el : null;
        }
      });

    }(this));

}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});
