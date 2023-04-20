import '../../Object/defineProperty.mjs';
import '../../Element.mjs';

// @ts-nocheck

(function(undefined) {

  // Detection from https://raw.githubusercontent.com/Financial-Times/polyfill-library/13cf7c340974d128d557580b5e2dafcd1b1192d1/polyfills/Element/prototype/dataset/detect.js
  var detect = (function(){
    if (!document.documentElement.dataset) {
      return false;
    }
    var el = document.createElement('div');
    el.setAttribute("data-a-b", "c");
    return el.dataset && el.dataset.aB == "c";
  }());

  if (detect) return

  // Polyfill derived from  https://raw.githubusercontent.com/Financial-Times/polyfill-library/13cf7c340974d128d557580b5e2dafcd1b1192d1/polyfills/Element/prototype/dataset/polyfill.js
  Object.defineProperty(Element.prototype, 'dataset', {
    get: function() {
      var element = this;
      var attributes = this.attributes;
      var map = {};

      for (var i = 0; i < attributes.length; i++) {
        var attribute = attributes[i];

        // This regex has been edited from the original polyfill, to add
        // support for period (.) separators in data-* attribute names. These
        // are allowed in the HTML spec, but were not covered by the original
        // polyfill's regex. We use periods in our i18n implementation.
        if (attribute && attribute.name && (/^data-\w[.\w-]*$/).test(attribute.name)) {
          var name = attribute.name;
          var value = attribute.value;

          var propName = name.substr(5).replace(/-./g, function (prop) {
            return prop.charAt(1).toUpperCase();
          });

          // If this browser supports __defineGetter__ and __defineSetter__,
          // continue using defineProperty. If not (like IE 8 and below), we use
          // a hacky fallback which at least gives an object in the right format
          if ('__defineGetter__' in Object.prototype && '__defineSetter__' in Object.prototype) {
            Object.defineProperty(map, propName, {
              enumerable: true,
              get: function() {
                return this.value;
              }.bind({value: value || ''}),
              set: function setter(name, value) {
                if (typeof value !== 'undefined') {
                  this.setAttribute(name, value);
                } else {
                  this.removeAttribute(name);
                }
              }.bind(element, name)
            });
          } else {
            map[propName] = value;
          }

        }
      }

      return map;
    }
  });

}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});
//# sourceMappingURL=vendor/polyfills/Element/prototype/dataset.mjs.map
