# Breadcrumbs

## Introduction

The Breadcrumbs component helps users to understand where they are within a website’s structure and move between levels.

## Guidance

Find out when to use the Breadcrumbs component in your service in the [GOV.UK Design System](https://govuk-design-system-production.cloudapps.digital/components/breadcrumbs).

## Quick start examples

### Component default

[Preview the breadcrumbs component](http://govuk-frontend-review.herokuapp.com/components/breadcrumbs/preview)

#### Markup

    <div class="govuk-c-breadcrumbs">
      <ol class="govuk-c-breadcrumbs__list">

        <li class="govuk-c-breadcrumbs__list-item">
          <a class="govuk-c-breadcrumbs__link" href="/section">Section 1</a>
        </li>

        <li class="govuk-c-breadcrumbs__list-item">
          <a class="govuk-c-breadcrumbs__link" href="/section/sub-section">Sub-section</a>
        </li>

      </ol>
    </div>

#### Macro

    {% from 'breadcrumbs/macro.njk' import govukBreadcrumbs %}

    {{ govukBreadcrumbs({
      "items": [
        {
          "text": "Section 1",
          "href": "/section"
        },
        {
          "text": "Sub-section",
          "href": "/section/sub-section"
        }
      ]
    }) }}

### Breadcrumbs--single-section

[Preview the breadcrumbs--single-section example](http://govuk-frontend-review.herokuapp.com/components/breadcrumbs/single-section/preview)

#### Markup

    <div class="govuk-c-breadcrumbs">
      <ol class="govuk-c-breadcrumbs__list">

        <li class="govuk-c-breadcrumbs__list-item">
          <a class="govuk-c-breadcrumbs__link" href="/section">Section 1</a>
        </li>

      </ol>
    </div>

#### Macro

    {% from 'breadcrumbs/macro.njk' import govukBreadcrumbs %}

    {{ govukBreadcrumbs({
      "items": [
        {
          "text": "Section 1",
          "href": "/section"
        }
      ]
    }) }}

### Breadcrumbs--many-breadcrumbs

[Preview the breadcrumbs--many-breadcrumbs example](http://govuk-frontend-review.herokuapp.com/components/breadcrumbs/many-breadcrumbs/preview)

#### Markup

    <div class="govuk-c-breadcrumbs">
      <ol class="govuk-c-breadcrumbs__list">

        <li class="govuk-c-breadcrumbs__list-item">
          <a class="govuk-c-breadcrumbs__link" href="/">Home</a>
        </li>

        <li class="govuk-c-breadcrumbs__list-item">
          <a class="govuk-c-breadcrumbs__link" href="/section">Section 3</a>
        </li>

        <li class="govuk-c-breadcrumbs__list-item">
          <a class="govuk-c-breadcrumbs__link" href="/section/sub-section">Sub-section 1</a>
        </li>

        <li class="govuk-c-breadcrumbs__list-item">
          <a class="govuk-c-breadcrumbs__link" href="/section/sub-section/sub-sub-section">Sub Sub-section 1</a>
        </li>

      </ol>
    </div>

#### Macro

    {% from 'breadcrumbs/macro.njk' import govukBreadcrumbs %}

    {{ govukBreadcrumbs({
      "items": [
        {
          "text": "Home",
          "href": "/"
        },
        {
          "text": "Section 3",
          "href": "/section"
        },
        {
          "text": "Sub-section 1",
          "href": "/section/sub-section"
        },
        {
          "text": "Sub Sub-section 1",
          "href": "/section/sub-section/sub-sub-section"
        }
      ]
    }) }}

### Breadcrumbs--no-home-section

[Preview the breadcrumbs--no-home-section example](http://govuk-frontend-review.herokuapp.com/components/breadcrumbs/no-home-section/preview)

#### Markup

    <div class="govuk-c-breadcrumbs">
      <ol class="govuk-c-breadcrumbs__list">

        <li class="govuk-c-breadcrumbs__list-item">
          <a class="govuk-c-breadcrumbs__link" href="/service-manual">Service Manual</a>
        </li>

        <li class="govuk-c-breadcrumbs__list-item">
          <a class="govuk-c-breadcrumbs__link" href="/service-manual/agile-delivery">Agile Delivery</a>
        </li>

      </ol>
    </div>

#### Macro

    {% from 'breadcrumbs/macro.njk' import govukBreadcrumbs %}

    {{ govukBreadcrumbs({
      "items": [
        {
          "text": "Service Manual",
          "href": "/service-manual"
        },
        {
          "text": "Agile Delivery",
          "href": "/service-manual/agile-delivery"
        }
      ]
    }) }}

### Breadcrumbs--last-breadcrumb-is-current-page

[Preview the breadcrumbs--last-breadcrumb-is-current-page example](http://govuk-frontend-review.herokuapp.com/components/breadcrumbs/last-breadcrumb-is-current-page/preview)

#### Markup

    <div class="govuk-c-breadcrumbs">
      <ol class="govuk-c-breadcrumbs__list">

        <li class="govuk-c-breadcrumbs__list-item">
          <a class="govuk-c-breadcrumbs__link" href="/">Home</a>
        </li>

        <li class="govuk-c-breadcrumbs__list-item">
          <a class="govuk-c-breadcrumbs__link" href="/browse/abroad">Passports, travel and living abroad</a>
        </li>

        <li class="govuk-c-breadcrumbs__list-item" aria-current="page">Travel abroad</li>

      </ol>
    </div>

#### Macro

    {% from 'breadcrumbs/macro.njk' import govukBreadcrumbs %}

    {{ govukBreadcrumbs({
      "items": [
        {
          "text": "Home",
          "href": "/"
        },
        {
          "text": "Passports, travel and living abroad",
          "href": "/browse/abroad"
        },
        {
          "text": "Travel abroad"
        }
      ]
    }) }}

## Dependencies

To consume the breadcrumbs component you must be running npm version 5 or above.

Please note, this component depends on @govuk-frontend/globals and @govuk-frontend/icons, which will automatically be installed with the package.

## Installation

    npm install --save @govuk-frontend/breadcrumbs

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

<th class="govuk-c-table__header" scope="row">items</th>

<td class="govuk-c-table__cell ">array</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">Array of breadcrumbs items</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">text</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Text to use within the breadcrumbs item</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">html</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">HTML to use within the breadcrumbs item. If this is provided, the text argument will be ignored.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">href</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">no</td>

<td class="govuk-c-table__cell ">Link for the breadcrumbs item. If not specified, breadcrumbs item is a normal list item</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">attributes</th>

<td class="govuk-c-table__cell ">object</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Any extra HTML attributes (for example data attributes) to add to the breadcrumbs container.</td>

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

    npm outdated @govuk-frontend/breadcrumbs

To update the latest version run:

    npm update @govuk-frontend/breadcrumbs

## Contribution

Guidelines can be found at [on our Github repository.](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md "link to contributing guidelines on our github repository")

## License

MIT