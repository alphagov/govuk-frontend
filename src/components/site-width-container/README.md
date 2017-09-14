# Site width container

## Introduction

A container set to the width of the site (960px) and its margins.

[Preview the site-width-container component.](http://govuk-frontend-review.herokuapp.com/components/site-width-container/preview)

## Guidance

More information about when to use site-width-container can be found on [GOV.UK Design System](http://www.linktodesignsystem.com/site-width-container "Link to read guidance on the use of site-width-container on Gov.uk Design system website")

## Quick start examples

    <div class="govuk-c-site-width-container ">

    </div>

## Variants

## Dependencies

To consume the site-width-container component you must be running npm version 5 or above.

## Installation

    npm install --save @govuk-frontend/site-width-container

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

    {% from "site-width-container/macro.njk" import govukSiteWidthContainer %}

    {{ govukSiteWidthContainer(classes) }}

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

    npm outdated @govuk-frontend/site-width-container

To update the latest version run:

    npm update @govuk-frontend/site-width-container

## Contribution

Guidelines can be found at [on our Github repository.](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md "link to contributing guidelines on our github repository")

## Acknowledgements/credits

*   GDS developers
*   Jani Kraner
*   Gemma Leigh

## License

MIT