# Radios

## Introduction

Let users select a single option from a list.

## Guidance

Find out when to use the radios component in your service in the [GOV.UK Design System](https://design-system.service.gov.uk/components/radios).

## Quick start examples

### Radios

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/radios/preview)

#### Markup

    <div class="govuk-form-group">

      <fieldset class="govuk-fieldset" aria-describedby="example-hint">

      <legend class="govuk-fieldset__legend">
        Have you changed your name?
      </legend>

      <span id="example-hint" class="govuk-hint">
        This includes changing your last name or spelling your name differently.
      </span>

      <div class="govuk-radios">

        <div class="govuk-radios__item">
          <input class="govuk-radios__input" id="example-1" name="example" type="radio" value="yes">
          <label class="govuk-label govuk-radios__label" for="example-1">
            Yes
          </label>
        </div>

        <div class="govuk-radios__item">
          <input class="govuk-radios__input" id="example-2" name="example" type="radio" value="no" checked>
          <label class="govuk-label govuk-radios__label" for="example-2">
            No
          </label>
        </div>

      </div>
      </fieldset>

    </div>

#### Macro

    {% from "radios/macro.njk" import govukRadios %}

    {{ govukRadios({
      "idPrefix": "example",
      "name": "example",
      "fieldset": {
        "legend": {
          "text": "Have you changed your name?"
        }
      },
      "hint": {
        "text": "This includes changing your last name or spelling your name differently."
      },
      "items": [
        {
          "value": "yes",
          "text": "Yes"
        },
        {
          "value": "no",
          "text": "No",
          "checked": true
        }
      ]
    }) }}

### Radios inline

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/radios/inline/preview)

#### Markup

    <div class="govuk-form-group">

      <fieldset class="govuk-fieldset" aria-describedby="example&#39;-hint">

      <legend class="govuk-fieldset__legend">
        Have you changed your name?
      </legend>

      <span id="example&#39;-hint" class="govuk-hint">
        This includes changing your last name or spelling your name differently.
      </span>

      <div class="govuk-radios govuk-radios--inline">

        <div class="govuk-radios__item">
          <input class="govuk-radios__input" id="example&#39;-1" name="example" type="radio" value="yes">
          <label class="govuk-label govuk-radios__label" for="example&#39;-1">
            Yes
          </label>
        </div>

        <div class="govuk-radios__item">
          <input class="govuk-radios__input" id="example&#39;-2" name="example" type="radio" value="no" checked>
          <label class="govuk-label govuk-radios__label" for="example&#39;-2">
            No
          </label>
        </div>

      </div>
      </fieldset>

    </div>

#### Macro

    {% from "radios/macro.njk" import govukRadios %}

    {{ govukRadios({
      "idPrefix": "example'",
      "classes": "govuk-radios--inline",
      "name": "example",
      "fieldset": {
        "legend": {
          "text": "Have you changed your name?"
        }
      },
      "hint": {
        "text": "This includes changing your last name or spelling your name differently."
      },
      "items": [
        {
          "value": "yes",
          "text": "Yes"
        },
        {
          "value": "no",
          "text": "No",
          "checked": true
        }
      ]
    }) }}

### Radios with disabled

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/radios/with-disabled/preview)

#### Markup

    <div class="govuk-form-group">

      <fieldset class="govuk-fieldset" aria-describedby="example-disabled-hint">

      <legend class="govuk-fieldset__legend">
        Have you changed your name?
      </legend>

      <span id="example-disabled-hint" class="govuk-hint">
        This includes changing your last name or spelling your name differently.
      </span>

      <div class="govuk-radios">

        <div class="govuk-radios__item">
          <input class="govuk-radios__input" id="example-disabled-1" name="example-disabled" type="radio" value="yes" disabled>
          <label class="govuk-label govuk-radios__label" for="example-disabled-1">
            Yes
          </label>
        </div>

        <div class="govuk-radios__item">
          <input class="govuk-radios__input" id="example-disabled-2" name="example-disabled" type="radio" value="no" disabled>
          <label class="govuk-label govuk-radios__label" for="example-disabled-2">
            No
          </label>
        </div>

      </div>
      </fieldset>

    </div>

#### Macro

    {% from "radios/macro.njk" import govukRadios %}

    {{ govukRadios({
      "idPrefix": "example-disabled",
      "name": "example-disabled",
      "fieldset": {
        "legend": {
          "text": "Have you changed your name?"
        }
      },
      "hint": {
        "text": "This includes changing your last name or spelling your name differently."
      },
      "items": [
        {
          "value": "yes",
          "text": "Yes",
          "disabled": true
        },
        {
          "value": "no",
          "text": "No",
          "disabled": true
        }
      ]
    }) }}

### Radios with legend as page heading

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/radios/with-legend-as-page-heading/preview)

#### Markup

    <div class="govuk-form-group">

      <fieldset class="govuk-fieldset" aria-describedby="housing-act-hint">

      <legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
        <h1 class="govuk-fieldset__heading">
          Which part of the Housing Act was your licence issued under?
        </h1>
      </legend>

      <span id="housing-act-hint" class="govuk-hint">
        Select one of the options below.
      </span>

      <div class="govuk-radios">

        <div class="govuk-radios__item">
          <input class="govuk-radios__input" id="housing-act-1" name="housing-act" type="radio" value="part-2">
          <label class="govuk-label govuk-radios__label" for="housing-act-1">
            <span class="govuk-heading-s govuk-!-margin-bottom-1">Part 2 of the Housing Act 2004</span> For properties that are 3 or more stories high and occupied by 5 or more people
          </label>
        </div>

        <div class="govuk-radios__item">
          <input class="govuk-radios__input" id="housing-act-2" name="housing-act" type="radio" value="part-3">
          <label class="govuk-label govuk-radios__label" for="housing-act-2">
            <span class="govuk-heading-s govuk-!-margin-bottom-1">Part 3 of the Housing Act 2004</span> For properties that are within a geographical area defined by a local council
          </label>
        </div>

      </div>
      </fieldset>

    </div>

#### Macro

    {% from "radios/macro.njk" import govukRadios %}

    {{ govukRadios({
      "idPrefix": "housing-act",
      "name": "housing-act",
      "fieldset": {
        "legend": {
          "text": "Which part of the Housing Act was your licence issued under?",
          "classes": "govuk-fieldset__legend--l",
          "isPageHeading": true
        }
      },
      "hint": {
        "text": "Select one of the options below."
      },
      "items": [
        {
          "value": "part-2",
          "html": "<span class=\"govuk-heading-s govuk-!-margin-bottom-1\">Part 2 of the Housing Act 2004</span> For properties that are 3 or more stories high and occupied by 5 or more people"
        },
        {
          "value": "part-3",
          "html": "<span class=\"govuk-heading-s govuk-!-margin-bottom-1\">Part 3 of the Housing Act 2004</span> For properties that are within a geographical area defined by a local council"
        }
      ]
    }) }}

### Radios with a medium legend

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/radios/with-a-medium-legend/preview)

#### Markup

    <div class="govuk-form-group">

      <fieldset class="govuk-fieldset" aria-describedby="housing-act-hint">

      <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
        Which part of the Housing Act was your licence issued under?
      </legend>

      <span id="housing-act-hint" class="govuk-hint">
        Select one of the options below.
      </span>

      <div class="govuk-radios">

        <div class="govuk-radios__item">
          <input class="govuk-radios__input" id="housing-act-1" name="housing-act" type="radio" value="part-2">
          <label class="govuk-label govuk-radios__label" for="housing-act-1">
            <span class="govuk-heading-s govuk-!-margin-bottom-1">Part 2 of the Housing Act 2004</span> For properties that are 3 or more stories high and occupied by 5 or more people
          </label>
        </div>

        <div class="govuk-radios__item">
          <input class="govuk-radios__input" id="housing-act-2" name="housing-act" type="radio" value="part-3">
          <label class="govuk-label govuk-radios__label" for="housing-act-2">
            <span class="govuk-heading-s govuk-!-margin-bottom-1">Part 3 of the Housing Act 2004</span> For properties that are within a geographical area defined by a local council
          </label>
        </div>

      </div>
      </fieldset>

    </div>

#### Macro

    {% from "radios/macro.njk" import govukRadios %}

    {{ govukRadios({
      "idPrefix": "housing-act",
      "name": "housing-act",
      "fieldset": {
        "legend": {
          "text": "Which part of the Housing Act was your licence issued under?",
          "classes": "govuk-fieldset__legend--m"
        }
      },
      "hint": {
        "text": "Select one of the options below."
      },
      "items": [
        {
          "value": "part-2",
          "html": "<span class=\"govuk-heading-s govuk-!-margin-bottom-1\">Part 2 of the Housing Act 2004</span> For properties that are 3 or more stories high and occupied by 5 or more people"
        },
        {
          "value": "part-3",
          "html": "<span class=\"govuk-heading-s govuk-!-margin-bottom-1\">Part 3 of the Housing Act 2004</span> For properties that are within a geographical area defined by a local council"
        }
      ]
    }) }}

### Radios with a divider

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/radios/with-a-divider/preview)

#### Markup

    <div class="govuk-form-group">

      <fieldset class="govuk-fieldset">

      <legend class="govuk-fieldset__legend">
        How do you want to sign in?
      </legend>

      <div class="govuk-radios">

        <div class="govuk-radios__item">
          <input class="govuk-radios__input" id="example-divider-1" name="example" type="radio" value="governement-gateway">
          <label class="govuk-label govuk-radios__label" for="example-divider-1">
            Use Government Gateway
          </label>
        </div>

        <div class="govuk-radios__item">
          <input class="govuk-radios__input" id="example-divider-2" name="example" type="radio" value="govuk-verify">
          <label class="govuk-label govuk-radios__label" for="example-divider-2">
            Use GOV.UK Verify
          </label>
        </div>

        <div class="govuk-radios__divider">or</div>

        <div class="govuk-radios__item">
          <input class="govuk-radios__input" id="example-divider-4" name="example" type="radio" value="create-account">
          <label class="govuk-label govuk-radios__label" for="example-divider-4">
            Create an account
          </label>
        </div>

      </div>
      </fieldset>

    </div>

#### Macro

    {% from "radios/macro.njk" import govukRadios %}

    {{ govukRadios({
      "idPrefix": "example-divider",
      "name": "example",
      "fieldset": {
        "legend": {
          "text": "How do you want to sign in?"
        }
      },
      "items": [
        {
          "value": "governement-gateway",
          "text": "Use Government Gateway"
        },
        {
          "value": "govuk-verify",
          "text": "Use GOV.UK Verify"
        },
        {
          "divider": "or"
        },
        {
          "value": "create-account",
          "text": "Create an account"
        }
      ]
    }) }}

### Radios with hints on items

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/radios/with-hints-on-items/preview)

#### Markup

    <div class="govuk-form-group">

      <fieldset class="govuk-fieldset">

      <legend class="govuk-fieldset__legend">
        <h1 class="govuk-fieldset__heading">
          How do you want to sign in?
        </h1>
      </legend>

      <div class="govuk-radios">

        <div class="govuk-radios__item">
          <input class="govuk-radios__input" id="gov-1" name="gov" type="radio" value="gateway" aria-describedby="gov-1-item-hint">
          <label class="govuk-label govuk-radios__label" for="gov-1">
            Sign in with Government Gateway
          </label>
          <span id="gov-1-item-hint" class="govuk-hint govuk-radios__hint">
            You&#39;ll have a user ID if you&#39;ve registered for Self Assessment or filed a tax return online before.
          </span>
        </div>

        <div class="govuk-radios__item">
          <input class="govuk-radios__input" id="gov-2" name="gov" type="radio" value="verify" aria-describedby="gov-2-item-hint">
          <label class="govuk-label govuk-radios__label" for="gov-2">
            Sign in with GOV.UK Verify
          </label>
          <span id="gov-2-item-hint" class="govuk-hint govuk-radios__hint">
            You’ll have an account if you’ve already proved your identity with either Barclays, CitizenSafe, Digidentity, Experian, Post Office, Royal Mail or SecureIdentity.
          </span>
        </div>

      </div>
      </fieldset>

    </div>

#### Macro

    {% from "radios/macro.njk" import govukRadios %}

    {{ govukRadios({
      "idPrefix": "gov",
      "name": "gov",
      "fieldset": {
        "legend": {
          "text": "How do you want to sign in?",
          "isPageHeading": true
        }
      },
      "items": [
        {
          "value": "gateway",
          "text": "Sign in with Government Gateway",
          "hint": {
            "text": "You'll have a user ID if you've registered for Self Assessment or filed a tax return online before."
          }
        },
        {
          "value": "verify",
          "text": "Sign in with GOV.UK Verify",
          "hint": {
            "text": "You’ll have an account if you’ve already proved your identity with either Barclays, CitizenSafe, Digidentity, Experian, Post Office, Royal Mail or SecureIdentity."
          }
        }
      ]
    }) }}

### Radios without fieldset

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/radios/without-fieldset/preview)

#### Markup

    <div class="govuk-form-group">

      <div class="govuk-radios">

        <div class="govuk-radios__item">
          <input class="govuk-radios__input" id="colours-1" name="colours" type="radio" value="red">
          <label class="govuk-label govuk-radios__label" for="colours-1">
            Red
          </label>
        </div>

        <div class="govuk-radios__item">
          <input class="govuk-radios__input" id="colours-2" name="colours" type="radio" value="green">
          <label class="govuk-label govuk-radios__label" for="colours-2">
            Green
          </label>
        </div>

        <div class="govuk-radios__item">
          <input class="govuk-radios__input" id="colours-3" name="colours" type="radio" value="blue">
          <label class="govuk-label govuk-radios__label" for="colours-3">
            Blue
          </label>
        </div>

      </div>

    </div>

#### Macro

    {% from "radios/macro.njk" import govukRadios %}

    {{ govukRadios({
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

### Radios with all fieldset attributes

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/radios/with-all-fieldset-attributes/preview)

#### Markup

    <div class="govuk-form-group govuk-form-group--error">

      <fieldset class="govuk-fieldset app-fieldset--custom-modifier" aria-describedby="example-hint example-error" data-attribute="value" data-second-attribute="second-value">

      <legend class="govuk-fieldset__legend">
        Have you changed your name?
      </legend>

      <span id="example-hint" class="govuk-hint">
        This includes changing your last name or spelling your name differently.
      </span>

      <span id="example-error" class="govuk-error-message">
        Please select an option
      </span>

      <div class="govuk-radios">

        <div class="govuk-radios__item">
          <input class="govuk-radios__input" id="example-1" name="example" type="radio" value="yes">
          <label class="govuk-label govuk-radios__label" for="example-1">
            Yes
          </label>
        </div>

        <div class="govuk-radios__item">
          <input class="govuk-radios__input" id="example-2" name="example" type="radio" value="no" checked>
          <label class="govuk-label govuk-radios__label" for="example-2">
            No
          </label>
        </div>

      </div>
      </fieldset>

    </div>

#### Macro

    {% from "radios/macro.njk" import govukRadios %}

    {{ govukRadios({
      "idPrefix": "example",
      "name": "example",
      "errorMessage": {
        "text": "Please select an option"
      },
      "fieldset": {
        "classes": "app-fieldset--custom-modifier",
        "attributes": {
          "data-attribute": "value",
          "data-second-attribute": "second-value"
        },
        "legend": {
          "text": "Have you changed your name?"
        }
      },
      "hint": {
        "text": "This includes changing your last name or spelling your name differently."
      },
      "items": [
        {
          "value": "yes",
          "text": "Yes"
        },
        {
          "value": "no",
          "text": "No",
          "checked": true
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

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Arguments for the fieldset component (e.g. legend). See <a href="../fieldset/README.md#component-arguments">fieldset</a> component.</td>

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

<td class="govuk-table__cell ">Arguments for the errorMessage component (e.g. text). See errorMessage component.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">idPrefix</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">String to prefix id for each radio item if no id is specified on each item. If`idPrefix` is not passed, fallback to using the name attribute instead.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">name</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">Yes</td>

<td class="govuk-table__cell ">Name attribute for each radio item.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">items</th>

<td class="govuk-table__cell ">array</td>

<td class="govuk-table__cell ">Yes</td>

<td class="govuk-table__cell ">Array of checkbox items objects.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">items.{}.text (or) items.{}.html</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">Yes</td>

<td class="govuk-table__cell ">Text or HTML to use within each radio item label. If `html` is provided, the `text` argument will be ignored.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">items.{}.id</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Specific id attribute for the radio item. If ommited, then `idPrefix` string will be applied.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">items.{}.name</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">Yes</td>

<td class="govuk-table__cell ">Specific name for the radio item. If ommited, then component global `name` string will be applied.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">items.{}.value</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">Yes</td>

<td class="govuk-table__cell ">Value for the radio input.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">items.{}.label</th>

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Provide additional attributes and classes to each radio item label. See [label](../label/README.md#component-arguments) component for more details.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">items.{}.hint</th>

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Provide optional hint to each radio item. See `hint` component for more details.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">items.{}.divider</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional divider text to separate radio items, for example the text "or".</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">items.{}.checked</th>

<td class="govuk-table__cell ">boolean</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">If true, radio will be checked.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">items.{}.conditional</th>

<td class="govuk-table__cell ">boolean</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">If true, content provided will be revealed when the item is checked.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">items.{}.conditional.html</th>

<td class="govuk-table__cell ">boolean</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Provide content for the conditional reveal.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">items.{}.disabled</th>

<td class="govuk-table__cell ">boolean</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">If true, radio will be disabled.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">items.{}.attributes</th>

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Any extra HTML attributes (for example data attributes) to add to the radio input tag.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">classes</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional additional classes to add to the radios container.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">attributes</th>

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Any extra HTML attributes (for example data attributes) to add to the radios container.</td>

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