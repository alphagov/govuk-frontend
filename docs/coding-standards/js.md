# JavaScript style guide
## Files
JavaScript files have the same name as the component's folder name. Test files have a `.test` suffix placed before the file extension.

```
checkboxes
├── checkboxes.js
└── checkboxes.test.js
```
## Skeleton

```js
import { nodeListForEach } from '../globals/common'

function Checkboxes ($module) {
  ...
}

Checkboxes.prototype.init = function () {
  ...
}

export default Checkboxes
```
## Comments

Use `/** ... */` for multi-line comments. Include a description, specify types and values for all parameters and return values.

```js
/**
* Get the nearest ancestor element of a node that matches a given tag name
* @param {object} node element
* @param {string} match tag name (e.g. div)
* @return {object} ancestor element
*/

function (node, match) {
  ...
  return ancestor
}
```

Use `//` for single line comments. Place single line comments on a newline above the subject of the comment.

Use `// FIXME:` to annotate problems.

Use `// TODO:` to annotate solutions to problems.

## Constructors and methods

Use the prototype design pattern to structure your code.

Create a constructor and define any variables that the object needs

```
function Checkboxes ($module) {
  ...
}
```

Assign methods to the prototype object. Do not overwrite the prototype with a new object as this makes inheritance impossible.

```js
// bad
Checkboxes.prototype = {
  init: function () {
    ...
  }
}

// good
Checkboxes.prototype.init = function () {
  ...
}
```

When initialising an object, use the `new` keyword.

```js
// bad
var myCheckbox = Checkbox().init()

// good
var myCheckbox = new Checkbox().init()
```
## Modules

Use ES6 modules (`import`/`export`) over a non-standard module system. You can always transpile to your preferred module system.

```js
import { nodeListForEach } from '../globals/common'
...
export default Checkboxes
```

Avoid using wildcard (`import * as nodeListForEach`) imports.

Prefer default export over named export.

## Polyfilling

If you’re new to polyfilling make sure to read https://remysharp.com/2010/10/08/what-is-a-polyfill

Before GOV.UK Frontend our projects used jQuery for a few main things: DOM interactions, events and data manipulation.

We’re taking a step back from jQuery due to its lack of support for the browsers we support, its large file size, lack of security updates and from conversations with the community.

We’re instead opting to write standard ES5 JavaScript, that we polyfill where necessary.

This means places where we would use [`$.each`](http://api.jquery.com/jquery.each/) we’re instead using [`.forEach`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) and polyfill the missing gaps.

We use polyfills provided by the Financial Times' [Polyfill service](https://polyfill.io).

This approach ensures that multiple polyfills can be sourced from this service with more confidence they’ll work without conflicting with each other.

The Polyfill service does not do runtime detection in browsers and instead opts to do this on the server via user-agent sniffing, it ships only the code needed for that browser which means newer browsers don’t have to run anything. We could investigate lazy-loading in the future, but for now we’re doing a bundled approach based on the lowest common denominator.

We are vendoring these polyfills to avoid any [single point of failure](https://en.wikipedia.org/wiki/Single_point_of_failure) issues that could arise from relying on a CDN.

So we detect if polyfills are needed at runtime, which results in all browsers getting the same polyfill bundle.

We hope that our approach can be automated or moved into a reusable npm package, based on their [npm package](https://github.com/Financial-Times/polyfill-service#library).
### Example: Polyfilling ‘addEventListener’ usage

1. Determine if the feature needs to be polyfilled

You can use resources such as [caniuse.com](https://caniuse.com/) and [developer.mozilla.org](https://developer.mozilla.org/en-US/) to check feature support.

In this example we’ve looked at [caniuse addEventListener](https://caniuse.com/#search=addEventListener) and seen that it’s not supported in IE8.

2. Use polyfill.io service to generate the polyfill required
You can [use the library](https://github.com/Financial-Times/polyfill-service#getpolyfillsoptions-method) to do this or [use their CDN](https://cdn.polyfill.io/v2/polyfill.js?features=Event&flags=always) directly: `https://cdn.polyfill.io/v2/polyfill.js?features=Event&flags=always`

Then save this in the same structure that is used in the main project (https://github.com/Financial-Times/polyfill-service/tree/master/packages/polyfill-library/polyfills)

3. Use polyfill.io service to get detection script

We need to make sure we only run the polyfills if they’re needed.

So we can grab the associated detection code from
https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Event/detect.js

4. Put everything together

```js
(function(undefined) {

    // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Event/detect.js
    var detect = (
      // code goes here ...
    )

    if (detect) return

    // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Event&flags=always
    // code goes here ...

}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});
```
## Formatting

GOV.UK Frontend uses [standardjs](http://standardjs.com/), an opinionated JavaScript linter. All JavaScript files follow its conventions, and it runs on CI to ensure that new pull requests are in line with them.

The standard docs have a [complete list of rules and some reasoning behind them](http://standardjs.com/rules.html).

Read more about [running standard manually or in your editor](https://github.com/alphagov/styleguides/blob/master/js.md#linting).


