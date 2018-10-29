# Installing GOV.UK Frontend from `dist`

## Limitations

When installing from `dist`, you are using compiled and minified versions of the
stylesheet. This means that you will not be able to:

- selectively include the CSS or JavaScript for individual components.
- build your own styles or components based on the palette or typography and
  spacing mixins.
- customise the build (for example, overriding colours or enabling global
  styles).
- use the component Nunjucks templates.

If you require any of this functionality, you should [install GOV.UK Frontend
using node package manager](installing-with-npm.md) instead.

## Steps to install

### 1. Download resources

Download the latest compiled and minified versions of the stylesheets,
JavaScript and the assets:

- [CSS and JavaScript](https://github.com/alphagov/govuk-frontend/tree/master/dist)
- [Assets](https://github.com/alphagov/govuk-frontend/tree/master/dist/assets)

### 2. Include resources

You must copy the entire `assets` folder to the root of your service.

Follow the below example to add the CSS and JavaScript files to your HTML template. This example assumes you have copied the stylesheets and JavaScript files to `/stylesheets` and `/javascript` respectively.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Example</title>
    <!--[if !IE 8]><!-->
      <link rel="stylesheet" href="stylesheets/govuk-frontend-[latest version].min.css">
    <!--<![endif]-->
    <!--[if IE 8]>
      <link rel="stylesheet" href="stylesheets/govuk-frontend-ie8-[latest-version].min.css">
    <![endif]-->
  </head>
  <body>
    <!-- Copy and paste component HTML-->
    <button class="govuk-button">This is a button component</button>
    <script src="javascript/govuk-frontend-[latest version].min.js"></script>
    <script>window.GOVUKFrontend.initAll()</script>
  </body>
</html>
```
