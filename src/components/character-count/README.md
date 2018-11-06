# Character count

## Introduction

Help users enter text within a limited number of characters

## Guidance

Find out when to use the character count component in your service in the [GOV.UK Design System](https://design-system.service.gov.uk/components/character-count).

## Quick start examples

### Character count

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/character-count/preview)

#### Markup

    <div class="govuk-character-count" data-module="character-count" data-maxlength="10">

    <div class="govuk-form-group">
      <label class="govuk-label" for="more-detail">
        Can you provide more detail?
      </label>

      <textarea class="govuk-textarea js-character-count " id="more-detail" name="more-detail" rows="5"></textarea>
    </div>

      <span id="more-detail-info" class="govuk-hint govuk-character-count__message" aria-live="polite">
        You can enter up to 10 characters
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
      }
    }) }}

### Character count with hint

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/character-count/with-hint/preview)

#### Markup

    <div class="govuk-character-count" data-module="character-count" data-maxlength="10">

    <div class="govuk-form-group">
      <label class="govuk-label" for="with-hint">
        Can you provide more detail?
      </label>

      <span id="with-hint-hint" class="govuk-hint">
        Don&#39;t include personal or financial information, eg your National Insurance number or credit card details.
      </span>

      <textarea class="govuk-textarea js-character-count " id="with-hint" name="with-hint" rows="5" aria-describedby="with-hint-hint"></textarea>
    </div>

      <span id="with-hint-info" class="govuk-hint govuk-character-count__message" aria-live="polite">
        You can enter up to 10 characters
      </span>
    </div>

#### Macro

    {% from "character-count/macro.njk" import govukCharacterCount %}

    {{ govukCharacterCount({
      "name": "with-hint",
      "id": "with-hint",
      "maxlength": 10,
      "label": {
        "text": "Can you provide more detail?"
      },
      "hint": {
        "text": "Don't include personal or financial information, eg your National Insurance number or credit card details."
      }
    }) }}

### Character count with default value

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/character-count/with-default-value/preview)

#### Markup

    <div class="govuk-character-count" data-module="character-count" data-maxlength="100">

    <div class="govuk-form-group">
      <label class="govuk-label" for="with-default-value">
        Full address
      </label>

      <textarea class="govuk-textarea js-character-count " id="with-default-value" name="default-value" rows="5">221B Baker Street
    London
    NW1 6XE
    </textarea>
    </div>

      <span id="with-default-value-info" class="govuk-hint govuk-character-count__message" aria-live="polite">
        You can enter up to 100 characters
      </span>
    </div>

#### Macro

    {% from "character-count/macro.njk" import govukCharacterCount %}

    {{ govukCharacterCount({
      "id": "with-default-value",
      "name": "default-value",
      "maxlength": 100,
      "label": {
        "text": "Full address"
      },
      "value": "221B Baker Street\nLondon\nNW1 6XE\n"
    }) }}

### Character count with default value exceeding limit

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/character-count/with-default-value-exceeding-limit/preview)

#### Markup

    <div class="govuk-character-count" data-module="character-count" data-maxlength="10">

    <div class="govuk-form-group govuk-form-group--error">
      <label class="govuk-label" for="exceeding-characters">
        Full address
      </label>

      <span id="exceeding-characters-error" class="govuk-error-message">
        Please do not exceed the maximum allowed limit
      </span>

      <textarea class="govuk-textarea govuk-textarea--error js-character-count  govuk-textarea--error" id="exceeding-characters" name="exceeding" rows="5" aria-describedby="exceeding-characters-error">221B Baker Street
    London
    NW1 6XE
    </textarea>
    </div>

      <span id="exceeding-characters-info" class="govuk-hint govuk-character-count__message" aria-live="polite">
        You can enter up to 10 characters
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
        "text": "Please do not exceed the maximum allowed limit"
      }
    }) }}

### Character count with custom rows

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/character-count/with-custom-rows/preview)

#### Markup

    <div class="govuk-character-count" data-module="character-count" data-maxlength="10">

    <div class="govuk-form-group">
      <label class="govuk-label" for="custom-rows">
        Full address
      </label>

      <textarea class="govuk-textarea js-character-count " id="custom-rows" name="custom" rows="8"></textarea>
    </div>

      <span id="custom-rows-info" class="govuk-hint govuk-character-count__message" aria-live="polite">
        You can enter up to 10 characters
      </span>
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

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/character-count/with-label-as-page-heading/preview)

#### Markup

    <div class="govuk-character-count" data-module="character-count" data-maxlength="10">

    <div class="govuk-form-group">
      <h1 class="govuk-label-wrapper">
        <label class="govuk-label" for="textarea-with-page-heading">
          Full address
        </label>

      </h1>

      <textarea class="govuk-textarea js-character-count " id="textarea-with-page-heading" name="address" rows="5"></textarea>
    </div>

      <span id="textarea-with-page-heading-info" class="govuk-hint govuk-character-count__message" aria-live="polite">
        You can enter up to 10 characters
      </span>
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

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/character-count/with-word-count/preview)

#### Markup

    <div class="govuk-character-count" data-module="character-count" data-maxwords="10">

    <div class="govuk-form-group">
      <label class="govuk-label" for="word-count">
        Full address
      </label>

      <textarea class="govuk-textarea js-character-count " id="word-count" name="word-count" rows="5"></textarea>
    </div>

      <span id="word-count-info" class="govuk-hint govuk-character-count__message" aria-live="polite">
        You can enter up to 10 words
      </span>
    </div>

#### Macro

    {% from "character-count/macro.njk" import govukCharacterCount %}

    {{ govukCharacterCount({
      "id": "word-count",
      "name": "word-count",
      "maxwords": 10,
      "label": {
        "text": "Full address"
      }
    }) }}

### Character count with threshold

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/character-count/with-threshold/preview)

#### Markup

    <div class="govuk-character-count" data-module="character-count" data-maxlength="10" data-threshold="75">

    <div class="govuk-form-group">
      <label class="govuk-label" for="with-threshold">
        Full address
      </label>

      <textarea class="govuk-textarea js-character-count " id="with-threshold" name="with-threshold" rows="5"></textarea>
    </div>

      <span id="with-threshold-info" class="govuk-hint govuk-character-count__message" aria-live="polite">
        You can enter up to 10 characters
      </span>
    </div>

#### Macro

    {% from "character-count/macro.njk" import govukCharacterCount %}

    {{ govukCharacterCount({
      "id": "with-threshold",
      "name": "with-threshold",
      "maxlength": 10,
      "threshold": 75,
      "label": {
        "text": "Full address"
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

## Component options

Use options to customise the appearance, content and behaviour of a component when using a macro, for example, changing the text.

See [options table](https://design-system.service.gov.uk/components/character-count/#options-example-default) for details.

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