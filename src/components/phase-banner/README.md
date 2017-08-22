# Phase banner

You have to use an alpha banner if your thing is in alpha, and a beta banner if it’s in beta.

## Guidance

Guidance and documentation can be found on [GOV.UK Design system](linkgoeshere).

## Demo

Phase banner [demo](phase-banner.html).

## Usage

Code example(s)

```
@@include('phase-banner-example.html')
```
## Nunjucks

```
@@include('phase-banner.njk')
```

## Arguments

| Name              | Type    | Default | Required  | Description
|---                |---      |---      |---        |---
| phaseTagText      | string  |         | Yes       | Tag text
| phaseBannerText   | string  |         | Yes       | Banner copy
| classes           | string  |         | No        | Optional additional classes

<!--
## Installation

```
npm install --save @govuk-frontend/phase-banner
```
-->
