# Select

## Introduction

The HTML `<select>` element represents a control that provides a menu of options.

## Guidance

Find out when to use the select component in your service in the [GOV.UK Design System](https://design-system.service.gov.uk/components/select).

## Quick start examples

### Select

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/select/preview)

#### Markup

    <div class="govuk-form-group">
      <label class="govuk-label" for="select-1">
        Label text goes here
      </label>

      <select class="govuk-select" id="select-1" name="select-1">

        <option value="1">GOV.UK frontend option 1</option>

        <option value="2" selected>GOV.UK frontend option 2</option>

        <option value="3" disabled>GOV.UK frontend option 3</option>

      </select>
    </div>

#### Macro

    {% from "select/macro.njk" import govukSelect %}

    {{ govukSelect({
      "id": "select-1",
      "name": "select-1",
      "label": {
        "text": "Label text goes here"
      },
      "items": [
        {
          "value": 1,
          "text": "GOV.UK frontend option 1"
        },
        {
          "value": 2,
          "text": "GOV.UK frontend option 2",
          "selected": true
        },
        {
          "value": 3,
          "text": "GOV.UK frontend option 3",
          "disabled": true
        }
      ]
    }) }}

### Select with hint text and error message

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/select/with-hint-text-and-error-message/preview)

#### Markup

    <div class="govuk-form-group govuk-form-group--error">
      <label class="govuk-label" for="select-2">
        Label text goes here
      </label>

      <span id="select-2-hint" class="govuk-hint">
        Hint text goes here
      </span>

      <span id="select-2-error" class="govuk-error-message">
        Error message goes here
      </span>

      <select class="govuk-select govuk-select--error" id="select-2" name="select-2" aria-describedby="select-2-hint select-2-error">

        <option value="1">GOV.UK frontend option 1</option>

        <option value="2">GOV.UK frontend option 2</option>

        <option value="3">GOV.UK frontend option 3</option>

      </select>
    </div>

#### Macro

    {% from "select/macro.njk" import govukSelect %}

    {{ govukSelect({
      "id": "select-2",
      "name": "select-2",
      "label": {
        "text": "Label text goes here"
      },
      "hint": {
        "text": "Hint text goes here"
      },
      "errorMessage": {
        "text": "Error message goes here"
      },
      "items": [
        {
          "value": 1,
          "text": "GOV.UK frontend option 1"
        },
        {
          "value": 2,
          "text": "GOV.UK frontend option 2"
        },
        {
          "value": 3,
          "text": "GOV.UK frontend option 3"
        }
      ]
    }) }}

### Select with label as page heading

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/select/with-label-as-page-heading/preview)

#### Markup

    <div class="govuk-form-group">
      <h1 class="govuk-label-wrapper">
        <label class="govuk-label" for="select-3">
          Label text goes here
        </label>

      </h1>

      <select class="govuk-select" id="select-3" name="select-3">

        <option value="1">GOV.UK frontend option 1</option>

        <option value="2" selected>GOV.UK frontend option 2</option>

        <option value="3" disabled>GOV.UK frontend option 3</option>

      </select>
    </div>

#### Macro

    {% from "select/macro.njk" import govukSelect %}

    {{ govukSelect({
      "id": "select-3",
      "name": "select-3",
      "label": {
        "text": "Label text goes here",
        "isPageHeading": true
      },
      "items": [
        {
          "value": 1,
          "text": "GOV.UK frontend option 1"
        },
        {
          "value": 2,
          "text": "GOV.UK frontend option 2",
          "selected": true
        },
        {
          "value": 3,
          "text": "GOV.UK frontend option 3",
          "disabled": true
        }
      ]
    }) }}

### Select with full width override

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/select/with-full-width-override/preview)

#### Markup

    <div class="govuk-form-group">
      <label class="govuk-label" for="select-1">
        Label text goes here
      </label>

      <select class="govuk-select govuk-!-width-full" id="select-1" name="select-1">

        <option value="1">GOV.UK frontend option 1</option>

        <option value="2" selected>GOV.UK frontend option 2</option>

        <option value="3" disabled>GOV.UK frontend option 3</option>

      </select>
    </div>

#### Macro

    {% from "select/macro.njk" import govukSelect %}

    {{ govukSelect({
      "id": "select-1",
      "name": "select-1",
      "classes": "govuk-!-width-full",
      "label": {
        "text": "Label text goes here"
      },
      "items": [
        {
          "value": 1,
          "text": "GOV.UK frontend option 1"
        },
        {
          "value": 2,
          "text": "GOV.UK frontend option 2",
          "selected": true
        },
        {
          "value": 3,
          "text": "GOV.UK frontend option 3",
          "disabled": true
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

<th class="govuk-table__header" scope="row">id</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">Yes</td>

<td class="govuk-table__cell ">Id for each select box</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">name</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">Yes</td>

<td class="govuk-table__cell ">Name property for the select.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">items</th>

<td class="govuk-table__cell ">array</td>

<td class="govuk-table__cell ">Yes</td>

<td class="govuk-table__cell ">Array of option items for the select.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">item.value</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Value for the option item.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">item.text</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">Yes</td>

<td class="govuk-table__cell ">Text for the option item.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">item.selected</th>

<td class="govuk-table__cell ">boolean</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Sets the option as the selected.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">item.disabled</th>

<td class="govuk-table__cell ">boolean</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Sets the option item as disabled.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">item.attributes</th>

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Any extra HTML attributes (for example data attributes) to the select option tag.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">label</th>

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional label text or HTML by specifying value for either text or html keys. See <a href="../label/README.md#component-arguments">label</a> component.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">hint</th>

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Arguments for the hint component (e.g. text). See <a href="../hint/README.md#component-arguments">hint</a> component.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">errorMessage</th>

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Arguments for the errorMessage component (e.g. text). See <a href="../error-message/README.md#component-arguments">errorMessage</a> component.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">classes</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional additional classes to add to the select component.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">attributes</th>

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Any extra HTML attributes (for example data attributes) to add to the select component.</td>

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