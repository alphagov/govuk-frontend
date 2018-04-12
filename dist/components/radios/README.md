# Radios

## Introduction

Let users select a single option from a list.

## Guidance

Find out when to use the Radios component in your service in the [GOV.UK Design System](https://govuk-design-system-production.cloudapps.digital/components/radios).

## Quick start examples

### Component default

[Preview the radios component](http://govuk-frontend-review.herokuapp.com/components/radios/preview)

#### Markup

      <div class="govuk-o-form-group">
      <fieldset class="govuk-c-fieldset">

        <legend class="govuk-c-fieldset__legend">
          Have you changed your name?

          <span class="govuk-c-fieldset__hint">This includes changing your last name or spelling your name differently.</span>

        </legend>

      <div class="govuk-c-radios">

          <div class="govuk-c-radios__item">
            <input class="govuk-c-radios__input" id="example-1" name="example" type="radio" value="yes">
            <label class="govuk-c-label govuk-c-radios__label" for="example-1">
            Yes

          </label>
          </div>

          <div class="govuk-c-radios__item">
            <input class="govuk-c-radios__input" id="example-2" name="example" type="radio" value="no" checked>
            <label class="govuk-c-label govuk-c-radios__label" for="example-2">
            No

          </label>
          </div>

        </div>
      </fieldset>
    </div>

#### Macro

    {% from 'radios/macro.njk' import govukRadios %}

    {{ govukRadios({
      "idPrefix": "example",
      "name": "example",
      "fieldset": {
        "legendText": "Have you changed your name?",
        "legendHintText": "This includes changing your last name or spelling your name differently."
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

### Radios--inline

[Preview the radios--inline example](http://govuk-frontend-review.herokuapp.com/components/radios/inline/preview)

#### Markup

      <div class="govuk-o-form-group">
      <fieldset class="govuk-c-fieldset">

        <legend class="govuk-c-fieldset__legend">
          Have you changed your name?

          <span class="govuk-c-fieldset__hint">This includes changing your last name or spelling your name differently.</span>

        </legend>

      <div class="govuk-c-radios govuk-c-radios--inline">

          <div class="govuk-c-radios__item">
            <input class="govuk-c-radios__input" id="example-1" name="example" type="radio" value="yes">
            <label class="govuk-c-label govuk-c-radios__label" for="example-1">
            Yes

          </label>
          </div>

          <div class="govuk-c-radios__item">
            <input class="govuk-c-radios__input" id="example-2" name="example" type="radio" value="no" checked>
            <label class="govuk-c-label govuk-c-radios__label" for="example-2">
            No

          </label>
          </div>

        </div>
      </fieldset>
    </div>

#### Macro

    {% from 'radios/macro.njk' import govukRadios %}

    {{ govukRadios({
      "idPrefix": "example",
      "classes": "govuk-c-radios--inline",
      "name": "example",
      "fieldset": {
        "legendText": "Have you changed your name?",
        "legendHintText": "This includes changing your last name or spelling your name differently."
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

### Radios--with-disabled

[Preview the radios--with-disabled example](http://govuk-frontend-review.herokuapp.com/components/radios/with-disabled/preview)

#### Markup

      <div class="govuk-o-form-group">
      <fieldset class="govuk-c-fieldset">

        <legend class="govuk-c-fieldset__legend">
          Have you changed your name?

          <span class="govuk-c-fieldset__hint">This includes changing your last name or spelling your name differently.</span>

        </legend>

      <div class="govuk-c-radios">

          <div class="govuk-c-radios__item">
            <input class="govuk-c-radios__input" id="example-disabled-1" name="example-disabled" type="radio" value="yes" disabled>
            <label class="govuk-c-label govuk-c-radios__label" for="example-disabled-1">
            Yes

          </label>
          </div>

          <div class="govuk-c-radios__item">
            <input class="govuk-c-radios__input" id="example-disabled-2" name="example-disabled" type="radio" value="no" disabled>
            <label class="govuk-c-label govuk-c-radios__label" for="example-disabled-2">
            No

          </label>
          </div>

        </div>
      </fieldset>
    </div>

#### Macro

    {% from 'radios/macro.njk' import govukRadios %}

    {{ govukRadios({
      "idPrefix": "example-disabled",
      "name": "example-disabled",
      "fieldset": {
        "legendText": "Have you changed your name?",
        "legendHintText": "This includes changing your last name or spelling your name differently."
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

### Radios--with-html

[Preview the radios--with-html example](http://govuk-frontend-review.herokuapp.com/components/radios/with-html/preview)

#### Markup

      <div class="govuk-o-form-group">
      <fieldset class="govuk-c-fieldset">

        <legend class="govuk-c-fieldset__legend">
          <h1 class="govuk-heading-l">Which part of the Housing Act was your licence issued under?</h1>

          <span class="govuk-c-fieldset__hint">Select one of the options below.</span>

        </legend>

      <div class="govuk-c-radios">

          <div class="govuk-c-radios__item">
            <input class="govuk-c-radios__input" id="housing-act-1" name="housing-act" type="radio" value="part-2">
            <label class="govuk-c-label govuk-c-radios__label" for="housing-act-1">
            <span class="govuk-heading-s govuk-!-mb-r1">Part 2 of the Housing Act 2004</span> For properties that are 3 or more stories high and occupied by 5 or more people

          </label>
          </div>

          <div class="govuk-c-radios__item">
            <input class="govuk-c-radios__input" id="housing-act-2" name="housing-act" type="radio" value="part-3">
            <label class="govuk-c-label govuk-c-radios__label" for="housing-act-2">
            <span class="govuk-heading-s govuk-!-mb-r1">Part 3 of the Housing Act 2004</span> For properties that are within a geographical area defined by a local council

          </label>
          </div>

        </div>
      </fieldset>
    </div>

#### Macro

    {% from 'radios/macro.njk' import govukRadios %}

    {{ govukRadios({
      "idPrefix": "housing-act",
      "name": "housing-act",
      "fieldset": {
        "legendHtml": "<h1 class=\"govuk-heading-l\">Which part of the Housing Act was your licence issued under?</h1>",
        "legendHintText": "Select one of the options below."
      },
      "items": [
        {
          "value": "part-2",
          "html": "<span class=\"govuk-heading-s govuk-!-mb-r1\">Part 2 of the Housing Act 2004</span> For properties that are 3 or more stories high and occupied by 5 or more people"
        },
        {
          "value": "part-3",
          "html": "<span class=\"govuk-heading-s govuk-!-mb-r1\">Part 3 of the Housing Act 2004</span> For properties that are within a geographical area defined by a local council"
        }
      ]
    }) }}

### Radios--without-fieldset

[Preview the radios--without-fieldset example](http://govuk-frontend-review.herokuapp.com/components/radios/without-fieldset/preview)

#### Markup

      <div class="govuk-c-radios">

        <div class="govuk-c-radios__item">
          <input class="govuk-c-radios__input" id="colours-1" name="colours" type="radio" value="red">
          <label class="govuk-c-label govuk-c-radios__label" for="colours-1">
          Red

        </label>
        </div>

        <div class="govuk-c-radios__item">
          <input class="govuk-c-radios__input" id="colours-2" name="colours" type="radio" value="green">
          <label class="govuk-c-label govuk-c-radios__label" for="colours-2">
          Green

        </label>
        </div>

        <div class="govuk-c-radios__item">
          <input class="govuk-c-radios__input" id="colours-3" name="colours" type="radio" value="blue">
          <label class="govuk-c-label govuk-c-radios__label" for="colours-3">
          Blue

        </label>
        </div>

      </div>

#### Macro

    {% from 'radios/macro.njk' import govukRadios %}

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

### Radios--with-extreme-fieldset

[Preview the radios--with-extreme-fieldset example](http://govuk-frontend-review.herokuapp.com/components/radios/with-extreme-fieldset/preview)

#### Markup

      <div class="govuk-o-form-group govuk-o-form-group--error">
      <fieldset class="govuk-c-fieldset app-c-fieldset--custom-modifier" data-attribute="value" data-second-attribute="second-value">

        <legend class="govuk-c-fieldset__legend">
          Have you changed your name?

          <span class="govuk-c-fieldset__hint">This includes changing your last name or spelling your name differently.</span>

          <span class="govuk-c-error-message">
          Please select an option
        </span>

        </legend>

      <div class="govuk-c-radios">

          <div class="govuk-c-radios__item">
            <input class="govuk-c-radios__input" id="example-1" name="example" type="radio" value="yes">
            <label class="govuk-c-label govuk-c-radios__label" for="example-1">
            Yes

          </label>
          </div>

          <div class="govuk-c-radios__item">
            <input class="govuk-c-radios__input" id="example-2" name="example" type="radio" value="no" checked>
            <label class="govuk-c-label govuk-c-radios__label" for="example-2">
            No

          </label>
          </div>

        </div>
      </fieldset>
    </div>

#### Macro

    {% from 'radios/macro.njk' import govukRadios %}

    {{ govukRadios({
      "idPrefix": "example",
      "name": "example",
      "errorMessage": {
        "text": "Please select an option"
      },
      "fieldset": {
        "classes": "app-c-fieldset--custom-modifier",
        "attributes": {
          "data-attribute": "value",
          "data-second-attribute": "second-value"
        },
        "legendText": "Have you changed your name?",
        "legendHintText": "This includes changing your last name or spelling your name differently."
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

## Dependencies

To consume the radios component you must be running npm version 5 or above.

Please note, this component depends on @govuk-frontend/globals, which will automatically be installed with the package.

## Installation

    npm install --save @govuk-frontend/radios

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

<td class="govuk-c-table__cell ">String to prefix id for each radio item if no id is specified on each item.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">name</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">Name attribute for each radio item.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">items</th>

<td class="govuk-c-table__cell ">array</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">Array of radio items.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">text</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Text to use within the radio label.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">html</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">HTML to use within the radio label. If this is provided, the text argument will be ignored.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">label</th>

<td class="govuk-c-table__cell ">object</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Provide additional attributes to the radio label.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">checked</th>

<td class="govuk-c-table__cell ">boolean</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">If true, radio will be checked.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">disabled</th>

<td class="govuk-c-table__cell ">boolean</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">If true, radio will be disabled.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">attributes</th>

<td class="govuk-c-table__cell ">object</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Any extra HTML attributes (for example data attributes) to add to the radio container.</td>

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

    npm outdated @govuk-frontend/radios

To update the latest version run:

    npm update @govuk-frontend/radios

## Contribution

Guidelines can be found at [on our Github repository.](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md "link to contributing guidelines on our github repository")

## License

MIT