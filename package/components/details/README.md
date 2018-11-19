# Details

## Introduction

Component for conditionally revealing content, using the details HTML element.

## Guidance

Find out when to use the details component in your service in the [GOV.UK Design System](https://design-system.service.gov.uk/components/details).

## Quick start examples

### Details

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/details/preview)

#### Markup

    <details class="govuk-details">
      <summary class="govuk-details__summary">
        <span class="govuk-details__summary-text">
          Help with nationality
        </span>
      </summary>
      <div class="govuk-details__text">
        We need to know your nationality so we can work out which elections you’re entitled to vote in. If you can’t provide your nationality, you’ll have to send copies of identity documents through the post.
      </div>
    </details>

#### Macro

    {% from "details/macro.njk" import govukDetails %}

    {{ govukDetails({
      "summaryText": "Help with nationality",
      "text": "We need to know your nationality so we can work out which elections you’re entitled to vote in. If you can’t provide your nationality, you’ll have to send copies of identity documents through the post."
    }) }}

### Details expanded

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/details/expanded/preview)

#### Markup

    <details id="help-with-nationality" class="govuk-details" open>
      <summary class="govuk-details__summary">
        <span class="govuk-details__summary-text">
          Help with nationality
        </span>
      </summary>
      <div class="govuk-details__text">
        We need to know your nationality so we can work out which elections you’re entitled to vote in. If you can’t provide your nationality, you’ll have to send copies of identity documents through the post.
      </div>
    </details>

#### Macro

    {% from "details/macro.njk" import govukDetails %}

    {{ govukDetails({
      "id": "help-with-nationality",
      "summaryText": "Help with nationality",
      "text": "We need to know your nationality so we can work out which elections you’re entitled to vote in. If you can’t provide your nationality, you’ll have to send copies of identity documents through the post.",
      "open": true
    }) }}

### Details with html

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/details/with-html/preview)

#### Markup

    <details class="govuk-details">
      <summary class="govuk-details__summary">
        <span class="govuk-details__summary-text">
          Where to find your National Insurance Number
        </span>
      </summary>
      <div class="govuk-details__text">
        Your National Insurance number can be found on
    <ul>
      <li>your National Insurance card</li>
      <li>your payslip</li>
      <li>P60</li>
      <li>benefits information</li>
      <li>tax return</li>
    </ul>

      </div>
    </details>

#### Macro

    {% from "details/macro.njk" import govukDetails %}

    {{ govukDetails({
      "summaryText": "Where to find your National Insurance Number",
      "html": "Your National Insurance number can be found on\n<ul>\n  <li>your National Insurance card</li>\n  <li>your payslip</li>\n  <li>P60</li>\n  <li>benefits information</li>\n  <li>tax return</li>\n</ul>\n"
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

See [options table](https://design-system.service.gov.uk/components/details/#options-example-default) for details.

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