# Changelog

Note: We're not following semantic versioning yet, we are going to talk about this soon.

## Unreleased

## 0.0.20-alpha (Breaking release)

Breaking changes:

- Rename ‘govuk-body-lede’ to ‘govuk-body-lead’. (PR [#405](https://github.com/alphagov/govuk-frontend/pull/405))
- Pluralise radio component (PR [#388](https://github.com/alphagov/govuk-frontend/pull/388))
- Pluralise checkbox component (PR [#384](https://github.com/alphagov/govuk-frontend/pull/384))

New features:

- Add `width` classes, which were based on `form-control` classes that were
specific to form control in Elements. (PR [#413](https://github.com/alphagov/govuk-frontend/pull/413))

Fixes:
- Make buttons 40px high including box shadow (PR [#416](https://github.com/alphagov/govuk-frontend/pull/416))
- Fix focus outline style in Chrome and Safari (PR [#414](https://github.com/alphagov/govuk-frontend/pull/414))
- Remove contributors list from template, fix template markup and update README files (PR [#403](https://github.com/alphagov/govuk-frontend/pull/403))
- Generate breadcrumb chevrons using pseudo-elements (PR [#407](https://github.com/alphagov/govuk-frontend/pull/407))
- Fix undefined classes in date input macro (PR [#410](https://github.com/alphagov/govuk-frontend/pull/410))
- Add documentation for typography helpers / core, simplify syntax (PR [#400](https://github.com/alphagov/govuk-frontend/pull/400))
- Add adjacent styles for headings after lists (PR [#408](https://github.com/alphagov/govuk-frontend/pull/408))
- Allow line height to be overridden in typography helpers (PR [#404](https://github.com/alphagov/govuk-frontend/pull/404))
