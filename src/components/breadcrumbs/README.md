# Breadcrumbs

## Introduction

The Breadcrumbs component helps users to understand where they are within a website’s structure and move between levels.

## Guidance

Find out when to use the breadcrumbs component in your service in the [GOV.UK Design System](https://design-system.service.gov.uk/components/breadcrumbs).

## Quick start examples

### Breadcrumbs

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/breadcrumbs/preview)

#### Markup

    <div class="govuk-breadcrumbs">
      <ol class="govuk-breadcrumbs__list">

        <li class="govuk-breadcrumbs__list-item">
          <a class="govuk-breadcrumbs__link" href="/section">Section</a>
        </li>

        <li class="govuk-breadcrumbs__list-item">
          <a class="govuk-breadcrumbs__link" href="/section/sub-section">Sub-section</a>
        </li>

      </ol>
    </div>

#### Macro

    {% from "breadcrumbs/macro.njk" import govukBreadcrumbs %}

    {{ govukBreadcrumbs({
      "items": [
        {
          "text": "Section",
          "href": "/section"
        },
        {
          "text": "Sub-section",
          "href": "/section/sub-section"
        }
      ]
    }) }}

### Breadcrumbs with one level

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/breadcrumbs/with-one-level/preview)

#### Markup

    <div class="govuk-breadcrumbs">
      <ol class="govuk-breadcrumbs__list">

        <li class="govuk-breadcrumbs__list-item">
          <a class="govuk-breadcrumbs__link" href="/section">Section</a>
        </li>

      </ol>
    </div>

#### Macro

    {% from "breadcrumbs/macro.njk" import govukBreadcrumbs %}

    {{ govukBreadcrumbs({
      "items": [
        {
          "text": "Section",
          "href": "/section"
        }
      ]
    }) }}

### Breadcrumbs with multiple levels

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/breadcrumbs/with-multiple-levels/preview)

#### Markup

    <div class="govuk-breadcrumbs">
      <ol class="govuk-breadcrumbs__list">

        <li class="govuk-breadcrumbs__list-item">
          <a class="govuk-breadcrumbs__link" href="/">Home</a>
        </li>

        <li class="govuk-breadcrumbs__list-item">
          <a class="govuk-breadcrumbs__link" href="/section">Section</a>
        </li>

        <li class="govuk-breadcrumbs__list-item">
          <a class="govuk-breadcrumbs__link" href="/section/sub-section">Sub-section</a>
        </li>

        <li class="govuk-breadcrumbs__list-item">
          <a class="govuk-breadcrumbs__link" href="/section/sub-section/sub-sub-section">Sub Sub-section</a>
        </li>

      </ol>
    </div>

#### Macro

    {% from "breadcrumbs/macro.njk" import govukBreadcrumbs %}

    {{ govukBreadcrumbs({
      "items": [
        {
          "text": "Home",
          "href": "/"
        },
        {
          "text": "Section",
          "href": "/section"
        },
        {
          "text": "Sub-section",
          "href": "/section/sub-section"
        },
        {
          "text": "Sub Sub-section",
          "href": "/section/sub-section/sub-sub-section"
        }
      ]
    }) }}

### Breadcrumbs without the home section

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/breadcrumbs/without-the-home-section/preview)

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

    {% from "breadcrumbs/macro.njk" import govukBreadcrumbs %}

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

### Breadcrumbs with last breadcrumb as current page

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/breadcrumbs/with-last-breadcrumb-as-current-page/preview)

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

    {% from "breadcrumbs/macro.njk" import govukBreadcrumbs %}

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

    app.use('/assets', express.static(path.join(__dirname, '/node_modules/govuk-frontend/assets')))

## Component options

Use options to customise the appearance, content and behaviour of a component when using a macro, for example, changing the text.

See [options table](https://design-system.service.gov.uk/components/breadcrumbs/#options-example-default) for details.

### Setting up Nunjucks views and paths

Below is an example setup using express configure views:

    nunjucks.configure('node_modules/govuk-frontend/components', {
      autoescape: true,
      cache: false,
      express: app
    })

## Contribution

Guidelines can be found at [on our Github repository.](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md "link to contributing guidelines on our github repository")

## License

MIT