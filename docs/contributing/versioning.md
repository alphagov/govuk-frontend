# Versioning

With our user interface (UI) library, users [can consume our code in different ways](#public-api).

We follow [Semantic Versioning](https://semver.org/) but a UI library often has subjective changes such as visual spacing changes.

This document aims to outline the processes we follow when we version our releases.

## Stability

A stable library prioritises the users and ecosystem that it supports.

We often release new components and features which will encourage people to update.

But we should make sure that we only make breaking changes when we have a good reason, and have decided that it is absolutely necessary.

Good examples of such situations would be:

- issues that are barriers for end-users (users of services) based on evidence (for example user research)
- issues that are barriers for users (users of GOV.UK Frontend) based on evidence
- accessibility issues
- security issues
- performance issues

We would not make breaking changes for:

- thinking you can sneak a change in with other breaking changes
- changing the name of an API, based on a hunch
- adopting a technology based on popularity and not because of the problems they solve
- changing a component's interface without a good reason to do so

This is similar to how we try to tackle most problems, by focusing on user needs first.

Whenever we decide to make a breaking change we must ensure we do our best to try to first [deprecate the feature](#deprecation) and allow a [migration path](#migration).

## Proposal

Some breaking changes that need discussion may first be proposed in the [GOV.UK Design System architecture repository](https://github.com/alphagov/govuk-design-system-architecture/blob/main/proposals/README.md).

This is to ensure the community can get involved with the decision.

Make an active effort to involve the community, this might be in the form of presentations or meetings.

## Deprecation

Deprecation is the practice of communicating features in the library that should no longer be used and requires a user change behaviour in their application.

Deprecating features in the library helps users migrate to the new code while still being able to run the older code.

Note: Our users may not know what 'deprecation' means, so it's important to also clarify that we are no longer recommending the use of a feature.

Example 1: Fixing a typo in a CSS class name.

1. We discover the class name `.govuk-visually-hidden-focussable` includes the typo 'focussable'
2. We raise a pull request that renames the class to `.govuk-visually-hidden-focusable` while keeping
the previous class available.
3. We add a comment to the source code that indicates this is deprecated, and raise an issue to remove it in a future breaking release.
4. When releasing the change we include a clear summary that indicates what was the problem, what we've changed and how a user can migrate before the future breaking release.

Sometimes it is not possible to deprecate code, this is OK but try to make this a last resort.

### Sass doc deprecation annotations

When deprecating Sass, you can use the [deprecated annotation](http://sassdoc.com/annotations/#deprecated).

If there is an alias, for example if you are renaming something, you can use the [alias annotation](http://sassdoc.com/annotations/#alias).

See [an example of deprecating a Sass mixin on GitHub](https://github.com/alphagov/govuk-frontend/blob/9424d87ed54764d2d8afe35d6e0077ee43d231e1/src/helpers/_grid.scss#L20-L26).

## Migration

Migration is the practice of a user moving from one approach to an equivalent approach.

It is very important that we make it easy to migrate when we make deprecations.

If possible include clear steps for users should update their code directly in the CHANGELOG entry that introduces the deprecation.

## Public API

The [Semantic Versioning specification](https://semver.org/) requires a public API.

> For this system to work, you first need to declare a public API. This may consist of documentation or be enforced by the code itself.

### Design System Website
One of ways users interact with GOV.UK Frontend is through the [GOV.UK Design System website](https://design-system.service.gov.uk/).

This includes:

- HTML - Documented in examples (for example, the [buttons code example](https://design-system.service.gov.uk/components/button/))
- Nunjucks - Documented in examples (for example, the buttons code example)
- SCSS - for example [colours variables](https://design-system.service.gov.uk/styles/colour/)

### npm package
The other primary way is through what is [published to npm](/package).

This includes:

- [JavaScript](https://frontend.design-system.service.gov.uk/importing-css-assets-and-javascript/#javascript)
- [SCSS](https://frontend.design-system.service.gov.uk/sass-api-reference/#sass-api-reference)
- Nunjucks Macros (Templates)

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

## Accidental breaking changes
If a backward-incompatible change is released unintentionally, we will follow the process outlined on semver.org: https://semver.org/#what-do-i-do-if-i-accidentally-release-a-backwards-incompatible-change-as-a-minor-version

> As soon as you realize that you’ve broken the Semantic Versioning spec, fix the problem and release a new minor version that corrects the problem and restores backwards compatibility. Even under this circumstance, it is unacceptable to modify versioned releases. If it’s appropriate, document the offending version and inform your users of the problem so that they are aware of the offending version.

If appropriate, you can set up an incident review that allows the team to  see if there are
any steps to avoid this happening again in the future.

Communicate any actions as a result of an incident review, this will ensure our users will see that we take incidents seriously and can avoid some loss of trust.
