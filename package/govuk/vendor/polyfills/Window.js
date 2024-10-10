(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define('GOVUKFrontend', factory) :
	(factory());
}(this, (function () { 'use strict';

	// @ts-nocheck
	(function (undefined) {

	var detect = ('Window' in this);

	if (detect) return

	if ((typeof WorkerGlobalScope === "undefined") && (typeof importScripts !== "function")) {
		(function (global) {
			if (global.constructor) {
				global.Window = global.constructor;
			} else {
				(global.Window = global.constructor = new Function('return function Window() {}')()).prototype = this;
			}
		}(this));
	}

	})
	.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

})));
//# sourceMappingURL=Window.js.map
