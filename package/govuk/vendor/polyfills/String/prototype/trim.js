(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
    typeof define === 'function' && define.amd ? define('GOVUKFrontend', factory) :
    (factory());
}(this, (function () { 'use strict';

    // @ts-nocheck
    (function (undefined) {

        var detect = ('trim' in String.prototype);

        if (detect) return

        String.prototype.trim = function () {
            return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        };

    }).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

})));
//# sourceMappingURL=trim.js.map
