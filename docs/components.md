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

We are using independent mode to version each package independently.

To keep track of whether versions are major, minor or patch - we can use Lerna's conventional commits flag when publishing to decide on the next version number.

To test conventional-commits (but not publish to npm):

    lerna publish --conventional-commits --skip-npm

This generates a changelog for each component split into:

fix:
feature:
BREAKING CHANGE:

This enables changelogs to be automatically generated.

## Publishing components workflow

1. Make changes

2. Commit those changes [use the following structure](#commit-structure).

3. Run the build to ensure any changes to `src/components/component-name` are made to `packages/component-name`.

```
gulp build:packages
```

4. Commit changes to the updated packages

```
git commit -m "chore(packages): copy changes to packages"
```

5. Run lerna bootstrap
Install all package dependencies and link any cross-dependencies.

```
lerna:bootstrap
```

5. Publish (and automatically generate a CHANGELOG.md file for each component)

```
  lerna publish --conventional-commits -m "chore(release): update packages and publish"
```

This will bump the version number in each packages package.json file and update the CHANGELOG.md file.

6. Update `dist` folder with the latest versions

```
gulp build:dist
```

7. Update `demo` folder with latest files and versioned assets

```
gulp build:demo
```

A brief [explanation](gulp-tasks.md) of used gulp tasks.

## Useful Lerna commands

To see which components have been changed since the last release:

    lerna updated

To list all packages:

    lerna ls

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
