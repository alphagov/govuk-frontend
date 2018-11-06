# Panel

## Introduction

The confirmation panel has a turquoise background and white text. Used for transaction end pages, and Bank Holidays.

## Guidance

Find out when to use the panel component in your service in the [GOV.UK Design System](https://design-system.service.gov.uk/components/panel).

## Quick start examples

### Panel

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/panel/preview)

#### Markup

    <div class="govuk-panel govuk-panel--confirmation">
      <h1 class="govuk-panel__title">
        Application complete
      </h1>

      <div class="govuk-panel__body">
        Your reference number: HDJ2123F
      </div>

    </div>

#### Macro

    {% from "panel/macro.njk" import govukPanel %}

    {{ govukPanel({
      "titleHtml": "Application complete",
      "text": "Your reference number: HDJ2123F"
    }) }}

### Panel custom heading level

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/panel/custom-heading-level/preview)

#### Markup

    <div class="govuk-panel govuk-panel--confirmation">
      <h2 class="govuk-panel__title">
        Application complete
      </h2>

      <div class="govuk-panel__body">
        Your reference number: HDJ2123F
      </div>

    </div>

#### Macro

    {% from "panel/macro.njk" import govukPanel %}

    {{ govukPanel({
      "titleText": "Application complete",
      "headingLevel": 2,
      "text": "Your reference number: HDJ2123F"
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

See [options table](https://design-system.service.gov.uk/components/panel/#options-example-default) for details.

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