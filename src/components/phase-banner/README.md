# Phase banner

You have to use an alpha banner if your thing is in alpha, and a beta banner if it’s in beta.

## Guidance

Guidance and documentation can be found on [GOV.UK Design system](linkgoeshere).

## Demo

Phase banner [demo](phase-banner.html).

## Usage

Code example(s)

```
@@include('phase-banner.html')
```
## Nunjucks

```
{% from "phase-banner/macro.njk" import govukPhaseBanner %}
{{ govukPhaseBanner(
  classes='',
  phaseBannerText='This is a new service – your <a href="#">feedback</a> will help us to improve it.',
  phaseTagText='BETA')
}}
```

## Arguments

| Name              | Type    | Default | Required  | Description
|---                |---      |---      |---        |---
| classes           | string  |         | No        | Optional additional classes
| phaseTagText      | string  |         | Yes       | Tag text
| phaseBannerText   | string  |         | Yes       | Banner copy

<!--
## Installation

```
npm install --save @govuk-frontend/phase-banner
```
-->
