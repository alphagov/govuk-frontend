# Import CSS, assets and JavaScript

## CSS

### Import all the CSS

To import all the Sass rules from GOV.UK Frontend, add the following to your Sass file:

```Scss
@import "node_modules/govuk-frontend/govuk/all";
```

### Import an individual component's CSS

To import the [button](https://design-system.service.gov.uk/components/button/) component for example, add the following to your Sass file:

```SCSS
@import "node_modules/govuk-frontend/govuk/components/button/button";
```

### Simplify Sass import paths

If you want to make Sass import paths shorter, add `node_modules/govuk-frontend` to either your:

- [Sass load paths](https://sass-lang.com/documentation/at-rules/import#finding-the-file)
- [assets paths](http://guides.rubyonrails.org/asset_pipeline.html#search-paths) if you use Ruby in your project

You can then import without using `node_modules/govuk-frontend/` in your import path. For example:

```SCSS
@import "govuk/components/button/button";
```

### Override with your own CSS

If you want to override GOV.UK Frontend's styles with your own styles, `@import` GOV.UK Frontend's styles before your own Sass rules.

### Using GOV.UK Frontend with our old frameworks

If your project uses GOV.UK Frontend toolkit, GOV.UK Template or GOV.UK Elements, you can [configure GOV.UK Frontend to work with them](/docs/installation/compatibility.md).

## Font and image assets

To use the font and image assets from GOV.UK Frontend, you can either:

- serve the assets from the GOV.UK Frontend assets folder - recommended
- copy the font and image files into your application

### Serve the assets from the GOV.UK Frontend assets folder - recommended

Set up your routing so that requests for files in `<YOUR-SITE-URL>/assets` are served from `/node_modules/govuk-frontend/govuk/assets`.

For example if you're using [express.js](https://expressjs.com/), add the following to your `app.js` file:

```javascript
var path = require('path');
app.use('/assets', express.static(path.join(__dirname, '/node_modules/govuk-frontend/govuk/assets')))
```

### Copy the font and image files into your application

If you decide to copy the assets instead, copy the:

- `/node_modules/govuk-frontend/govuk/assets/images` folder to `<YOUR-APP>/assets/images`
- `/node_modules/govuk-frontend/govuk/assets/fonts` folder to `<YOUR-APP>/assets/fonts`

You should use an automated task or your build pipeline to copy the files, so your project folder stays up to date when we update GOV.UK Frontend.

#### If you have your own folder structure

If you use a different folder structure than `<YOUR-APP>/assets/images` and `<YOUR-APP>/assets/images`, you can set Sass variables so that Sass builds the CSS to point to your folders.

Set one of the following before the `@import` line in your Sass file:

- `$govuk-assets-path`
- `$govuk-images-path` and `$govuk-fonts-path`

Set the `$govuk-assets-path` variable if your `font` and `image` folders have the same parent folder. For example:

```SCSS
$govuk-assets-path: '/<YOUR-ASSETS-FOLDER>';
```

Set the the `$govuk-images-path` and `$govuk-fonts-path` variables if your `font` and `image` folders have different parent folders. For example:

```SCSS
$govuk-images-path: "/<YOUR-IMAGES-FOLDER>/";
$govuk-fonts-path: "/<YOUR-FONTS-FOLDER>/";
```

You can also use your own function to generate paths, for example if you're using `asset-pipeline` in [sass-rails](https://github.com/rails/sass-rails). Set the `$govuk-image-url-function` and `$govuk-font-url-function` variables to the name of your function.

## JavaScript

To import the JavaScript from GOV.UK Frontend, you can either:

- add GOV.UK Frontend's JavaScript file to your HTML
- import the JavaScript using a bundler like [Webpack](https://webpack.js.org/)

### Add the JavaScript file to your HTML

If you decide to add the JavaScript to your HTML, first either:

- set up your routing so that requests for the JavaScript file are served from  `node_modules/govuk-frontend/govuk/all.js`
- copy the `node_modules/govuk-frontend/govuk/all.js` file into your application

Then import the JavaScript file before the closing `</body>` tag of your HTML page or page template, and run the `initAll` function to initialise all the components.

```html
<body>
...
  <script src="<YOUR-APP>/<YOUR-JS-FILE>.js"></script>
  <script>
    window.GOVUKFrontend.initAll()
  </script>
</body>
```

### Import JavaScript using a bundler

If you decide to import using a bundler, use `import` to import all of GOV.UK Frontend's components, then run the `initAll` function to initialise them:

```javascript
import { initAll } from 'govuk-frontend'
initAll()
```

If you're using a bundler that uses CommonJS like [Browserify](http://browserify.org/), you should use `require`:

```javascript
const GOVUKFrontend = require('govuk-frontend')
GOVUKFrontend.initAll()
```

### Select and initialise an individual component

You can select and initialise a specific component by using its `data-module` attribute. For example, initialise the first radio component on a page using `govuk-radios`:

```html
  <script>
    var Radios = window.GOVUKFrontend.Radios
    var $radio = document.querySelector('[data-module="govuk-radios"]')
    if ($radio) {
      new Radios($radio).init()
    }
  </script>
```

### Select and initialise part of a page

If you update a page with new markup, for example a modal dialogue box, you can run `initAll` with a `scope` parameter to initialise the components on part of a page.

For example:

```html
  <script>
    var $modal = document.querySelector('.modal')
    window.GOVUKFrontend.initAll({
      scope: $modal
    })
  </script>
```
