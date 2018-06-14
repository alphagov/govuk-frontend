# Inset text

## Introduction

Use bordered inset text to draw attention to important content on the page.

## Quick start examples

### Component default

[Preview the inset-text component](http://govuk-frontend-review.herokuapp.com/components/inset-text/preview)

#### Markup

    <div class="govuk-inset-text">
      It can take up to 8 weeks to register a lasting power of attorney if there are no mistakes in the application.
    </div>

#### Macro

    {% from 'inset-text/macro.njk' import govukInsetText %}

    {{ govukInsetText({
      "text": "It can take up to 8 weeks to register a lasting power of attorney if there are no mistakes in the application."
    }) }}

### Inset-text--with html

[Preview the inset-text--with html example](http://govuk-frontend-review.herokuapp.com/components/inset-text/with html/preview)

#### Markup

    <div class="govuk-inset-text">
      It can take up to 8 weeks to register a <a class="govuk-link" href="#">lasting power of attorney</a> if there are no mistakes in the application.
    </div>

#### Macro

    {% from 'inset-text/macro.njk' import govukInsetText %}

    {{ govukInsetText({
      "html": "It can take up to 8 weeks to register a <a class=\"govuk-link\" href=\"#\">lasting power of attorney</a> if there are no mistakes in the application."
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

<th class="govuk-table__header" scope="row">text (or) html</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">Yes</td>

<td class="govuk-table__cell ">Text or HTML to use within the inset text. If `html` is provided, the `text` argument will be ignored.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">id</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional id attribute to add to the inset text container.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">classes</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional additional classes to add to the inset text container.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">attributes</th>

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Any extra HTML attributes (for example data attributes) to add to the inset text container.</td>

</tr>

</tbody>

</table>

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