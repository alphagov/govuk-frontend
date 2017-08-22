# Checkbox

Checkbox intro.

## Guidance

Guidance and documentation can be found on [GOV.UK Design System](linkgoeshere).

## Demo

Checkbox [demo](checkbox.html).

## Usage

Code example(s)

```
@@include('checkbox.html')
```

## Nunjucks

```
{% from 'checkbox/macro.njk' import govukCheckbox %}

{{ govukCheckbox(
  classes='',
  name='waste-types',
  id='waste-type',
  checkboxes=[
   {
      id: '1',
      value: 'waste-animal',
      label: 'Waste from animal carcasses'
    },
    {
      id: '2',
      value: 'waste-mines',
      label: 'Waste from mines or quarries'
    },
    {
      id: '3',
      value: 'waste-farm',
      label: 'Farm or agricultural waste',
      checked: 'true'
    },
    {
      id: '4',
      value: 'waste-disabled',
      label: 'Disabled checkbox option',
      disabled: 'true'
    }
  ]
) }}
```

## Arguments

| Name        | Type    | Default | Required | Description
|---          |---      |---      |---       |---
| classes     | string  |         | No       | Optional additional classes
| name        | string  |         | Yes      | Name of the group of checkboxes
| id          | string  |         | Yes      | ID is prefixed to the ID of each checkbox
| checkboxes  | array   |         | Yes      | Checkboxes array with id, value, label, checked and disabled keys


<!--
## Installation

```
npm install --save @govuk-frontend/checkbox
```
-->
