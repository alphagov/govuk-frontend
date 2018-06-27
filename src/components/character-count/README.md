# Character count

## Introduction

Help users enter text within a limited number of characters

## Guidance

Find out when to use the character count component in your service in the [GOV.UK Design System](https://design-system.service.gov.uk/components/character-count).

## Quick start examples

### Component default

[Preview the character count component](http://govuk-frontend-review.herokuapp.com/components/character-count/preview)

#### Markup

    <div class="govuk-form-group">

      <label class="govuk-label" for="more-detail">
        Can you provide more detail?
      </label>
      <textarea data-module="character-count" class="govuk-character-count" id="more-detail" name="more-detail" rows="5" maxlength="10"" aria-describedby="more-detail-info"></textarea>

        <span id="more-detail-info" class="govuk-hint govuk-character-count__message ">
        You have 10 characters remaining
      </span>

    </div>

#### Macro

    {% from "character-count/macro.njk" import govukCharacterCount %}

    {{ govukCharacterCount({
      "name": "more-detail",
      "id": "more-detail",
      "maxlength": 10,
      "label": {
        "text": "Can you provide more detail?"
      },
      "hint": {
        "text": "You have 10 characters remaining"
      }
    }) }}

### Character count with highlight

[Preview the Character count with highlight example](http://govuk-frontend-review.herokuapp.com/components/character-count/with-highlight/preview)

#### Markup

    <div class="govuk-form-group">

      <label class="govuk-label" for="with-highlight">
        Can you provide more detail?
      </label>
      <textarea data-module="character-count" class="govuk-character-count" id="with-highlight" name="highlight" rows="5" maxlength="10"" aria-describedby="with-highlight-info" data-highlight="true"></textarea>

        <span id="with-highlight-info" class="govuk-hint govuk-character-count__message ">
        You have 10 characters remaining
      </span>

    </div>

#### Macro

    {% from "character-count/macro.njk" import govukCharacterCount %}

    {{ govukCharacterCount({
      "id": "with-highlight",
      "name": "highlight",
      "maxlength": 10,
      "label": {
        "text": "Can you provide more detail?"
      },
      "hint": {
        "text": "You have 10 characters remaining"
      },
      "attributes": {
        "data-highlight": true
      }
    }) }}

### Character count with default value

[Preview the Character count with default value example](http://govuk-frontend-review.herokuapp.com/components/character-count/with-default-value/preview)

#### Markup

    <div class="govuk-form-group">

      <label class="govuk-label" for="with-default-value">
        Full address
      </label>
      <textarea data-module="character-count" class="govuk-character-count" id="with-default-value" name="default-value" rows="5" maxlength="100"" aria-describedby="with-default-value-info">221B Baker Street
    London
    NW1 6XE
    </textarea>

        <span id="with-default-value-info" class="govuk-hint govuk-character-count__message ">
        You have 67 characters remaining
      </span>

    </div>

#### Macro

    {% from "character-count/macro.njk" import govukCharacterCount %}

    {{ govukCharacterCount({
      "id": "with-default-value",
      "name": "default-value",
      "maxlength": 100,
      "value": "221B Baker Street\nLondon\nNW1 6XE\n",
      "label": {
        "text": "Full address"
      },
      "hint": {
        "text": "You have 67 characters remaining"
      }
    }) }}

### Character count with default value exceeding limit

[Preview the Character count with default value exceeding limit example](http://govuk-frontend-review.herokuapp.com/components/character-count/with-default-value-exceeding-limit/preview)

#### Markup

    <div class="govuk-form-group govuk-form-group--error">

      <label class="govuk-label" for="exceeding-characters">
        Full address
      </label>
      <textarea data-module="character-count" class="govuk-character-count govuk-character-count--error" id="exceeding-characters" name="exceeding" rows="5" maxlength="10"" aria-describedby="exceeding-characters-info" data-highlight="true">221B Baker Street
    London
    NW1 6XE
    </textarea>

        <span id="exceeding-characters-info" class="govuk-error-message govuk-character-count__message ">
        You have 23 characters too many
      </span>

    </div>

#### Macro

    {% from "character-count/macro.njk" import govukCharacterCount %}

    {{ govukCharacterCount({
      "id": "exceeding-characters",
      "name": "exceeding",
      "maxlength": 10,
      "value": "221B Baker Street\nLondon\nNW1 6XE\n",
      "label": {
        "text": "Full address"
      },
      "errorMessage": {
        "text": "You have 23 characters too many"
      },
      "attributes": {
        "data-highlight": true
      }
    }) }}

### Character count with custom rows

[Preview the Character count with custom rows example](http://govuk-frontend-review.herokuapp.com/components/character-count/with-custom-rows/preview)

#### Markup

    <div class="govuk-form-group">

      <label class="govuk-label" for="custom-rows">
        Full address
      </label>
      <textarea data-module="character-count" class="govuk-character-count" id="custom-rows" name="custom" rows="8" maxlength="10""></textarea>

    </div>

#### Macro

    {% from "character-count/macro.njk" import govukCharacterCount %}

    {{ govukCharacterCount({
      "id": "custom-rows",
      "name": "custom",
      "maxlength": 10,
      "label": {
        "text": "Full address"
      },
      "rows": 8
    }) }}

### Character count with label as page heading

[Preview the Character count with label as page heading example](http://govuk-frontend-review.herokuapp.com/components/character-count/with-label-as-page-heading/preview)

#### Markup

    <div class="govuk-form-group">

      <h1 class="govuk-label-wrapper">
        <label class="govuk-label" for="textarea-with-page-heading">
          Full address
        </label>

      </h1>
      <textarea data-module="character-count" class="govuk-character-count" id="textarea-with-page-heading" name="address" rows="5" maxlength="10""></textarea>

    </div>

#### Macro

    {% from "character-count/macro.njk" import govukCharacterCount %}

    {{ govukCharacterCount({
      "id": "textarea-with-page-heading",
      "name": "address",
      "maxlength": 10,
      "label": {
        "text": "Full address",
        "isPageHeading": true
      }
    }) }}

### Character count with word count

[Preview the Character count with word count example](http://govuk-frontend-review.herokuapp.com/components/character-count/with-word-count/preview)

#### Markup

    <div class="govuk-form-group">

      <label class="govuk-label" for="word-count">
        Full address
      </label>
      <textarea data-module="character-count" class="govuk-character-count" id="word-count" name="word-count" rows="5" maxlength="10"" data-maxwords="10"></textarea>

    </div>

#### Macro

    {% from "character-count/macro.njk" import govukCharacterCount %}

    {{ govukCharacterCount({
      "id": "word-count",
      "name": "word-count",
      "maxlength": 10,
      "label": {
        "text": "Full address"
      },
      "attributes": {
        "data-maxwords": 10
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