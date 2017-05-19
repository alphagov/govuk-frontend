# Contributing

We're not ready for contributions yet, this document exists as a guide for those working on govuk-frontend.

# Conventions to follow

## Indentation and whitespace

2-space, soft-tabs only. No trailing whitespace.

## CSS

Prefix all classes with `.govuk-`.

Use the BEM naming convention.

For more detail, see our [coding standards for CSS](/docs/coding-standards/css.md).

## JavaScript

`govuk-frontend` uses [standardjs](http://standardjs.com/), an opinionated JavaScript linter.
All JavaScript files follow its conventions, and it runs on CI to ensure that new pull requests are in line with them.

To check the whole codebase, run:

    npm test

For more detail, see our [coding standards for JavaScript](/docs/coding-standards/js.md).

## Folder structure and naming

Find components in `src/components`.

Component folder and files should be **singular, not plural**.

An example component exists in `src/components/component-example`.

Use this as the basis for creating new components.

The folder structure should be:

    component-name
      - _component-name.scss
      - component-name.html
      - component-name.js
      - README.md


# Versioning

We use [Semantic Versioning](http://semver.org/).

## To release a new version

To follow.

# Commit hygiene

Please see our [git style guide](https://github.com/alphagov/styleguides/blob/master/git.md)
which describes how we prefer git history and commit messages to read.
