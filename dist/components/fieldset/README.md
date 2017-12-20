<div class="govuk-o-width-container">

<div class="govuk-o-main-wrapper">

# Fieldset

## Introduction

The fieldset element is used to group several controls within a web form. The legend element represents a caption for the content of its parent fieldset.

## Guidance

More information about when to use fieldset can be found on [GOV.UK Design System](http://www.linktodesignsystem.com/fieldset "Link to read guidance on the use of fieldset on Gov.uk Design system website")

## Quick start examples

### Component default

[Preview the fieldset component](http://govuk-frontend-review.herokuapp.com/components/fieldset/preview)

#### Markup

    <fieldset class="govuk-c-fieldset">

      <legend class="govuk-c-fieldset__legend">
        Legend text goes here

        <span class="govuk-c-fieldset__hint">Legend hint text goes here</span>

      </legend>

      </fieldset>

#### Macro

    {{ govukFieldset({
      "legendText": "Legend text goes here",
      "legendHintText": "Legend hint text goes here"
    }) }}

### Fieldset--with-error-message

[Preview the fieldset--with-error-message variant](http://govuk-frontend-review.herokuapp.com/components/fieldset/with-error-message/preview)

#### Markup

    <fieldset class="govuk-c-fieldset">

      <legend class="govuk-c-fieldset__legend">
        Legend text goes here

        <span class="govuk-c-fieldset__hint">Legend hint text goes here</span>

        <span class="govuk-c-error-message">
           Error message goes here
        </span>

      </legend>

      </fieldset>

#### Macro

    {{ govukFieldset({
      "legendText": "Legend text goes here",
      "legendHintText": "Legend hint text goes here",
      "errorMessage": {
        "text": "Error message goes here"
      }
    }) }}

### Fieldset--with-html-instead-of-text

[Preview the fieldset--with-html-instead-of-text variant](http://govuk-frontend-review.herokuapp.com/components/fieldset/with-html-instead-of-text/preview)

#### Markup

    <fieldset class="govuk-c-fieldset">

      <legend class="govuk-c-fieldset__legend">
        Legend text <i>goes</i> here

        <span class="govuk-c-fieldset__hint">Legend hint text <i>goes</i> here</span>

        <span class="govuk-c-error-message">
           Error message <i>goes</i>  here
        </span>

      </legend>

      </fieldset>

#### Macro

    {{ govukFieldset({
      "legendHtml": "Legend text <i>goes</i> here",
      "legendHintHtml": "Legend hint text <i>goes</i> here",
      "errorMessage": {
        "html": "Error message <i>goes</i>  here"
      }
    }) }}

## Dependencies

To consume the fieldset component you must be running npm version 5 or above.

## Installation

    npm install --save @govuk-frontend/fieldset

## Requirements

### Build tool configuration

When compiling the Sass files you'll need to define includePaths to reference the node_modules directory. Below is a sample configuration using gulp

<pre>  `.pipe(sass({
        includePaths: 'node_modules/'
    }))` 
  </pre>

### Static asset path configuration

To show the button image you need to configure your app to show these assets. Below is a sample configuration using Express js:

<pre>  `app.use('/public', express.static(path.join(__dirname, '/node_modules/@govuk-frontend/icons')))` 
  </pre>

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

<th class="govuk-c-table__header" scope="row">legendText</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Legend text</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">legendHtml</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Legend text</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">legendHintText</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">HTML to use within the legend element. If this is used, the legendText argument will be ignored.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">legendHintHtml</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">HTML to use within the legend hint element. If this is used, the hintText argument will be ignored.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">errorMessage</th>

<td class="govuk-c-table__cell ">object</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Provide text or html key with values. See errorMessage component for more details.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">attributes</th>

<td class="govuk-c-table__cell ">object</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Any extra HTML attributes (for example data attributes) to add to the fieldset container.</td>

</tr>

</tbody>

</table>

</div>

### Setting up Nunjucks views and paths

Below is an example setup using express configure views:

<pre>  `nunjucks.configure('node_modules/@govuk-frontend`, {
    autoescape: true,
    cache: false,
    express: app
  })` 
  </pre>

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

</div>

</div>