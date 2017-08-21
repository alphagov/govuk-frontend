# Fieldset

The fieldset element is used to group several controls within a web form.
The legend element represents a caption for the content of its parent fieldset.

## Guidance

Guidance and documentation can be found on [GOV.UK Design System](linkgoeshere).

## Demo

Fieldset and legend [demo](fieldset.html).

## Usage

Code example(s)

```
@@include('fieldset.html')
```

## Nunjucks

```
{% from "fieldset/macro.njk" import govukFieldset %}

{{ govukFieldset(
  classes='',
  legendText='Legend text goes here'
  )
}}
```

## Arguments

| Name        | Type    | Default | Required  | Description
|---          |---      |---      |---        |---
| classes     | string  |         | No        | Optional additional classes
| legendText  | string  |         | No        | Legend text

<!--
## Installation

```
npm install --save @govuk-frontend/fieldset
```
-->
