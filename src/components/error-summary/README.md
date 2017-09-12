# Error summary

## Introduction

Component to show an error summary box - used at the top of the page, to summarise validation errors.

[Preview the error-summary component.](http://govuk-frontend-review.herokuapp.com/components/error-summary/preview)

## Guidance

More information about when to use error-summary can be found on [GOV.UK Design System](http://www.linktodesignsystem.com/error-summary "Link to read guidance on the use of error-summary on Gov.uk Design system website")

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

## Quick start examples

    <div class="govuk-c-error-summary " aria-labelledby="error-summary-title" role="alert" tabindex="-1">

      <h2 class="govuk-c-error-summary__title" id="error-summary-title">
        Message to alert the user to a problem goes here
      </h2>

      <div class="govuk-c-error-summary__body">
        <p>
          Optional description of the errors and how to correct them
        </p>
        <ul class="govuk-c-list  govuk-c-error-summary__list">

      <li>
    <a href="#example-error-1 ">        Descriptive link to the question with an error
    </a>  </li>
      <li>
    <a href="#example-error-2 ">        Descriptive link to the question with an error
    </a>  </li>

    </ul>

      </div>

    </div>

## If you are using Nunjucks

To use a macro, follow the below code examples:

    {% from "error-summary/macro.njk" import govukErrorSummary %}

    {{ govukErrorSummary(
      classes='',
      title='Message to alert the user to a problem goes here',
      description='Optional description of the errors and how to correct them',
      listClasses='',
      listItems=[
        {
          text: 'Descriptive link to the question with an error',
          url: '#example-error-1'
        },
        {
          text: 'Descriptive link to the question with an error',
          url: '#example-error-2'
        }
      ]
    ) }}

Where the macros take the following arguments

## Component arguments

<div>

<table class="govuk-c-table ">

<thead class="govuk-c-table__head">

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header " scope="col">Name</th>

<th class="govuk-c-table__header " scope="col">Type</th>

<th class="govuk-c-table__header " scope="col">Required</th>

<th class="govuk-c-table__header " scope="col">Description</th>

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

<th class="govuk-c-table__header" scope="row">title</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">Error summary title</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">description</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Optional error summary description</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">listItems</th>

<td class="govuk-c-table__cell ">array</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">List items array with url and text keys</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">url</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">List item url</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">text</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">List item text</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">listOptions</th>

<td class="govuk-c-table__cell ">object</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">List options</td>

</tr>

</tbody>

</table>

</div>

### Setting up Nunjucks views and paths

Below is an example setup using express configure views:

    nunjucks.configure('node_modules/@govuk-frontend`, {
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

## Acknowledgements/credits

*   GDS developers
*   Jani Kraner
*   Gemma Leigh

## License

MIT