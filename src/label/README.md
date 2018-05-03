# Label

## Introduction

Use labels for all form fields.

## Quick start examples

### Component default

[Preview the label component](http://govuk-frontend-review.herokuapp.com/components/label/preview)

#### Markup

    <label class="govuk-label">
      National Insurance number
    </label>

#### Macro

    {% from 'label/macro.njk' import govukLabel %}

    {{ govukLabel({
      "text": "National Insurance number"
    }) }}

### Label--with bold text

[Preview the label--with bold text example](http://govuk-frontend-review.herokuapp.com/components/label/with bold text/preview)

#### Markup

    <label class="govuk-label govuk-label--bold">
      National Insurance number
    </label>

#### Macro

    {% from 'label/macro.njk' import govukLabel %}

    {{ govukLabel({
      "classes": "govuk-label--bold",
      "text": "National Insurance number"
    }) }}

### Label--as page heading

[Preview the label--as page heading example](http://govuk-frontend-review.herokuapp.com/components/label/as page heading/preview)

#### Markup

    <h1 class="govuk-label-wrapper">
      <label class="govuk-label">
        National Insurance number
      </label>

    </h1>

#### Macro

    {% from 'label/macro.njk' import govukLabel %}

    {{ govukLabel({
      "text": "National Insurance number",
      "isPageHeading": true
    }) }}

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

<th class="govuk-table__header" scope="row">text</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Text to use within the label</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">html</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">HTML to use within the label. If this is provided, the text argument will be ignored.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">for</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">Yes</td>

<td class="govuk-table__cell ">The value of the for attribute, the id of the input the label is associated with</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">isPageHeading</th>

<td class="govuk-table__cell ">boolean</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Whether the label also acts as the heading for the page.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">attributes</th>

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Any extra HTML attributes (for example data attributes) to add to the error message span tag.</td>

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

    npm outdated @govuk-frontend/label

To update the latest version run:

    npm update @govuk-frontend/label

## Contribution

Guidelines can be found at [on our Github repository.](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md "link to contributing guidelines on our github repository")

## License

MIT