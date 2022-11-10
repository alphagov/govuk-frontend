(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define('GOVUKFrontend', factory) :
	(factory());
}(this, (function () { 'use strict';

(function(undefined) {

    // Detection from https://github.com/Financial-Times/polyfill-library/blob/v3.111.0/polyfills/Date/now/detect.js
    var detect = ('Date' in self && 'now' in self.Date && 'getTime' in self.Date.prototype);

    if (detect) return

    // Polyfill from https://polyfill.io/v3/polyfill.js?version=3.111.0&features=Date.now&flags=always
    Date.now = function () {
        return new Date().getTime();
    };

}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

})));
