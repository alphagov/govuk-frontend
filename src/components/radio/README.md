# Radio

## Introduction

A radio button is a GOV.UK element that allows users to answer a question by selecting an option. If you have a question with more than one option you should stack radio buttons.

## Guidance

More information about when to use radio can be found on [GOV.UK Design System](http://www.linktodesignsystem.com/radio "Link to read guidance on the use of radio on Gov.uk Design system website")

## Quick start examples

### Component default

[Preview the radio component.](http://govuk-frontend-review.herokuapp.com/components/radio/preview)

#### Markup

#### Macro

      {% from 'radio/macro.njk' import govukRadio %}

    {{- govukRadio(
      classes='',
      name='radio-group',
      id='radio',
      radios=[
       {
          id: '1',
          value: 'Yes',
          label: 'Yes'
        },
        {
          id: '2',
          value: 'No',
          label: 'No'
        },
        {
          id: '3',
          value: 'No',
          label: 'No',
          checked: 'true'
        },
        {
          id: '4',
          value: 'NA',
          label: 'Not applicable',
          disabled: 'true'
        }
      ]
    ) -}}

## Variants

## Dependencies

To consume the radio component you must be running npm version 5 or above.

Please note, this component depends on @govuk-frontend/globals, which will automatically be installed with the package.

## Installation

    npm install --save @govuk-frontend/radio

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

<th class="govuk-c-table__header" scope="row">classes</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Optional additional classes</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">name</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">Name of the group of radio buttons</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">id</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">ID is prefixed to the ID of each radio button</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">radios</th>

<td class="govuk-c-table__cell ">array</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">Radios array with id, value, label, checked and disabled keys</td>

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

    npm outdated @govuk-frontend/radio

To update the latest version run:

    npm update @govuk-frontend/radio

## Contribution

Guidelines can be found at [on our Github repository.](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md "link to contributing guidelines on our github repository")

## Acknowledgements/credits

*   GDS developers
*   Jani Kraner
*   Gemma Leigh

## License

MIT