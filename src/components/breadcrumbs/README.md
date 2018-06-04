# Breadcrumbs

## Introduction

The Breadcrumbs component helps users to understand where they are within a website’s structure and move between levels.

## Guidance

Find out when to use the Breadcrumbs component in your service in the [GOV.UK Design System](https://govuk-design-system-production.cloudapps.digital/components/breadcrumbs).

## Quick start examples

### Component default

[Preview the breadcrumbs component](http://govuk-frontend-review.herokuapp.com/components/breadcrumbs/preview)

#### Markup

    <div class="govuk-breadcrumbs">
      <ol class="govuk-breadcrumbs__list">

        <li class="govuk-breadcrumbs__list-item">
          <a class="govuk-breadcrumbs__link" href="/section">Section 1</a>
        </li>

        <li class="govuk-breadcrumbs__list-item">
          <a class="govuk-breadcrumbs__link" href="/section/sub-section">Sub-section</a>
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

    <div class="govuk-breadcrumbs">
      <ol class="govuk-breadcrumbs__list">

        <li class="govuk-breadcrumbs__list-item">
          <a class="govuk-breadcrumbs__link" href="/section">Section 1</a>
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

    <div class="govuk-breadcrumbs">
      <ol class="govuk-breadcrumbs__list">

        <li class="govuk-breadcrumbs__list-item">
          <a class="govuk-breadcrumbs__link" href="/">Home</a>
        </li>

        <li class="govuk-breadcrumbs__list-item">
          <a class="govuk-breadcrumbs__link" href="/section">Section 3</a>
        </li>

        <li class="govuk-breadcrumbs__list-item">
          <a class="govuk-breadcrumbs__link" href="/section/sub-section">Sub-section 1</a>
        </li>

        <li class="govuk-breadcrumbs__list-item">
          <a class="govuk-breadcrumbs__link" href="/section/sub-section/sub-sub-section">Sub Sub-section 1</a>
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

    <div class="govuk-breadcrumbs">
      <ol class="govuk-breadcrumbs__list">

        <li class="govuk-breadcrumbs__list-item">
          <a class="govuk-breadcrumbs__link" href="/service-manual">Service Manual</a>
        </li>

        <li class="govuk-breadcrumbs__list-item">
          <a class="govuk-breadcrumbs__link" href="/service-manual/agile-delivery">Agile Delivery</a>
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

    <div class="govuk-breadcrumbs">
      <ol class="govuk-breadcrumbs__list">

        <li class="govuk-breadcrumbs__list-item">
          <a class="govuk-breadcrumbs__link" href="/">Home</a>
        </li>

        <li class="govuk-breadcrumbs__list-item">
          <a class="govuk-breadcrumbs__link" href="/browse/abroad">Passports, travel and living abroad</a>
        </li>

        <li class="govuk-breadcrumbs__list-item" aria-current="page">Travel abroad</li>

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

<td class="govuk-table__cell">items</td>

<td class="govuk-table__cell ">array</td>

<td class="govuk-table__cell ">Yes</td>

<td class="govuk-table__cell ">Array of breadcrumbs items</td>

</tr>

<tr class="govuk-table__row">

<td class="govuk-table__cell">items[]text</td>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Text to use within the breadcrumbs item</td>

</tr>

<tr class="govuk-table__row">

<td class="govuk-table__cell">items[]safe</td>

<td class="govuk-table__cell ">boolean</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Whether item text can be considered safe. If not safe, it will be escaped.</td>

</tr>

<tr class="govuk-table__row">

<td class="govuk-table__cell">items[]href</td>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">no</td>

<td class="govuk-table__cell ">Link for the breadcrumbs item. If not specified, breadcrumbs item is a normal list item</td>

</tr>

<tr class="govuk-table__row">

<td class="govuk-table__cell">attributes</td>

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Any extra HTML attributes (for example data attributes) to add to the breadcrumbs container.</td>

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