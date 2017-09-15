# Date

## Introduction

A component for entering dates, for example - date of birth.

## Guidance

More information about when to use date can be found on [GOV.UK Design System](http://www.linktodesignsystem.com/date "Link to read guidance on the use of date on Gov.uk Design system website")

## Quick start examples

### Component default

[Preview the date component.](http://govuk-frontend-review.herokuapp.com/components/date/preview)

#### Markup

#### Macro

      {% from "date/macro.njk" import govukDate %}

    {{- govukDate(
      fieldsetClasses='',
      legendText='What is your date of birth?',
      legendHintText='For example, 31 3 1980',
      legendErrorMessage='',
      id='dob',
      name='dob',
      dateItems=[
        {
          name: 'day',
          error: ''
        },
        {
          name: 'month',
          error: ''
        },
        {
          name: 'year',
          error: ''
        }
      ]
      )
    -}}

    {{- govukDate(
      fieldsetClasses='',
      legendText='What is your date of birth?',
      legendHintText='For example, 31 3 1980',
      legendErrorMessage='Error message goes here',
      id='dob',
      name='dob',
      dateItems=[
        {
          name: 'day',
          error: 'true'
        },
        {
          name: 'month',
          error: 'true'
        },
        {
          name: 'year',
          error: 'true'
        }
      ]
      )
    -}}

    {{- govukDate(
      fieldsetClasses='',
      legendText='What is your date of birth?',
      legendHintText='For example, 31 3 1980',
      legendErrorMessage='Error message goes here',
      id='dob-day-error',
      name='dob-day-error',
      dateItems=[
        {
          name: 'day',
          error: 'true'
        },
        {
          name: 'month',
          error: ''
        },
        {
          name: 'year',
          error: ''
        }
      ]
      )
    -}}

    {{- govukDate(
      fieldsetClasses='',
      legendText='What is your date of birth?',
      legendHintText='For example, 31 3 1980',
      legendErrorMessage='Error message goes here',
      id='dob-month-error',
      name='dob-month-error',
      dateItems=[
        {
          name: 'day',
          error: ''
        },
        {
          name: 'month',
          error: 'true'
        },
        {
          name: 'year',
          error: ''
        }
      ]
      )
    -}}

    {{- govukDate(
      fieldsetClasses='',
      legendText='What is your date of birth?',
      legendHintText='For example, 31 3 1980',
      legendErrorMessage='Error message goes here',
      id='dob-year-error',
      name='dob-year-error',
      dateItems=[
        {
          name: 'day',
          error: ''
        },
        {
          name: 'month',
          error: ''
        },
        {
          name: 'year',
          error: 'true'
        }
      ]
      )
    -}}

## Variants

## Dependencies

To consume the date component you must be running npm version 5 or above.

## Installation

    npm install --save @govuk-frontend/date

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

<div>

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

<th class="govuk-c-table__header" scope="row">fieldsetClasses</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Optional additional classes</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">legendText</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Legend text</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">legendHintText</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Optional legend hint text</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">legendErrorMessage</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Optional legend error message</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">id</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Ids of date items</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">Names of date items</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">name of each date input</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">dateItems</th>

<td class="govuk-c-table__cell ">object</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">dateItems object with name and error keys</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">dateItems.name</th>

<td class="govuk-c-table__cell "></td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">Name of date item, for example - Day, Month or Year</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">dateItems.error</th>

<td class="govuk-c-table__cell "></td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">Set error for date item</td>

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

    npm outdated @govuk-frontend/date

To update the latest version run:

    npm update @govuk-frontend/date

## Contribution

Guidelines can be found at [on our Github repository.](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md "link to contributing guidelines on our github repository")

## Acknowledgements/credits

*   GDS developers
*   Jani Kraner
*   Gemma Leigh

## License

MIT