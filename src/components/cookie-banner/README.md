# Cookie banner

Cookie banner intro.

## Guidance

Guidance and documentation can be found on [GOV.UK Design System](linkgoeshere).

## Demo

Cookie banner [demo](cookie-banner.html).

## Usage

Code example(s)

```
@@include('cookie-banner.html')
```

## Nunjucks

```
{% from "cookie-banner/macro.njk" import govukCookieBanner %}
{{ govukCookieBanner(
  classes='',
  cookieBannerText='GOV.UK uses cookies to make the site simpler. <a href="https://www.gov.uk/help/cookies">Find out more about cookies</a>'
  )
}}
```

## Arguments

| Name                | Type    | Default | Required  | Description
|---                  |---      |---      |---        |---
| classes             | string  |         | No        | Optional additional classes
| cookieBannerText    | string  |         | Yes       | Cookie banner copy


<!--
## Installation

```
npm install --save @govuk-frontend/cookie-banner
```
-->
