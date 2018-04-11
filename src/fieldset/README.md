# Fieldset

## Introduction

The fieldset element is used to group several controls within a web form. The legend element represents a caption for the content of its parent fieldset.

## Guidance

Find out when to use the Fieldset component in your service in the [GOV.UK Design System](https://govuk-design-system-production.cloudapps.digital/components/fieldset).

## Quick start examples

### Component default

[Preview the fieldset component](http://govuk-frontend-review.herokuapp.com/components/fieldset/preview)

#### Markup

    <div class="govuk-form-group">
      <fieldset class="govuk-fieldset">

        <legend class="govuk-fieldset__legend">
          What is your address?

          <span class="govuk-fieldset__hint">For example, 10 Downing Street</span>

        </legend>

      </fieldset>
    </div>

#### Macro

    {% from 'fieldset/macro.njk' import govukFieldset %}

    {{ govukFieldset({
      "legendText": "What is your address?",
      "legendHintText": "For example, 10 Downing Street"
    }) }}

### Fieldset--with-error-message

[Preview the fieldset--with-error-message example](http://govuk-frontend-review.herokuapp.com/components/fieldset/with-error-message/preview)

#### Markup

    <div class="govuk-form-group govuk-form-group--error">
      <fieldset class="govuk-fieldset">

        <legend class="govuk-fieldset__legend">
          What is your address?

          <span class="govuk-fieldset__hint">For example, 10 Downing Street</span>

          <span class="govuk-error-message">
          Please fill in the street input
        </span>

        </legend>

      </fieldset>
    </div>

#### Macro

    {% from 'fieldset/macro.njk' import govukFieldset %}

    {{ govukFieldset({
      "legendText": "What is your address?",
      "legendHintText": "For example, 10 Downing Street",
      "errorMessage": {
        "text": "Please fill in the street input"
      }
    }) }}

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

<th class="govuk-table__header" scope="row">classes</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional additional classes</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">legendText</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Legend text</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">legendHtml</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Legend text</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">legendHintText</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">HTML to use within the legend element. If this is used, the legendText argument will be ignored.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">legendHintHtml</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">HTML to use within the legend hint element. If this is used, the hintText argument will be ignored.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">errorMessage</th>

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Provide text or html key with values. See errorMessage component for more details.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">attributes</th>

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Any extra HTML attributes (for example data attributes) to add to the fieldset container.</td>

</tr>

</tbody>

</table>

### Setting up Nunjucks views and paths

Below is an example setup using express configure views:

    nunjucks.configure('node_modules/@govuk-frontend', {
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

## License

MIT