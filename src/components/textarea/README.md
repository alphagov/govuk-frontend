# Textarea

## Introduction

A multi-line text field.

## Guidance

Find out when to use the textarea component in your service in the [GOV.UK Design System](https://design-system.service.gov.uk/components/textarea).

## Quick start examples

### Component default

[Preview the textarea component](http://govuk-frontend-review.herokuapp.com/components/textarea/preview)

#### Markup

    <div class="govuk-form-group">
      <label class="govuk-label" for="more-detail">
        Can you provide more detail?
      </label>

      <span id="more-detail-hint" class="govuk-hint">
        Don&#39;t include personal or financial information, eg your National Insurance number or credit card details.
      </span>

      <textarea class="govuk-textarea" id="more-detail" name="more-detail" rows="5" aria-describedby="more-detail-hint"></textarea>
    </div>

#### Macro

    {% from "textarea/macro.njk" import govukTextarea %}

    {{ govukTextarea({
      "name": "more-detail",
      "id": "more-detail",
      "label": {
        "text": "Can you provide more detail?"
      },
      "hint": {
        "text": "Don't include personal or financial information, eg your National Insurance number or credit card details."
      }
    }) }}

### Textarea with error message

[Preview the Textarea with error message example](http://govuk-frontend-review.herokuapp.com/components/textarea/with-error-message/preview)

#### Markup

    <div class="govuk-form-group govuk-form-group--error">
      <label class="govuk-label" for="no-ni-reason">
        Why can&#39;t you provide a National Insurance number?
      </label>

      <span id="no-ni-reason-error" class="govuk-error-message">
        You must provide an explanation
      </span>

      <textarea class="govuk-textarea govuk-textarea--error" id="no-ni-reason" name="no-ni-reason" rows="5" aria-describedby="no-ni-reason-error"></textarea>
    </div>

#### Macro

    {% from "textarea/macro.njk" import govukTextarea %}

    {{ govukTextarea({
      "name": "no-ni-reason",
      "id": "no-ni-reason",
      "label": {
        "text": "Why can't you provide a National Insurance number?"
      },
      "errorMessage": {
        "text": "You must provide an explanation"
      }
    }) }}

### Textarea with default value

[Preview the Textarea with default value example](http://govuk-frontend-review.herokuapp.com/components/textarea/with-default-value/preview)

#### Markup

    <div class="govuk-form-group">
      <label class="govuk-label" for="full-address">
        Full address
      </label>

      <textarea class="govuk-textarea" id="full-address" name="address" rows="5">221B Baker Street
    London
    NW1 6XE
    </textarea>
    </div>

#### Macro

    {% from "textarea/macro.njk" import govukTextarea %}

    {{ govukTextarea({
      "id": "full-address",
      "name": "address",
      "value": "221B Baker Street\nLondon\nNW1 6XE\n",
      "label": {
        "text": "Full address"
      }
    }) }}

### Textarea with custom rows

[Preview the Textarea with custom rows example](http://govuk-frontend-review.herokuapp.com/components/textarea/with-custom-rows/preview)

#### Markup

    <div class="govuk-form-group">
      <label class="govuk-label" for="full-address">
        Full address
      </label>

      <textarea class="govuk-textarea" id="full-address" name="address" rows="8"></textarea>
    </div>

#### Macro

    {% from "textarea/macro.njk" import govukTextarea %}

    {{ govukTextarea({
      "id": "full-address",
      "name": "address",
      "label": {
        "text": "Full address"
      },
      "rows": 8
    }) }}

### Textarea with label as page heading

[Preview the Textarea with label as page heading example](http://govuk-frontend-review.herokuapp.com/components/textarea/with-label-as-page-heading/preview)

#### Markup

    <div class="govuk-form-group">
      <h1 class="govuk-label-wrapper">
        <label class="govuk-label" for="textarea-with-page-heading">
          Full address
        </label>

      </h1>

      <textarea class="govuk-textarea" id="textarea-with-page-heading" name="address" rows="5"></textarea>
    </div>

#### Macro

    {% from "textarea/macro.njk" import govukTextarea %}

    {{ govukTextarea({
      "id": "textarea-with-page-heading",
      "name": "address",
      "label": {
        "text": "Full address",
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

<th class="govuk-table__header" scope="row">id</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">Yes</td>

<td class="govuk-table__cell ">The id of the textarea</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">describedBy</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Text or element id to add to the `aria-describedby` attribute to provide description for screenreader users.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">name</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">Yes</td>

<td class="govuk-table__cell ">The name of the textarea, which is submitted with the form data.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">rows</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional number of textarea rows (default is 5 rows).</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">value</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional initial value of the textarea.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">label</th>

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">Yes</td>

<td class="govuk-table__cell ">Arguments for the label component. See label component.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">hint</th>

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Arguments for the hint component (e.g. text). See hint component.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">errorMessage</th>

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Arguments for the errorMessage component (e.g. text). See errorMessage component.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">classes</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional additional classes to add to the textarea tag.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">attributes</th>

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Any extra HTML attributes (for example data attributes) to add to the textarea tag.</td>

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