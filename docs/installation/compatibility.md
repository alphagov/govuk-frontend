# Use GOV.UK Frontend with old frameworks or colours

You can configure GOV.UK Frontend to work with the following 'legacy'
frameworks:

- [GOV.UK Frontend toolkit]
- [GOV.UK Template]
- [GOV.UK Elements]

You cannot use the following features if you installed GOV.UK Frontend from
`dist`. [Install with node package manager](installing-from-npm.md) instead.

If you use these features, your service will not have GOV.UK Frontend's many
accessibility and usability improvements.

## Turn on 'compatibility mode'

You can turn on 'compatibility mode' if you want to use both GOV.UK Frontend
components and a legacy framework in a service.

GOV.UK Frontend will:

- use the old colour palette
- use the old GOV.UK font from GOV.UK Template
- override some of the CSS in the legacy frameworks
- no longer use `rem` for font sizes

To turn on compatibility mode for all 3 legacy frameworks, add the following
variables to your project's Sass file, above `@import "govuk-frontend/govuk/all"`:

```SCSS
$govuk-compatibility-govukfrontendtoolkit: true;
$govuk-compatibility-govuktemplate: true;
$govuk-compatibility-govukelements: true;
```

You can leave out a variable to turn off compatibility mode for that framework.

## Use the old colour palette

If you are not using any of the legacy frameworks, you can still configure
GOV.UK Frontend to use the old colour palette.

Add the following variable to your project's Sass file, above
`@import "govuk-frontend/govuk/all"`:

```scss
$govuk-use-legacy-palette: true;
```

[GOV.UK Frontend Toolkit]: https://github.com/alphagov/govuk_frontend_toolkit
[GOV.UK Template]: https://github.com/alphagov/govuk_template
[GOV.UK Elements]: https://github.com/alphagov/govuk_elements
