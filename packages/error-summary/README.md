# Error summary

## Introduction

Component to show an error summary box - used at the top of the page, to summarise validation errors.

## Guidance

Find out when to use the Error summary component in your service in the [GOV.UK Design System](https://govuk-design-system-production.cloudapps.digital/components/error-summary).

## Quick start examples

### Component default

[Preview the error-summary component](http://govuk-frontend-review.herokuapp.com/components/error-summary/preview)

#### Markup

    <div class="govuk-c-error-summary optional-extra-class" aria-labelledby="error-summary-title" role="alert" tabindex="-1">
      <h2 class="govuk-c-error-summary__title" id="error-summary-title">
        Message to alert the user to a problem goes here
      </h2>
      <div class="govuk-c-error-summary__body">

        <p>
          Optional description of the errors and how to correct them
        </p>

        <ul class="govuk-list govuk-c-error-summary__list">

          <li>

            <a href="#example-error-1">Descriptive link to the question with an error</a>

          </li>

          <li>

            <a href="#example-error-1">Descriptive link to the question with an error</a>

          </li>

        </ul>
      </div>
    </div>

#### Macro

    {% from 'error-summary/macro.njk' import govukErrorSummary %}

    {{ govukErrorSummary({
      "titleText": "Message to alert the user to a problem goes here",
      "descriptionText": "Optional description of the errors and how to correct them",
      "classes": "optional-extra-class",
      "errorList": [
        {
          "text": "Descriptive link to the question with an error",
          "href": "#example-error-1"
        },
        {
          "html": "Descriptive link to the question with an error",
          "href": "#example-error-1"
        }
      ]
    }) }}

## Dependencies

To consume the error-summary component you must be running npm version 5 or above.

## Installation

    npm install --save @govuk-frontend/error-summary

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

<th class="govuk-c-table__header" scope="row">titleText</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Text to use for the heading of the error summary block.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">titleHtml</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">HTML to use for the heading of the error summary block. If this is provided, the titleText argument will be ignored.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">descriptionText</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Optional text description of the errors.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">descriptionHtml</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Optional HTML description of the errors. If this is provided, the descriptionText argument will be ignored.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">errorList</th>

<td class="govuk-c-table__cell ">object</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">Contains an array of error link items and all their available arguments.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">attributes</th>

<td class="govuk-c-table__cell ">object</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Any extra HTML attributes (for example data attributes) to add to the error-summary container.</td>

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

    npm outdated @govuk-frontend/error-summary

To update the latest version run:

    npm update @govuk-frontend/error-summary

## Contribution

Guidelines can be found at [on our Github repository.](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md "link to contributing guidelines on our github repository")

## License

MIT