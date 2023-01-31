(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
    typeof define === 'function' && define.amd ? define('GOVUKFrontend', factory) :
    (factory());
}(this, (function () { 'use strict';

    (function(undefined) {

        // Detection from https://github.com/mdn/content/blob/cf607d68522cd35ee7670782d3ee3a361eaef2e4/files/en-us/web/javascript/reference/global_objects/string/trim/index.md#polyfill
        var detect = ('trim' in String.prototype);
        
        if (detect) return

        // Polyfill from https://github.com/mdn/content/blob/cf607d68522cd35ee7670782d3ee3a361eaef2e4/files/en-us/web/javascript/reference/global_objects/string/trim/index.md#polyfill
        String.prototype.trim = function () {
            return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        };

    }).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

})));
//# sourceMappingURL=trim.js.map
