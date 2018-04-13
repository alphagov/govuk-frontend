# Tag

## Introduction

Phase tags are mostly used inside phase banners as an indication of the state of a project. It’s possible to use them outside phase banners, for example as part of a service header.

## Guidance

Find out when to use the Tag component in your service in the [GOV.UK Design System](https://govuk-design-system-production.cloudapps.digital/components/tag).

## Quick start examples

### Component default

[Preview the tag component](http://govuk-frontend-review.herokuapp.com/components/tag/preview)

#### Markup

    <strong class="govuk-tag">
      alpha
    </strong>

#### Macro

    {% from 'tag/macro.njk' import govukTag %}

    {{ govukTag({
      "text": "alpha"
    }) }}

### Tag--inactive

[Preview the tag--inactive example](http://govuk-frontend-review.herokuapp.com/components/tag/inactive/preview)

#### Markup

    <strong class="govuk-tag govuk-tag--inactive">
      alpha
    </strong>

#### Macro

    {% from 'tag/macro.njk' import govukTag %}

    {{ govukTag({
      "text": "alpha",
      "classes": "govuk-tag--inactive"
    }) }}

## Dependencies

To consume the tag component you must be running npm version 5 or above.

## Installation

    npm install --save @govuk-frontend/tag

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

<td class="govuk-table__cell ">Text for the tag component.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">html</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">HTML to use within for the tag component. If this is provided, the text argument will be ignored.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">attributes</th>

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Any extra HTML attributes (for example data attributes) to add to the tag container.</td>

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

    npm outdated @govuk-frontend/tag

To update the latest version run:

    npm update @govuk-frontend/tag

## Contribution

Guidelines can be found at [on our Github repository.](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md "link to contributing guidelines on our github repository")

## License

MIT