## Polyfilling

The following example shows how to add a polyfill for `Element.closest()`.

1. Determine if the feature needs to be polyfilled

   You can use resources such as ["Can I use"](https://caniuse.com/) and [developer.mozilla.org](https://developer.mozilla.org/en-US/) to check feature support.

   In this example we’ve looked at ["Can I use" `Element.closest()`](https://caniuse.com/element-closest) and seen that it’s not supported in IE11.

2. Use polyfill.io service to generate the polyfill required
   You can [use the library](https://github.com/Financial-Times/polyfill-library) to do this or [use their CDN](https://cdn.polyfill.io/v3/polyfill.js?features=Element.prototype.closest&flags=always) directly: `https://cdn.polyfill.io/v3/polyfill.js?features=Element.prototype.closest&flags=always`

   Then save this in the same structure that is used in the main project (https://github.com/Financial-Times/polyfill-library/tree/master/polyfills)

3. Use polyfill.io service to get detection script

   We need to make sure we only run the polyfills if they’re needed.

   We can take the associated detection code from
   https://github.com/Financial-Times/polyfill-library/blob/master/polyfills/Element/prototype/closest/detect.js

4. Put everything together

```js
(function(undefined) {

    https://github.com/Financial-Times/polyfill-library/blob/master/polyfills/Element/prototype/closest/detect.js
    var detect = (
      // code goes here
    )

    if (detect) return

    // Polyfill from https://cdn.polyfill.io/v3/polyfill.js?features=Element.prototype.closest&flags=always
    // code goes here

}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});
```
