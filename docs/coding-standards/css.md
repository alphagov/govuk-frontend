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

### Further reading:

* [Harry Roberts - More Transparent UI Code with Namespaces](https://csswizardry.com/2015/03/more-transparent-ui-code-with-namespaces/)
* [Harry Roberts - BEMIT: Taking the BEM Naming Convention a Step Further](https://csswizardry.com/2015/08/bemit-taking-the-bem-naming-convention-a-step-further/)
* [CSS-Tricks - BEM - 101](https://css-tricks.com/bem-101/)

