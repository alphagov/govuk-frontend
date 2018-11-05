# Phase banner

## Introduction

A banner that indicates content is in alpha or beta phase with a description.

## Guidance

Find out when to use the phase banner component in your service in the [GOV.UK Design System](https://design-system.service.gov.uk/components/phase-banner).

## Quick start examples

### Phase banner

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/phase-banner/preview)

#### Markup

    <div class="govuk-phase-banner">
      <p class="govuk-phase-banner__content"><strong class="govuk-tag govuk-phase-banner__content__tag ">
      alpha
    </strong>
    <span class="govuk-phase-banner__text">
          This is a new service - your <a href="#" class="govuk-link">feedback</a> will help us to improve it.
        </span>
      </p>
    </div>

#### Macro

    {% from "phase-banner/macro.njk" import govukPhaseBanner %}

    {{ govukPhaseBanner({
      "tag": {
        "text": "alpha"
      },
      "html": "This is a new service - your <a href=\"#\" class=\"govuk-link\">feedback</a> will help us to improve it."
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

See [options table](https://design-system.service.gov.uk/components/phase-banner/#options-example-default) for details.

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