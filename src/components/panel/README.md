# Panel

The confirmation panel has a turquoise background and white text.
Used for transaction end pages, and Bank Holidays.

The information panel has a GOV.UK blue background and white text.
Used for explanatory pages.

## Guidance

Guidance and documentation can be found on [GOV.UK Design System](linkgoeshere).

## Demo

* Panel [demo](panel.html).

## Usage

Code example(s)

```
@@include('panel.html')
```

## Nunjucks

```
{% from "panel/macro.njk" import govukPanel %}

{{ govukInput(
  classes='',
  title='Application complete',
  content='Your reference number is',
  reference='HDJ2123F'
  )
}}
```

## Arguments

| Name          | Type    | Required  | Description
|---            |---      |---        |---
| classes       | string  | No        | Optional additional classes
| title         | string  | Yes       | The panel title
| content       | string  | No        | The panel content
| reference     | string  | No        | Optional reference number

<!--
## Installation

```
npm install --save @govuk-frontend/phase-banner
```
-->
