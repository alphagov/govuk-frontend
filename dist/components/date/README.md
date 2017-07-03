# Date

Component for entering Day/Month/Year dates.

## Guidance

Guidance and documentation can be found on [GOV.UK Design System](linkgoeshere).

## Demo

Date [demo](date.html).

## Usage

Code example(s)

```
<div class="govuk-c-date">
  <div class="govuk-c-date__item govuk-c-date__item--day">
    <label class="govuk-c-label govuk-c-date__label" for="dob-day">Day</label>
    <input class="govuk-c-input govuk-c-date__input" id="dob-day" name="dob-day" type="number" pattern="[0-9]*" min="0" max="31">
  </div>
  <div class="govuk-c-date__item govuk-c-date__item--month">
    <label class="govuk-c-label govuk-c-date__label" for="dob-month">Month</label>
    <input class="govuk-c-input govuk-c-date__input" id="dob-month" name="dob-month" type="number" pattern="[0-9]*" min="0" max="12">
  </div>
  <div class="govuk-c-date__item govuk-c-date__item--year">
    <label class="govuk-c-label govuk-c-date__label" for="dob-year">Year</label>
    <input class="govuk-c-input govuk-c-date__input" id="dob-year" name="dob-year" type="number" pattern="[0-9]*" min="0" max="2016">
  </div>
</div>

<legend>
  <span class="govuk-c-error-message">Error message goes here</span>
</legend>
<div class="govuk-c-date">
  <div class="govuk-c-date__item govuk-c-date__item--day">
    <label class="govuk-c-label govuk-c-date__label" for="dob-day-1">Day</label>
    <input class="govuk-c-input govuk-c-date__input govuk-c-input--error" id="dob-day-1" name="dob-day" type="number" pattern="[0-9]*" min="0" max="31">
  </div>
  <div class="govuk-c-date__item govuk-c-date__item--month">
    <label class="govuk-c-label govuk-c-date__label" for="dob-month-1">Month</label>
    <input class="govuk-c-input govuk-c-date__input" id="dob-month-1" name="dob-month" type="number" pattern="[0-9]*" min="0" max="12">
  </div>
  <div class="govuk-c-date__item govuk-c-date__item--year">
    <label class="govuk-c-label govuk-c-date__label" for="dob-year-1">Year</label>
    <input class="govuk-c-input govuk-c-date__input" id="dob-year-1" name="dob-year" type="number" pattern="[0-9]*" min="0" max="2016">
  </div>
</div>

```


<!--
## Installation

```
npm install --save @govuk-frontend/date
```
-->
