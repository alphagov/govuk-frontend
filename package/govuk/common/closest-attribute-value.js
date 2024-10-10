(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define('GOVUKFrontend', ['exports'], factory) :
  (factory((global.GOVUKFrontend = {})));
}(this, (function (exports) { 'use strict';

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

  /**
   * Returns the value of the given attribute closest to the given element (including itself)
   *
   * @deprecated Will be made private in v5.0
   * @param {Element} $element - The element to start walking the DOM tree up
   * @param {string} attributeName - The name of the attribute
   * @returns {string | null} Attribute value
   */
  function closestAttributeValue ($element, attributeName) {
    var $closestElementWithAttribute = $element.closest('[' + attributeName + ']');
    return $closestElementWithAttribute
      ? $closestElementWithAttribute.getAttribute(attributeName)
      : null
  }

  exports.closestAttributeValue = closestAttributeValue;

})));
//# sourceMappingURL=closest-attribute-value.js.map
