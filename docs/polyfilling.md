## Polyfilling

The following example shows how to add a polyfill for `addEventListener`.

1. Determine if the feature needs to be polyfilled

You can use resources such as [caniuse.com](https://caniuse.com/) and [developer.mozilla.org](https://developer.mozilla.org/en-US/) to check feature support.

In this example we’ve looked at [caniuse addEventListener](https://caniuse.com/#search=addEventListener) and seen that it’s not supported in IE8.

2. Use polyfill.io service to generate the polyfill required
You can [use the library](https://github.com/Financial-Times/polyfill-service#getpolyfillsoptions-method) to do this or [use their CDN](https://cdn.polyfill.io/v2/polyfill.js?features=Event&flags=always) directly: `https://cdn.polyfill.io/v2/polyfill.js?features=Event&flags=always`

Then save this in the same structure that is used in the main project (https://github.com/Financial-Times/polyfill-service/tree/master/packages/polyfill-library/polyfills)

3. Use polyfill.io service to get detection script

We need to make sure we only run the polyfills if they’re needed.

We can take the associated detection code from
https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Event/detect.js

4. Put everything together

```js
(function(undefined) {

    // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Event/detect.js
    var detect = (
      // code goes here
    )

    if (detect) return

    // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Event&flags=always
    // code goes here

}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});
```
