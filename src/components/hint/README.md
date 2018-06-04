# Hint

## Introduction

Use hint text for supporting contextual help

## Quick start examples

### Component default

[Preview the hint component](http://govuk-frontend-review.herokuapp.com/components/hint/preview)

#### Markup

    <span class="govuk-hint">
      It’s on your National Insurance card, benefit letter, payslip or P60\. For example, ‘QQ 12 34 56 C’.
    </span>

#### Macro

    {% from 'hint/macro.njk' import govukHint %}

    {{ govukHint({
      "text": "It’s on your National Insurance card, benefit letter, payslip or P60\. For example, ‘QQ 12 34 56 C’."
    }) }}

### Hint--with html

[Preview the hint--with html example](http://govuk-frontend-review.herokuapp.com/components/hint/with html/preview)

#### Markup

    <span class="govuk-hint">
      It’s on your National Insurance card, benefit letter, payslip or <a class="govuk-link" href="#">P60</a>. For example, ‘QQ 12 34 56 C’.
    </span>

#### Macro

    {% from 'hint/macro.njk' import govukHint %}

    {{ govukHint({
      "text": "It’s on your National Insurance card, benefit letter, payslip or <a class=\"govuk-link\" href=\"#\">P60</a>. For example, ‘QQ 12 34 56 C’.",
      "safe": true
    }) }}

## Requirements

### Build tool configuration

When compiling the Sass files you'll need to define includePaths to reference the node_modules directory. Below is a sample configuration using gulp

    .pipe(sass({
      includePaths: 'node_modules/'
    }))

### Static asset path configuration

In order to include the images used in the components, you need to configure your app to show these assets. Below is a sample configuration using Express js:

    app.use('/assets', express.static(path.join(__dirname, '/node_modules/@govuk-frontend/frontend/assets')))

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

<td class="govuk-table__cell">classes</td>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional additional classes</td>

</tr>

<tr class="govuk-table__row">

<td class="govuk-table__cell">id</td>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">Yes</td>

<td class="govuk-table__cell ">The id of the hint</td>

</tr>

<tr class="govuk-table__row">

<td class="govuk-table__cell">text</td>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Text to use within the hint</td>

</tr>

<tr class="govuk-table__row">

<td class="govuk-table__cell">safe</td>

<td class="govuk-table__cell ">boolean</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Whether text argument can be considered safe. If not safe, it will be escaped.</td>

</tr>

<tr class="govuk-table__row">

<td class="govuk-table__cell">attributes</td>

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Any extra HTML attributes (for example data attributes) to add to the hint span tag.</td>

</tr>

</tbody>

</table>

### Setting up Nunjucks views and paths

Below is an example setup using express configure views:

    nunjucks.configure('node_modules/@govuk-frontend/frontend/components', {
      autoescape: true,
      cache: false,
      express: app
    })

## Contribution

Guidelines can be found at [on our Github repository.](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md "link to contributing guidelines on our github repository")

## License

MIT