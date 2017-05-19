# CSS

# Class naming convention

## Namespace

All classnames start with a `.govuk-` namespace.

**Why?**

To encapsulate component styling and prevent unnecessary style leaks. Also to identify ‘approved’ components, that have been rewritten to meet the new coding conventions.

## Prefixes

Objects, components, utilites and JS hooks use a prefix:

    Object (layout)    o-               .govuk-o-wrapper

    Component          c-               .govuk-c-button

    Utility            u-               .govuk-u-visually-hidden

    JS hooks           js-              .govuk-js-enabled

**Why**

To easily identify components, objects and utilties and to know what the implications of changing each one will be.

## Objects o-

Objects can range from something as simple as a wrapper element, to layout systems.

May be used in any number of unrelated contexts to the one you can currently see it in.
Making modifications to these types of class could potentially have knock-on effects in a lot of other unrelated places.

## Components c-

Components are recognisable pieces of UI.

Modifying these styles should be safe and have no side effects.

## Utilities u-

It has a very specific role (often providing only one declaration) and should not be bound onto or changed.

It can be reused and is not tied to any specific piece of UI.

## JS hooks js-

Use a prefix for all JavaScript hooks.


# BEM

BEM – meaning block, element, modifier – is a front-end naming methodology.

BEM tells developers how classes relate to each other.

The naming convention follows this pattern:

    .block {}
    .block__element {}
    .block--modifier {}

    .govuk-c-card               // Block - the root of a component
    .govuk-c-card__body         // Element - a part of the block
    .govuk-c-card--active       // Modifier - a variant of the block

The reason for double hyphens and underscores after the block name, is so that the block can be hyphen delimited, for example:

    .govuk-c-phase-banner

BEM stands for `Block__Element--Modifier`, not `Block__Element__Element--Modifier`.
Avoid multiple element level naming.

## Nesting

Aim to keep nesting to a minimum.

Break elements and modifiers outside of blocks rather than nesting using a parent selector `&`.

Bad:

    .gv-c-breadcrumb {
      ...
      &__item {
        ...
      }
    }

Good:

    .gv-c-breadcrumb {
      ...
    }

    .gv-c-breadcrumb__item {
      ...
    }

**Why?**

This makes the code base more searchable and straightforward, making it easier to maintain.
It also  discourages the (bad) habit of excessive nesting.

### Further reading:

* [Harry Roberts - More Transparent UI Code with Namespaces](https://csswizardry.com/2015/03/more-transparent-ui-code-with-namespaces/)
* [Harry Roberts - BEMIT: Taking the BEM Naming Convention a Step Further](https://csswizardry.com/2015/08/bemit-taking-the-bem-naming-convention-a-step-further/)
* [CSS-Tricks - BEM - 101](https://css-tricks.com/bem-101/)


# Linting

To ensure code quality and consistency in our Sass files we check that certain style rules are followed using a project [YAML file](../config/.sass-lint.yml)
As we're using node-sass parser to parse our scss files, the package of choice is [sass-lint](https://github.com/sasstools/sass-lint).

## Running the lint task
You can run the linter in [gulp](https://www.npmjs.com/package/gulp-sass-lint) or check linting directly in [Sublime Text](https://github.com/skovhus/SublimeLinter-contrib-sass-lint), [Atom](https://atom.io/packages/linter-sass-lint) or other [IDE's](https://github.com/sasstools/sass-lint#ide-integration)

## Linting rules

We use the following rules when linting files:

### Use soft tabs (2 spaces)
### Write each property in own line

Bad:

`.selector {border: 0; padding: 0;}`

Good:
```
.selector {
  border: 0;
  padding: 0;
}
```

### Use variables for colours not HEX values in selectors rules, unless in variables.

Bad:
```
.selector {
  color: #005ea5;
}
```
Good:
.selector {
  color: $govuk-blue;
}

### Colours defined as variables should be in lowercase and in full length

Bad:
```
$white: #FFF;
```
Good:
```
$white: #ffffff;
```

### Use `border: 0` not `none` to denote no border
### Avoid using ID selectors
### Separate rule, function, and mixin declarations with empty lines

Bad:
```
p {
  margin: 0;
  em {
    ...
  }
}
a {
  ...
}
```

Good:
```
p {
  margin: 0;

  em {
    ...
  }
}

a {
  ...
}
```

### Use no more than 3 levels of nesting
### Don't use extends, use mixins
### Allow max 3-rule property shorthand if possible

Bad:
```
margin: 1px 2px 3px 2px;
```
Good:
```
margin: 1px 2px 3px;
```
### Files should always have a final newline
### Commas in lists should be followed by a space

### The basenames of `@import`ed SCSS partials should not begin with an underscore and should not include the filename extension

Bad:
```
@import '_foo.scss';
@import '_bar/foo.scss';
```
Good:
```
@import 'foo';
@import 'bar/foo';
```

### Properties should be formatted with a single space separating the colon from the property's value

Bad:
```
.foo {
  content:bar';
}
```
Good:
```
.foo {
  content: 'bar';
}
```

### Operators should be formatted with a single space on both sides of an infix operator. These include `+, -, *, /, %, ==, !=, >, >=, <,` and `<=`

Bad:
```
.selector {
  margin: 5px+15px;
}

$foo: 1;
$bar: 3;

.selector {
  margin: $foo+$bar+'px';
}

$foo: 1+1;
$bar: 2-1;

@if $foo==$bar {
  $baz: 1;
}

@if ($foo!=$bar) {
  $baz: 1;
}
```
Good:
```
.selector {
  margin: 5px + 15px;
}

$foo: 1;
$bar: 3;

.selector {
  margin: $foo + $bar + 'px';
}

$foo: 1 + 1;
$bar: 2 - 1;

@if $foo == $bar {
  $baz: 1;
}

@if ($foo != $bar) {
  $baz: 1;
}
```

### Functions, mixins, variables, and placeholders should be declared with all lowercase letters and hyphens instead of underscores

Bad:
```
@mixin FONT_STACK() {
  content: '';
}
```
Good:
```
@mixin font-stack() {
  content: '';
}
```

### Omit length units on zero values

Bad:
```
.selector {
  margin: 0px;
}
```
Good:
```
.selector {
  margin: 0;
}
```

### Property values and variable declarations should always end with a semicolon
### Don't write trailing zeros for numeric values with a decimal point

```
.selector {
  font-size: 0.5em;
}
```
Good:
```
.selector {
  font-size: 0.5em;
}
```

### Remove trailing whitespace

More write up on [supported rules](https://github.com/sasstools/sass-lint/tree/master/docs/rules).
