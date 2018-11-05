# Checkboxes

## Introduction

Let users select one or more options.

## Guidance

Find out when to use the checkboxes component in your service in the [GOV.UK Design System](https://design-system.service.gov.uk/components/checkboxes).

## Quick start examples

### Checkboxes

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/checkboxes/preview)

#### Markup

    <div class="govuk-form-group">

      <fieldset class="govuk-fieldset" aria-describedby="nationality-hint">

      <legend class="govuk-fieldset__legend">
        What is your nationality?
      </legend>

      <span id="nationality-hint" class="govuk-hint">
        If you have dual nationality, select all options that are relevant to you.
      </span>

      <div class="govuk-checkboxes">

        <div class="govuk-checkboxes__item">
          <input class="govuk-checkboxes__input" id="nationality-1" name="nationality" type="checkbox" value="british">
          <label class="govuk-label govuk-checkboxes__label" for="nationality-1">
            British
          </label>
        </div>

        <div class="govuk-checkboxes__item">
          <input class="govuk-checkboxes__input" id="nationality-2" name="nationality" type="checkbox" value="irish">
          <label class="govuk-label govuk-checkboxes__label" for="nationality-2">
            Irish
          </label>
        </div>

        <div class="govuk-checkboxes__item">
          <input class="govuk-checkboxes__input" id="nationality-3" name="nationality" type="checkbox" value="other">
          <label class="govuk-label govuk-checkboxes__label" for="nationality-3">
            Citizen of another country
          </label>
        </div>

      </div>
      </fieldset>

    </div>

#### Macro

    {% from "checkboxes/macro.njk" import govukCheckboxes %}

    {{ govukCheckboxes({
      "idPrefix": "nationality",
      "name": "nationality",
      "fieldset": {
        "legend": {
          "text": "What is your nationality?"
        }
      },
      "hint": {
        "text": "If you have dual nationality, select all options that are relevant to you."
      },
      "items": [
        {
          "value": "british",
          "text": "British"
        },
        {
          "value": "irish",
          "text": "Irish"
        },
        {
          "value": "other",
          "text": "Citizen of another country"
        }
      ]
    }) }}

### Checkboxes with id and name

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/checkboxes/with-id-and-name/preview)

#### Markup

    <div class="govuk-form-group">

      <fieldset class="govuk-fieldset" aria-describedby="undefined-hint">

      <legend class="govuk-fieldset__legend">
        What is your nationality?
      </legend>

      <span id="undefined-hint" class="govuk-hint">
        If you have dual nationality, select all options that are relevant to you.
      </span>

      <div class="govuk-checkboxes">

        <div class="govuk-checkboxes__item">
          <input class="govuk-checkboxes__input" id="item_british" name="british" type="checkbox" value="yes">
          <label class="govuk-label govuk-checkboxes__label" for="item_british">
            British
          </label>
        </div>

        <div class="govuk-checkboxes__item">
          <input class="govuk-checkboxes__input" id="item_irish" name="irish" type="checkbox" value="irish">
          <label class="govuk-label govuk-checkboxes__label" for="item_irish">
            Irish
          </label>
        </div>

      </div>
      </fieldset>

    </div>

#### Macro

    {% from "checkboxes/macro.njk" import govukCheckboxes %}

    {{ govukCheckboxes({
      "fieldset": {
        "legend": {
          "text": "What is your nationality?"
        }
      },
      "hint": {
        "text": "If you have dual nationality, select all options that are relevant to you."
      },
      "items": [
        {
          "name": "british",
          "id": "item_british",
          "value": "yes",
          "text": "British"
        },
        {
          "name": "irish",
          "id": "item_irish",
          "value": "irish",
          "text": "Irish"
        }
      ]
    }) }}

### Checkboxes with hints on items

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/checkboxes/with-hints-on-items/preview)

#### Markup

    <div class="govuk-form-group">

      <fieldset class="govuk-fieldset">

      <legend class="govuk-fieldset__legend">
        <h1 class="govuk-fieldset__heading">
          How do you want to sign in?
        </h1>
      </legend>

      <div class="govuk-checkboxes">

        <div class="govuk-checkboxes__item">
          <input class="govuk-checkboxes__input" id="government-gateway" name="gateway" type="checkbox" value="gov-gateway" aria-describedby="government-gateway-item-hint">
          <label class="govuk-label govuk-checkboxes__label" for="government-gateway">
            Sign in with Government Gateway
          </label>
          <span id="government-gateway-item-hint" class="govuk-hint govuk-checkboxes__hint">
            You’ll have a user ID if you’ve registered for Self Assessment or filed a tax return online before.
          </span>
        </div>

        <div class="govuk-checkboxes__item">
          <input class="govuk-checkboxes__input" id="govuk-verify" name="verify" type="checkbox" value="gov-verify" aria-describedby="govuk-verify-item-hint">
          <label class="govuk-label govuk-checkboxes__label" for="govuk-verify">
            Sign in with GOV.UK Verify
          </label>
          <span id="govuk-verify-item-hint" class="govuk-hint govuk-checkboxes__hint">
            You’ll have an account if you’ve already proved your identity with either Barclays, CitizenSafe, Digidentity, Experian, Post Office, Royal Mail or SecureIdentity.
          </span>
        </div>

      </div>
      </fieldset>

    </div>

#### Macro

    {% from "checkboxes/macro.njk" import govukCheckboxes %}

    {{ govukCheckboxes({
      "fieldset": {
        "legend": {
          "text": "How do you want to sign in?",
          "isPageHeading": true
        }
      },
      "items": [
        {
          "name": "gateway",
          "id": "government-gateway",
          "value": "gov-gateway",
          "text": "Sign in with Government Gateway",
          "hint": {
            "text": "You’ll have a user ID if you’ve registered for Self Assessment or filed a tax return online before."
          }
        },
        {
          "name": "verify",
          "id": "govuk-verify",
          "value": "gov-verify",
          "text": "Sign in with GOV.UK Verify",
          "hint": {
            "text": "You’ll have an account if you’ve already proved your identity with either Barclays, CitizenSafe, Digidentity, Experian, Post Office, Royal Mail or SecureIdentity."
          }
        }
      ]
    }) }}

### Checkboxes with disabled item

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/checkboxes/with-disabled-item/preview)

#### Markup

    <div class="govuk-form-group">

      <div class="govuk-checkboxes">

        <div class="govuk-checkboxes__item">
          <input class="govuk-checkboxes__input" id="colours-1" name="colours" type="checkbox" value="red">
          <label class="govuk-label govuk-checkboxes__label" for="colours-1">
            Red
          </label>
        </div>

        <div class="govuk-checkboxes__item">
          <input class="govuk-checkboxes__input" id="colours-2" name="colours" type="checkbox" value="green">
          <label class="govuk-label govuk-checkboxes__label" for="colours-2">
            Green
          </label>
        </div>

        <div class="govuk-checkboxes__item">
          <input class="govuk-checkboxes__input" id="colours-3" name="colours" type="checkbox" value="blue" disabled>
          <label class="govuk-label govuk-checkboxes__label" for="colours-3">
            Blue
          </label>
        </div>

      </div>

    </div>

#### Macro

    {% from "checkboxes/macro.njk" import govukCheckboxes %}

    {{ govukCheckboxes({
      "name": "colours",
      "items": [
        {
          "value": "red",
          "text": "Red"
        },
        {
          "value": "green",
          "text": "Green"
        },
        {
          "value": "blue",
          "text": "Blue",
          "disabled": true
        }
      ]
    }) }}

### Checkboxes with legend as a page heading

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/checkboxes/with-legend-as-a-page-heading/preview)

#### Markup

    <div class="govuk-form-group">

      <fieldset class="govuk-fieldset" aria-describedby="waste-hint">

      <legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
        <h1 class="govuk-fieldset__heading">
          Which types of waste do you transport regularly?
        </h1>
      </legend>

      <span id="waste-hint" class="govuk-hint">
        Select all that apply
      </span>

      <div class="govuk-checkboxes">

        <div class="govuk-checkboxes__item">
          <input class="govuk-checkboxes__input" id="waste-1" name="waste" type="checkbox" value="animal">
          <label class="govuk-label govuk-checkboxes__label" for="waste-1">
            Waste from animal carcasses
          </label>
        </div>

        <div class="govuk-checkboxes__item">
          <input class="govuk-checkboxes__input" id="waste-2" name="waste" type="checkbox" value="mines">
          <label class="govuk-label govuk-checkboxes__label" for="waste-2">
            Waste from mines or quarries
          </label>
        </div>

        <div class="govuk-checkboxes__item">
          <input class="govuk-checkboxes__input" id="waste-3" name="waste" type="checkbox" value="farm">
          <label class="govuk-label govuk-checkboxes__label" for="waste-3">
            Farm or agricultural waste
          </label>
        </div>

      </div>
      </fieldset>

    </div>

#### Macro

    {% from "checkboxes/macro.njk" import govukCheckboxes %}

    {{ govukCheckboxes({
      "name": "waste",
      "fieldset": {
        "legend": {
          "text": "Which types of waste do you transport regularly?",
          "classes": "govuk-fieldset__legend--l",
          "isPageHeading": true
        }
      },
      "hint": {
        "text": "Select all that apply"
      },
      "items": [
        {
          "value": "animal",
          "text": "Waste from animal carcasses"
        },
        {
          "value": "mines",
          "text": "Waste from mines or quarries"
        },
        {
          "value": "farm",
          "text": "Farm or agricultural waste"
        }
      ]
    }) }}

### Checkboxes with a medium legend

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/checkboxes/with-a-medium-legend/preview)

#### Markup

    <div class="govuk-form-group govuk-form-group--error">

      <fieldset class="govuk-fieldset" aria-describedby="waste-hint waste-error">

      <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
        Which types of waste do you transport regularly?
      </legend>

      <span id="waste-hint" class="govuk-hint">
        Select all that apply
      </span>

      <span id="waste-error" class="govuk-error-message">
        Select which types of waste you transport regularly
      </span>

      <div class="govuk-checkboxes">

        <div class="govuk-checkboxes__item">
          <input class="govuk-checkboxes__input" id="waste-1" name="waste" type="checkbox" value="animal">
          <label class="govuk-label govuk-checkboxes__label" for="waste-1">
            Waste from animal carcasses
          </label>
        </div>

        <div class="govuk-checkboxes__item">
          <input class="govuk-checkboxes__input" id="waste-2" name="waste" type="checkbox" value="mines">
          <label class="govuk-label govuk-checkboxes__label" for="waste-2">
            Waste from mines or quarries
          </label>
        </div>

        <div class="govuk-checkboxes__item">
          <input class="govuk-checkboxes__input" id="waste-3" name="waste" type="checkbox" value="farm">
          <label class="govuk-label govuk-checkboxes__label" for="waste-3">
            Farm or agricultural waste
          </label>
        </div>

      </div>
      </fieldset>

    </div>

#### Macro

    {% from "checkboxes/macro.njk" import govukCheckboxes %}

    {{ govukCheckboxes({
      "name": "waste",
      "fieldset": {
        "legend": {
          "text": "Which types of waste do you transport regularly?",
          "classes": "govuk-fieldset__legend--m"
        }
      },
      "hint": {
        "text": "Select all that apply"
      },
      "errorMessage": {
        "text": "Select which types of waste you transport regularly"
      },
      "items": [
        {
          "value": "animal",
          "text": "Waste from animal carcasses"
        },
        {
          "value": "mines",
          "text": "Waste from mines or quarries"
        },
        {
          "value": "farm",
          "text": "Farm or agricultural waste"
        }
      ]
    }) }}

### Checkboxes without fieldset

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/checkboxes/without-fieldset/preview)

#### Markup

    <div class="govuk-form-group">

      <div class="govuk-checkboxes">

        <div class="govuk-checkboxes__item">
          <input class="govuk-checkboxes__input" id="colours-1" name="colours" type="checkbox" value="red">
          <label class="govuk-label govuk-checkboxes__label" for="colours-1">
            Red
          </label>
        </div>

        <div class="govuk-checkboxes__item">
          <input class="govuk-checkboxes__input" id="colours-2" name="colours" type="checkbox" value="green">
          <label class="govuk-label govuk-checkboxes__label" for="colours-2">
            Green
          </label>
        </div>

        <div class="govuk-checkboxes__item">
          <input class="govuk-checkboxes__input" id="colours-3" name="colours" type="checkbox" value="blue">
          <label class="govuk-label govuk-checkboxes__label" for="colours-3">
            Blue
          </label>
        </div>

      </div>

    </div>

#### Macro

    {% from "checkboxes/macro.njk" import govukCheckboxes %}

    {{ govukCheckboxes({
      "name": "colours",
      "items": [
        {
          "value": "red",
          "text": "Red"
        },
        {
          "value": "green",
          "text": "Green"
        },
        {
          "value": "blue",
          "text": "Blue"
        }
      ]
    }) }}

### Checkboxes with single option set aria-describeby on input

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/checkboxes/with-single-option-set-aria-describeby-on-input/preview)

#### Markup

    <div class="govuk-form-group govuk-form-group--error">

      <span id="colours-error" class="govuk-error-message">
        Please select an option
      </span>

      <div class="govuk-checkboxes">

        <div class="govuk-checkboxes__item">
          <input class="govuk-checkboxes__input" id="colours-1" name="colours" type="checkbox" value="red" aria-describedby="colours-error">
          <label class="govuk-label govuk-checkboxes__label" for="colours-1">
            Red
          </label>
        </div>

      </div>

    </div>

#### Macro

    {% from "checkboxes/macro.njk" import govukCheckboxes %}

    {{ govukCheckboxes({
      "name": "colours",
      "errorMessage": {
        "text": "Please select an option"
      },
      "items": [
        {
          "value": "red",
          "text": "Red"
        }
      ]
    }) }}

### Checkboxes with all fieldset attributes

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/checkboxes/with-all-fieldset-attributes/preview)

#### Markup

    <div class="govuk-form-group govuk-form-group--error">

      <fieldset class="govuk-fieldset app-fieldset--custom-modifier" aria-describedby="example-hint example-error" data-attribute="value" data-second-attribute="second-value">

      <legend class="govuk-fieldset__legend">
        What is your nationality?
      </legend>

      <span id="example-hint" class="govuk-hint">
        If you have dual nationality, select all options that are relevant to you.
      </span>

      <span id="example-error" class="govuk-error-message">
        Please select an option
      </span>

      <div class="govuk-checkboxes">

        <div class="govuk-checkboxes__item">
          <input class="govuk-checkboxes__input" id="example-1" name="example" type="checkbox" value="british">
          <label class="govuk-label govuk-checkboxes__label" for="example-1">
            British
          </label>
        </div>

        <div class="govuk-checkboxes__item">
          <input class="govuk-checkboxes__input" id="example-2" name="example" type="checkbox" value="irish">
          <label class="govuk-label govuk-checkboxes__label" for="example-2">
            Irish
          </label>
        </div>

        <div class="govuk-checkboxes__item">
          <input class="govuk-checkboxes__input" id="example-3" name="example" type="checkbox" value="other">
          <label class="govuk-label govuk-checkboxes__label" for="example-3">
            Citizen of another country
          </label>
        </div>

      </div>
      </fieldset>

    </div>

#### Macro

    {% from "checkboxes/macro.njk" import govukCheckboxes %}

    {{ govukCheckboxes({
      "idPrefix": "example",
      "name": "example",
      "fieldset": {
        "classes": "app-fieldset--custom-modifier",
        "attributes": {
          "data-attribute": "value",
          "data-second-attribute": "second-value"
        },
        "legend": {
          "text": "What is your nationality?"
        }
      },
      "hint": {
        "text": "If you have dual nationality, select all options that are relevant to you."
      },
      "errorMessage": {
        "text": "Please select an option"
      },
      "items": [
        {
          "value": "british",
          "text": "British"
        },
        {
          "value": "irish",
          "text": "Irish"
        },
        {
          "value": "other",
          "text": "Citizen of another country"
        }
      ]
    }) }}

### Checkboxes with error message

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/checkboxes/with-error-message/preview)

#### Markup

    <div class="govuk-form-group govuk-form-group--error">

      <fieldset class="govuk-fieldset" aria-describedby="waste-error">

      <legend class="govuk-fieldset__legend">
        Which types of waste do you transport regularly?
      </legend>

      <span id="waste-error" class="govuk-error-message">
        Please select an option
      </span>

      <div class="govuk-checkboxes">

        <div class="govuk-checkboxes__item">
          <input class="govuk-checkboxes__input" id="waste-1" name="waste" type="checkbox" value="animal">
          <label class="govuk-label govuk-checkboxes__label" for="waste-1">
            Waste from animal carcasses
          </label>
        </div>

        <div class="govuk-checkboxes__item">
          <input class="govuk-checkboxes__input" id="waste-2" name="waste" type="checkbox" value="mines">
          <label class="govuk-label govuk-checkboxes__label" for="waste-2">
            Waste from mines or quarries
          </label>
        </div>

        <div class="govuk-checkboxes__item">
          <input class="govuk-checkboxes__input" id="waste-3" name="waste" type="checkbox" value="farm">
          <label class="govuk-label govuk-checkboxes__label" for="waste-3">
            Farm or agricultural waste
          </label>
        </div>

      </div>
      </fieldset>

    </div>

#### Macro

    {% from "checkboxes/macro.njk" import govukCheckboxes %}

    {{ govukCheckboxes({
      "name": "waste",
      "errorMessage": {
        "text": "Please select an option"
      },
      "fieldset": {
        "legend": {
          "text": "Which types of waste do you transport regularly?"
        }
      },
      "items": [
        {
          "value": "animal",
          "text": "Waste from animal carcasses"
        },
        {
          "value": "mines",
          "text": "Waste from mines or quarries"
        },
        {
          "value": "farm",
          "text": "Farm or agricultural waste"
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

<th class="govuk-table__header" scope="row">fieldset</th>

<td class="govuk-table__cell">object</td>

<td class="govuk-table__cell">No</td>

<td class="govuk-table__cell">Arguments for the fieldset component (e.g. legend). See <a href="../fieldset/README.md#component-arguments">fieldset</a> component.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">hint</th>

<td class="govuk-table__cell">object</td>

<td class="govuk-table__cell">No</td>

<td class="govuk-table__cell">Arguments for the hint component (e.g. text). See <a href="../hint/README.md#component-arguments">hint</a> component.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">errorMessage</th>

<td class="govuk-table__cell">object</td>

<td class="govuk-table__cell">No</td>

<td class="govuk-table__cell">Arguments for the errorMessage component (e.g. text). See <a href="../error-message/README.md#component-arguments">errorMessage</a> component.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">idPrefix</th>

<td class="govuk-table__cell">string</td>

<td class="govuk-table__cell">No</td>

<td class="govuk-table__cell">String to prefix id for each checkbox item if no id is specified on each item. If`idPrefix` is not passed, fallback to using the name attribute instead.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">name</th>

<td class="govuk-table__cell">string</td>

<td class="govuk-table__cell">Yes</td>

<td class="govuk-table__cell">Name attribute for each checkbox item.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">items</th>

<td class="govuk-table__cell">array</td>

<td class="govuk-table__cell">Yes</td>

<td class="govuk-table__cell">Array of checkbox items objects.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">items.{}.text (or) items.{}.html</th>

<td class="govuk-table__cell">string</td>

<td class="govuk-table__cell">Yes</td>

<td class="govuk-table__cell">Text or HTML to use within each checkbox item label. If `html` is provided, the `text` argument will be ignored.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">items.{}.id</th>

<td class="govuk-table__cell">string</td>

<td class="govuk-table__cell">No</td>

<td class="govuk-table__cell">Specific id attribute for the checkbox item. If ommited, then `idPrefix` string will be applied.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">items.{}.name</th>

<td class="govuk-table__cell">string</td>

<td class="govuk-table__cell">Yes</td>

<td class="govuk-table__cell">Specific name for the checkbox item. If ommited, then component global `name` string will be applied.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">items.{}.value</th>

<td class="govuk-table__cell">string</td>

<td class="govuk-table__cell">Yes</td>

<td class="govuk-table__cell">Value for the checkbox input.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">items.{}.label</th>

<td class="govuk-table__cell">object</td>

<td class="govuk-table__cell">No</td>

<td class="govuk-table__cell">Provide additional attributes and classes to each checkbox item label. See [label](../label/README.md#component-arguments) component for more details.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">items.{}.hint</th>

<td class="govuk-table__cell">object</td>

<td class="govuk-table__cell">No</td>

<td class="govuk-table__cell">Provide optional hint to each checkbox item. See `hint` component for more details.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">items.{}.checked</th>

<td class="govuk-table__cell">boolean</td>

<td class="govuk-table__cell">No</td>

<td class="govuk-table__cell">If true, checkbox will be checked.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">items.{}.conditional</th>

<td class="govuk-table__cell">boolean</td>

<td class="govuk-table__cell">No</td>

<td class="govuk-table__cell">If true, content provided will be revealed when the item is checked.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">items.{}.conditional.html</th>

<td class="govuk-table__cell">boolean</td>

<td class="govuk-table__cell">No</td>

<td class="govuk-table__cell">Provide content for the conditional reveal.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">items.{}.disabled</th>

<td class="govuk-table__cell">boolean</td>

<td class="govuk-table__cell">No</td>

<td class="govuk-table__cell">If true, checkbox will be disabled.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">items.{}.attributes</th>

<td class="govuk-table__cell">object</td>

<td class="govuk-table__cell">No</td>

<td class="govuk-table__cell">Any extra HTML attributes (for example data attributes) to add to the checkbox input tag.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">classes</th>

<td class="govuk-table__cell">string</td>

<td class="govuk-table__cell">No</td>

<td class="govuk-table__cell">Optional additional classes to add to the checkboxes container.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">attributes</th>

<td class="govuk-table__cell">object</td>

<td class="govuk-table__cell">No</td>

<td class="govuk-table__cell">Any extra HTML attributes (for example data attributes) to add to the checkboxes container.</td>

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