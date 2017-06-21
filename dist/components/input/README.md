# Input

A single-line text field.

## Guidance

Guidance and documentation can be found on [GOV.UK Design system](linkgoeshere).

## Demo

Input [demo](input.html).

## Usage

Code example(s)

```
<label class="govuk-c-label" for="govuk-c-input-a">
  National Insurance number
</label>
<input class="govuk-c-input" id="govuk-c-input-a" type="text">

<label class="govuk-c-label" for="govuk-c-label-b">
  National Insurance number
  <span class="govuk-c-error-message">
    Error message goes here
  </span>
</label>
<input class="govuk-c-input govuk-c-input--error" id="govuk-c-input-b" type="text">

<label class="govuk-c-label" for="govuk-c-input-c">
  National Insurance number
  <span class="govuk-c-label__hint">
    It's on your National Insurance card, benefit letter, payslip or P60.
    <br>
    For example, ‘QQ 12 34 56 C’.
  </span>
</label>
<input class="govuk-c-input" id="govuk-c-input-c" type="text">

<label class="govuk-c-label" for="govuk-c-label-d">
  National Insurance number
  <span class="govuk-c-label__hint">
    It's on your National Insurance card, benefit letter, payslip or P60.
    <br>
    For example, ‘QQ 12 34 56 C’.
  </span>
  <span class="govuk-c-error-message">
    Error message goes here
  </span>
</label>
<input class="govuk-c-input govuk-c-input--error" id="govuk-c-input-d" type="text">


```


<!--
## Installation

```
npm install --save @govuk-frontend/input
```
-->
