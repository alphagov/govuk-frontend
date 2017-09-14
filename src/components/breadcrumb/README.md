# Breadcrumb

## Introduction

A breadcrumb is a GOV.UK element that helps users to understand where they are within the site and move between levels.

[Preview the breadcrumb component.](http://govuk-frontend-review.herokuapp.com/components/breadcrumb/preview)

## Guidance

More information about when to use breadcrumb can be found on [GOV.UK Design System](http://www.linktodesignsystem.com/breadcrumb "Link to read guidance on the use of breadcrumb on Gov.uk Design system website")

## Quick start examples

    <div class="govuk-c-breadcrumb ">
      <ol class="govuk-c-breadcrumb__list">

          <li class="govuk-c-breadcrumb__list-item">
            <a class="govuk-c-breadcrumb__link" href="/">Home</a>
          </li>

          <li class="govuk-c-breadcrumb__list-item" aria-current="page">Current page</li>

      </ol>
    </div>

## Variants

## Dependencies

To consume the breadcrumb component you must be running npm version 5 or above.

Please note, this component depends on @govuk-frontend/globals and @govuk-frontend/icons, which will automatically be installed with the package.

## Installation

    npm install --save @govuk-frontend/breadcrumb

## Requirements

### Build tool configuration

When compiling the Sass files you'll need to define includePaths to reference the node_modules directory. Below is a sample configuration using gulp

      .pipe(sass({
          includePaths: 'node_modules/'
      }))

### Static asset path configuration

To show the button image you need to configure your app to show these assets. Below is a sample configuration using Express js:

    app.use('/public', express.static(path.join(__dirname, '/node_modules/@govuk-frontend/icons')))

## If you are using Nunjucks

To use a macro, follow the below code example:

    {% from "breadcrumb/macro.njk" import govukBreadcrumb %}

    {{ govukBreadcrumb(
      classes='',
      [
        { title: 'Home', url: '/' },
        { title: 'Current page' }
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

<th class="govuk-c-table__header" scope="row">breadcrumbs</th>

<td class="govuk-c-table__cell ">array</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">Breadcrumbs array with title and url keys</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">title</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">Title of the breadcrumb item</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">url</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Url of the breadcrumb item</td>

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

    npm outdated @govuk-frontend/breadcrumb

To update the latest version run:

    npm update @govuk-frontend/breadcrumb

## Contribution

Guidelines can be found at [on our Github repository.](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md "link to contributing guidelines on our github repository")

## Acknowledgements/credits

*   GDS developers
*   Jani Kraner
*   Gemma Leigh

## License

MIT