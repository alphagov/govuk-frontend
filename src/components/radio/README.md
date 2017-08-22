# Radio

A radio button. You must use the `value` attribute to define the value submitted by this item. Use the `checked` attribute to indicate whether this item is selected by default. Radio buttons that have the same value for the name attribute are in the same "radio button group". Only one radio button in a group can be selected at a time.

## Guidance

Guidance and documentation can be found on [GOV.UK Design system](linkgoeshere).

## Demo

Radio button [demo](radio.html).

## Usage

Code example(s)

```
@@include('radio.html')
```
## Nunjucks

```
{% from 'checkbox/macro.njk' import govukCheckbox %}

{{ govukCheckbox(
  classes='',
  name='radio-group',
  id='radio',
  radios=[
   {
      id: '1',
      value: 'Yes',
      label: 'Waste from animal carcasses'
    },
    {
      id: '2',
      value: No',
      label: 'Waste from mines or quarries'
    },
    {
      id: '3',
      value: 'No',
      label: 'Farm or agricultural waste',
      checked: 'true'
    },
    {
      id: '4',
      value: 'NA',
      label: 'Not applicable',
      disabled: 'true'
    }
  ]
) }}
```

## Arguments

| Name        | Type    | Default | Required | Description
|---          |---      |---      |---       |---
| classes     | string  |         | No       | Optional additional classes
| name        | string  |         | Yes      | Name of the group of radio buttons
| id          | string  |         | Yes      | ID is prefixed to the ID of each radio button
| radios      | array   |         | Yes      | Radios array with id, value, label, checked and disabled keys

<!--
## Installation

```
npm install --save @govuk-frontend/radio
```
-->
