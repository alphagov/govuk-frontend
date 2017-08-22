# Inset text

Use bordered inset text to draw attention to important content on the page.

## Guidance

Guidance and documentation can be found on [GOV.UK Design System](linkgoeshere).

## Demo

Inset text [demo](inset-text.html).

## Usage

Code example(s)

```
@@include('inset-text.html')
```

## Nunjucks

```
{% from "inset-text/macro.njk" import govukInsetText %}

{{ govukInsetText(
  content='<p>
    It can take up to 8 weeks to register a lasting power of attorney if<br>
    there are no mistakes in the application.
  </p>'
  )
}}
```

## Arguments

| Name      | Type    | Required  | Description
|---        |---      |---        |---
| classes   | string  | No        | Optional additional classes
| content   | string  | Yes       | Inset text content

<!--
## Installation

```
npm install --save @govuk-frontend/inset-text
```
-->
