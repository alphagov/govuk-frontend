# JavaScript style guide

## Files

JavaScript files have the same name as the component's folder name. Test files have a `.test` suffix placed before the file extension.

```
checkboxes
├── checkboxes.mjs
└── checkboxes.test.js
```

## Skeleton

```js
import { nodeListForEach } from '../vendor/common.mjs'

function Checkboxes ($module) {
  // code goes here
}

Checkboxes.prototype.init = function () {
  // code goes here
}

export default Checkboxes
```

## Use data attributes to initialise component JavaScript

Use `data-module` attributes in HTML to initialise a component in JavaScript. For example:

```html
data-module="govuk-accordion"
```

## Use classes to target DOM elements

After you initialise a component, use `govuk-js-*` classes to target DOM elements. For example:

```html
class="govuk-js-header-toggle"
```

## Comments

Use `/** ... */` for multi-line comments. Include a description, and specify types and values for all parameters and return values.

```js
/**
* Get the nearest ancestor element of a node that matches a given tag name
* @param {object} node element
* @param {string} match tag name (e.g. div)
* @return {object} ancestor element
*/

function (node, match) {
  // code goes here
  return ancestor
}
```

Use `//` for single-line comments. Place single-line comments on a new line above the subject of the comment.

Use `// FIXME:` to annotate problems.

Use `// TODO:` to annotate solutions to problems.

## Constructors and methods

Use the prototype design pattern to structure your code.

Create a constructor and define any variables that the object needs.

```js
function Checkboxes ($module) {
  // code goes here
}
```

Assign methods to the prototype object. Do not overwrite the prototype with a new object as this makes inheritance impossible.

```js
// bad
Checkboxes.prototype = {
  init: function () {
    // code goes here
  }
}

// good
Checkboxes.prototype.init = function () {
  // code goes here
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
import { nodeListForEach } from '../vendor/common.mjs'
// code goes here
export default Checkboxes
```

Avoid using wildcard (`import * as nodeListForEach`) imports.

You must specify the file extension for a file when importing it.

Use default export over named export.

## Polyfilling

If you need to support older browsers, import the necessary [polyfills](/src/govuk/vendor/polyfills) and they will be added to the environment when the feature is not supported.

For example, if you want to polyfill `addEventListener` for IE8, import the Event polyfills.

```js
import '../vendor/polyfills/Event.mjs'
```

If you need polyfills for features that are not yet included in this project, please see the following guide on [how to add polyfills](../polyfilling.md).

## Formatting and linting

GOV.UK Frontend uses [standardjs](http://standardjs.com/), an opinionated JavaScript linter. All JavaScript files follow its conventions, and it runs on CI to ensure that new pull requests are in line with them.

The standard docs have a [complete list of rules and some reasoning behind them](http://standardjs.com/rules.html).

Read more about [running standard manually, or in your editor, on the 'JavaScript coding style' page of the GDS Way](https://gds-way.cloudapps.digital/manuals/programming-languages/js.html#linting).

See also [testing and linting](/docs/releasing/testing-and-linting.md).
