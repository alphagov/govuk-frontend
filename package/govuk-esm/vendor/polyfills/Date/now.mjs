// @ts-nocheck
(function (undefined) {

    var detect = ('Date' in self && 'now' in self.Date && 'getTime' in self.Date.prototype);

    if (detect) return

    Date.now = function () {
        return new Date().getTime();
    };

}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});
//# sourceMappingURL=vendor/polyfills/Date/now.mjs.map
