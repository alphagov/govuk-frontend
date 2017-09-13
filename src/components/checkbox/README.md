# Checkbox

## Introduction

Breadcrumb navigation, showing page hierarchy.

[Preview the checkbox component.](http://govuk-frontend-review.herokuapp.com/components/checkbox/preview)

## Guidance

More information about when to use checkbox can be found on [GOV.UK Design System](http://www.linktodesignsystem.com/checkbox "Link to read guidance on the use of checkbox on Gov.uk Design system website")

## Dependencies

To consume the checkbox component you must be running npm version 5 or above.

## Installation

    npm install --save @govuk-frontend/checkbox

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

      <div class="govuk-c-checkbox ">
        <input class="govuk-c-checkbox__input" id="waste-type-1" name="waste-types" type="checkbox" value="waste-animal"   >
        <label class="govuk-c-checkbox__label" for="waste-type-1">Waste from animal carcasses</label>
      </div>
      <div class="govuk-c-checkbox ">
        <input class="govuk-c-checkbox__input" id="waste-type-2" name="waste-types" type="checkbox" value="waste-mines"   >
        <label class="govuk-c-checkbox__label" for="waste-type-2">Waste from mines or quarries</label>
      </div>
      <div class="govuk-c-checkbox ">
        <input class="govuk-c-checkbox__input" id="waste-type-3" name="waste-types" type="checkbox" value="waste-farm"  checked >
        <label class="govuk-c-checkbox__label" for="waste-type-3">Farm or agricultural waste</label>
      </div>
      <div class="govuk-c-checkbox ">
        <input class="govuk-c-checkbox__input" id="waste-type-4" name="waste-types" type="checkbox" value="waste-disabled"   disabled>
        <label class="govuk-c-checkbox__label" for="waste-type-4">Disabled checkbox option</label>
      </div>

## If you are using Nunjucks

To use a macro, follow the below code examples:

    {% from 'checkbox/macro.njk' import govukCheckbox %}

    {{ govukCheckbox(
      classes='',
      name='waste-types',
      id='waste-type',
      checkboxes=[
       {
          id: '1',
          value: 'waste-animal',
          label: 'Waste from animal carcasses'
        },
        {
          id: '2',
          value: 'waste-mines',
          label: 'Waste from mines or quarries'
        },
        {
          id: '3',
          value: 'waste-farm',
          label: 'Farm or agricultural waste',
          checked: 'true'
        },
        {
          id: '4',
          value: 'waste-disabled',
          label: 'Disabled checkbox option',
          disabled: 'true'
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

<th class="govuk-c-table__header" scope="row">name</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">Name of the group of checkboxes</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">id</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">ID is prefixed to the ID of each checkbox</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">checkboxes</th>

<td class="govuk-c-table__cell ">array</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">Checkboxes array with id, value, label, checked and disabled keys</td>

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

    npm outdated @govuk-frontend/checkbox

To update the latest version run:

    npm update @govuk-frontend/checkbox

## Contribution

Guidelines can be found at [on our Github repository.](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md "link to contributing guidelines on our github repository")

## Acknowledgements/credits

*   GDS developers
*   Jani Kraner
*   Gemma Leigh

## License

MIT