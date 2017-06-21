# Label

Use labels for all form fields.

## Guidance

Guidance and documentation can be found on [GOV.UK Design System](linkgoeshere).

## Demo

Label [demo](label.html).

## Usage

Code example(s)

```
<label class="govuk-c-label">
  National Insurance number
  <span class="govuk-c-label__hint">
    It's on your National Insurance card, benefit letter, payslip or P60.
    For example, ‘QQ 12 34 56 C’.
  </span>
</label>

<label class="govuk-c-label govuk-c-label--bold">
  National Insurance number
  <span class="govuk-c-label__hint">
    It's on your National Insurance card, benefit letter, payslip or P60.
    For example, ‘QQ 12 34 56 C’.
  </span>
</label>

```


## Installation

```
npm install --save @govuk-frontend/label
```



# Implementation

Labels should be associated with form fields using the `for` attribute.
