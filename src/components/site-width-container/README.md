# Site width container

A container set to the width of the site (960px) and its margins.

## Guidance

Guidance and documentation can be found on [GOV.UK Design System](linkgoeshere).

## Demo

Site width container [demo](site-width-container.html).

## Usage

Code example(s)

```
@@include('site-width-container.html')
```

## Nunjucks

```
{% call govukSiteWidthContainer(classes='') %}
  <!-- Insert content to sit inside govukSiteWidthContainer here -->
{% endcall %}
```

Use call to nest of govukGrid items within govukSiteWidthContainer.

```
{% call govukSiteWidthContainer(classes='') %}
  {% call govukGrid(
    classes='',
    gridItems=[ { width: 'two-thirds' } ]
    )
  %}
  <!-- Insert macros to sit inside grid item here -->
  {% endcall %}
{% endcall %}
```

## Arguments

| Name          | Type    | Required  | Description
|---            |---      |---        |---
| classes       | string  | No        | Optional additional classes

<!--
## Installation

```
npm install --save @govuk-frontend/site-width-container
```
-->
