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

### Testing components on their own
You can run a subset of the test suite that only tests components by running:

    npm run test:components

Note: There's a watch mode that keeps a testing session open waiting for changes that can be used with:

    npm run test:components -- --watch

## Folder structure and naming

Find components in `src/components`.

Component folder and files should be singular, except in cases where they are more commonly used in groups, for example, radios, breadcrumbs and checkboxes.

An example component exists in `src/components/component-example`.

Use this as the basis for creating new components.

The folder structure should be:

    component-name
      - _component-name.scss
      - component-name.html
      - component-name.js
      - README.md

# Updating Changelog

If you open a GitHub pull request on this repo, please update `CHANGELOG` to reflect your contribution.

Add your entry under `Unreleased` as `Breaking change`, `New feature`, `Fix` or `Internal`.

Please include a description of the work done and a link to the PR (see current `CHANGELOG` for the format).

Include the modified `CHANGELOG` in the PR.


# Versioning

We are not using semantic versioning yet, we are going to talk about this soon.

See `CHANGELOG` for more information.

## To release a new version

See `docs/publishing`

# Commit hygiene

Please see our [git style guide](https://github.com/alphagov/styleguides/blob/master/git.md)
which describes how we prefer git history and commit messages to read.
