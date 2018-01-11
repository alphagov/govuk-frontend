# Textarea

## Introduction

A multi-line text field.

## Guidance

More information about when to use textarea can be found on [GOV.UK Design System](http://www.linktodesignsystem.com/textarea "Link to read guidance on the use of textarea on Gov.uk Design system website")

## Quick start examples

### Component default

[Preview the textarea component](http://govuk-frontend-review.herokuapp.com/components/textarea/preview)

#### Markup

    <label class="govuk-c-label" for="more-detail">
      Can you provide more detail?

      <span class="govuk-c-label__hint">
        Don&#39;t include personal or financial information, eg your National Insurance number or credit card details.
      </span>

    </label>
    <textarea id="more-detail" name="more-detail" rows="5" class="govuk-c-textarea"></textarea>

#### Macro

    {{ govukTextarea({
      "name": "more-detail",
      "id": "more-detail",
      "label": {
        "text": "Can you provide more detail?",
        "hintText": "Don't include personal or financial information, eg your National Insurance number or credit card details."
      }
    }) }}

### Textarea--with error message

[Preview the textarea--with error message variant](http://govuk-frontend-review.herokuapp.com/components/textarea/with error message/preview)

#### Markup

    <label class="govuk-c-label" for="no-ni-reason">
      Why can&#39;t you provide a National Insurance number?

      <span class="govuk-c-error-message">
       You must provide an explanation
    </span>

    </label>
    <textarea id="no-ni-reason" name="no-ni-reason" rows="5" class="govuk-c-textarea govuk-c-textarea--error"></textarea>

#### Macro

    {{ govukTextarea({
      "name": "no-ni-reason",
      "id": "no-ni-reason",
      "label": {
        "text": "Why can't you provide a National Insurance number?"
      },
      "errorMessage": {
        "text": "You must provide an explanation"
      }
    }) }}

### Textarea--with default value

[Preview the textarea--with default value variant](http://govuk-frontend-review.herokuapp.com/components/textarea/with default value/preview)

#### Markup

    <label class="govuk-c-label" for="full-address">
      Full address

    </label>
    <textarea id="full-address" name="address" rows="5" class="govuk-c-textarea">221B Baker Street
    London
    NW1 6XE
    </textarea>

#### Macro

    {{ govukTextarea({
      "id": "full-address",
      "name": "address",
      "value": "221B Baker Street\nLondon\nNW1 6XE\n",
      "label": {
        "text": "Full address"
      }
    }) }}

### Textarea--with custom rows

[Preview the textarea--with custom rows variant](http://govuk-frontend-review.herokuapp.com/components/textarea/with custom rows/preview)

#### Markup

    <label class="govuk-c-label" for="full-address">
      Full address

    </label>
    <textarea id="full-address" name="address" rows="8" class="govuk-c-textarea"></textarea>

#### Macro

    {{ govukTextarea({
      "id": "full-address",
      "name": "address",
      "label": {
        "text": "Full address"
      },
      "rows": 8
    }) }}

## Dependencies

To consume the textarea component you must be running npm version 5 or above.

## Installation

      npm install --save @govuk-frontend/textarea

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

<th class="govuk-c-table__header" scope="row">id</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">The id of the textarea</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">name</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">The name of the textarea, which is submitted with the form data</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">rows</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Optional number of textarea rows (default is 5 rows)</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">value</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Optional initial value of the textarea</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">label</th>

<td class="govuk-c-table__cell ">object</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">Arguments for the label component</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">errorMessage</th>

<td class="govuk-c-table__cell ">object</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Arguments for the error message component</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">attributes</th>

<td class="govuk-c-table__cell ">object</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Any extra HTML attributes (for example data attributes) to add to the textarea tag</td>

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

      npm outdated @govuk-frontend/textarea

To update the latest version run:

      npm update @govuk-frontend/textarea

## Contribution

Guidelines can be found at [on our Github repository.](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md "link to contributing guidelines on our github repository")

## License

MIT