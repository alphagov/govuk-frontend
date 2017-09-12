# Label

## Introduction

Use labels for all form fields.

[Preview the label component.](http://govuk-frontend-review.herokuapp.com/components/label/preview)

## Guidance

More information about when to use label can be found on [GOV.UK Design System](http://www.linktodesignsystem.com/label "Link to read guidance on the use of label on Gov.uk Design system website")

## Dependencies

To consume the label component you must be running npm version 5 or above.

## Installation

    npm install --save @govuk-frontend/label

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

    <label class="govuk-c-label " for="">
      National Insurance number

        <span class="govuk-c-label__hint">It’s on your National Insurance card, benefit letter, payslip or P60.
        For example, ‘QQ 12 34 56 C’.</span>

    </label>

    <label class="govuk-c-label  govuk-c-label--bold " for="">
      National Insurance number

        <span class="govuk-c-label__hint">It’s on your National Insurance card, benefit letter, payslip or P60.
        For example, ‘QQ 12 34 56 C’.</span>

    </label>

    <label class="govuk-c-label " for="">
      National Insurance number

        <span class="govuk-c-label__hint">It’s on your National Insurance card, benefit letter, payslip or P60.
        For example, ‘QQ 12 34 56 C’.</span>

        <span class="govuk-c-error-message ">
      Error message goes here
    </span>

    </label>

## If you are using Nunjucks

To use a macro, follow the below code examples:

    {% from "label/macro.njk" import govukLabel %}

    {{ govukLabel(
      classes='',
      labelText='National Insurance number',
      hintText='It’s on your National Insurance card, benefit letter, payslip or P60.
        For example, ‘QQ 12 34 56 C’.',
      id=''
      )
    }}

    {{ govukLabel(
      classes='govuk-c-label--bold',
      labelText='National Insurance number',
      hintText='It’s on your National Insurance card, benefit letter, payslip or P60.
        For example, ‘QQ 12 34 56 C’.',
      id=''
      )
    }}

    {{ govukLabel(
      classes='',
      labelText='National Insurance number',
      hintText='It’s on your National Insurance card, benefit letter, payslip or P60.
        For example, ‘QQ 12 34 56 C’.',
      errorMessage='Error message goes here',
      id=''
      )
    }}

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

<th class="govuk-c-table__header" scope="row">labelText</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">The label text</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">hintText</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Optional hint text</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">errorMessage</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Optional error message</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">id</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">The value of the for attribute, the id input the label is associated with</td>

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

    npm outdated @govuk-frontend/label

To update the latest version run:

    npm update @govuk-frontend/label

## Contribution

Guidelines can be found at [on our Github repository.](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md "link to contributing guidelines on our github repository")

## Acknowledgements/credits

*   GDS developers
*   Jani Kraner
*   Gemma Leigh

## License

MIT