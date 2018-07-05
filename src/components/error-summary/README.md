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

## Component arguments

If you are using Nunjucks,then macros take the following arguments

**If you’re using Nunjucks macros in production be aware that using `html` arguments, or ones ending with `Html` can be a [security risk](https://en.wikipedia.org/wiki/Cross-site_scripting). More about it in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).**

<table class="govuk-table">

<thead class="govuk-table__head">

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="col">Name</th>

<th class="govuk-table__header" scope="col">Type</th>

<th class="govuk-table__header" scope="col">Required</th>

<th class="govuk-table__header" scope="col">Description</th>

</tr>

</thead>

<tbody class="govuk-table__body">

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">titleText (or) titleHtml</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">Yes</td>

<td class="govuk-table__cell ">Text or HTML to use for the heading of the error summary block. If `titleHtml` is provided, the `titleText` argument will be ignored.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">descriptionText (or) descriptionHtml</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional text or HTML description of the errors. If `descriptionhtml` is provided, the `descriptionText` argument will be ignored.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">errorList</th>

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">Yes</td>

<td class="govuk-table__cell ">Contains an array of error link items and all their available arguments.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">errorList.{}.href</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Href attribute for the error link item. If provided item will be an anchor.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">errorList.{}.text (or) errorList.{}.html</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">Yes</td>

<td class="govuk-table__cell ">Text or HTML for the error link item. If `html` is provided, the `text` argument will be ignored.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">classes</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional additional classes to add to the error-summary container.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">attributes</th>

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Any extra HTML attributes (for example data attributes) to add to the error-summary container.</td>

</tr>

</tbody>

</table>

**If you’re using Nunjucks macros in production be aware that using `html` arguments, or ones ending with `Html` can be a [security risk](https://en.wikipedia.org/wiki/Cross-site_scripting). More about it in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).**

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