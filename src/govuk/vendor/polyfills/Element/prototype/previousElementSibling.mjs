// @ts-nocheck
import '../../Object/defineProperty.mjs'
import '../../Element.mjs'

(function(undefined) {

    var detect = (
      'document' in this && "previousElementSibling" in document.documentElement
    )

    if (detect) return

    Object.defineProperty(Element.prototype, 'previousElementSibling', {
      get: function(){
        var el = this.previousSibling;
        while (el && el.nodeType !== 1) { el = el.previousSibling; }
        return el;
      }
    });

}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});
