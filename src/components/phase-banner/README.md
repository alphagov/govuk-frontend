# Phase banner

## Introduction

A banner that indicates content is in alpha or beta phase with a description.

## Guidance

Find out when to use the Phase banner component in your service in the [GOV.UK Design System](https://govuk-design-system-production.cloudapps.digital/components/phase-banner).

## Quick start examples

### Component default

[Preview the phase-banner component](http://govuk-frontend-review.herokuapp.com/components/phase-banner/preview)

#### Markup

    <div class="govuk-phase-banner">
      <p class="govuk-phase-banner__content">

      <strong class="govuk-tag govuk-phase-banner__content__tag ">
      alpha
    </strong>
    <span class="govuk-phase-banner__text">
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
      "text": "This is a new service - your <a href=\"#\" class=\"govuk-link\">feedback</a> will help us to improve it.",
      "safe": true
    }) }}

## Requirements

### Build tool configuration

When compiling the Sass files you'll need to define includePaths to reference the node_modules directory. Below is a sample configuration using gulp

    .pipe(sass({
      includePaths: 'node_modules/'
    }))

### Static asset path configuration

In order to include the images used in the components, you need to configure your app to show these assets. Below is a sample configuration using Express js:

    app.use('/assets', express.static(path.join(__dirname, '/node_modules/@govuk-frontend/frontend/assets')))

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

<td class="govuk-table__cell">classes</td>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional additional classes</td>

</tr>

<tr class="govuk-table__row">

<td class="govuk-table__cell">text</td>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Text for teh phase-banner message.</td>

</tr>

<tr class="govuk-table__row">

<td class="govuk-table__cell">safe</td>

<td class="govuk-table__cell ">boolean</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Whether title text can be considered safe. If not safe, it will be escaped.</td>

</tr>

<tr class="govuk-table__row">

<td class="govuk-table__cell">tag</td>

<td class="govuk-table__cell ">object or string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Arguments for the tag. See tag component.</td>

</tr>

<tr class="govuk-table__row">

<td class="govuk-table__cell">attributes</td>

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Any extra HTML attributes (for example data attributes) to add to the phase banner container.</td>

</tr>

</tbody>

</table>

### Setting up Nunjucks views and paths

Below is an example setup using express configure views:

    nunjucks.configure('node_modules/@govuk-frontend/frontend/components', {
      autoescape: true,
      cache: false,
      express: app
    })

## Contribution

Guidelines can be found at [on our Github repository.](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md "link to contributing guidelines on our github repository")

## License

MIT