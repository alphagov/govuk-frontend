// @ts-nocheck
import '../../Object/defineProperty.mjs'
import '../../Element.mjs'

(function(undefined) {

    var detect = (
      'document' in this && "nextElementSibling" in document.documentElement
    )

    if (detect) return

    Object.defineProperty(Element.prototype, "nextElementSibling", {
      get: function(){
        var el = this.nextSibling;
        while (el && el.nodeType !== 1) { el = el.nextSibling; }
        return el;
      }
    });

}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});
