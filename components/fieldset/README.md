# Fieldset

## Introduction

The fieldset element is used to group several controls within a web form. The legend element represents a caption for the content of its parent fieldset.

## Guidance

Find out when to use the fieldset component in your service in the [GOV.UK Design System](https://design-system.service.gov.uk/components/fieldset).

## Quick start examples

### Fieldset

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/fieldset/preview)

#### Markup

    <fieldset class="govuk-fieldset">

      <legend class="govuk-fieldset__legend">
        What is your address?
      </legend>

    </fieldset>

#### Macro

    {% from "fieldset/macro.njk" import govukFieldset %}

    {{ govukFieldset({
      "legend": {
        "text": "What is your address?"
      }
    }) }}

### Fieldset as page heading

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/fieldset/as-page-heading/preview)

#### Markup

    <fieldset class="govuk-fieldset">

      <legend class="govuk-fieldset__legend govuk-fieldset__legend--xl">
        <h1 class="govuk-fieldset__heading">
          What is your address?
        </h1>
      </legend>

    </fieldset>

#### Macro

    {% from "fieldset/macro.njk" import govukFieldset %}

    {{ govukFieldset({
      "legend": {
        "text": "What is your address?",
        "classes": "govuk-fieldset__legend--xl",
        "isPageHeading": true
      }
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

See [options table](https://design-system.service.gov.uk/components/fieldset/#options-example-default) for details.

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