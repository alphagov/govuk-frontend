# Tag

## Introduction

Phase tags are mostly used inside phase banners as an indication of the state of a project. It’s possible to use them outside phase banners, for example as part of a service header.

## Guidance

Find out when to use the tag component in your service in the [GOV.UK Design System](https://design-system.service.gov.uk/components/tag).

## Quick start examples

### Tag

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/tag/preview)

#### Markup

    <strong class="govuk-tag">
      alpha
    </strong>

#### Macro

    {% from "tag/macro.njk" import govukTag %}

    {{ govukTag({
      "text": "alpha"
    }) }}

### Tag inactive

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/tag/inactive/preview)

#### Markup

    <strong class="govuk-tag govuk-tag--inactive">
      alpha
    </strong>

#### Macro

    {% from "tag/macro.njk" import govukTag %}

    {{ govukTag({
      "text": "alpha",
      "classes": "govuk-tag--inactive"
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

See [options table](https://design-system.service.gov.uk/components/tag/#options-example-default) for details.

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