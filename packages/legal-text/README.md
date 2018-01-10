# Legal text

## Introduction

Use bold text with an exclamation icon if there are legal consequences - for example, a fine or prison sentence.

## Guidance

More information about when to use legal-text can be found on [GOV.UK Design System](http://www.linktodesignsystem.com/legal-text "Link to read guidance on the use of legal-text on Gov.uk Design system website")

## Quick start examples

### Component default

[Preview the legal-text component](http://govuk-frontend-review.herokuapp.com/components/legal-text/preview)

#### Markup

    <div class="govuk-c-legal-text">
      <span class="govuk-c-legal-text__icon govuk-o-circle" aria-hidden="true">!</span>
      <strong class="govuk-c-legal-text__text">
        <span class="govuk-c-legal-text__assistive">Warning</span>
        You can be fined up to £5,000 if you don’t register.
      </strong>
    </div>

#### Macro

    {{ govukLegalText({
      "classes": null,
      "legalText": "You can be fined up to £5,000 if you don’t register.",
      "iconFallbackText": "Warning"
    }) }}

## Dependencies

To consume the legal-text component you must be running npm version 5 or above.

## Installation

      npm install --save @govuk-frontend/legal-text

## Requirements

### Build tool configuration

When compiling the Sass files you'll need to define includePaths to reference the node_modules directory. Below is a sample configuration using gulp

      .pipe(sass({
        includePaths: 'node_modules/'
      }))

### Static asset path configuration

To show the button image you need to configure your app to show these assets. Below is a sample configuration using Express js:

      app.use('/public', express.static(path.join(__dirname, '/node_modules/@govuk-frontend/icons')))

## Component arguments

If you are using Nunjucks,then macros take the following arguments

<table class="govuk-c-table">

<thead class="govuk-c-table__head">

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="col">Name</th>

<th class="govuk-c-table__header" scope="col">Type</th>

<th class="govuk-c-table__header" scope="col">Required</th>

<th class="govuk-c-table__header" scope="col">Description</th>

</tr>

</thead>

<tbody class="govuk-c-table__body">

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">classes</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Optional additional classes</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">iconFallbackText</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">The fallback text for the icon</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">legalText</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">The text next to the icon</td>

</tr>

</tbody>

</table>

### Setting up Nunjucks views and paths

Below is an example setup using express configure views:

      nunjucks.configure('node_modules/@govuk-frontend', {
        autoescape: true,
        cache: false,
        express: app
      })

## Getting updates

To check whether you have the latest version of the button run:

      npm outdated @govuk-frontend/legal-text

To update the latest version run:

      npm update @govuk-frontend/legal-text

## Contribution

Guidelines can be found at [on our Github repository.](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md "link to contributing guidelines on our github repository")

## License

MIT