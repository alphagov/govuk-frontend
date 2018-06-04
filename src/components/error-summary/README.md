# Error summary

## Introduction

Component to show an error summary box - used at the top of the page, to summarise validation errors.

## Guidance

Find out when to use the Error summary component in your service in the [GOV.UK Design System](https://govuk-design-system-production.cloudapps.digital/components/error-summary).

## Quick start examples

### Component default

[Preview the error-summary component](http://govuk-frontend-review.herokuapp.com/components/error-summary/preview)

#### Markup

    <div class="govuk-error-summary optional-extra-class" aria-labelledby="error-summary-title" role="alert" tabindex="-1" data-module="error-summary">
      <h2 class="govuk-error-summary__title" id="error-summary-title">
        Message to alert the user to a problem goes here
      </h2>
      <div class="govuk-error-summary__body">

        <p>
          Optional description of the errors and how to correct them
        </p>

        <ul class="govuk-list govuk-error-summary__list">

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
      "title": {
        "text": "Message to alert the user to a problem goes here"
      },
      "description": {
        "text": "Optional description of the errors and how to correct them"
      },
      "classes": "optional-extra-class",
      "errorList": [
        {
          "text": "Descriptive link to the question with an error",
          "href": "#example-error-1"
        },
        {
          "text": "Descriptive link to the question with an error",
          "safe": true,
          "href": "#example-error-1"
        }
      ]
    }) }}

### Error-summary--strings

[Preview the error-summary--strings example](http://govuk-frontend-review.herokuapp.com/components/error-summary/strings/preview)

#### Markup

    <div class="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabindex="-1" data-module="error-summary">
      <h2 class="govuk-error-summary__title" id="error-summary-title">
        Message to alert the user to a problem goes here
      </h2>
      <div class="govuk-error-summary__body">

        <p>
          Optional description of the errors and how to correct them
        </p>

        <ul class="govuk-list govuk-error-summary__list">

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
      "title": "Message to alert the user to a problem goes here",
      "description": "Optional description of the errors and how to correct them",
      "errorList": [
        {
          "text": "Descriptive link to the question with an error",
          "href": "#example-error-1"
        },
        {
          "text": "Descriptive link to the question with an error",
          "safe": true,
          "href": "#example-error-1"
        }
      ]
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

<td class="govuk-table__cell">title</td>

<td class="govuk-table__cell ">object or string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">If passed as a string, title.text will use that value.</td>

</tr>

<tr class="govuk-table__row">

<td class="govuk-table__cell">title.text</td>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Text to use for the heading of the error summary block.</td>

</tr>

<tr class="govuk-table__row">

<td class="govuk-table__cell">title.safe</td>

<td class="govuk-table__cell ">boolean</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Whether title text argument can be considered safe. If not safe, it will be escaped.</td>

</tr>

<tr class="govuk-table__row">

<td class="govuk-table__cell">description</td>

<td class="govuk-table__cell ">object or string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">If passed as a string, legend.text will use that value.</td>

</tr>

<tr class="govuk-table__row">

<td class="govuk-table__cell">description.text</td>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional text description of the errors.</td>

</tr>

<tr class="govuk-table__row">

<td class="govuk-table__cell">description.safe</td>

<td class="govuk-table__cell ">boolean</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Whether description text argument can be considered safe. If not safe, it will be escaped.</td>

</tr>

<tr class="govuk-table__row">

<td class="govuk-table__cell">errorList</td>

<td class="govuk-table__cell ">array</td>

<td class="govuk-table__cell ">Yes</td>

<td class="govuk-table__cell ">Contains an array of error link items and all their available arguments.</td>

</tr>

<tr class="govuk-table__row">

<td class="govuk-table__cell">attributes</td>

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Any extra HTML attributes (for example data attributes) to add to the error-summary container.</td>

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