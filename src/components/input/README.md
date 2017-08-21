# Input

A single-line text field.

## Guidance

Guidance and documentation can be found on [GOV.UK Design system](linkgoeshere).

## Demo

Input [demo](input.html).

## Usage

Code example(s)

```
@@include('input.html')
```

## Nunjucks

{% from "input/macro.njk" import govukInput %}

{{ govukInput(
  classes='',
  labelText='National Insurance number',
  hintText='It’s on your National Insurance card, benefit letter, payslip or P60.
    For example, ‘QQ 12 34 56 C’.',
  errorMessage='Error message goes here',
  id='input-id',
  name='input-name',
  value='initial value'
  )
}}

## Arguments

| Name          | Type    | Required  | Description
|---            |---      |---        |---
| classes       | string  | No        | Optional additional classes
| labelText     | string  | Yes       | The label text
| hintText      | string  | No        | Optional hint text
| errorMessage  | string  | No        | Optional error message
| id            | string  | Yes       | The id of the input
| name          | string  | Yes       | The name of the input, which is submitted with the form data.
| value         | string  | No        | Optional initial value of the input

<!--
## Installation

```
npm install --save @govuk-frontend/input
```
-->
