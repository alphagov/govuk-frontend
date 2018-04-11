# Checkboxes

## Introduction

Let users select one or more options.

## Guidance

Find out when to use the Checkboxes component in your service in the [GOV.UK Design System](https://govuk-design-system-production.cloudapps.digital/components/checkboxes).

## Quick start examples

### Component default

[Preview the checkboxes component](http://govuk-frontend-review.herokuapp.com/components/checkboxes/preview)

#### Markup

      <div class="govuk-form-group">
      <fieldset class="govuk-fieldset">

        <legend class="govuk-fieldset__legend">
          What is your nationality?

          <span class="govuk-fieldset__hint">If you have dual nationality, select all options that are relevant to you.</span>

        </legend>

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

    {% from 'checkboxes/macro.njk' import govukCheckboxes %}

    {{ govukCheckboxes({
      "idPrefix": "nationality",
      "name": "nationality",
      "fieldset": {
        "legendText": "What is your nationality?",
        "legendHintText": "If you have dual nationality, select all options that are relevant to you."
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

### Checkboxes--with-disabled

[Preview the checkboxes--with-disabled example](http://govuk-frontend-review.herokuapp.com/components/checkboxes/with-disabled/preview)

#### Markup

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

#### Macro

    {% from 'checkboxes/macro.njk' import govukCheckboxes %}

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

### Checkboxes--with-html

[Preview the checkboxes--with-html example](http://govuk-frontend-review.herokuapp.com/components/checkboxes/with-html/preview)

#### Markup

      <div class="govuk-form-group">
      <fieldset class="govuk-fieldset">

        <legend class="govuk-fieldset__legend">
          <h3 class="govuk-heading-m">Which types of waste do you transport regularly?</h3>

          <span class="govuk-fieldset__hint">Select all that apply</span>

        </legend>

      <div class="govuk-checkboxes">

          <div class="govuk-checkboxes__item">
            <input class="govuk-checkboxes__input" id="undefined-1" name="" type="checkbox" value="animal">
            <label class="govuk-label govuk-checkboxes__label" for="undefined-1">
            Waste from animal carcasses

          </label>
          </div>

          <div class="govuk-checkboxes__item">
            <input class="govuk-checkboxes__input" id="undefined-2" name="" type="checkbox" value="mines">
            <label class="govuk-label govuk-checkboxes__label" for="undefined-2">
            Waste from mines or quarries

          </label>
          </div>

          <div class="govuk-checkboxes__item">
            <input class="govuk-checkboxes__input" id="undefined-3" name="" type="checkbox" value="farm">
            <label class="govuk-label govuk-checkboxes__label" for="undefined-3">
            Farm or agricultural waste

          </label>
          </div>

        </div>
      </fieldset>
    </div>

#### Macro

    {% from 'checkboxes/macro.njk' import govukCheckboxes %}

    {{ govukCheckboxes({
      "fieldset": {
        "legendHtml": "<h3 class=\"govuk-heading-m\">Which types of waste do you transport regularly?</h3>",
        "legendHintText": "Select all that apply"
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

### Checkboxes--without-fieldset

[Preview the checkboxes--without-fieldset example](http://govuk-frontend-review.herokuapp.com/components/checkboxes/without-fieldset/preview)

#### Markup

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

#### Macro

    {% from 'checkboxes/macro.njk' import govukCheckboxes %}

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

### Checkboxes--with-extreme-fieldset

[Preview the checkboxes--with-extreme-fieldset example](http://govuk-frontend-review.herokuapp.com/components/checkboxes/with-extreme-fieldset/preview)

#### Markup

      <div class="govuk-form-group govuk-form-group--error">
      <fieldset class="govuk-fieldset app-fieldset--custom-modifier" data-attribute="value" data-second-attribute="second-value">

        <legend class="govuk-fieldset__legend">
          What is your nationality?

          <span class="govuk-fieldset__hint">If you have dual nationality, select all options that are relevant to you.</span>

          <span class="govuk-error-message">
          Please select an option
        </span>

        </legend>

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

    {% from 'checkboxes/macro.njk' import govukCheckboxes %}

    {{ govukCheckboxes({
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
        "legendText": "What is your nationality?",
        "legendHintText": "If you have dual nationality, select all options that are relevant to you."
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

### Checkboxes--with-error

[Preview the checkboxes--with-error example](http://govuk-frontend-review.herokuapp.com/components/checkboxes/with-error/preview)

#### Markup

      <div class="govuk-form-group govuk-form-group--error">
      <fieldset class="govuk-fieldset">

        <legend class="govuk-fieldset__legend">
          <h3 class="govuk-heading-m">Which types of waste do you transport regularly?</h3>

          <span class="govuk-error-message">
          Please select an option
        </span>

        </legend>

      <div class="govuk-checkboxes">

          <div class="govuk-checkboxes__item">
            <input class="govuk-checkboxes__input" id="undefined-1" name="" type="checkbox" value="animal">
            <label class="govuk-label govuk-checkboxes__label" for="undefined-1">
            Waste from animal carcasses

          </label>
          </div>

          <div class="govuk-checkboxes__item">
            <input class="govuk-checkboxes__input" id="undefined-2" name="" type="checkbox" value="mines">
            <label class="govuk-label govuk-checkboxes__label" for="undefined-2">
            Waste from mines or quarries

          </label>
          </div>

          <div class="govuk-checkboxes__item">
            <input class="govuk-checkboxes__input" id="undefined-3" name="" type="checkbox" value="farm">
            <label class="govuk-label govuk-checkboxes__label" for="undefined-3">
            Farm or agricultural waste

          </label>
          </div>

        </div>
      </fieldset>
    </div>

#### Macro

    {% from 'checkboxes/macro.njk' import govukCheckboxes %}

    {{ govukCheckboxes({
      "errorMessage": {
        "text": "Please select an option"
      },
      "fieldset": {
        "legendHtml": "<h3 class=\"govuk-heading-m\">Which types of waste do you transport regularly?</h3>"
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

## Dependencies

To consume the checkboxes component you must be running npm version 5 or above.

## Installation

    npm install --save @govuk-frontend/checkboxes

## Requirements

### Build tool configuration

When compiling the Sass files you'll need to define includePaths to reference the node_modules directory. Below is a sample configuration using gulp

    .pipe(sass({
      includePaths: 'node_modules/'
    }))

### Static asset path configuration

To show the button image you need to configure your app to show these assets. Below is a sample configuration using Express js:

    app.use('/public', express.static(path.join(__dirname, '/node_modules/@govuk-frontend/icons')))

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

<th class="govuk-table__header" scope="row">fieldset</th>

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Arguments for the fieldset component (e.g. legendText, legendHintText, errorMessage). See fieldset component.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">classes</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional additional classes</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">idPrefix</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">String to prefix id for each checkbox item if no id is specified on each item.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">name</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">Yes</td>

<td class="govuk-table__cell ">Name attribute for each checkbox item.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">items</th>

<td class="govuk-table__cell ">array</td>

<td class="govuk-table__cell ">Yes</td>

<td class="govuk-table__cell ">Array of checkbox items.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">text</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Text to use within each checkbox item label.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">html</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">HTML to use within each checkbox item label. If this is provided, the text argument will be ignored.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">label</th>

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Provide additional attributes to each checkbox item label.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">checked</th>

<td class="govuk-table__cell ">boolean</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">If true, checkbox will be checked</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">disabled</th>

<td class="govuk-table__cell ">boolean</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">If true, checkbox will be disabled</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">attributes</th>

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Any extra HTML attributes (for example data attributes) to add to the checkboxes container.</td>

</tr>

</tbody>

</table>

### Setting up Nunjucks views and paths

Below is an example setup using express configure views:

    nunjucks.configure('node_modules/@govuk-frontend', {
      autoescape: true,
      cache: false,
      express: app
    })

## Getting updates

To check whether you have the latest version of the button run:

    npm outdated @govuk-frontend/checkboxes

To update the latest version run:

    npm update @govuk-frontend/checkboxes

## Contribution

Guidelines can be found at [on our Github repository.](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md "link to contributing guidelines on our github repository")

## License

MIT