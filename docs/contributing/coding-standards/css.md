# CSS Style Guide

## Class naming convention

## `govuk` namespacing

All class names start with a `.govuk-` namespace to reduce the likelihood of
conflicting with existing classes in your application. It also helps to identify
where the styling for a particular element is coming from.

If you are building components for your own application or framework you should
use a different prefix, for example `.app-` or the initials of your department.

## Block Element Modifier (BEM)

GOV.UK Frontend uses the Block Element Modifier (BEM) methodology when naming
CSS classes. This is designed to help developers understand how the different
classes relate to each other.

The naming convention follows this pattern:

```scss
.block {}
.block__element {}
.block--modifier {}

.govuk-card {}            // Block - the root of a component
.govuk-card__body {}      // Element - a part of the block
.govuk-card--active {}    // Modifier - a variant of the block
```

It uses double hyphens (`--`) and underscores (`__`) so that the block, element
or modifiers themselves can be hyphen delimited without causing ambiguity.

For example:

```scss
.govuk-pagination {}
.govuk-pagination__link-title {}
.govuk-pagination__link-title--decorated {}
```

### Further reading:

- [Get BEM](http://getbem.com/introduction/)
- [BEM Resources](https://github.com/sturobson/BEM-resources)
- [Harry Roberts - BEMIT: Taking the BEM Naming Convention a Step Further](https://csswizardry.com/2015/08/bemit-taking-the-bem-naming-convention-a-step-further/)

## Nesting

Break elements and modifiers outside of blocks rather than nesting using a
parent selector `&`.

This makes the codebase easier to read, and makes it easier to search for a
given class name. It also discourages excessive nesting.

Bad:

```scss
.govuk-breadcrumb {
  // ...
  &__item {
    // ...
  }
}
```

Good:

```scss
.govuk-breadcrumb {
  // ...
}

.govuk-breadcrumb__item {
  // ...
}
```

BEM stands for `Block__Element--Modifier`, not `Block__Element__Element--Modifier`.

Avoid including multiple elements when naming classes.

## Single Responsibility Principle

Each class has a single purpose, so you can be sure when making a change to a
class - it will only affect the element that class is applied to.

Also when deprecating classes, all of the CSS for this class can be removed
without affecting another component that had reused this css.

**Why?**

To ensure that styles can safely be added or removed without fear of breaking
other components.

## Component modifiers

Keep all of the variants of a component in the same place.

`.govuk-error-summary` modifies the `.govuk-list` component.

Component modifiers use an extra class, scoped to the component:

`.govuk-error-summary__list`

This class is part of the component, rather than a parent of a component.

**Why?**
This makes it easier to keep track of different contexts.

## Formatting and linting

To ensure code quality and consistency in our Sass files we check that certain rules are followed. These rules are based on [GDS Stylelint Config](https://github.com/alphagov/stylelint-config-gds/blob/main/scss.js), but we also add our own custom rules with a project [config file](/stylelint.config.js).

For consistent formatting we run [Prettier](https://prettier.io).

See [testing and linting](/docs/releasing/testing-and-linting.md) for more information.

## Running the lint task

You can run the linter with `npm run lint:scss`, or use linting in [Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) and [other editors that support Stylelint](https://stylelint.io/user-guide/customize/#using-stylelint).

To automatically fix Stylelint issues, add the `--fix` flag:

```shell
npm run lint:scss -- --fix
```

## Running the formatting task

You can run the formatter with `npm run lint:prettier`, or use formatting in [Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and [other editors that support Prettier](https://prettier.io/docs/en/editors.html)

To automatically fix Prettier issues in all supported files, add the `--write` flag:

```shell
npm run lint:prettier -- --write
```

## Linting rules

We use the following rules when linting files:

### Use soft tabs (2 spaces)

### Write each property on its own line

Bad:

```scss
.selector {padding: 0; border: 0;}
```

Good:

```scss
.selector {
  padding: 0;
  border: 0;
}
```

### Use variables for colours not HEX values in selectors rules, unless in variables.

Bad:

```scss
.selector {
  color: #005ea5;
}
```

Good:

```scss
.selector {
  color: $govuk-blue;
}
```

### Colours defined as variables should be in lowercase and in full length

Bad:

```scss
$white: #FFF;
```

Good:

```scss
$white: #ffffff;
```

### Avoid using ID selectors

Bad:

```scss
#content {
  // ...
}
```

Good:

```scss
.govuk-wrapper {
  // ...
}
```

### Separate rule, function, and mixin declarations with empty lines

Bad:

```scss
p {
  margin: 0;
  em {
    // ...
  }
}
a {
  // ...
}
```

Good:

```scss
p {
  margin: 0;

  em {
    // ...
  }
}

a {
  // ...
}
```

### Use no more than 3 levels of nesting

Bad:

```scss
.govuk-breadcrumb {
  // ...
  &__item {
    // ...
  }
}
```

Good:

```scss
.govuk-breadcrumb {
  // ...
}

.govuk-breadcrumb__item {
  // ...
}
```

### Don't use extends, use mixins

Bad:

```scss
@extend %contain-floats;
```

Good:

```scss
@include clearfix;
```

### Allow max 3-rule property shorthand if possible

Bad:

```scss
margin: 1px 2px 3px 2px;
```

Good:

```scss
margin: 1px 2px 3px;
```

### Strings should always use double quotes

Bad:

```scss
@import 'foo';

$govuk-font-family-gds-transport: 'GDS Transport', arial, sans-serif;

.bar {
  content: 'baz';
}
```

Good:

```scss
@import "foo";

$govuk-font-family-gds-transport: "GDS Transport", arial, sans-serif;

.bar {
  content: "baz";
}
```

### Files should always have a final newline

### The basenames of `@import`ed SCSS partials should not begin with an underscore and should not include the filename extension

Bad:

```scss
@import "_foo.scss";
@import "_bar/foo.scss";
```

Good:

```scss
@import "foo";
@import "bar/foo";
```

### Properties should be formatted with a single space separating the colon from the property's value

Bad:

```scss
.foo {
  content:"bar";
}
```

Good:

```scss
.foo {
  content: "bar";
}
```

### `@if` statements should be written without surrounding brackets

Bad:

```scss
@if ($foo == $bar) {
  $baz: 1;
}
```

Good:

```scss
@if $foo == $bar {
  $baz: 1;
}
```

### `@if` statements comparing against `null` values should use `not`

Bad:

```scss
@if $foo == null {
  $baz: 1;
}
```

Good:

```scss
@if not $foo {
  $baz: 1;
}
```

### Operators should be formatted with a single space on both sides of an infix operator. These include `+, -, *, /, %, ==, !=, >, >=, <,` and `<=`

Bad:

```scss
.selector-1 {
  margin: 5px+15px;
}

$foo: 1;
$bar: 3;

.selector-2 {
  margin: $foo+$bar+"px";
}

$foo: 1+1;
$bar: 2-1;

@if $foo==$bar {
  $baz: 1;
}

@if $foo!=$bar {
  $baz: 1;
}
```

Good:

```scss
.selector-1 {
  margin: 5px + 15px;
}

$foo: 1;
$bar: 3;

.selector-2 {
  margin: $foo + $bar + "px";
}

$foo: 1 + 1;
$bar: 2 - 1;

@if $foo == $bar {
  $baz: 1;
}

@if $foo != $bar {
  $baz: 1;
}
```

### Functions, mixins, variables, and placeholders should be declared with all lowercase letters and hyphens instead of underscores

Bad:

```scss
@mixin FONT_STACK() {
  font-family: $govuk-font-stack;
}
```

Good:

```scss
@mixin font-stack() {
  font-family: $govuk-font-stack;
}
```

### Omit length units on zero values

Bad:

```scss
.selector {
  margin: 0px;
}
```

Good:

```scss
.selector {
  margin: 0;
}
```

### Property values and variable declarations should always end with a semicolon

Bad:

```scss
.selector {
  margin: 0
}

$my-example-var: value
```

Good:

```scss
.selector {
  margin: 0;
}

$my-example-var: value;
```

### Write leading or trailing zeroes for numeric values with a decimal point

Bad:

```scss
.selector {
  font-size: .50em;
}
```

Good:

```scss
.selector {
  font-size: 0.5em;
}
```

### Remove trailing whitespace

More write up on [supported rules](https://stylelint.io/user-guide/rules/list).

## Comments

For comments, you should normally use 2 slashes (`//`) at the start of the line.

If you need to include the comment in the compiled CSS, use the multi-line ('loud') comment style, which starts with `/*` and ends at the next `*/`.

Wrap comments at 80 characters wherever possible.

### SassDoc

We document SCSS using [SassDoc](http://sassdoc.com/). This includes most of the settings, helpers and tools layers, with variables, functions and mixins being marked as private or public.

The SassDoc comments are used to generate the [Sass API reference in the GOV.UK Frontend docs](https://frontend.design-system.service.gov.uk/sass-api-reference/).

For SassDoc comments, use 3 slashes (`///`) at the start of the line.

See [`_colour.scss`](/packages/govuk-frontend/src/govuk/helpers/_colour.scss) for an example of SassDoc syntax.
