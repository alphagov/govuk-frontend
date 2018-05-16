# Components

All components must use the `.govuk-` namespace.

For example, `.govuk-button`.

All components must follow the conventions described in our [CSS coding standards](coding-standards/css.md).

## Every component should:
* use classes for child elements, scoped to the parent component
* be flexible, not set a width or external padding and margins
* set internal margins in a single direction
* not rely on any other selector outside of the component scss file to style its children

## Component template API
[Read more](component-api.md) about the way we write component templates.
