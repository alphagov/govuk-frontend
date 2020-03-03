# Get started

Get one GOV.UK Frontend component working in your application.

You must [install GOV.UK Frontend using npm](/docs/installation/installing-with-npm.md) first. If you've installed from `dist`, get started with [a basic page](/docs/installation/installing-from-dist.md#2-include-resources) instead.

## Add a component to your application

Go to the [example accordion component](https://design-system.service.gov.uk/components/accordion/#accordion-example) on the GOV.UK Design System website, then copy the HTML.

Paste the HTML into your application.

## Get the CSS working

1. Add the following line to the main Sass file in your project, so your Sass compiler adds all GOV.UK Frontend styles to your CSS file.

    ```Scss
    @import "node_modules/govuk-frontend/govuk/all";
    ```

2. Add your CSS file to your page layout. For example:

    ```html
      <head>
        ...
        <link rel="stylesheet" href="<YOUR-CSS-FILE>.css">
      </head>
    ```

3. Run your application and check that the accordion is rendering using styles that start with `govuk-`.

There are also different ways you can [import GOV.UK Frontend's CSS](/docs/installation/importing-css-assets-and-javascript.md#css).

## Get the font and images working

Your component will not use the right font or images until you've added GOV.UK Frontend's assets to your application.

1. Use an automated task or your build pipeline to copy the:

    - `/node_modules/govuk-frontend/govuk/assets/images` folder to `<YOUR-APP>/assets/images`
    - `/node_modules/govuk-frontend/govuk/assets/fonts` folder to `<YOUR-APP>/assets/fonts`

2. Run your application, then use [the Fonts tab in Firefox Page Inspector](https://developer.mozilla.org/en-US/docs/Tools/Page_Inspector/How_to/Edit_fonts#The_Fonts_tab) to check the accordion is using the GDS Transport font.

In your live application, we recommend [routing requests to `node-modules`](/docs/installation/importing-css-assets-and-javascript.md#fonts-and-image-assets) instead of copying files.

## Get the JavaScript working

If you do not initialise GOV.UK Frontend's JavaScript with `initAll`, some components will not work correctly for disabled users who use assistive technologies.

1. Add the `.js-enabled` class to the opening `<body>` tag of your page template. For example:

    ```JavaScript
    document.body.className = ((document.body.className) ? document.body.className + ' js-enabled' : 'js-enabled');
    ```

2. Use an automated task or your build pipeline to copy the `/node-modules/govuk-frontend/govuk/all.js` file to `<YOUR-JAVASCRIPT-FOLDER>/govuk.js`

3. Import the Javascript file before the closing `</body>` tag of your page template, then run the `initAll` function to initialise all the components. For example:

    ```html
    <body>
      ...
      <script src="<YOUR-JAVASCRIPT-FOLDER>/govuk.js"></script>
      <script>
        window.GOVUKFrontend.initAll()
      </script>
    </body>
    ```

4. Run your application and check you can show and hide sections of the accordion by selecting the buttons.

There are also different ways you can [import GOV.UK Frontend's JavaScript](/docs/installation/importing-css-assets-and-javascript.md#javascript).
