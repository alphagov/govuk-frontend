# Table

## Introduction

Table description.

## Guidance

Find out when to use the Table component in your service in the [GOV.UK Design System](https://govuk-design-system-production.cloudapps.digital/components/table).

## Quick start examples

### Component default

[Preview the table component](http://govuk-frontend-review.herokuapp.com/components/table/preview)

#### Markup

    <table class="govuk-table">

      <tbody class="govuk-table__body">

        <tr class="govuk-table__row">

          <td class="govuk-table__cell">January</td>

          <td class="govuk-table__cell govuk-table__cell--numeric">£85</td>

          <td class="govuk-table__cell govuk-table__cell--numeric">£95</td>

        </tr>

        <tr class="govuk-table__row">

          <td class="govuk-table__cell">February</td>

          <td class="govuk-table__cell govuk-table__cell--numeric">£75</td>

          <td class="govuk-table__cell govuk-table__cell--numeric">£55</td>

        </tr>

        <tr class="govuk-table__row">

          <td class="govuk-table__cell">March</td>

          <td class="govuk-table__cell govuk-table__cell--numeric">£165</td>

          <td class="govuk-table__cell govuk-table__cell--numeric">£125</td>

        </tr>

      </tbody>
    </table>

#### Macro

    {% from 'table/macro.njk' import govukTable %}

    {{ govukTable({
      "rows": [
        [
          {
            "text": "January"
          },
          {
            "text": "£85",
            "format": "numeric"
          },
          {
            "text": "£95",
            "format": "numeric"
          }
        ],
        [
          {
            "text": "February"
          },
          {
            "text": "£75",
            "format": "numeric"
          },
          {
            "text": "£55",
            "format": "numeric"
          }
        ],
        [
          {
            "text": "March"
          },
          {
            "text": "£165",
            "format": "numeric"
          },
          {
            "text": "£125",
            "format": "numeric"
          }
        ]
      ]
    }) }}

### Table--table-with-head

[Preview the table--table-with-head example](http://govuk-frontend-review.herokuapp.com/components/table/table-with-head/preview)

#### Markup

    <table class="govuk-table">

      <thead class="govuk-table__head">
        <tr class="govuk-table__row">

          <th class="govuk-table__header" scope="col">Month you apply</th>

          <th class="govuk-table__header govuk-table__header--numeric" scope="col">Rate for bicycles</th>

          <th class="govuk-table__header govuk-table__header--numeric" scope="col">Rate for vehicles</th>

        </tr>
      </thead>

      <tbody class="govuk-table__body">

        <tr class="govuk-table__row">

          <td class="govuk-table__cell">January</td>

          <td class="govuk-table__cell govuk-table__cell--numeric">£85</td>

          <td class="govuk-table__cell govuk-table__cell--numeric">£95</td>

        </tr>

        <tr class="govuk-table__row">

          <td class="govuk-table__cell">February</td>

          <td class="govuk-table__cell govuk-table__cell--numeric">£75</td>

          <td class="govuk-table__cell govuk-table__cell--numeric">£55</td>

        </tr>

        <tr class="govuk-table__row">

          <td class="govuk-table__cell">March</td>

          <td class="govuk-table__cell govuk-table__cell--numeric">£165</td>

          <td class="govuk-table__cell govuk-table__cell--numeric">£125</td>

        </tr>

      </tbody>
    </table>

#### Macro

    {% from 'table/macro.njk' import govukTable %}

    {{ govukTable({
      "head": [
        {
          "text": "Month you apply"
        },
        {
          "text": "Rate for bicycles",
          "format": "numeric"
        },
        {
          "text": "Rate for vehicles",
          "format": "numeric"
        }
      ],
      "rows": [
        [
          {
            "text": "January"
          },
          {
            "text": "£85",
            "format": "numeric"
          },
          {
            "text": "£95",
            "format": "numeric"
          }
        ],
        [
          {
            "text": "February"
          },
          {
            "text": "£75",
            "format": "numeric"
          },
          {
            "text": "£55",
            "format": "numeric"
          }
        ],
        [
          {
            "text": "March"
          },
          {
            "text": "£165",
            "format": "numeric"
          },
          {
            "text": "£125",
            "format": "numeric"
          }
        ]
      ]
    }) }}

### Table--table-with-caption-and-head

[Preview the table--table-with-caption-and-head example](http://govuk-frontend-review.herokuapp.com/components/table/table-with-caption-and-head/preview)

#### Markup

    <table class="govuk-table">

      <caption class="govuk-table__caption govuk-heading-m">Caption 1 : Months and rates</caption>

      <thead class="govuk-table__head">
        <tr class="govuk-table__row">

          <th class="govuk-table__header" scope="col">Month you apply</th>

          <th class="govuk-table__header govuk-table__header--numeric" scope="col">Rate for bicycles</th>

          <th class="govuk-table__header govuk-table__header--numeric" scope="col">Rate for vehicles</th>

        </tr>
      </thead>

      <tbody class="govuk-table__body">

        <tr class="govuk-table__row">

          <th class="govuk-table__header" scope="row">January</th>

          <td class="govuk-table__cell govuk-table__cell--numeric">£85</td>

          <td class="govuk-table__cell govuk-table__cell--numeric">£95</td>

        </tr>

        <tr class="govuk-table__row">

          <th class="govuk-table__header" scope="row">February</th>

          <td class="govuk-table__cell govuk-table__cell--numeric">£75</td>

          <td class="govuk-table__cell govuk-table__cell--numeric">£55</td>

        </tr>

        <tr class="govuk-table__row">

          <th class="govuk-table__header" scope="row">March</th>

          <td class="govuk-table__cell govuk-table__cell--numeric">£165</td>

          <td class="govuk-table__cell govuk-table__cell--numeric">£125</td>

        </tr>

      </tbody>
    </table>

#### Macro

    {% from 'table/macro.njk' import govukTable %}

    {{ govukTable({
      "caption": "Caption 1 : Months and rates",
      "captionClasses": "govuk-heading-m",
      "firstCellIsHeader": true,
      "head": [
        {
          "text": "Month you apply"
        },
        {
          "text": "Rate for bicycles",
          "format": "numeric"
        },
        {
          "text": "Rate for vehicles",
          "format": "numeric"
        }
      ],
      "rows": [
        [
          {
            "text": "January"
          },
          {
            "text": "£85",
            "format": "numeric"
          },
          {
            "text": "£95",
            "format": "numeric"
          }
        ],
        [
          {
            "text": "February"
          },
          {
            "text": "£75",
            "format": "numeric"
          },
          {
            "text": "£55",
            "format": "numeric"
          }
        ],
        [
          {
            "text": "March"
          },
          {
            "text": "£165",
            "format": "numeric"
          },
          {
            "text": "£125",
            "format": "numeric"
          }
        ]
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

    app.use('/assets', express.static(path.join(__dirname, '/node_modules/govuk-frontend/assets')))

## Component arguments

If you are using Nunjucks,then macros take the following arguments

<table class="govuk-table">

<thead class="govuk-table__head">

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="col">Name</th>

<th class="govuk-table__header" scope="col">format</th>

<th class="govuk-table__header" scope="col">Required</th>

<th class="govuk-table__header" scope="col">Description</th>

</tr>

</thead>

<tbody class="govuk-table__body">

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">rows</th>

<td class="govuk-table__cell ">array</td>

<td class="govuk-table__cell ">Yes</td>

<td class="govuk-table__cell ">Array of table rows and cells.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">rows.[].text (or) rows.[].html</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">Yes</td>

<td class="govuk-table__cell ">Text or HTML for cells in table rows. If `html` is specified, the `text` argument will be ignored.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">rows.[].format</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Specify format of a cell. Currently we only use "numeric".</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">rows.[].colspan</th>

<td class="govuk-table__cell ">number</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Specify how many columns a cell extends.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">rows.[].rowspan</th>

<td class="govuk-table__cell ">number</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Specify how many rows a cell extends.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">head</th>

<td class="govuk-table__cell ">array</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional array of table head cells.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">head.[].text or head.[].html</th>

<td class="govuk-table__cell ">array</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional array of table head cells. If `html` is specified, the `text` argument will be ignored.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">head.[].colspan</th>

<td class="govuk-table__cell ">number</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Specify how many columns a cell extends.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">head.[].rowspan</th>

<td class="govuk-table__cell ">number</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Specify how many rows a cell extends.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">head.[].format</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Specify format of a cell. Currently we only use "numeric".</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">caption</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional caption text.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">captionClasses</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional classes for caption text size. Class should correspond to the available typography heading classes.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">firstCellIsHeader</th>

<td class="govuk-table__cell ">boolean</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">If set to true, first cell in table row will be a TH instead of a TD.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">classes</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional additional classes to add to the table container.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">attributes</th>

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Any extra HTML attributes (for example data attributes) to add to the table container.</td>

</tr>

</tbody>

</table>

### Setting up Nunjucks views and paths

Below is an example setup using express configure views:

    nunjucks.configure('node_modules/govuk-frontend/components', {
      autoescape: true,
      cache: false,
      express: app
    })

## Contribution

Guidelines can be found at [on our Github repository.](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md "link to contributing guidelines on our github repository")

## License

MIT