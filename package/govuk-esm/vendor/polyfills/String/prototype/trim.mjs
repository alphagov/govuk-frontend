// @ts-nocheck
(function (undefined) {

    var detect = ('trim' in String.prototype);

    if (detect) return

    String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };

}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});
//# sourceMappingURL=vendor/polyfills/String/prototype/trim.mjs.map
