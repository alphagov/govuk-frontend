import '../../Object/defineProperty.mjs'
import '../../Element.mjs'

(function(undefined) {

    // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-library/master/polyfills/Element/prototype/previousElementSibling/detect.js
    var detect = (
      'document' in this && "previousElementSibling" in document.documentElement
    )

    if (detect) return

    // Polyfill from https://raw.githubusercontent.com/Financial-Times/polyfill-library/master/polyfills/Element/prototype/previousElementSibling/polyfill.js
    Object.defineProperty(Element.prototype, 'previousElementSibling', {
      get: function(){
        var el = this.previousSibling;
        while (el && el.nodeType !== 1) { el = el.previousSibling; }
        return el;
      }
    });

}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});
