# Error message

## Introduction

Component to show a red error message - used for form validation. Use inside a label or legend.

## Guidance

Find out when to use the Error message component in your service in the [GOV.UK Design System](https://govuk-design-system-production.cloudapps.digital/components/error-message).

## Quick start examples

### Component default

[Preview the error-message component](http://govuk-frontend-review.herokuapp.com/components/error-message/preview)

#### Markup

    <span class="govuk-error-message">
      Error message about full name goes here
    </span>

#### Macro

    {% from 'error-message/macro.njk' import govukErrorMessage %}

    {{ govukErrorMessage({
      "text": "Error message about full name goes here"
    }) }}

## Requirements

### Build tool configuration

When compiling the Sass files you'll need to define includePaths to reference the node_modules directory. Below is a sample configuration using gulp

    .pipe(sass({
      includePaths: 'node_modules/'
    }))

### Static asset path configuration

In order to include the images used in the components, you need to configure your app to show these assets. Below is a sample configuration using Express js:

    app.use('/assets', express.static(path.join(__dirname, '/node_modules/@govuk-frontend/frontend/assets')))

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

<td class="govuk-table__cell">classes</td>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional additional classes</td>

</tr>

<tr class="govuk-table__row">

<td class="govuk-table__cell">text</td>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Text to use within the error message</td>

</tr>

<tr class="govuk-table__row">

<td class="govuk-table__cell">safe</td>

<td class="govuk-table__cell ">boolean</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Whether text argument can be considered safe. If not safe, it will be escaped.</td>

</tr>

<tr class="govuk-table__row">

<td class="govuk-table__cell">attributes</td>

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Any extra HTML attributes (for example data attributes) to add to the error message span tag</td>

</tr>

</tbody>

</table>

### Setting up Nunjucks views and paths

Below is an example setup using express configure views:

    nunjucks.configure('node_modules/@govuk-frontend/frontend/components', {
      autoescape: true,
      cache: false,
      express: app
    })

## Contribution

Guidelines can be found at [on our Github repository.](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md "link to contributing guidelines on our github repository")

## License

MIT