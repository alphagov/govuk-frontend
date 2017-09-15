# Select box

## Introduction

The HTML `<select>` element represents a control that provides a menu of options.

## Guidance

More information about when to use select-box can be found on [GOV.UK Design System](http://www.linktodesignsystem.com/select-box "Link to read guidance on the use of select-box on Gov.uk Design system website")

## Quick start examples

### Component default

[Preview the select-box component.](http://govuk-frontend-review.herokuapp.com/components/select-box/preview)

#### Markup

#### Macro

      {% from "select-box/macro.njk" import govukSelectBox %}

    {{ govukSelectBox(
      classes='',
      id='select-box-1',
      name='select-box-1',
      options=[
        {
          value: '1',
          label: 'GOV.UK frontend option 1'
        },
        {
          value: '2',
          label: 'GOV.UK frontend option 2'
        },
        {
          value: '3',
          label: 'GOV.UK frontend option 3'
        }
      ]
    )}}

    {{ govukSelectBox(
      hasLabelWithText='Label for select box',
      labelClasses='',
      classes='',
      id='select-box-2',
      name='select-box-2',
      options=[
        {
          value: 'a',
          label: 'GOV.UK frontend option a'
        },
        {
          value: 'b',
          label: 'GOV.UK frontend option b',
          selected: 'true'
        },
        {
          value: 'c',
          label: 'GOV.UK frontend option c'
        }
      ]
    )}}

## Variants

## Dependencies

To consume the select-box component you must be running npm version 5 or above.

## Installation

    npm install --save @govuk-frontend/select-box

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

<th class="govuk-c-table__header" scope="row">id</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">Id for each select box</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">name</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">Name for each select box</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">options</th>

<td class="govuk-c-table__cell ">array</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">Options array with value, label, selected keys</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">hasLabelWithText</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Optional to provide label text that will render the label element</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">labelClasses</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Optional to provide label with custom classes</td>

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

    npm outdated @govuk-frontend/select-box

To update the latest version run:

    npm update @govuk-frontend/select-box

## Contribution

Guidelines can be found at [on our Github repository.](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md "link to contributing guidelines on our github repository")

## Acknowledgements/credits

*   GDS developers
*   Jani Kraner
*   Gemma Leigh

## License

MIT