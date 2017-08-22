# Details

Component for conditionally revealing content, using the details HTML element.

## Guidance

Guidance and documentation can be found on [GOV.UK Design System](linkgoeshere).

## Demo

Details [demo](details.html).

## Usage

Code example(s)

```
@@include('details-example.html')
```

## Nunjucks

```
@@include('details.njk')
```

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
