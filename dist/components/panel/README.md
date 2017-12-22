<div class="govuk-o-width-container">

<div class="govuk-o-main-wrapper">

# Panel

## Introduction

The confirmation panel has a turquoise background and white text. Used for transaction end pages, and Bank Holidays.

## Guidance

More information about when to use panel can be found on [GOV.UK Design System](http://www.linktodesignsystem.com/panel "Link to read guidance on the use of panel on Gov.uk Design system website")

## Quick start examples

### Component default

[Preview the panel component](http://govuk-frontend-review.herokuapp.com/components/panel/preview)

#### Markup

    <div class="govuk-c-panel govuk-c-panel--confirmation">
      <h2 class="govuk-c-panel__title">
        Application complete
      </h2>
      <div class="govuk-c-panel__body">
        Your reference number<br><strong>HDJ2123F</strong>
      </div>
    </div>

#### Macro

    {{ govukPanel({
      "titleText": "Application complete",
      "html": "Your reference number<br><strong>HDJ2123F</strong>"
    }) }}

### Panel--no-reference-number

[Preview the panel--no-reference-number variant](http://govuk-frontend-review.herokuapp.com/components/panel/no-reference-number/preview)

#### Markup

    <div class="govuk-c-panel govuk-c-panel--confirmation extra-dummy-class">
      <h2 class="govuk-c-panel__title">
        Application complete
      </h2>
      <div class="govuk-c-panel__body">
        Thank you for your application
      </div>
    </div>

#### Macro

    {{ govukPanel({
      "classes": "extra-dummy-class",
      "titleText": "Application complete",
      "text": "Thank you for your application"
    }) }}

## Dependencies

To consume the panel component you must be running npm version 5 or above.

## Installation

    npm install --save @govuk-frontend/panel

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

<th class="govuk-c-table__header" scope="row">titleText</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">Text for the panel title</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">titleHtml</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">HTML for the panel title. If this is provided, the titleText argument is ignored.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">text</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Text for the panel content</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">html</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">HTML for the panel content. If this is provided, the text argument is ignored.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">classes</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Optional additional classes</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">attributes</th>

<td class="govuk-c-table__cell ">object</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Any extra HTML attributes (for example data attributes) to add to the panel container</td>

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

    npm outdated @govuk-frontend/panel

To update the latest version run:

    npm update @govuk-frontend/panel

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