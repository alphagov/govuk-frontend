# Date input

## Introduction

A component for entering dates, for example - date of birth.

## Guidance

Find out when to use the Date input component in your service in the [GOV.UK Design System](https://govuk-design-system-production.cloudapps.digital/components/date-input).

## Quick start examples

### Component default

[Preview the date-input component](http://govuk-frontend-review.herokuapp.com/components/date-input/preview)

#### Markup

      <div class="govuk-form-group">
      <fieldset class="govuk-fieldset">

        <legend class="govuk-fieldset__legend">
          What is your date of birth?

          <span class="govuk-fieldset__hint">For example, 31 3 1980</span>

        </legend>

      <div class="govuk-date-input" id="dob">

          <div class="govuk-date-input__item govuk-date-input__item--day">
            <div class="govuk-form-group"><label class="govuk-label govuk-date-input__label" for="dob-day">
            Day

          </label>
          <input class="govuk-input govuk-date-input__input" id="dob-day" name="dob-day" type="number" pattern="[0-9]*">
          </div>
          </div>

          <div class="govuk-date-input__item govuk-date-input__item--month">
            <div class="govuk-form-group"><label class="govuk-label govuk-date-input__label" for="dob-month">
            Month

          </label>
          <input class="govuk-input govuk-date-input__input" id="dob-month" name="dob-month" type="number" pattern="[0-9]*">
          </div>
          </div>

          <div class="govuk-date-input__item govuk-date-input__item--year">
            <div class="govuk-form-group"><label class="govuk-label govuk-date-input__label" for="dob-year">
            Year

          </label>
          <input class="govuk-input govuk-date-input__input" id="dob-year" name="dob-year" type="number" pattern="[0-9]*">
          </div>
          </div>

        </div>
      </fieldset>
    </div>

#### Macro

    {% from 'date-input/macro.njk' import govukDateInput %}

    {{ govukDateInput({
      "id": "dob",
      "name": "dob",
      "fieldset": {
        "legendText": "What is your date of birth?",
        "legendHintText": "For example, 31 3 1980"
      },
      "items": [
        {
          "name": "day"
        },
        {
          "name": "month"
        },
        {
          "name": "year"
        }
      ]
    }) }}

### Date-input--with-errors

[Preview the date-input--with-errors example](http://govuk-frontend-review.herokuapp.com/components/date-input/with-errors/preview)

#### Markup

      <div class="govuk-form-group govuk-form-group--error">
      <fieldset class="govuk-fieldset">

        <legend class="govuk-fieldset__legend">
          What is your date of birth?

          <span class="govuk-fieldset__hint">For example, 31 3 1980</span>

          <span class="govuk-error-message">
          Error message goes here
        </span>

        </legend>

      <div class="govuk-date-input" id="dob-errors">

          <div class="govuk-date-input__item govuk-date-input__item--day">
            <div class="govuk-form-group"><label class="govuk-label govuk-date-input__label" for="dob-errors-day">
            Day

          </label>
          <input class="govuk-input govuk-date-input__input govuk-input--error" id="dob-errors-day" name="undefined-day" type="number" pattern="[0-9]*">
          </div>
          </div>

          <div class="govuk-date-input__item govuk-date-input__item--month">
            <div class="govuk-form-group"><label class="govuk-label govuk-date-input__label" for="dob-errors-month">
            Month

          </label>
          <input class="govuk-input govuk-date-input__input govuk-input--error" id="dob-errors-month" name="undefined-month" type="number" pattern="[0-9]*">
          </div>
          </div>

          <div class="govuk-date-input__item govuk-date-input__item--year">
            <div class="govuk-form-group"><label class="govuk-label govuk-date-input__label" for="dob-errors-year">
            Year

          </label>
          <input class="govuk-input govuk-date-input__input govuk-input--error" id="dob-errors-year" name="undefined-year" type="number" pattern="[0-9]*">
          </div>
          </div>

        </div>
      </fieldset>
    </div>

#### Macro

    {% from 'date-input/macro.njk' import govukDateInput %}

    {{ govukDateInput({
      "id": "dob-errors",
      "fieldset": {
        "legendText": "What is your date of birth?",
        "legendHintText": "For example, 31 3 1980"
      },
      "errorMessage": {
        "text": "Error message goes here"
      },
      "items": [
        {
          "name": "day",
          "classes": "govuk-input--error"
        },
        {
          "name": "month",
          "classes": "govuk-input--error"
        },
        {
          "name": "year",
          "classes": "govuk-input--error"
        }
      ]
    }) }}

### Date-input--with-day-error

[Preview the date-input--with-day-error example](http://govuk-frontend-review.herokuapp.com/components/date-input/with-day-error/preview)

#### Markup

      <div class="govuk-form-group govuk-form-group--error">
      <fieldset class="govuk-fieldset">

        <legend class="govuk-fieldset__legend">
          What is your date of birth?

          <span class="govuk-fieldset__hint">For example, 31 3 1980</span>

          <span class="govuk-error-message">
          Error message goes here
        </span>

        </legend>

      <div class="govuk-date-input" id="dob-day-error">

          <div class="govuk-date-input__item govuk-date-input__item--day">
            <div class="govuk-form-group"><label class="govuk-label govuk-date-input__label" for="dob-day-error-day">
            Day

          </label>
          <input class="govuk-input govuk-date-input__input govuk-input--error" id="dob-day-error-day" name="dob-day-error-day" type="number" pattern="[0-9]*">
          </div>
          </div>

          <div class="govuk-date-input__item govuk-date-input__item--month">
            <div class="govuk-form-group"><label class="govuk-label govuk-date-input__label" for="dob-day-error-month">
            Month

          </label>
          <input class="govuk-input govuk-date-input__input" id="dob-day-error-month" name="dob-day-error-month" type="number" pattern="[0-9]*">
          </div>
          </div>

          <div class="govuk-date-input__item govuk-date-input__item--year">
            <div class="govuk-form-group"><label class="govuk-label govuk-date-input__label" for="dob-day-error-year">
            Year

          </label>
          <input class="govuk-input govuk-date-input__input" id="dob-day-error-year" name="dob-day-error-year" type="number" pattern="[0-9]*">
          </div>
          </div>

        </div>
      </fieldset>
    </div>

#### Macro

    {% from 'date-input/macro.njk' import govukDateInput %}

    {{ govukDateInput({
      "id": "dob-day-error",
      "name": "dob-day-error",
      "fieldset": {
        "legendText": "What is your date of birth?",
        "legendHintText": "For example, 31 3 1980"
      },
      "errorMessage": {
        "text": "Error message goes here"
      },
      "items": [
        {
          "name": "day",
          "classes": "govuk-input--error"
        },
        {
          "name": "month"
        },
        {
          "name": "year"
        }
      ]
    }) }}

### Date-input--with-month-error

[Preview the date-input--with-month-error example](http://govuk-frontend-review.herokuapp.com/components/date-input/with-month-error/preview)

#### Markup

      <div class="govuk-form-group govuk-form-group--error">
      <fieldset class="govuk-fieldset">

        <legend class="govuk-fieldset__legend">
          What is your date of birth?

          <span class="govuk-fieldset__hint">For example, 31 3 1980</span>

          <span class="govuk-error-message">
          Error message goes here
        </span>

        </legend>

      <div class="govuk-date-input" id="dob-month-error">

          <div class="govuk-date-input__item govuk-date-input__item--day">
            <div class="govuk-form-group"><label class="govuk-label govuk-date-input__label" for="dob-month-error-day">
            Day

          </label>
          <input class="govuk-input govuk-date-input__input" id="dob-month-error-day" name="dob-month-error-day" type="number" pattern="[0-9]*">
          </div>
          </div>

          <div class="govuk-date-input__item govuk-date-input__item--month">
            <div class="govuk-form-group"><label class="govuk-label govuk-date-input__label" for="dob-month-error-month">
            Month

          </label>
          <input class="govuk-input govuk-date-input__input govuk-input--error" id="dob-month-error-month" name="dob-month-error-month" type="number" pattern="[0-9]*">
          </div>
          </div>

          <div class="govuk-date-input__item govuk-date-input__item--year">
            <div class="govuk-form-group"><label class="govuk-label govuk-date-input__label" for="dob-month-error-year">
            Year

          </label>
          <input class="govuk-input govuk-date-input__input" id="dob-month-error-year" name="dob-month-error-year" type="number" pattern="[0-9]*">
          </div>
          </div>

        </div>
      </fieldset>
    </div>

#### Macro

    {% from 'date-input/macro.njk' import govukDateInput %}

    {{ govukDateInput({
      "id": "dob-month-error",
      "name": "dob-month-error",
      "fieldset": {
        "legendText": "What is your date of birth?",
        "legendHintText": "For example, 31 3 1980"
      },
      "errorMessage": {
        "text": "Error message goes here"
      },
      "items": [
        {
          "name": "day"
        },
        {
          "name": "month",
          "classes": "govuk-input--error"
        },
        {
          "name": "year"
        }
      ]
    }) }}

### Date-input--with-year-error

[Preview the date-input--with-year-error example](http://govuk-frontend-review.herokuapp.com/components/date-input/with-year-error/preview)

#### Markup

      <div class="govuk-form-group govuk-form-group--error">
      <fieldset class="govuk-fieldset">

        <legend class="govuk-fieldset__legend">
          What is your date of birth?

          <span class="govuk-fieldset__hint">For example, 31 3 1980</span>

          <span class="govuk-error-message">
          Error message goes here
        </span>

        </legend>

      <div class="govuk-date-input" id="dob-year-error">

          <div class="govuk-date-input__item govuk-date-input__item--day">
            <div class="govuk-form-group"><label class="govuk-label govuk-date-input__label" for="dob-year-error-day">
            Day

          </label>
          <input class="govuk-input govuk-date-input__input" id="dob-year-error-day" name="dob-year-error-day" type="number" pattern="[0-9]*">
          </div>
          </div>

          <div class="govuk-date-input__item govuk-date-input__item--month">
            <div class="govuk-form-group"><label class="govuk-label govuk-date-input__label" for="dob-year-error-month">
            Month

          </label>
          <input class="govuk-input govuk-date-input__input" id="dob-year-error-month" name="dob-year-error-month" type="number" pattern="[0-9]*">
          </div>
          </div>

          <div class="govuk-date-input__item govuk-date-input__item--year">
            <div class="govuk-form-group"><label class="govuk-label govuk-date-input__label" for="dob-year-error-year">
            Year

          </label>
          <input class="govuk-input govuk-date-input__input govuk-input--error" id="dob-year-error-year" name="dob-year-error-year" type="number" pattern="[0-9]*">
          </div>
          </div>

        </div>
      </fieldset>
    </div>

#### Macro

    {% from 'date-input/macro.njk' import govukDateInput %}

    {{ govukDateInput({
      "id": "dob-year-error",
      "name": "dob-year-error",
      "fieldset": {
        "legendText": "What is your date of birth?",
        "legendHintText": "For example, 31 3 1980"
      },
      "errorMessage": {
        "text": "Error message goes here"
      },
      "items": [
        {
          "name": "day"
        },
        {
          "name": "month"
        },
        {
          "name": "year",
          "classes": "govuk-input--error"
        }
      ]
    }) }}

## Dependencies

To consume the date-input component you must be running npm version 5 or above.

## Installation

    npm install --save @govuk-frontend/date-input

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

<th class="govuk-table__header" scope="row">classes</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional additional classes</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">id</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional id. This is used for the main component and to compose the items' ids.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">name</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional name. This is used to compose the items' names.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">attributes</th>

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Any extra HTML attributes (for example data attributes) to add to the date div tag.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">items</th>

<td class="govuk-table__cell ">array</td>

<td class="govuk-table__cell ">Yes</td>

<td class="govuk-table__cell ">An array of input objects with name, value and optional classes</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">errorMessage</th>

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional error message. See errorMessage component.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">fieldset</th>

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Arguments for the fieldset component (e.g. legendText, legendHintText, errorMessage). See fieldset component.</td>

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

    npm outdated @govuk-frontend/date-input

To update the latest version run:

    npm update @govuk-frontend/date-input

## Contribution

Guidelines can be found at [on our Github repository.](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md "link to contributing guidelines on our github repository")

## License

MIT