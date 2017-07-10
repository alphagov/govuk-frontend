# Radio

A radio button. You must use the `value` attribute to define the value submitted by this item. Use the `checked` attribute to indicate whether this item is selected by default. Radio buttons that have the same value for the name attribute are in the same "radio button group". Only one radio button in a group can be selected at a time.

## Guidance

Guidance and documentation can be found on [GOV.UK Design system](linkgoeshere).

## Demo

Radio button [demo](radio.html).

## Usage

Code example(s)

```
<div class="govuk-c-radio">
  <input class="govuk-c-radio__input" id="radio-1" type="radio" name="radio-group" value="Yes">
  <label class="govuk-c-radio__label" for="radio-1">Yes</label>
</div>
<div class="govuk-c-radio">
  <input class="govuk-c-radio__input" id="radio-2" type="radio" name="radio-group" value="No">
  <label class="govuk-c-radio__label" for="radio-2">No</label>
</div>
<div class="govuk-c-radio">
  <input class="govuk-c-radio__input" id="radio-3" type="radio" name="radio-group" disabled="disabled" value="NA">
  <label class="govuk-c-radio__label" for="radio-3">Not applicable</label>
</div>

```



## Installation

```
npm install --save @govuk-frontend/radio
```

