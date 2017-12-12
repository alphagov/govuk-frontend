# Link

## Introduction

Link component, with 2 variants:

*   muted link - used for the “anything wrong with this page?” links
*   download link - with download icon

## Guidance

More information about when to use link can be found on [GOV.UK Design System](http://www.linktodesignsystem.com/link "Link to read guidance on the use of link on Gov.uk Design system website")

## Quick start examples

### Component default

[Preview the link component](http://govuk-frontend-review.herokuapp.com/components/link/preview)

#### Markup

    <a href="#" class="govuk-c-link">Default link</a>

#### Macro

    {{ govukLink({
      "text": "Default link"
    }) }}

### Link--download

[Preview the link--download variant](http://govuk-frontend-review.herokuapp.com/components/link/download/preview)

#### Markup

    <a href="#" class="govuk-c-link govuk-c-link--download">Download</a>

#### Macro

    {{ govukLink({
      "text": "Download",
      "classes": "govuk-c-link--download"
    }) }}

### Link--muted

[Preview the link--muted variant](http://govuk-frontend-review.herokuapp.com/components/link/muted/preview)

#### Markup

    <a href="#" class="govuk-c-link govuk-c-link--muted">Is there anything wrong with this page?</a>

#### Macro

    {{ govukLink({
      "text": "Is there anything wrong with this page?",
      "classes": "govuk-c-link--muted"
    }) }}

## Dependencies

To consume the link component you must be running npm version 5 or above.

## Installation

    npm install --save @govuk-frontend/link

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

<td class="govuk-c-table__cell ">The available classes for the link: govuk-c-link--download, govuk-c-link--muted</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">text</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Text to use within the link</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">html</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">HTML to use within the link. If this is provided, the text argument will be ignored.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">href</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">The value of the link href attribute</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">attributes</th>

<td class="govuk-c-table__cell ">object</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Any extra HTML attributes (for example data attributes) to add to the anchor tag.</td>

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

    npm outdated @govuk-frontend/link

To update the latest version run:

    npm update @govuk-frontend/link

## Contribution

Guidelines can be found at [on our Github repository.](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md "link to contributing guidelines on our github repository")

## Acknowledgements/credits

*   GDS developers
*   Jani Kraner
*   Gemma Leigh

## License

MIT