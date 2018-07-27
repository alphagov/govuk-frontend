# Contributing

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

See our [coding standards for CSS](/docs/contributing/coding-standards/css.md) and [testing and linting](/docs/contributing/testing-and-linting.md).

### JavaScript

See our [coding standards for JavaScript](/docs/contributing/coding-standards/js.md) and [testing and linting](/docs/contributing/testing-and-linting.md).

### Components and Nunjucks API

See our [coding standards for components](/docs/contributing/coding-standards/components.md), [coding standards for Nunjucks macros](/docs/contributing/coding-standards/nunjucks-api.md) and [testing and linting](/docs/contributing/testing-and-linting.md).

## Testing and linting

See [testing and linting](/docs/contributing/testing-and-linting.md).

## Supported browsers
Your contribution needs to work with certain browsers as set out in [README](README.md#browser-support). See also [supporting Internet Explorer 8](/docs/installation/supporting-internet-explorer-8.md).

## Supported assistive technology
Your contribution needs to work with certain assistive technology as set out in [README](README.md#assistive-technology-support).

## Commit hygiene

Please see our [git style guide](https://github.com/alphagov/styleguides/blob/master/git.md)
which describes how we prefer git history and commit messages to read.

## Updating Changelog

If you open a GitHub pull request on this repo, please update `CHANGELOG` to reflect your contribution.

Add your entry under `Unreleased` as `Breaking changes`, `New features`, `Fixes`.

Internal changes to the project that are not part of the public API do not need changelog entries, for example fixing the CI build server.

These sections follow [semantic versioning](https://semver.org/), where:

- `Breaking changes` corresponds to a `major` (1.X.X) change.
- `New features` corresponds to a `minor` (X.1.X) change.
- `Fixes` corresponds to a `patch` (X.X.1) change.

See the [`CHANGELOG_TEMPLATE.md`](/docs/contributing/CHANGELOG_TEMPLATE.md) for an example for how this looks.

Include the modified `CHANGELOG` in the PR.

## Application tasks

See [tasks](/docs/contributing/tasks.md).

## Deploying

See [deploying](/docs/contributing/deploying.md).

## Releasing a new version

See [publishing](/docs/contributing/publishing.md).
