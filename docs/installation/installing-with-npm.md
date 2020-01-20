# Install GOV.UK Frontend using Node.js package manager (npm)

## Requirements

1. Install [Node.js](https://nodejs.org/en/).

    If you have not already installed version 4.2.0 or later of Node.js, install the latest Long Term Support (LTS) version.

2. `cd` to the root of your project and check if you have a [`package.json` file](https://docs.npmjs.com/files/package.json). If you do not have the file, create it by running:

    ```
    npm init -y
    ```

3. Install a Sass compiler that will work with your project, for example [Dart Sass](https://sass-lang.com/dart-sass) or [LibSass](https://sass-lang.com/libsass).

You can also [install Nunjucks v3.0.0 or later](https://www.npmjs.com/package/nunjucks) if you want to [use GOV.UK Frontend's Nunjucks macros](https://design-system.service.gov.uk/get-started/production/#using-nunjucks-macros).

## Install

### 1. Install the GOV.UK Frontend package

Run:

```
npm install govuk-frontend --save
```

When the installation finishes, the `govuk-frontend` package will be inside your `node_modules` folder.

### 2. Import GOV.UK Frontend's CSS styles

Add the following to the main Sass file in your project, to import all the CSS styles from GOV.UK Frontend.

```Scss
@import "node_modules/govuk-frontend/govuk/all";
```

If you want to override GOV.UK Frontend's styles with your own styles, add the `@import` line before your own Sass rules.

You can also import individual components. For example to import the [button](https://design-system.service.gov.uk/components/button/) component:

```SCSS
@import "node_modules/govuk-frontend/govuk/components/button/button";
```

If your project uses GOV.UK Frontend toolkit, GOV.UK Template or GOV.UK Elements, you can [configure GOV.UK Frontend to work with them](https://github.com/alphagov/govuk-frontend/blob/master/docs/installation/compatibility.md).

#### Simplify Sass import paths

If you want to make Sass import paths shorter, add `node_modules/govuk-frontend` to either your:

- [Sass load paths](https://sass-lang.com/documentation/at-rules/import#finding-the-file)
- [assets paths](http://guides.rubyonrails.org/asset_pipeline.html#search-paths) if you use Ruby in your project

You can then import components with for example:

```SCSS
@import "govuk/components/button/button";
```

### 3. Route requests for images and fonts

To make GOV.UK Frontend’s images and font work in your project, you can either:

- route requests to the files in GOV.UK Frontend's folders - recommended
- copy GOV.UK Frontend's files into your project folder

#### Route requests - recommended

We recommend you route requests for files in `/assets` to the `/node_modules/govuk-frontend/govuk/assets` folder.

For example if you're using [express.js](https://expressjs.com/), add the following to your `app.js` file:

```javascript
var path = require('path');
app.use('/assets', express.static(path.join(__dirname, '/node_modules/govuk-frontend/govuk/assets')))
```

#### Copy files

Copy the following folders into your project folder:

- `/node_modules/govuk-frontend/govuk/assets/images`
- `/node_modules/govuk-frontend/govuk/assets/fonts`

You should use an automated task or your build pipeline to copy the files, so your project folder stays up to date when we update GOV.UK Frontend.

##### If you use different folders

If you use different folders for images and the font, you should override GOV.UK Frontend's default paths with your paths.

If your `image` and `font` folders are together in the same folder, set the `$govuk-assets-path` variable to your folder. For example:

```SCSS
$govuk-assets-path: '/<YOUR-FOLDER>';
@import "govuk-frontend/govuk/all";
```

If your `image` and `font` folders are in different folders, set the `$govuk-images-path` and `$govuk-fonts-path` variables to your folders. For example:

```SCSS
$govuk-images-path: "/<YOUR-IMAGES-FOLDER>/";
$govuk-fonts-path: "/<YOUR-FONTS-FOLDER>/";
@import "govuk-frontend/govuk/all";
```

You can also use your own function to generate paths, for example if you're using `asset-pipeline` in [sass-rails](https://github.com/rails/sass-rails). Set the `$govuk-image-url-function` variable to the name of your function.

### 4. Add JavaScript and initialise components

You can either:

- add GOV.UK Frontend's JavaScript file to your HTML
- import the JavaScript using a bundler like [Webpack](https://webpack.js.org/)

You must also initialise GOV.UK Frontend's components by calling the `initAll` function. If you do not initialise, some components will not work correctly for disabled users who use assistive technologies.

### Add the JavaScript file to your HTML

First either:

- route requests to the `node_modules/govuk-frontend/govuk/all.js` file
- copy the file into your project folder

Then add GOV.UK Frontend's Javascript file before the closing `</body>` tag of your HTML page or page template, and run the `initAll` function to initialise all the components.

```html
<body>
...
  <script src="node_modules/govuk-frontend/govuk/all.js"></script>
  <script>
    window.GOVUKFrontend.initAll()
  </script>
</body>
```

You can select and initialise specific components using their `data-module` attribute. For example, initialise the first radio component on a page using `govuk-radios`:

```html
  <script>
    var Radios = window.GOVUKFrontend.Radios
    var $radio = document.querySelector('[data-module="govuk-radios"]')
    if ($radio) {
      new Radios($radio).init()
    }
  </script>
```

If you add new markup to a page, for example a modal dialogue box, you can run `initAll` with a `scope` parameter to initialise the components on part of a page. For example:

```html
  <script>
    var $modal = document.querySelector('.modal')
    window.GOVUKFrontend.initAll({
      scope: $modal
    })
  </script>
```

#### Import JavaScript using a bundler

Use `import` to import all of GOV.UK Frontend's components, then run the `initAll` function to initialise them:

```javascript
import { initAll } from 'govuk-frontend'
initAll()
```

If you're using a bundler that uses CommonJS like [Browserify](http://browserify.org/), you should use `require`:

```javascript
const GOVUKFrontend = require('govuk-frontend')
GOVUKFrontend.initAll()
```

### 5. Check it works

Create an HTML file with the following code:

```html
<!DOCTYPE html>
  <head>
    <title>Example title</title>
    <link rel="stylesheet" href="/<PATH-TO-CSS>/application.css">
  </head>
  <body>
    <button class="govuk-button">Example button</button>
    <script src="/<PATH-TO-JAVASCRIPT>/all.js"></script>
  </body>
</html>
```

Replace:

- `<PATH-TO-CSS>` with the path to the CSS file
- `<PATH-TO-JAVASCRIPT>` with the path to the JavaScript file

Check that GOV.UK Frontend's Javascript, CSS, images and font are working. You should see a [default button](https://design-system.service.gov.uk/components/button/#default-buttons).

You can get the full code for page layouts and components from the [Design System website](https://design-system.service.gov.uk/).

### 6. Generate a CSS file for Internet Explorer 8

You should [generate a separate CSS file](supporting-internet-explorer-8.md) if you need to support Internet Explorer 8.
