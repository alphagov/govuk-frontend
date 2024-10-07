# JavaScript style guide

## Files

JavaScript files have the same name as the component's folder name. Test files have a `.test` suffix placed before the file extension.

```console
component
├── component.mjs
└── component.test.js
```

## Skeleton

```mjs
import { GOVUKFrontendComponent } from '../../govuk-frontend-component.mjs'

/**
 * Component name
 *
 * @preserve
 */
export class Example extends GOVUKFrontendComponent {
  /**
   * @param {Element | null} $root - HTML element to use for component
   */
  constructor($root){
    super($root)

    // Code goes here
    this.$root.addEventListener('click', () => {
      // ...
    })
  }
}
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

```mjs
/**
 * Get the first descendent (child) of an HTML element that matches a given tag name
 *
 * @param {Element} $element - HTML element
 * @param {string} tagName - Tag name (for example 'div')
 * @returns {Element} Ancestor element
 */
function exampleHelper($element, tagName) {
  // Code goes here
  return $element.querySelector(tagName)
}
```

Use `//` for single-line comments. Place single-line comments on a new line above the subject of the comment.

Use `// FIXME:` to annotate problems.

Use `// TODO:` to annotate solutions to problems.

## Classes and methods

Use the class design pattern to structure your code.

Create a class and define the methods you need.

```mjs
class Example {
  // Code goes here
}
```

Add methods to the class.

```mjs
// Good
class Example {
  doSomething() {
    // Code goes here
  }
}

// Bad
Example.prototype = {
  doSomething: function () {
    // Code goes here
  }
}
```

When initialising a class, use the `new` keyword.

```mjs
// Bad
const myExample1 = Example()

// Good
const myExample2 = new Example()
```

## Modules

Use ECMAScript (ES) modules (`import`/`export`) over CommonJS and other formats. You can always transpile to your preferred module system.

```mjs
import { closestAttributeValue } from '../common/index.mjs'

// Code goes here
export function exampleHelper1() {}
export function exampleHelper2() {}
```

You must specify the file extension when using the import keyword.

Avoid using namespace imports (`import * as namespace`) in code bundled for CommonJS and other formats as this can prevent "tree shaking" optimisations.

Prefer named exports over default exports to avoid compatibility issues with transpiler "synthetic default" as discussed in: https://github.com/alphagov/govuk-frontend/issues/2829

## Throwing errors

### Error types

First, check if one of the [native errors provides](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#error_types) the right semantic for the error you're looking to throw, if so, use this class.

If none of the native errors have the right semantics, create a new class for this error. This class should:

- have a name ending in `Error` to match the native conventions
- extend `GOVUKFrontendError`, so users can separate our custom errors from native ones using `instanceof`
- have a `name` property set to its class name, as extending classes doesn't set this automatically and grabbing the constructor's name risks being affected by mangling during minification

```js
class CustomError extends GOVUKFrontendError {
  name = 'CustomError'
}
```

### Error message

Keep the message to the point, but provide the users the information they need to identify the cause of the error.

If the message is the same whatever the situation, you may use the constructor of our custom error to centralise that message, rather than passing it each time an error is thrown.

```js
class SupportError extends GOVUKFrontendError {
  name = 'SupportError'

  constructor () {
    super('GOV.UK Frontend is not supported in this browser')
  }
}
```

## Polyfilling

If you need polyfills for features that are not yet included in this project, please see the following guide on [how to add polyfills](../polyfilling.md).

## Formatting and linting

GOV.UK Frontend uses [ESLint](https://eslint.org) with [JavaScript Standard Style](https://standardjs.com), an opinionated JavaScript style guide. All JavaScript files follow its conventions, and it runs on GitHub Actions to ensure that new pull requests are in line with them.

For consistent formatting we run [Prettier](https://prettier.io).

The standard docs have a [complete list of rules and some reasoning behind them](https://standardjs.com/rules.html).

Read more about [running standard manually, or in your editor, on the 'JavaScript coding style' page of the GDS Way](https://gds-way.cloudapps.digital/manuals/programming-languages/js.html#linting).

See also [testing and linting](/docs/releasing/testing-and-linting.md).

## Running the lint task

You can run the linter with `npm run lint:js`, or use linting in [Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [other editors that support ESLint](https://eslint.org/docs/latest/use/integrations#editors).

To automatically fix ESLint issues, add the `--fix` flag:

```shell
npm run lint:js -- --fix
```

## Running the formatting task

You can run the formatter with `npm run lint:prettier`, or use formatting in [Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and [other editors that support Prettier](https://prettier.io/docs/en/editors.html)

To automatically fix Prettier issues in all supported files, add the `--write` flag:

```shell
npm run lint:prettier -- --write
```
