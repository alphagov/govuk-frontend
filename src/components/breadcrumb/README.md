# Breadcrumb

Breadcrumb navigation, showing page hierarchy.

## Guidance

Guidance and documentation can be found on [GOV.UK Design System](linkgoeshere).

## Demo

Breadcrumb [demo](breadcrumb.html).

## Usage

Code example(s)

```
@@include('breadcrumb.html')
```

## Nunjucks

```
{% from "breadcrumb/macro.njk" import govukBreadcrumb %}

{{ govukBreadcrumb(
  classes='',
  [
    { title: 'Home', url: '/' },
    { title: 'Current page' }
  ]
) }}
```

## Arguments

| Name        | Type   | Default | Required | Description
|---          |---     |---      |---       |---
| classes     | string |         | No       | Optional additional classes
| breadcrumbs | array  |         | Yes      | Breadcrumbs array with title and url keys
| title       | string |         | Yes      | Title of the breadcrumb item
| url         | string |         | Yes      | Url of the breadcrumb item

<!--
## Installation

```
npm install --save @govuk-frontend/breadcrumb
```
-->
