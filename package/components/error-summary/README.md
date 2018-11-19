# Error summary

## Introduction

Component to show an error summary box - used at the top of the page, to summarise validation errors.

## Guidance

Find out when to use the error summary component in your service in the [GOV.UK Design System](https://design-system.service.gov.uk/components/error-summary).

## Quick start examples

### Error summary

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/error-summary/preview)

#### Markup

    <div class="govuk-error-summary optional-extra-class" aria-labelledby="error-summary-title" role="alert" tabindex="-1" data-module="error-summary">
      <h2 class="govuk-error-summary__title" id="error-summary-title">
        Message to alert the user to a problem goes here
      </h2>
      <div class="govuk-error-summary__body">

        <p>
          Optional description of the errors and how to correct them
        </p>

        <ul class="govuk-list govuk-error-summary__list">

          <li>

            <a href="#example-error-1">Descriptive link to the question with an error</a>

          </li>

          <li>

            <a href="#example-error-1">Descriptive link to the question with an error</a>

          </li>

        </ul>
      </div>
    </div>

#### Macro

    {% from "error-summary/macro.njk" import govukErrorSummary %}

    {{ govukErrorSummary({
      "titleText": "Message to alert the user to a problem goes here",
      "descriptionText": "Optional description of the errors and how to correct them",
      "classes": "optional-extra-class",
      "errorList": [
        {
          "text": "Descriptive link to the question with an error",
          "href": "#example-error-1"
        },
        {
          "text": "Descriptive link to the question with an error",
          "href": "#example-error-1"
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

See [options table](https://design-system.service.gov.uk/components/error-summary/#options-example-default) for details.

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