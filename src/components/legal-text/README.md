# Legal text

Use bold text with an exclamation icon if there are legal consequences - for example, a fine or prison sentence.

## Guidance

Guidance and documentation can be found on [GOV.UK Design System](linkgoeshere).

## Demo

Legal text [demo](legal-text.html).

## Usage

Code example(s)

```
@@include('legal-text.html')
```

## Nunjucks

```
{% from "legal-text/macro.njk" import govukLegalText %}

{{ govukLegalText(
  iconFallbackText='Warning',
  legalText='You can be fined up to £5,000 if you don’t register.')
}}
```

## Arguments

| Name              | Type    | Default | Required  | Description
|---                |---      |---      |---        |---
| iconFallbackText  | string  |         | Yes       | The fallback text for the icon
| legalText         | string  |         | Yes       | The text next to the icon

<!--
## Installation

```
npm install --save @govuk-frontend/legal-text
```
-->
