# Input

A single-line text field.

## Guidance

Guidance and documentation can be found on [GOV.UK Design system](linkgoeshere).

## Demo

Input [demo](input.html).

## Usage

Code example(s)

```
@@include('input-example.html')
```

## Nunjucks

@@include('input.njk')

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
