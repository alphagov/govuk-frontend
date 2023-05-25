# Managing change

Follow the processes in this document to make it easier for users to migrate to new major versions.

## Deprecating and removing features

Wherever possible, deprecate features as part of a minor release, before removing them in the next major release.

This gives users the option of migrating away from using the deprecated features at their own pace, minimising the amount of work that needs to be done when new major versions are released.

Features should not be deprecated while they are relied on by other parts of GOV.UK Frontend.

Deprecations should not be made in patch releases.

### Tell users about the deprecation

Tell users about the deprecation in the release notes.

Do not assume that users will understand the term 'deprecation'. Wherever possible, explain why we are deprecating the feature and what we want users to do if they are currently using it.

Depending on what is being deprecated, we might want to throw deprecation warnings from the code to help users find where they are using the deprecated feature in their own codebase. See the guidance on deprecating specific types of features below.

You can mention the warnings in the release notes to help users understand if they are affected.

For example:

> If you import specific files from the core or overrides layers, you’ll now see a deprecation warning when compiling Sass if you do not import `node_modules/govuk-frontend/dist/govuk/base` first.
>
> To fix the warning, import `node_modules/govuk-frontend/dist/govuk/base` first. For example:
>
> ```scss
> @import "node_modules/govuk-frontend/dist/govuk/base";
> @import "node_modules/govuk-frontend/dist/core/typography";
> ```
>
> If you do not import `node_modules/govuk-frontend/dist/govuk/base` first, your service will no longer work from GOV.UK Frontend v5.0.0.

### Make sure we remember to remove the deprecated feature

Create a GitHub issue for removing the deprecated feature. If there are multiple related things that should be removed at the same time then you can create a single issue that covers all of them.

The issue should include:

- clear instructions for removal
- the reason for the deprecation and removal

Attach the GitHub issue to the milestone for the next major version.

### Deprecating a Sass function or mixin

Include the [`@deprecated` annotation](http://sassdoc.com/annotations/#deprecated) in the Sassdoc comment block for the function, variable or mixin.

In the annotation description include:

- the suggested alternative, if there is one
- a link to the GitHub issue for its removal

If possible, update the code to output a warning using the `_warning` mixin or its associated functions (see section below on allowing users to suppress warnings).

Use the `_warning` mixin when deprecating a mixin:

```scss
/// XL headings
///
/// @deprecated Use govuk-typography-responsive($size: 80) instead.
///   See https://github.com/alphagov/govuk-frontend/issues/1234
@mixin govuk-heading-xl {
  @include _warning("heading-xl", "govuk-heading-xl is deprecated. Use govuk-typography-responsive(80) instead.");
  @include govuk-typography-responsive($size: 80);
}
```

Mixins cannot be invoked within functions, so we use the `_should-warn` and `_warning-message` functions directly when deprecating a function:

```scss
/// Double a number
///
/// A contrived example function that takes a number and multiplies it by 2.
///
/// @deprecated Use govuk-multiply(number, 2) instead.
///   See https://github.com/alphagov/govuk-frontend/issues/1234
@function govuk-double($number) {
  @if _should-warn("double") {
    @warn _warning-message("double", "govuk-double($number) is deprecated. Use govuk-multiply($number, 2) instead.")
  }
  @return govuk-multiply($number, 2);
}
```

Unlike the `_warning` mixin, producing warnings in this way doesn't suppress future instances of the same warning. This may be preferred in cases where a user may need to change their code in multiple places (such as if a parameter has been deprecated).

### Deprecating a parameter for a Sass mixin or function

If possible, update the mixin or function to maintain the existing functionality while outputting a warning.

```scss
/// Reticulate splines
///
/// An even more contrived example function
///
/// @param {String} $spline Spline to reticulate
/// @param {Number} $angle Angle to reticulate by
/// @param {Boolean} $rightAngle Deprecated. Use $angle: 90 instead.
@mixin govuk-reticulate-splines($spline, $angle: 180, $rightAngle: false) {
  @if ($rightAngle != false) {
    @include _warning("right-angle", "Passing $rightAngle to govuk-reticulate-splines is deprecated. Pass $angle: 90 instead.");

    $angle: 90;
  }

  // Reticulate the $spline by $angle degrees!
}
```

### Deprecating a CSS class

```scss
// @deprecated
.govuk-foo-old-class-name {
  foo: bar;
}
```

## Renaming things

When renaming things, keep the old name available as an alias and mark it as deprecated, following the steps above to [make sure we remember to remove the deprecated feature](#make-sure-we-remember-to-remove-the-deprecated-feature).

### Renaming Sass mixins and functions

Include the [`@alias`](http://sassdoc.com/annotations/#alias) and [`@deprecated`](http://sassdoc.com/annotations/#deprecated) annotations in the Sassdoc comment block for the old mixin or function.

For example:

```scss
/// The old way of doing something
///
/// @param {String} $foo Foo, obviously.
/// @return String Modified foo!
///
/// @alias the-new-name
/// @deprecated Use the-new-name($foo) instead.
@function the-old-name($foo) {
  @include _warning("the-old-name", "the-old-name is deprecated. Use the-new-name instead.");
  @return the-new-name($foo);
}

/// The new way of doing something
///
/// @param {String} $foo Foo, obviously.
/// @return {String} Modified foo!
@function the-new-name($foo) {
  // do something...
}
```

### Renaming Sass parameters

Keep the old name around as an optional parameter and print a warning if anyone passes it, so they know to migrate to the new parameter.

Add 'Deprecated.' to the description for the parameter.

```scss
/// Reticulate splines
///
/// An even more contrived example function
///
/// @param {String} $spline Spline to reticulate
/// @param {String} $spilne Deprecated. Use $spline instead.
@function govuk-reticulate-splines($spline, $spilne: false) {
  @if ($spilne != false) {
    @include _warning("spilne", "Passing $spilne to govuk-reticulate-splines is deprecated. Pass $spline instead.");

    $spline: $spilne;
  }

  // Do something with $spline
}
```

### Renaming CSS classes

Keep the old name in the selector list, and mark it as deprecated.

```scss
// govuk-old-class-name is deprecated. Use govuk-new-class-name instead.
.govuk-old-class-name,
.govuk-new-class-name {
  foo: bar;
}
```

### The `_warning` mixin and allowing users to suppress warnings

In the above examples we've used `@include _warning(...)` instead of the native sass `@warn` at-rule. We use this instead of `@warn` because it gives users the option to suppress deprecation warnings by interacting with the `$govuk-suppressed-warnings` map.

You can read more about how `$govuk-suppressed-warnings` and `_warning` work by reading their respective sassdocs in [`packages/govuk-frontend/src/govuk/settings/_warnings.scss`](/packages/govuk-frontend/src/govuk/settings/_warnings.scss).

We make this option available for users because they can not always action deprecation warnings or upgrade their codebase beyond a specific version of GOV.UK Frontend. For example, a legacy codebase that does not have the resource to upgrade to the latest breaking change where a deprecated feature will be removed. This feature allows those users to continue to operate their codebase without having to repeatedly see non-actionable deprecation warnings in their testing.
