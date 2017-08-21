# Label

Use labels for all form fields.

## Guidance

Guidance and documentation can be found on [GOV.UK Design System](linkgoeshere).

## Demo

Label [demo](label.html).

## Usage

Code example(s)

```
@@include('label.html')
```

## Nunjucks

{% from "label/macro.njk" import govukLabel %}

{{ govukLabel(
  classes='',
  labelText='National Insurance number',
  hintText='It’s on your National Insurance card, benefit letter, payslip or P60.
    For example, ‘QQ 12 34 56 C’.',
  errorMessage='Error message goes here',
  id=''
  )
}}

## Arguments

| Name          | Type    | Required  | Description
|---            |---      |---        |---
| classes       | string  | No        | Optional additional classes
| labelText     | string  | Yes       | The label text
| hintText      | string  | No        | Optional hint text
| errorMessage  | string  | No        | Optional error message
| id            | string  | Yes       | The value of the for attribute, the id input the label is associated with

<!--
## Installation

```
npm install --save @govuk-frontend/label
```
-->

# Implementation

Labels should be associated with form fields using the `for` attribute.
