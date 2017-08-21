# Details

Component for conditionally revealing content, using the details HTML element.

## Guidance

Guidance and documentation can be found on [GOV.UK Design System](linkgoeshere).

## Demo

Details [demo](details.html).

## Usage

Code example(s)

```
@@include('details.html')
```

## Nunjucks

{% from "details/macro.njk" import govukDetails %}

{{ govukDetails(
  classes='',
  detailsSummaryText='Help with nationality',
  detailsText='<p>
    If you’re not sure about your nationality, try to find out from an official document like a passport or national ID card.
  </p>
  <p>
    We need to know your nationality so we can work out which elections you’re entitled to vote in. If you can’t provide your nationality, you’ll have to send copies of identity documents through the post.
  </p>'
  )
}}

## Arguments

| Name                | Type    | Default | Required  | Description
|---                  |---      |---      |---        |---
| classes             | string  |         | No        | Optional additional classes
| detailsSummaryText  | string  |         | Yes       | Summary element text
| detailsText         | string  |         | Yes       | Revealed details text

<!--
## Installation

```
npm install --save @govuk-frontend/details
```
-->
