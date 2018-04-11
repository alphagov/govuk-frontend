# Warning text

## Introduction

Use bold text with an exclamation icon if there are consequences - for example, a fine or prison sentence.

## Guidance

Find out when to use the Warning text component in your service in the [GOV.UK Design System](https://govuk-design-system-production.cloudapps.digital/components/warning-text).

## Quick start examples

### Component default

[Preview the warning-text component](http://govuk-frontend-review.herokuapp.com/components/warning-text/preview)

#### Markup

    <div class="govuk-warning-text">
      <span class="govuk-warning-text__icon govuk-circle" aria-hidden="true">!</span>
      <strong class="govuk-warning-text__text">
        <span class="govuk-warning-text__assistive">Warning</span>
        You can be fined up to £5,000 if you don’t register.
      </strong>
    </div>

#### Macro

    {% from 'warning-text/macro.njk' import govukWarningText %}

    {{ govukWarningText({
      "text": "You can be fined up to £5,000 if you don’t register.",
      "iconFallbackText": "Warning"
    }) }}

## Dependencies

To consume the warning-text component you must be running npm version 5 or above.

## Installation

    npm install --save @govuk-frontend/warning-text

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

<table class="govuk-table">

<thead class="govuk-table__head">

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="col">Name</th>

<th class="govuk-table__header" scope="col">Type</th>

<th class="govuk-table__header" scope="col">Required</th>

<th class="govuk-table__header" scope="col">Description</th>

</tr>

</thead>

<tbody class="govuk-table__body">

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">classes</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional additional classes</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">iconFallbackText</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">Yes</td>

<td class="govuk-table__cell ">The fallback text for the icon</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">text</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">Yes</td>

<td class="govuk-table__cell ">The text next to the icon</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">html</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">Yes</td>

<td class="govuk-table__cell ">HTML for the warning text content. If this is provided, the text argument is ignored.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">attributes</th>

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Any extra HTML attributes (for example data attributes) to add to the textarea tag</td>

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

    npm outdated @govuk-frontend/warning-text

To update the latest version run:

    npm update @govuk-frontend/warning-text

## Contribution

Guidelines can be found at [on our Github repository.](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md "link to contributing guidelines on our github repository")

## License

MIT