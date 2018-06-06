# Contributing

We're not ready for contributions yet, this document exists as a guide for those working on govuk-frontend.

## Contents of this file

### For contributors
- [Code of conduct](#code-of-conduct)
- [Application architecture](#application-architecture)
- [Running locally](#running-locally)
- [Conventions to follow](#conventions-to-follow)
  - [Indentation and whitespace](#indentation-and-whitespace)
  - [CSS](#css)
  - [JavaScript](#javascript)
  - [Components and Nunjucks API](#components-and-nunjucks-api)
- [Testing and linting](#testing-and-linting)
- [Supported browsers](#supported-browsers)
- [Commit hygiene](#commit-hygiene)
- [Updating Changelog](#updating-changelog)

### For maintainers
- [Application tasks](#running-application-tasks)
- [Deploying](#deploying)
- [Versioning](#versioning)
- [Releasing a new version](#releasing-a-new-version)


## Code of Conduct
Please read [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) before contributing.

## Application architecture

See [application architecture](/docs/contributing/application-architecture.md) for an overview of the directories in this repository.

## Running locally

See [running locally](/docs/contributing/running-locally.md).

## Conventions to follow

### Indentation and whitespace

2-space, soft-tabs only. No trailing whitespace.

### CSS

Prefix all classes with `.govuk-`.

Use the BEM naming convention.

For more detail, see our [coding standards for CSS](/docs/coding-standards/css.md).

### JavaScript

`govuk-frontend` uses [standardjs](http://standardjs.com/), an opinionated JavaScript linter.
All JavaScript files follow its conventions, and it runs on CI to ensure that new pull requests are in line with them.

To check the whole codebase, run:

    npm test

For more detail, see our [coding standards for JavaScript](/docs/coding-standards/js.md).

If you need polyfills for features that are not yet included in this project, please see the following guide on [how to add polyfills](/docs/contributing/polyfilling.md).

### Components and Nunjucks API

See our [coding standards for components](/docs/contributing/coding-standards/components.md), [coding standards for Nunjucks macros](/docs/contributing/coding-standards/nunjucks-api.md) and [testing and linting](/docs/contributing/testing-and-linting.md).

### Testing components on their own
You can run a subset of the test suite that only tests components by running:

    npm run test:components

Note: There's a watch mode that keeps a testing session open waiting for changes that can be used with:

    npm run test:components -- --watch

#### Updating component snapshots

If a snapshot test fails, review the difference in the console. If the change is the correct change to make, run:

`npm run test:components -- -u`

This will update the snapshot file. Commit this file separately with a commit message that explains you're updating the snapshot file and an explanation of what caused the change.

## Commit hygiene

Please see our [git style guide](https://github.com/alphagov/styleguides/blob/master/git.md)
which describes how we prefer git history and commit messages to read.

## Updating Changelog

If you open a GitHub pull request on this repo, please update `CHANGELOG` to reflect your contribution.

Add your entry under `Unreleased` as `Breaking change`, `New feature`, `Fix` or `Internal`.

Please include a description of the work done and a link to the PR (see current `CHANGELOG` for the format).

Include the modified `CHANGELOG` in the PR.

## Application tasks

See [tasks](/docs/contributing/tasks.md).

## Deploying

See [deploying](/docs/contributing/deploying.md).

## Versioning

We are not using semantic versioning yet, we are going to talk about this soon.

See `CHANGELOG` for more information.

## Releasing a new version

See [publishing](/docs/contributing/publishing.md).
