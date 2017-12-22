<div class="govuk-o-width-container">

<div class="govuk-o-main-wrapper">

# Checkbox

## Introduction

Checkbox description goes here

## Guidance

More information about when to use checkbox can be found on [GOV.UK Design System](http://www.linktodesignsystem.com/checkbox "Link to read guidance on the use of checkbox on Gov.uk Design system website")

## Quick start examples

### Component default

[Preview the checkbox component](http://govuk-frontend-review.herokuapp.com/components/checkbox/preview)

#### Markup

    <fieldset class="govuk-c-fieldset">

      <legend class="govuk-c-fieldset__legend">
        What is your nationality?

        <span class="govuk-c-fieldset__hint">If you have dual nationality, select all options that are relevant to you.</span>

      </legend>

      <div class="govuk-c-checkbox">
        <input class="govuk-c-checkbox__input" id="nationality-1" name="nationality" type="checkbox" value="british">
        <label class="govuk-c-label govuk-c-checkbox__label" for="nationality-1">
          British

        </label>
      </div>

      <div class="govuk-c-checkbox">
        <input class="govuk-c-checkbox__input" id="nationality-2" name="nationality" type="checkbox" value="irish">
        <label class="govuk-c-label govuk-c-checkbox__label" for="nationality-2">
          Irish

        </label>
      </div>

      <div class="govuk-c-checkbox">
        <input class="govuk-c-checkbox__input" id="nationality-3" name="nationality" type="checkbox" value="other">
        <label class="govuk-c-label govuk-c-checkbox__label" for="nationality-3">
          Citizen of another country

        </label>
      </div>
    </fieldset>

#### Macro

    {{ govukCheckbox({
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

### Checkbox--with-html

[Preview the checkbox--with-html variant](http://govuk-frontend-review.herokuapp.com/components/checkbox/with-html/preview)

#### Markup

    <fieldset class="govuk-c-fieldset">

      <legend class="govuk-c-fieldset__legend">
        <h3 class="govuk-heading-m">Which types of waste do you transport regularly?</h3>

        <span class="govuk-c-fieldset__hint">Select all that apply</span>

      </legend>

      <div class="govuk-c-checkbox">
        <input class="govuk-c-checkbox__input" id="undefined-1" name="" type="checkbox" value="animal">
        <label class="govuk-c-label govuk-c-checkbox__label" for="undefined-1">
          Waste from animal carcasses

        </label>
      </div>

      <div class="govuk-c-checkbox">
        <input class="govuk-c-checkbox__input" id="undefined-2" name="" type="checkbox" value="mines">
        <label class="govuk-c-label govuk-c-checkbox__label" for="undefined-2">
          Waste from mines or quarries

        </label>
      </div>

      <div class="govuk-c-checkbox">
        <input class="govuk-c-checkbox__input" id="undefined-3" name="" type="checkbox" value="farm">
        <label class="govuk-c-label govuk-c-checkbox__label" for="undefined-3">
          Farm or agricultural waste

        </label>
      </div>
    </fieldset>

#### Macro

    {{ govukCheckbox({
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

### Checkbox--without-fieldset

[Preview the checkbox--without-fieldset variant](http://govuk-frontend-review.herokuapp.com/components/checkbox/without-fieldset/preview)

#### Markup

    <div class="govuk-c-checkbox">
      <input class="govuk-c-checkbox__input" id="colours-1" name="colours" type="checkbox" value="red">
      <label class="govuk-c-label govuk-c-checkbox__label" for="colours-1">
        Red

      </label>
    </div>

    <div class="govuk-c-checkbox">
      <input class="govuk-c-checkbox__input" id="colours-2" name="colours" type="checkbox" value="green">
      <label class="govuk-c-label govuk-c-checkbox__label" for="colours-2">
        Green

      </label>
    </div>

    <div class="govuk-c-checkbox">
      <input class="govuk-c-checkbox__input" id="colours-3" name="colours" type="checkbox" value="blue">
      <label class="govuk-c-label govuk-c-checkbox__label" for="colours-3">
        Blue

      </label>
    </div>

#### Macro

    {{ govukCheckbox({
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

### Checkbox--disabled

[Preview the checkbox--disabled variant](http://govuk-frontend-review.herokuapp.com/components/checkbox/disabled/preview)

#### Markup

    <div class="govuk-c-checkbox">
      <input class="govuk-c-checkbox__input" id="disabled-example-1" name="disabled-example" type="checkbox" value="disabled" disabled>
      <label class="govuk-c-label govuk-c-checkbox__label" for="disabled-example-1">
        Disabled option

      </label>
    </div>

#### Macro

    {{ govukCheckbox({
      "name": "disabled-example",
      "items": [
        {
          "value": "disabled",
          "text": "Disabled option",
          "disabled": true
        }
      ]
    }) }}

## Dependencies

To consume the checkbox component you must be running npm version 5 or above.

## Installation

    npm install --save @govuk-frontend/checkbox

## Requirements

### Build tool configuration

When compiling the Sass files you'll need to define includePaths to reference the node_modules directory. Below is a sample configuration using gulp

<pre>  `.pipe(sass({
        includePaths: 'node_modules/'
    }))` 
  </pre>

### Static asset path configuration

To show the button image you need to configure your app to show these assets. Below is a sample configuration using Express js:

<pre>  `app.use('/public', express.static(path.join(__dirname, '/node_modules/@govuk-frontend/icons')))` 
  </pre>

## Component arguments

If you are using Nunjucks,then macros take the following arguments

<div>

<table class="govuk-c-table">

<thead class="govuk-c-table__head">

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="col">Name</th>

<th class="govuk-c-table__header" scope="col">Type</th>

<th class="govuk-c-table__header" scope="col">Required</th>

<th class="govuk-c-table__header" scope="col">Description</th>

</tr>

</thead>

<tbody class="govuk-c-table__body">

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">fieldset</th>

<td class="govuk-c-table__cell ">object</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Arguments for the fieldset component (e.g. legendText, legendHintText, errorMessage). See fieldset component.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">classes</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Optional additional classes</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">idPrefix</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">String to prefix id for each checkbox item if no id is specified on each item.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">name</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">Name attribute for each checkbox item.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">items</th>

<td class="govuk-c-table__cell ">array</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">Array of checkbox items.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">text</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Text to use within the checkbox label.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">html</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">HTML to use within the checkbox label. If this is provided, the text argument will be ignored.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">label</th>

<td class="govuk-c-table__cell ">object</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Provide additional attributes to the checkbox label.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">checked</th>

<td class="govuk-c-table__cell ">boolean</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">If true, checkbox will be checked</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">disabled</th>

<td class="govuk-c-table__cell ">boolean</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">If true, checkbox will be disabled</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">attributes</th>

<td class="govuk-c-table__cell ">object</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Any extra HTML attributes (for example data attributes) to add to the checkbox container.</td>

</tr>

</tbody>

</table>

</div>

### Setting up Nunjucks views and paths

Below is an example setup using express configure views:

<pre>  `nunjucks.configure('node_modules/@govuk-frontend`, {
    autoescape: true,
    cache: false,
    express: app
  })` 
  </pre>

## Getting updates

To check whether you have the latest version of the button run:

    npm outdated @govuk-frontend/checkbox

To update the latest version run:

    npm update @govuk-frontend/checkbox

## Contribution

Guidelines can be found at [on our Github repository.](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md "link to contributing guidelines on our github repository")

## Acknowledgements/credits

*   GDS developers
*   Jani Kraner
*   Gemma Leigh

## License

MIT

</div>

</div>