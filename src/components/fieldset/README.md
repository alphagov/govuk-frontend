# Fieldset

## Introduction

The fieldset element is used to group several controls within a web form. The legend element represents a caption for the content of its parent fieldset.

[Preview the fieldset component.](http://govuk-frontend-review.herokuapp.com/components/fieldset/preview)

## Guidance

More information about when to use fieldset can be found on [GOV.UK Design System](http://www.linktodesignsystem.com/fieldset "Link to read guidance on the use of fieldset on Gov.uk Design system website")

## Dependencies

To consume the fieldset component you must be running npm version 5 or above.

## Installation

    npm install --save @govuk-frontend/fieldset

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

    <fieldset class="govuk-c-fieldset ">
      <legend class="govuk-c-fieldset__legend">
        Legend text goes here

        <span class="govuk-c-fieldset__hint">Legend hint text goes here</span>

          <span class="govuk-c-error-message ">
      Error message goes here
    </span>

      </legend>

    </fieldset>

## If you are using Nunjucks

To use a macro, follow the below code examples:

    {% from "fieldset/macro.njk" import govukFieldset %}

    {{ govukFieldset(
      classes='',
      text='Legend text goes here',
      hintText='Legend hint text goes here',
      errorMessage='Error message goes here'
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

<th class="govuk-c-table__header" scope="row">legendText</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Legend text</td>

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

    npm outdated @govuk-frontend/fieldset

To update the latest version run:

    npm update @govuk-frontend/fieldset

## Contribution

Guidelines can be found at [on our Github repository.](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md "link to contributing guidelines on our github repository")

## Acknowledgements/credits

*   GDS developers
*   Jani Kraner
*   Gemma Leigh

## License

MIT