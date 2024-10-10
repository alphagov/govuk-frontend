import './matches.mjs';

// @ts-nocheck

(function(undefined) {

  var detect = (
    'document' in this && "closest" in document.documentElement
  );

  if (detect) return

  Element.prototype.closest = function closest(selector) {
    var node = this;

    while (node) {
      if (node.matches(selector)) return node;
      else node = 'SVGElement' in window && node instanceof SVGElement ? node.parentNode : node.parentElement;
    }

    return null;
  };

}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});
//# sourceMappingURL=vendor/polyfills/Element/prototype/closest.mjs.map
