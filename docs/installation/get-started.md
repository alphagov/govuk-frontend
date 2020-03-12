# Get started

Get one GOV.UK Frontend component working in your application, so you can test everything works correctly before you add more components or styles.

You will need to do the following.

1. Install GOV.UK Frontend.
2. Add the HTML for a component to your application.
3. Get the CSS working.
4. Get the font and images working.
5. Get the JavaScript working.

## 1. Install

[Install GOV.UK Frontend using npm](/docs/installation/installing-with-npm.md).

If you've installed from `dist`, get started with [a basic page](/docs/installation/installing-from-dist.md#2-include-resources) instead.

## 2. Add the HTML for a component to your application

Go to the [example accordion component](https://design-system.service.gov.uk/components/accordion/#accordion-example) on the GOV.UK Design System website, then copy the HTML.

Paste the HTML into a page or template in your application.

## 3. Get the CSS working

1. Add the following to the main Sass file in your project, so your Sass compiler adds all of GOV.UK Frontend's styles to your CSS file.

    ```Scss
    @import "node_modules/govuk-frontend/govuk/all";
    ```

2. Add your CSS file to your page layout if you need to. For example:

    ```html
      <head>
        ...
        <link rel="stylesheet" href="<YOUR-CSS-FILE>.css">
      </head>
    ```

3. Run your application and check that the accordion displays correctly.

The accordion will use a generic font until you get the font and images working, and will not be interactive until you get the JavaScript working.

There are also different ways you can [import GOV.UK Frontend's CSS](/docs/installation/importing-css-assets-and-javascript.md#css).

## 4. Get the font and images working

Your component will not use the right font or images until you've added GOV.UK Frontend's assets to your application.

1. Copy the:

    - `/node_modules/govuk-frontend/govuk/assets/images` folder to `<YOUR-APP>/assets/images`
    - `/node_modules/govuk-frontend/govuk/assets/fonts` folder to `<YOUR-APP>/assets/fonts`

2. Run your application, then use [the Fonts tab in Firefox Page Inspector](https://developer.mozilla.org/en-US/docs/Tools/Page_Inspector/How_to/Edit_fonts#The_Fonts_tab) to check the accordion is using the GDS Transport font.

In your live application, we recommend [using an automated task or your build pipeline](/docs/installation/importing-css-assets-and-javascript.md#font-and-image-assets) instead of copying the files manually.

## 5. Get the JavaScript working

1. Add the following JavaScript to the top of the `<body>` section of your page template:

    ```JavaScript
    document.body.className = ((document.body.className) ? document.body.className + ' js-enabled' : 'js-enabled');
    ```

2. Copy the `/node-modules/govuk-frontend/govuk/all.js` file to `<YOUR-JAVASCRIPT-FOLDER>/govuk.js`.

3. Import the file before the closing `</body>` tag of your page template, then run the `initAll` function to initialise all the components. For example:

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

In your live application:

- you must use `initAll` to initialise all components that use GOV.UK Frontend's JavaScript, or some components will not work correctly for disabled users who use assistive technologies
- we recommend [using an automated task or your build pipeline](/docs/installation/importing-css-assets-and-javascript.md#javascript) instead of copying the files manually

You can now get the full code for page layouts and other components from the [Design System website](https://design-system.service.gov.uk/).
