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

We are using [lerna.js](https://lernajs.io/) to manage our packages and publish to npm.

Lerna is a tool that optimizes the workflow around managing multi-package repositories with git and npm.

### Publishing components manually (while in Alpha)

In a new branch:

- Run the `npm build:packages` task to ensure any changes to `src/components/component-name` are copied to `packages/component-name`.

```
npm build:packages
```

- Ensure each component has a package.json file listing its dependencies.

- Commit changes to the updated packages

```
git add packages/*
git commit -m "chore(packages): copy changes to packages"
```

Open a pull request for these changes.


Once these have been merged into master.

- Run lerna bootstrap to install all package dependencies and link any cross-dependencies

```
lerna bootstrap
```

- Run lerna updated to see which packages have been changed

```
lerna updated
```

- Manually bump the version of each package

```
lerna publish -m "chore(release): update packages and publish"
```

Then in a new branch:

- Update `dist` folder with the latest versions

```
npm build:dist
```

```
git add dist/*
git commit -m "chore(dist): update dist to version x.x.x-alpha"
```

Open a pull request for these changes.


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
thing being changed - e.g. component name, packages, gulp
