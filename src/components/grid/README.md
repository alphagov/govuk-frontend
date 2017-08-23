# Grid

Grid row with grid items.

## Guidance

Guidance and documentation can be found on [GOV.UK Design System](linkgoeshere).

## Demo

Grid [demo](grid.html).

## Usage

Code example(s)

```
@@include('grid.html')
```

## Nunjucks

```
{% call govukGrid(
  classes='',
  gridItems=[
    { width: 'full' }]
  )
%}
<!-- Insert macros to sit inside grid here -->
{% endcall %}

{% call govukGrid(
  classes='',
  gridItems=[
    { width: 'one-half' },
    { width: 'one-half' }]
  )
%}
<!-- Insert macros to sit inside grid here -->
{% endcall %}

{% call govukGrid(
  classes='',
  gridItems=[
    { width: 'one-third' },
    { width: 'one-third' },
    { width: 'one-third' }]
  )
%}
<!-- Insert macros to sit inside grid here -->
{% endcall %}

{% call govukGrid(
  classes='',
  gridItems=[
    { width: 'two-thirds' },
    { width: 'one-third' }]
  )
%}
<!-- Insert macros to sit inside grid here -->
{% endcall %}

{% call govukGrid(
  classes='',
  gridItems=[
    { width: 'one-third' },
    { width: 'two-thirds' }]
  )
%}
<!-- Insert macros to sit inside grid here -->
{% endcall %}

{% call govukGrid(
  classes='',
  gridItems=[
    { width: 'one-quarter' },
    { width: 'one-quarter' },
    { width: 'one-quarter' },
    { width: 'one-quarter' }]
  )
%}
<!-- Insert macros to sit inside grid here -->
{% endcall %}
```

## Arguments

| Name          | Type    | Required  | Description
|---            |---      |---        |---
| classes       | string  | No        | Optional additional classes
| gridItems     | array   | Yes       | Grid items array with width key
| width         | string  | Yes       | Width of the grid item - full, one-half, one-third, two-thirds, one-quarter

<!--
## Installation

```
npm install --save @govuk-frontend/grid
```
-->
