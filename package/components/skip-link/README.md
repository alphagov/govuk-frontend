# Skip link

## Introduction

Skip link component. Make skip links visible when they are tabbed to. You'll need to add correct id to your main content area, to ensure the skip link will work.

## Guidance

Find out when to use the skip link component in your service in the [GOV.UK Design System](https://design-system.service.gov.uk/components/skip-link).

## Quick start examples

### Skip link

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/skip-link/preview)

#### Markup

    <a href="#content" class="govuk-skip-link">Skip to main content</a>

#### Macro

    {% from "skip-link/macro.njk" import govukSkipLink %}

    {{ govukSkipLink({
      "text": "Skip to main content",
      "href": "#content"
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

See [options table](https://design-system.service.gov.uk/components/skip-link/#options-example-default) for details.

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