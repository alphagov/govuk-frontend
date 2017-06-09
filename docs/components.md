# Components

All components must use the `.govuk-` namespace and the `c` prefix.

For example, `.govuk-c-button`.

All components must follow the conventions described in our [CSS coding standards](coding-standards/css.md).

## Every component should:
* use classes for child elements, scoped to the parent component
* be flexible, not set a width or external padding and margins
* set internal margins in a single direction
* not rely on any other selector outside of the component scss file to style its children

## Publishing components

We are using [lerna.js](https://lernajs.io/) to publish components.

Lerna is a tool that optimizes the workflow around managing multi-package repositories with git and npm.

First run the build, to ensure any changes to `src/components/component-name` are made to `packages/component-name`.

```
npm run build
```

Then bootstrap the packages.
Install all package dependencies and link any cross-dependencies.

```
npm run lerna:boostrap
```

To list all of the packages:

```
npm run lerna:ls
```

To publish changes to a component:

```
npm run lerna:publish
```

This will create a new release of the packages that have been updated.
It will take you through each component and prompt for a new version, then update all the packages on git and npm.

To see which components have been changed since the last release:

```
npm run lerna:updated
```

## Generate a changelog

```
npm run lerna:log
```
You will required to have exported the [GitHub API personal access token](https://github.com/settings/tokens)

```
$ export GITHUB_AUTH="tokengoeshere"
```

Those changes can then be copied and pasted into the commit message.

More on [Lerna Changelog](https://github.com/lerna/lerna-changelog#readme)
