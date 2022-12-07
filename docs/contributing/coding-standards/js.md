# JavaScript style guide

## Files

JavaScript files have the same name as the component's folder name. Test files have a `.test` suffix placed before the file extension.

```
component
├── component.mjs
└── component.test.js
```

## Skeleton

```js
import '../../vendor/polyfills/Element.mjs'

/**
 * Component name
 *
 * @class
 * @param {Element} $module - HTML element to use for component
 * @this {Example}
 */
function Example ($module) {
  if (!($module instanceof HTMLElement)) {
    // Return instance for method chaining
    // using `new Example($module).init()`
    return this
  }

  this.$module = $module

  // Code goes here
}

/**
 * Initialise component
 *
 * @returns {Example} Example component
 */
Example.prototype.init = function () {
  // Check that required elements are present
  if (!this.$module) {
    return this
  }

  // Code goes here

  // Return instance for assignment
  // `var myExample = new Example($module).init()`
  return this
}

export default Example
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
 * Get the first descendent (child) of an HTML element that matches a given tag name
 *
 * @param {Element} $element - HTML element
 * @param {string} tagName - Tag name (for example 'div')
 * @returns {Element} Ancestor element
 */
function ($element, tagName) {
  // Code goes here
  return $element.querySelector(tagName)
}
```

Use `//` for single-line comments. Place single-line comments on a new line above the subject of the comment.

Use `// FIXME:` to annotate problems.

Use `// TODO:` to annotate solutions to problems.

## Constructors and methods

Use the prototype design pattern to structure your code.

Create a constructor and define any variables that the object needs.

```js
function Example ($module) {
  // Code goes here
}
```

Assign methods to the prototype object. Do not overwrite the prototype with a new object as this makes inheritance impossible.

```js
// Bad
Example.prototype = {
  init: function () {
    // Code goes here
  }
}

// Good
Example.prototype.init = function () {
  // Code goes here
}
```

When initialising an object, use the `new` keyword.

```js
// Bad
var myExample = Example().init()

// Good
var myExample = new Example().init()
```

## Modules

Use ECMAScript modules (`import`/`export`) over CommonJS and other formats. You can always transpile to your preferred module system.

```js
import { closestAttributeValue } from '../common/index.mjs'

// Code goes here
export function exampleHelper1 () {}
export function exampleHelper2 () {}
```

You must specify the file extension when using the import keyword.

Avoid using namespace imports (`import * as namespace`) in code transpiled to CommonJS (or AMD) bundled code as this can prevent "tree shaking" optimisations.

Prefer named exports over default exports to avoid compatibility issues with transpiler "synthetic default" as discussed in: https://github.com/alphagov/govuk-frontend/issues/2829

## Polyfilling

If you need to support older browsers, import the necessary [polyfills](/src/govuk/vendor/polyfills) and they will be added to the environment when the feature is not supported.

For example, if you want to polyfill `addEventListener` for IE8, import the Event polyfills.

```js
import '../vendor/polyfills/Event.mjs'
```

If you need polyfills for features that are not yet included in this project, please see the following guide on [how to add polyfills](../polyfilling.md).

## Formatting and linting

GOV.UK Frontend uses [JavaScript Standard Style](https://standardjs.com), an opinionated JavaScript linter. All JavaScript files follow its conventions, and it runs on GitHub Actions to ensure that new pull requests are in line with them.

The standard docs have a [complete list of rules and some reasoning behind them](https://standardjs.com/rules.html).

Read more about [running standard manually, or in your editor, on the 'JavaScript coding style' page of the GDS Way](https://gds-way.cloudapps.digital/manuals/programming-languages/js.html#linting).

See also [testing and linting](/docs/releasing/testing-and-linting.md).
