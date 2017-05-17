# CSS

# Class naming convention

All classnames start with a `.govuk-` namespace.

** Why? **
To encapsulate component styling and prevent unnecessary style leaks. Also to identify ‘approved’ components, that have been rewritten to meet the new coding conventions.

Objects, components, utilites and JS hooks use a prefix:

    Object (layout)    o-               .govuk-o-wrapper

    Component          c-               .govuk-c-button

    Utility            u-               .govuk-u-visually-hidden

    JS hooks           js-              .js-enabled

States use a BEM modifier:

    States             is-              is-visible
                       has-             has-loaded

    <div class="govuk-c-card govuk-c-card--is-active">
        […]
    </div>

** Why **

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

# BEM

Block__Element--Modifier classes.

BEM stands for `Block__Element--Modifier`, not `Block__Element__Element--Modifier`.
Avoid multiple element level naming.

    .govuk-c-modal
    .govuk-c-modal__content
    .govuk-c-modal--supersize

