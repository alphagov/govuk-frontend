# Textarea

A multi-line text field.

## Guidance

Guidance and documentation can be found on [GOV.UK Design system](linkgoeshere).

## Demo

Textarea [demo](textarea.html).

## Usage

Code example(s)

```
@@include('textarea.html')
```

## Nunjucks

{% from "textarea/macro.njk" import govukTextarea %}

{{ govukTextarea(
  classes='',
  labelText='National Insurance number',
  hintText='',
  errorMessage='Error message goes here',
  id='input-id',
  name='input-name',
  number='5'
  )
}}

## Arguments

| Name          | Type    | Default   | Required  | Description
|---            |---      |---        |---        |---
| classes       | string  |           | No        | Optional additional classes
| labelText     | string  |           | Yes       | The label text
| hintText      | string  |           | No        | Optional hint text
| errorMessage  | string  |           | No        | Optional error message
| id            | string  |           | Yes       | The id of the textarea
| name          | string  |           | Yes       | The name of the textarea
| rows          | string  | 5         | No        | Change default number of textarea rows

<!--
## Installation

```
npm install --save @govuk-frontend/textarea
```
-->
