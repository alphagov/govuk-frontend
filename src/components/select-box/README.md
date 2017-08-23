# Select box

The HTML `<select>` element represents a control that provides a menu of options.

## Guidance

Guidance and documentation can be found on [GOV.UK Design system](linkgoeshere).

## Demo

Select box [demo](select-box.html).

## Usage

Code example(s)

```
@@include('select-box.html')
```

## Nunjucks
```
{{ govukSelectBox(
  classes='',
  id='select-box-1',
  name='select-box-1',
  options=[
    {
      value: '1',
      label: 'GOV.UK frontend option 1'
    },
    {
      value: '2',
      label: 'GOV.UK frontend option 2'
    },
    {
      value: '3',
      label: 'GOV.UK frontend option 3'
    }
  ]
)}}

{{ govukSelectBox(
  hasLabelWithText='Default label text',
  labelClasses='select-box__label',
  classes='',
  id='select-box-2',
  name='select-box-2',
  options=[
    {
      value: 'a',
      label: 'GOV.UK frontend option a'
    },
    {
      value: 'b',
      label: 'GOV.UK frontend option b',
      selected: 'true'
    },
    {
      value: 'c',
      label: 'GOV.UK frontend option c'
    }
  ]
)}}
```

## Arguments

| Name             | Type    | Default | Required | Description
|---               |---      |---      |---       |---
| classes          | string  |         | No       | Optional additional classes
| name             | string  |         | Yes      | Name of the group of checkboxes
| id               | string  |         | Yes      | ID for each checkbox
| name             | string  |         | Yes      | NAME for each checkbox
| options          | array   |         | Yes      | Options array with value, label, selected keys
| hasLabelWithText | string  |         | No       | Optional to provide label text that will render the label element
| labelClasses     | string  |         | No       | Optional to provide label with custom classes

<!--
## Installation

```
npm install --save @govuk-frontend/select-box
```
-->
