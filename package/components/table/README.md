# Table

## Introduction

Table description.

## Guidance

Find out when to use the table component in your service in the [GOV.UK Design System](https://design-system.service.gov.uk/components/table).

## Quick start examples

### Table

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/table/preview)

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

    {% from "table/macro.njk" import govukTable %}

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

### Table table with head

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/table/table-with-head/preview)

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

    {% from "table/macro.njk" import govukTable %}

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

### Table table with head and caption

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/table/table-with-head-and-caption/preview)

#### Markup

    <table class="govuk-table">

      <caption class="govuk-table__caption govuk-heading-m">Caption 1: Months and rates</caption>

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

    {% from "table/macro.njk" import govukTable %}

    {{ govukTable({
      "caption": "Caption 1: Months and rates",
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

## Component options

Use options to customise the appearance, content and behaviour of a component when using a macro, for example, changing the text.

See [options table](https://design-system.service.gov.uk/components/table/#options-example-default) for details.

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