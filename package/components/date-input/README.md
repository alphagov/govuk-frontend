# Date input

## Introduction

A component for entering dates, for example - date of birth.

## Guidance

Find out when to use the date input component in your service in the [GOV.UK Design System](https://design-system.service.gov.uk/components/date-input).

## Quick start examples

### Date input

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/date-input/preview)

#### Markup

    <div class="govuk-form-group">
    <fieldset class="govuk-fieldset" aria-describedby="dob-hint" role="group">

      <legend class="govuk-fieldset__legend">
        What is your date of birth?
      </legend>

      <span id="dob-hint" class="govuk-hint">
        For example, 31 3 1980
      </span>

      <div class="govuk-date-input" id="dob">

        <div class="govuk-date-input__item">
          <div class="govuk-form-group">
            <label class="govuk-label govuk-date-input__label" for="dob-day">
              Day
            </label>

            <input class="govuk-input govuk-date-input__input govuk-input--width-2 govuk-input--width-2" id="dob-day" name="dob-day" type="number" pattern="[0-9]*">
          </div>
        </div>

        <div class="govuk-date-input__item">
          <div class="govuk-form-group">
            <label class="govuk-label govuk-date-input__label" for="dob-month">
              Month
            </label>

            <input class="govuk-input govuk-date-input__input govuk-input--width-2 govuk-input--width-2" id="dob-month" name="dob-month" type="number" pattern="[0-9]*">
          </div>
        </div>

        <div class="govuk-date-input__item">
          <div class="govuk-form-group">
            <label class="govuk-label govuk-date-input__label" for="dob-year">
              Year
            </label>

            <input class="govuk-input govuk-date-input__input govuk-input--width-4 govuk-input--width-4" id="dob-year" name="dob-year" type="number" pattern="[0-9]*">
          </div>
        </div>

      </div>
      </fieldset>

    </div>

#### Macro

    {% from "date-input/macro.njk" import govukDateInput %}

    {{ govukDateInput({
      "id": "dob",
      "name": "dob",
      "fieldset": {
        "legend": {
          "text": "What is your date of birth?"
        }
      },
      "hint": {
        "text": "For example, 31 3 1980"
      },
      "items": [
        {
          "name": "day",
          "classes": "govuk-input--width-2"
        },
        {
          "name": "month",
          "classes": "govuk-input--width-2"
        },
        {
          "name": "year",
          "classes": "govuk-input--width-4"
        }
      ]
    }) }}

### Date input with errors

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/date-input/with-errors/preview)

#### Markup

    <div class="govuk-form-group govuk-form-group--error">
    <fieldset class="govuk-fieldset" aria-describedby="dob-errors-hint dob-errors-error" role="group">

      <legend class="govuk-fieldset__legend">
        What is your date of birth?
      </legend>

      <span id="dob-errors-hint" class="govuk-hint">
        For example, 31 3 1980
      </span>

      <span id="dob-errors-error" class="govuk-error-message">
        Error message goes here
      </span>

      <div class="govuk-date-input" id="dob-errors">

        <div class="govuk-date-input__item">
          <div class="govuk-form-group">
            <label class="govuk-label govuk-date-input__label" for="dob-errors-day">
              Day
            </label>

            <input class="govuk-input govuk-date-input__input govuk-input--width-2 govuk-input--width-2 govuk-input--error" id="dob-errors-day" name="day" type="number" pattern="[0-9]*">
          </div>
        </div>

        <div class="govuk-date-input__item">
          <div class="govuk-form-group">
            <label class="govuk-label govuk-date-input__label" for="dob-errors-month">
              Month
            </label>

            <input class="govuk-input govuk-date-input__input govuk-input--width-2 govuk-input--width-2 govuk-input--error" id="dob-errors-month" name="month" type="number" pattern="[0-9]*">
          </div>
        </div>

        <div class="govuk-date-input__item">
          <div class="govuk-form-group">
            <label class="govuk-label govuk-date-input__label" for="dob-errors-year">
              Year
            </label>

            <input class="govuk-input govuk-date-input__input govuk-input--width-4 govuk-input--width-4 govuk-input--error" id="dob-errors-year" name="year" type="number" pattern="[0-9]*">
          </div>
        </div>

      </div>
      </fieldset>

    </div>

#### Macro

    {% from "date-input/macro.njk" import govukDateInput %}

    {{ govukDateInput({
      "id": "dob-errors",
      "fieldset": {
        "legend": {
          "text": "What is your date of birth?"
        }
      },
      "hint": {
        "text": "For example, 31 3 1980"
      },
      "errorMessage": {
        "text": "Error message goes here"
      },
      "items": [
        {
          "name": "day",
          "classes": "govuk-input--width-2 govuk-input--error"
        },
        {
          "name": "month",
          "classes": "govuk-input--width-2 govuk-input--error"
        },
        {
          "name": "year",
          "classes": "govuk-input--width-4 govuk-input--error"
        }
      ]
    }) }}

### Date input with error on day input

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/date-input/with-error-on-day-input/preview)

#### Markup

    <div class="govuk-form-group govuk-form-group--error">
    <fieldset class="govuk-fieldset" aria-describedby="dob-day-error-hint dob-day-error-error" role="group">

      <legend class="govuk-fieldset__legend">
        What is your date of birth?
      </legend>

      <span id="dob-day-error-hint" class="govuk-hint">
        For example, 31 3 1980
      </span>

      <span id="dob-day-error-error" class="govuk-error-message">
        Error message goes here
      </span>

      <div class="govuk-date-input" id="dob-day-error">

        <div class="govuk-date-input__item">
          <div class="govuk-form-group">
            <label class="govuk-label govuk-date-input__label" for="dob-day-error-day">
              Day
            </label>

            <input class="govuk-input govuk-date-input__input govuk-input--width-2 govuk-input--width-2 govuk-input--error" id="dob-day-error-day" name="dob-day-error-day" type="number" pattern="[0-9]*">
          </div>
        </div>

        <div class="govuk-date-input__item">
          <div class="govuk-form-group">
            <label class="govuk-label govuk-date-input__label" for="dob-day-error-month">
              Month
            </label>

            <input class="govuk-input govuk-date-input__input govuk-input--width-2 govuk-input--width-2" id="dob-day-error-month" name="dob-day-error-month" type="number" pattern="[0-9]*">
          </div>
        </div>

        <div class="govuk-date-input__item">
          <div class="govuk-form-group">
            <label class="govuk-label govuk-date-input__label" for="dob-day-error-year">
              Year
            </label>

            <input class="govuk-input govuk-date-input__input govuk-input--width-4 govuk-input--width-4" id="dob-day-error-year" name="dob-day-error-year" type="number" pattern="[0-9]*">
          </div>
        </div>

      </div>
      </fieldset>

    </div>

#### Macro

    {% from "date-input/macro.njk" import govukDateInput %}

    {{ govukDateInput({
      "id": "dob-day-error",
      "name": "dob-day-error",
      "fieldset": {
        "legend": {
          "text": "What is your date of birth?"
        }
      },
      "hint": {
        "text": "For example, 31 3 1980"
      },
      "errorMessage": {
        "text": "Error message goes here"
      },
      "items": [
        {
          "name": "day",
          "classes": "govuk-input--width-2 govuk-input--error"
        },
        {
          "name": "month",
          "classes": "govuk-input--width-2"
        },
        {
          "name": "year",
          "classes": "govuk-input--width-4"
        }
      ]
    }) }}

### Date input with error on month input

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/date-input/with-error-on-month-input/preview)

#### Markup

    <div class="govuk-form-group govuk-form-group--error">
    <fieldset class="govuk-fieldset" aria-describedby="dob-month-error-hint dob-month-error-error" role="group">

      <legend class="govuk-fieldset__legend">
        What is your date of birth?
      </legend>

      <span id="dob-month-error-hint" class="govuk-hint">
        For example, 31 3 1980
      </span>

      <span id="dob-month-error-error" class="govuk-error-message">
        Error message goes here
      </span>

      <div class="govuk-date-input" id="dob-month-error">

        <div class="govuk-date-input__item">
          <div class="govuk-form-group">
            <label class="govuk-label govuk-date-input__label" for="dob-month-error-day">
              Day
            </label>

            <input class="govuk-input govuk-date-input__input govuk-input--width-2 govuk-input--width-2" id="dob-month-error-day" name="dob-month-error-day" type="number" pattern="[0-9]*">
          </div>
        </div>

        <div class="govuk-date-input__item">
          <div class="govuk-form-group">
            <label class="govuk-label govuk-date-input__label" for="dob-month-error-month">
              Month
            </label>

            <input class="govuk-input govuk-date-input__input govuk-input--width-2 govuk-input--width-2 govuk-input--error" id="dob-month-error-month" name="dob-month-error-month" type="number" pattern="[0-9]*">
          </div>
        </div>

        <div class="govuk-date-input__item">
          <div class="govuk-form-group">
            <label class="govuk-label govuk-date-input__label" for="dob-month-error-year">
              Year
            </label>

            <input class="govuk-input govuk-date-input__input govuk-input--width-4 govuk-input--width-4" id="dob-month-error-year" name="dob-month-error-year" type="number" pattern="[0-9]*">
          </div>
        </div>

      </div>
      </fieldset>

    </div>

#### Macro

    {% from "date-input/macro.njk" import govukDateInput %}

    {{ govukDateInput({
      "id": "dob-month-error",
      "name": "dob-month-error",
      "fieldset": {
        "legend": {
          "text": "What is your date of birth?"
        }
      },
      "hint": {
        "text": "For example, 31 3 1980"
      },
      "errorMessage": {
        "text": "Error message goes here"
      },
      "items": [
        {
          "name": "day",
          "classes": "govuk-input--width-2"
        },
        {
          "name": "month",
          "classes": "govuk-input--width-2 govuk-input--error"
        },
        {
          "name": "year",
          "classes": "govuk-input--width-4"
        }
      ]
    }) }}

### Date input with error on year input

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/date-input/with-error-on-year-input/preview)

#### Markup

    <div class="govuk-form-group govuk-form-group--error">
    <fieldset class="govuk-fieldset" aria-describedby="dob-year-error-hint dob-year-error-error" role="group">

      <legend class="govuk-fieldset__legend">
        What is your date of birth?
      </legend>

      <span id="dob-year-error-hint" class="govuk-hint">
        For example, 31 3 1980
      </span>

      <span id="dob-year-error-error" class="govuk-error-message">
        Error message goes here
      </span>

      <div class="govuk-date-input" id="dob-year-error">

        <div class="govuk-date-input__item">
          <div class="govuk-form-group">
            <label class="govuk-label govuk-date-input__label" for="dob-year-error-day">
              Day
            </label>

            <input class="govuk-input govuk-date-input__input govuk-input--width-2 govuk-input--width-2" id="dob-year-error-day" name="dob-year-error-day" type="number" pattern="[0-9]*">
          </div>
        </div>

        <div class="govuk-date-input__item">
          <div class="govuk-form-group">
            <label class="govuk-label govuk-date-input__label" for="dob-year-error-month">
              Month
            </label>

            <input class="govuk-input govuk-date-input__input govuk-input--width-2 govuk-input--width-2" id="dob-year-error-month" name="dob-year-error-month" type="number" pattern="[0-9]*">
          </div>
        </div>

        <div class="govuk-date-input__item">
          <div class="govuk-form-group">
            <label class="govuk-label govuk-date-input__label" for="dob-year-error-year">
              Year
            </label>

            <input class="govuk-input govuk-date-input__input govuk-input--width-4 govuk-input--width-4 govuk-input--error" id="dob-year-error-year" name="dob-year-error-year" type="number" pattern="[0-9]*">
          </div>
        </div>

      </div>
      </fieldset>

    </div>

#### Macro

    {% from "date-input/macro.njk" import govukDateInput %}

    {{ govukDateInput({
      "id": "dob-year-error",
      "name": "dob-year-error",
      "fieldset": {
        "legend": {
          "text": "What is your date of birth?"
        }
      },
      "hint": {
        "text": "For example, 31 3 1980"
      },
      "errorMessage": {
        "text": "Error message goes here"
      },
      "items": [
        {
          "name": "day",
          "classes": "govuk-input--width-2"
        },
        {
          "name": "month",
          "classes": "govuk-input--width-2"
        },
        {
          "name": "year",
          "classes": "govuk-input--width-4 govuk-input--error"
        }
      ]
    }) }}

### Date input with default items

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/date-input/with-default-items/preview)

#### Markup

    <div class="govuk-form-group">
    <fieldset class="govuk-fieldset" aria-describedby="dob-hint" role="group">

      <legend class="govuk-fieldset__legend">
        What is your date of birth?
      </legend>

      <span id="dob-hint" class="govuk-hint">
        For example, 31 3 1980
      </span>

      <div class="govuk-date-input" id="dob">

        <div class="govuk-date-input__item">
          <div class="govuk-form-group">
            <label class="govuk-label govuk-date-input__label" for="dob-day">
              Day
            </label>

            <input class="govuk-input govuk-date-input__input govuk-input--width-2 govuk-input--width-2" id="dob-day" name="dob-day" type="number" pattern="[0-9]*">
          </div>
        </div>

        <div class="govuk-date-input__item">
          <div class="govuk-form-group">
            <label class="govuk-label govuk-date-input__label" for="dob-month">
              Month
            </label>

            <input class="govuk-input govuk-date-input__input govuk-input--width-2 govuk-input--width-2" id="dob-month" name="dob-month" type="number" pattern="[0-9]*">
          </div>
        </div>

        <div class="govuk-date-input__item">
          <div class="govuk-form-group">
            <label class="govuk-label govuk-date-input__label" for="dob-year">
              Year
            </label>

            <input class="govuk-input govuk-date-input__input govuk-input--width-4 govuk-input--width-4" id="dob-year" name="dob-year" type="number" pattern="[0-9]*">
          </div>
        </div>

      </div>
      </fieldset>

    </div>

#### Macro

    {% from "date-input/macro.njk" import govukDateInput %}

    {{ govukDateInput({
      "id": "dob",
      "name": "dob",
      "fieldset": {
        "legend": {
          "text": "What is your date of birth?"
        }
      },
      "hint": {
        "text": "For example, 31 3 1980"
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

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional id. This is used for the main component and to compose id attribute for each item.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">name</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional name. This is used to compose the name attribute for each item.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">items</th>

<td class="govuk-table__cell ">array</td>

<td class="govuk-table__cell ">Yes</td>

<td class="govuk-table__cell ">An array of input objects with name, value and optional classes</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">items.{}.id</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional item-specific id. If provided, it will be used instead of the generated id.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">items.{}.name</th>

<td class="govuk-table__cell ">array</td>

<td class="govuk-table__cell ">Yes</td>

<td class="govuk-table__cell ">Item-specific name attribute.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">items.{}.value</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional item-specific value attribute. If provided, it will be used as the initial value of the input.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">hint</th>

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional hint. See hint component.</td>

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

<td class="govuk-table__cell ">Arguments for the fieldset component (e.g. legend). See fieldset component.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">classes</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional additional classes to add to the date-input container.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">attributes</th>

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Any extra HTML attributes (for example data attributes) to add to the date-input container.</td>

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