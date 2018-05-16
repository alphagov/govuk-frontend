### Download assets

Download the latest versions of the following assets and include them in your
project:

- [css and javascript](https://github.com/alphagov/govuk-frontend/tree/master/dist)
- [assets](https://github.com/alphagov/govuk-frontend/tree/master/dist/assets)

### Include assets

Add the CSS and JavaScript code to your HTML template (this assumes you've copied the files to `/assets` in your project):

```html
<!DOCTYPE html>
  <head>
    <title>Example</title>
    <!--[if !IE 8]><!-->
      <link rel="stylesheet" href="assets/govuk-frontend-[latest version].min.css">
    <!--<![endif]-->
    <!--[if IE 8]>
      <link rel="stylesheet" href="assets/govuk-frontend-old-ie-[latest version].min.css">
    <![endif]-->
  </head>
  <body>
    <!-- Copy and paste component HTML-->
    <button class="govuk-button">This is a button component</button>
    <script src="assets/govuk-frontend-[latest version].min.js"></script>
  </body>
</html>
```
