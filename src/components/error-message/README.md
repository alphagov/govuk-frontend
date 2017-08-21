# Error message

Component to show a red error message - used for form validation.
Use inside a label or legend.

## Guidance

Guidance and documentation can be found on [GOV.UK Design System](linkgoeshere).

## Demo

Error message [demo](error-message.html).

## Usage

Code example(s)

```
@@include('error-message.html')
```

## Nujucks

```
{% from "error-message/macro.njk" import govukErrorMessage %}

{{ govukErrorMessage(
  classes='',
  errorMessageText='Error message goes here'
  )
}}
```

## Usage


| Name              | Type    | Default | Required  | Description
|---                |---      |---      |---        |---
| classes           | string  |         | No        | Optional additional classes
| errorMessageText  | string  |         | Yes       | Error message

<!--
## Installation

```
npm install --save @govuk-frontend/error-message
```
-->
