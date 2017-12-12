# Breadcrumb

## Introduction

A breadcrumb is a GOV.UK element that helps users to understand where they are within the site and move between levels.

## Guidance

More information about when to use breadcrumb can be found on [GOV.UK Design System](http://www.linktodesignsystem.com/breadcrumb "Link to read guidance on the use of breadcrumb on Gov.uk Design system website")

## Quick start examples

### Component default

[Preview the breadcrumb component](http://govuk-frontend-review.herokuapp.com/components/breadcrumb/preview)

#### Markup

    <div class="govuk-c-breadcrumb">
      <ol class="govuk-c-breadcrumb__list">

        <li class="govuk-c-breadcrumb__list-item">
          <a class="govuk-c-breadcrumb__link" href="/section">Section 1</a>
        </li>

        <li class="govuk-c-breadcrumb__list-item">
          <a class="govuk-c-breadcrumb__link" href="/section/sub-section">Sub-section</a>
        </li>

      </ol>
    </div>

#### Macro

    {{ govukBreadcrumb({
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

### Breadcrumb--single-section

[Preview the breadcrumb--single-section variant](http://govuk-frontend-review.herokuapp.com/components/breadcrumb/single-section/preview)

#### Markup

    <div class="govuk-c-breadcrumb">
      <ol class="govuk-c-breadcrumb__list">

        <li class="govuk-c-breadcrumb__list-item">
          <a class="govuk-c-breadcrumb__link" href="/section">Section 1</a>
        </li>

      </ol>
    </div>

#### Macro

    {{ govukBreadcrumb({
      "items": [
        {
          "text": "Section 1",
          "href": "/section"
        }
      ]
    }) }}

### Breadcrumb--many-breadcrumbs

[Preview the breadcrumb--many-breadcrumbs variant](http://govuk-frontend-review.herokuapp.com/components/breadcrumb/many-breadcrumbs/preview)

#### Markup

    <div class="govuk-c-breadcrumb">
      <ol class="govuk-c-breadcrumb__list">

        <li class="govuk-c-breadcrumb__list-item">
          <a class="govuk-c-breadcrumb__link" href="/">Home</a>
        </li>

        <li class="govuk-c-breadcrumb__list-item">
          <a class="govuk-c-breadcrumb__link" href="/section">Section 3</a>
        </li>

        <li class="govuk-c-breadcrumb__list-item">
          <a class="govuk-c-breadcrumb__link" href="/section/sub-section">Sub-section 1</a>
        </li>

        <li class="govuk-c-breadcrumb__list-item">
          <a class="govuk-c-breadcrumb__link" href="/section/sub-section/sub-sub-section">Sub Sub-section 1</a>
        </li>

      </ol>
    </div>

#### Macro

    {{ govukBreadcrumb({
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

### Breadcrumb--no-home-section

[Preview the breadcrumb--no-home-section variant](http://govuk-frontend-review.herokuapp.com/components/breadcrumb/no-home-section/preview)

#### Markup

    <div class="govuk-c-breadcrumb">
      <ol class="govuk-c-breadcrumb__list">

        <li class="govuk-c-breadcrumb__list-item">
          <a class="govuk-c-breadcrumb__link" href="/service-manual">Service Manual</a>
        </li>

        <li class="govuk-c-breadcrumb__list-item">
          <a class="govuk-c-breadcrumb__link" href="/service-manual/agile-delivery">Agile Delivery</a>
        </li>

      </ol>
    </div>

#### Macro

    {{ govukBreadcrumb({
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

### Breadcrumb--last-breadcrumb-is-current-page

[Preview the breadcrumb--last-breadcrumb-is-current-page variant](http://govuk-frontend-review.herokuapp.com/components/breadcrumb/last-breadcrumb-is-current-page/preview)

#### Markup

    <div class="govuk-c-breadcrumb">
      <ol class="govuk-c-breadcrumb__list">

        <li class="govuk-c-breadcrumb__list-item">
          <a class="govuk-c-breadcrumb__link" href="/">Home</a>
        </li>

        <li class="govuk-c-breadcrumb__list-item">
          <a class="govuk-c-breadcrumb__link" href="/browse/abroad">Passports, travel and living abroad</a>
        </li>

        <li class="govuk-c-breadcrumb__list-item" aria-current="page">Travel abroad</li>

      </ol>
    </div>

#### Macro

    {{ govukBreadcrumb({
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

<th class="govuk-c-table__header" scope="row">items</th>

<td class="govuk-c-table__cell ">array</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">Array of breadcrumb items</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">text</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Text to use within the breadcrumb item</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">html</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">HTML to use within the breadcrumb item. If this is provided, the text argument will be ignored.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">href</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">no</td>

<td class="govuk-c-table__cell ">Link for the breadcrumb item. If not specified, breadcrumb item is a normal list item</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">attributes</th>

<td class="govuk-c-table__cell ">object</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Any extra HTML attributes (for example data attributes) to add to the breadcrumb container.</td>

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

## License

MIT