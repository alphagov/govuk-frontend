# Hint

## Introduction

Use hint text for supporting contextual help

## Quick start examples

### Hint

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/hint/preview)

#### Markup

    <span class="govuk-hint">
      It’s on your National Insurance card, benefit letter, payslip or P60.
    For example, ‘QQ 12 34 56 C’.

    </span>

#### Macro

    {% from "hint/macro.njk" import govukHint %}

    {{ govukHint({
      "text": "It’s on your National Insurance card, benefit letter, payslip or P60.\nFor example, ‘QQ 12 34 56 C’.\n"
    }) }}

### Hint with html

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/hint/with-html/preview)

#### Markup

    <span class="govuk-hint">
      It’s on your National Insurance card, benefit letter, payslip or <a class="govuk-link" href="#">P60</a>.
    For example, ‘QQ 12 34 56 C’.

    </span>

#### Macro

    {% from "hint/macro.njk" import govukHint %}

    {{ govukHint({
      "html": "It’s on your National Insurance card, benefit letter, payslip or <a class=\"govuk-link\" href=\"#\">P60</a>.\nFor example, ‘QQ 12 34 56 C’.\n"
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

See [options table](https://design-system.service.gov.uk/components/file-upload/#options-example-default--hint) for details.

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