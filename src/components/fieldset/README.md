# Fieldset

## Introduction

The fieldset element is used to group several controls within a web form. The legend element represents a caption for the content of its parent fieldset.

## Guidance

Find out when to use the fieldset component in your service in the [GOV.UK Design System](https://design-system.service.gov.uk/components/fieldset).

## Quick start examples

### Component default

[Preview the fieldset component](http://govuk-frontend-review.herokuapp.com/components/fieldset/preview)

#### Markup

    <fieldset class="govuk-fieldset">

      <legend class="govuk-fieldset__legend">
        What is your address?
      </legend>

    </fieldset>

#### Macro

    {% from 'fieldset/macro.njk' import govukFieldset %}

    {{ govukFieldset({
      "legend": {
        "text": "What is your address?"
      }
    }) }}

### Fieldset--as page heading

[Preview the fieldset--as page heading example](http://govuk-frontend-review.herokuapp.com/components/fieldset/as page heading/preview)

#### Markup

    <fieldset class="govuk-fieldset">

      <legend class="govuk-fieldset__legend govuk-fieldset__legend--xl">
        <h1 class="govuk-fieldset__heading">
          What is your address?
        </h1>
      </legend>

    </fieldset>

#### Macro

    {% from 'fieldset/macro.njk' import govukFieldset %}

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

<th class="govuk-table__header" scope="row">describedBy</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Text or element id to add to the `aria-describedby` attribute to provide description of the group of fields for screenreader users.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">legend</th>

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Arguments for the legend</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">legend.{}.text (or) legend.{}.html</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Legend text or HTML. If `html` is provided, the `text` argument will be ignored.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">legend.{}.classes</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional additional classes to add to the legend container.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">legend.{}.isPageHeading</th>

<td class="govuk-table__cell ">boolean</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Whether the legend also acts as the heading for the page.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">classes</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional additional classes to add to the fieldset container.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">attributes</th>

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Any extra HTML attributes (for example data attributes) to add to the fieldset container.</td>

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