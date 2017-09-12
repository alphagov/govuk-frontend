# Table

## Introduction

Table description.

[Preview the table component.](http://govuk-frontend-review.herokuapp.com/components/table/preview)

## Guidance

More information about when to use table can be found on [GOV.UK Design System](http://www.linktodesignsystem.com/table "Link to read guidance on the use of table on Gov.uk Design system website")

## Dependencies

To consume the table component you must be running npm version 5 or above.

## Installation

    npm install --save @govuk-frontend/table

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

    <table class="govuk-c-table ">
      <caption class="govuk-c-table__caption  small ">Months and rates</caption>
      <tbody class="govuk-c-table__body">
        <tr class="govuk-c-table__row">
          <th class="govuk-c-table__header" scope="row"> January</th>
          <td class="govuk-c-table__cell  govuk-c-table__cell--numeric "  >£85</td>
          <td class="govuk-c-table__cell  govuk-c-table__cell--numeric "  >£95</td>
        </tr>
        <tr class="govuk-c-table__row">
          <th class="govuk-c-table__header" scope="row"> February</th>
          <td class="govuk-c-table__cell  govuk-c-table__cell--numeric "  >£75</td>
          <td class="govuk-c-table__cell  govuk-c-table__cell--numeric "  >£55</td>
        </tr>
        <tr class="govuk-c-table__row">
          <th class="govuk-c-table__header" scope="row"> March</th>
          <td class="govuk-c-table__cell  govuk-c-table__cell--numeric "  >£165</td>
          <td class="govuk-c-table__cell  govuk-c-table__cell--numeric "  >£125</td>
        </tr>
      </tbody>
    </table>

    <table class="govuk-c-table ">
      <thead class="govuk-c-table__head">
        <tr class="govuk-c-table__row">
          <th class="govuk-c-table__header "   scope="col">Month you apply</th>
          <th class="govuk-c-table__header  govuk-c-table__header--numeric "   scope="col">Rate for bicycles</th>
          <th class="govuk-c-table__header  govuk-c-table__header--numeric "   scope="col">Rate for vehicles</th>
      </tr>
      </thead>
      <tbody class="govuk-c-table__body">
        <tr class="govuk-c-table__row">
          <th class="govuk-c-table__header" scope="row"> January</th>
          <td class="govuk-c-table__cell  govuk-c-table__cell--numeric "  >£85</td>
          <td class="govuk-c-table__cell  govuk-c-table__cell--numeric "  >£95</td>
        </tr>
        <tr class="govuk-c-table__row">
          <th class="govuk-c-table__header" scope="row"> February</th>
          <td class="govuk-c-table__cell  govuk-c-table__cell--numeric "  >£75</td>
          <td class="govuk-c-table__cell  govuk-c-table__cell--numeric "  >£55</td>
        </tr>
        <tr class="govuk-c-table__row">
          <th class="govuk-c-table__header" scope="row"> March</th>
          <td class="govuk-c-table__cell  govuk-c-table__cell--numeric "  >£165</td>
          <td class="govuk-c-table__cell  govuk-c-table__cell--numeric "  >£125</td>
        </tr>
      </tbody>
    </table>

## If you are using Nunjucks

To use a macro, follow the below code examples:

    {% from 'table/macro.njk' import govukTable %}

    {# table with a caption #}
    {{ govukTable(
      classes='',
      options = {
        'caption': 'Months and rates',
        'captionSize': 'small',
        'isFirstCellHeader': 'true'
      },
      data = {
        'rows' : [
          [
            {
              text: 'January'
            },
            {
              text: '£85',
              type: 'numeric'
            },
            {
              text: '£95',
              type: 'numeric'
            }
          ],
          [
            {
              text: 'February'
            },
            {
              text: '£75',
              type: 'numeric'
            },
            {
              text: '£55',
              type: 'numeric'
            }
          ],
          [
            {
              text: 'March'
            },
            {
              text: '£165',
              type: 'numeric'
            },
            {
              text: '£125',
              type: 'numeric'
            }
          ]
        ]
      }
    )}}

    {# table with a head #}
    {{ govukTable(
      classes='',
      options = {
        'isFirstCellHeader': 'true'
      },
      data = {
        'head' : [
          {
            text: 'Month you apply'
          },
          {
            text: 'Rate for bicycles',
            type: 'numeric'
          },
          {
            text: 'Rate for vehicles',
            type: 'numeric'
          }
        ],
        'rows' : [
          [
            {
              text: 'January'
            },
            {
              text: '£85',
              type: 'numeric'
            },
            {
              text: '£95',
              type: 'numeric'
            }
          ],
          [
            {
              text: 'February'
            },
            {
              text: '£75',
              type: 'numeric'
            },
            {
              text: '£55',
              type: 'numeric'
            }
          ],
          [
            {
              text: 'March'
            },
            {
              text: '£165',
              type: 'numeric'
            },
            {
              text: '£125',
              type: 'numeric'
            }
          ]
        ]
      }
    )}}

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

<th class="govuk-c-table__header" scope="row">data</th>

<td class="govuk-c-table__cell ">array</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">Data array with text and type keys</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">options</th>

<td class="govuk-c-table__cell ">array</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">Options array with caption, captionSize and isFirstCellHeader keys</td>

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

    npm outdated @govuk-frontend/table

To update the latest version run:

    npm update @govuk-frontend/table

## Contribution

Guidelines can be found at [on our Github repository.](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md "link to contributing guidelines on our github repository")

## Acknowledgements/credits

*   GDS developers
*   Jani Kraner
*   Gemma Leigh

## License

MIT