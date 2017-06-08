GOV.UK Frontend ·
[![Build Status](https://travis-ci.org/alphagov/govuk-frontend.svg?branch=master)](https://travis-ci.org/alphagov/govuk-frontend)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
=====================

## What is it?

A single package containing everything needed to start building a GOV.UK service.

> :rotating_light: This will not work until packages are published to npm.

## Install

## Install all components

```
npm install --save @govuk-frontend/all
```

## Install individual components

Install a button component

```
npm install --save @govuk-frontend/button
```

All components can be found in the packages directory.
Each component has a README with installation and usage instructions.

## Usage

## HTML

Copy and paste component HTML [from here](TODO: Insert link to GOV.UK Design System).

## SCSS

In your main.scss file

```
// All components
@import "@govuk-frontend/all/govuk-frontend-all";

// Pick and choose components
@import "@govuk-frontend/button/govuk-button";
@import "@govuk-frontend/input/govuk-input"
```

## CSS

```
npm install --save @govuk-frontend/all
```

Include the CSS and JavaScript.

```
<!DOCTYPE html>
<html>
  <head>
    <title>Example</title>
    <link rel="stylesheet"
          href="node_modules/@govuk-frontend/all/govuk-frontend-all.min.css">
  </head>
  <body>
    <!-- Copy and paste component HTML-->
    <button class="govuk-c-button">This is a button component</button>
    <script src="node_modules/@govuk-frontend/all/govuk-frontend-all.min.js"></script>
  </body>
</html>
```

## Docs

* [coding standards](/docs/coding-standards/) - our guides for CSS and JavaScript
* [components](/docs/components.md) - rules for components
* [legacy IE](/docs/legacy-ie.md) - legacy IE support
