# Label

## Introduction

Use labels for all form fields.

## Quick start examples

### Label

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/label/preview)

#### Markup

    <label class="govuk-label">
      National Insurance number
    </label>

#### Macro

    {% from "label/macro.njk" import govukLabel %}

    {{ govukLabel({
      "text": "National Insurance number"
    }) }}

### Label with bold text

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/label/with-bold-text/preview)

#### Markup

    <label class="govuk-label govuk-label--s">
      National Insurance number
    </label>

#### Macro

    {% from "label/macro.njk" import govukLabel %}

    {{ govukLabel({
      "classes": "govuk-label--s",
      "text": "National Insurance number"
    }) }}

### Label as page heading

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/label/as-page-heading/preview)

#### Markup

    <h1 class="govuk-label-wrapper">
      <label class="govuk-label govuk-label--xl">
        National Insurance number
      </label>

    </h1>

#### Macro

    {% from "label/macro.njk" import govukLabel %}

    {{ govukLabel({
      "text": "National Insurance number",
      "classes": "govuk-label--xl",
      "isPageHeading": true
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

See [options table](https://design-system.service.gov.uk/components/file-upload/#options-example-default--label) for details.

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