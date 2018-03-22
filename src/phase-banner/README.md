# Phase banner

## Introduction

A banner that indicates content is in alpha or beta phase with a description.

## Guidance

Find out when to use the Phase banner component in your service in the [GOV.UK Design System](https://govuk-design-system-production.cloudapps.digital/components/phase-banner).

## Quick start examples

### Component default

[Preview the phase-banner component](http://govuk-frontend-review.herokuapp.com/components/phase-banner/preview)

#### Markup

    <div class="govuk-c-phase-banner">
      <p class="govuk-c-phase-banner__content"><strong class="govuk-c-tag govuk-c-phase-banner__content__tag ">
      alpha
    </strong>
    <span class="govuk-c-phase-banner__text">
          This is a new service - your <a href="#" class="govuk-link">feedback</a> will help us to improve it.
        </span>
      </p>
    </div>

#### Macro

    {% from 'phase-banner/macro.njk' import govukPhaseBanner %}

    {{ govukPhaseBanner({
      "tag": {
        "text": "alpha"
      },
      "html": "This is a new service - your <a href=\"#\" class=\"govuk-link\">feedback</a> will help us to improve it."
    }) }}

## Dependencies

To consume the phase-banner component you must be running npm version 5 or above.

## Installation

    npm install --save @govuk-frontend/phase-banner

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

<th class="govuk-c-table__header" scope="row">text</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Text for teh phase-banner message.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">html</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">HTML to use for the phase-banner message. If this is provided, the text argument will be ignored.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">tag</th>

<td class="govuk-c-table__cell ">object</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Arguments for the tag object. Can contain text or html.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">attributes</th>

<td class="govuk-c-table__cell ">object</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Any extra HTML attributes (for example data attributes) to add to the phase banner container.</td>

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

    npm outdated @govuk-frontend/phase-banner

To update the latest version run:

    npm update @govuk-frontend/phase-banner

## Contribution

Guidelines can be found at [on our Github repository.](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md "link to contributing guidelines on our github repository")

## License

MIT