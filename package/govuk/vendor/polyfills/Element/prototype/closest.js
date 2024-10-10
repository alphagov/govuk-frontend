(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define('GOVUKFrontend', factory) :
  (factory());
}(this, (function () { 'use strict';

  // @ts-nocheck
  (function (undefined) {

    var detect = (
      'document' in this && "matches" in document.documentElement
    );

    if (detect) return

    Element.prototype.matches = Element.prototype.webkitMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.mozMatchesSelector || function matches(selector) {
      var element = this;
      var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
      var index = 0;

      while (elements[index] && elements[index] !== element) {
        ++index;
      }

      return !!elements[index];
    };

  }).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

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

})));
//# sourceMappingURL=closest.js.map
