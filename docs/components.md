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

## Commit structure

This makes it easier to scan commit messages.

fix(button): amend button colour to meet contrast requirements


```
type(scope): short summary
long description
issue fixed
```

1. choose the [type of change](#commit-type)
2. add [scope for the change](#scope)
3. write a short summary
4. write a longer description
   list any breaking changes or issues fixed

### commit type:
- feat (new feature for the user, not a new feature for build script)
- fix (bug fix for the user, not a fix to a build script)
- docs (changes to the documentation)
- refactor (refactoring production code, eg. renaming a variable)
- style (formatting, missing semi colons, etc; no production code change)
- test (adding missing tests, refactoring tests; no production code change)
- chore (updating gulp tasks etc; no production code change)

### scope:
thing being changed - e.g. component name, package, gulp
