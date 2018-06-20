# Installing GOV.UK Frontend with node package manager (NPM)

## Requirements

To use GOV.UK Frontend with NPM you must:

1. Install the long-term support (LTS) version of
   [Node.js](https://nodejs.org/en/), which includes NPM. The minimum version of
   Node required is 4.2.0.

   (We recommend using [`nvm`](https://github.com/creationix/nvm) for managing
   versions of Node.)

2. Create a [package.json file](https://docs.npmjs.com/files/package.json) if
   you don’t already have one. You can create a default `package.json` file by
   running `npm init` from the root of your application.

3. If you want to use the GOV.UK Frontend Nunjucks macros, install Nunjucks -
   the minimum version required is 3.0.0.

```
npm install nunjucks --save
```

### Installation

You can install all components or one or more individual components depending on
your needs.

To install all components, run:

```
npm install --save govuk-frontend
```

After you have installed GOV.UK Frontend the `govuk-frontend` package will
appear in your `node_modules` folder.

### Importing styles

You need to import the GOV.UK Frontend styles into the main Sass file in your
project. You should place the below code before your own Sass rules (or Sass
imports) if you want to override GOV.UK Frontend with your own styles.

1. To import all components, add the below to your Sass file:

  ```CSS
  @import "node_modules/govuk-frontend/all";
  ```

2. To import an individual component (for example a button), add the below to
your Sass file:

  ```CSS
  @import "node_modules/govuk-frontend/components/button/button";
  ```

#### Optional: Resolving import paths

If you wish to resolve the above `@import` paths in your build (in order to
avoid prefixing paths with `node_modules`), you should add `node_modules` to
your [Sass include paths](https://github.com/sass/node-sass#includepaths)
(in Ruby, they should be added to [assets
paths](http://guides.rubyonrails.org/asset_pipeline.html#search-paths)).

For example, if your project uses Gulp, you would add the Sass include paths to
your Gulp configuration file (for example `gulpfile.js`) with
[gulp-sass](https://www.npmjs.com/package/gulp-sass). Below is an example:

```JS
gulp.task('sass', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass({
      includePaths: 'node_modules'
     }))
    .pipe(gulp.dest('./css'));
});

```

If you compile Sass to CSS in your project, your build tasks will already
include something similar to the above task - in that case, you will just need
to include add `includePaths` to it.

After resolving the import paths you can import GOV.UK Frontend by using:

```CSS
@import "govuk-frontend/components/button/button";
```

#### Global Styles

GOV.UK Frontend avoids applying styles globally on HTML elements such as `body`; instead, styles are are applied using classes.

This to avoid the risk of global styles conflicting with any pre-existing globals, for example in GOV.UK Elements or GOV.UK Template, or with any app specific CSS.

Hovever, we do include some global styles in the [GOV.UK Prototype Kit](https://github.com/alphagov/govuk-prototype-kit-private-beta) to speed up prototyping.

These [global styles](src/core/_global-styles.scss) are are not included by default in GOV.UK Frontend. To include these global styles in your app, you can set `$govuk-global-styles` variable to `true` before importing GOV.UK Frontend styles into your app:

```
// application.scss

$govuk-global-styles: true;

@import "govuk-frontend/frontend/all";
```

### Importing JavaScript

Some of the JavaScript included in GOV.UK Frontend improves the usability and
accessibility of the components. You should make sure that you are importing and
initialising Javascript in your application to ensure that all users can use it successfully.

For example, the JavaScript will:

- allow links styled as buttons to be triggered with the space bar when focused,
  which matches the behaviour of native buttons and the way the button is
  described when using assistive technologies.
- enhance the Details component to help users of assistive technologies
  understand whether it is expanded or collapsed, and to make the component
  behave correctly for users of Internet Explorer 8.

You can include and initialise the Javascript for all components by adding an import statement to your application's main JavaScript file:

```js
import All from 'govuk-frontend/all'
```

Alternatively, you can import and initialise individual components, such as the
Button component:

```js
import Button from 'govuk-frontend/components/button/button'

new Button().init()
```

The import syntax you should use depends on the JavaScript module format
used by your bundler. For example, if you are using `CommonJS`, you would
instead use:

```js
require('govuk-frontend/all')
```

#### Polyfills
A JavaScript polyfill provides functionality on older browsers or assistive technology that do not natively support it.

The polyfills provided with GOV.UK Frontend aim to fix usability and accessibility issues. If there is a JavaScript included in the component directory, it is important to import and initialise it in your project to ensure that all users can properly use the component (see [Polyfilling](/docs/contributing/polyfilling.md)).  

Examples of GOV.UK Frontend polyfills:
1. Links styled to look like buttons lack button behaviour. The polyfill script will allow them to be triggered with a space key after they’ve been focused, to match standard buttons.
2. Details component polyfill includes accessibility enhancements to ensure that the user is given appropriate information about the state (collapsed/expanded) of the component. The polyfill also makes the component behave correctly on IE8.

#### Bundling JavaScript
The JavaScript included in GOV.UK Frontend components are in [UMD (Universal Module Definition)](https://github.com/umdjs/umd) format which makes it compatible with AMD (Asynchronous module definition) and CommonJS.

See [JavaScript Coding Standards](/docs/contributing/coding-standards/js.md) for more details of how JavaScript is used in the project.

#### Include JavaScript with Webpack 4
Here's an example of setting up [`webpack.config.js`](examples/webpack/webpack.config.js) in your project

#### Include JavaScript with Gulp and Rollup
You can configure Gulp and Rollup as part of your build process using the
[gulp-better-rollup](https://www.npmjs.com/package/gulp-better-rollup) plugin:

```js
gulp.task('compile', () => {
  return gulp.src('./js/*.js')
    .pipe(rollup({
      // Legacy mode is required for IE8 support
      legacy: true
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./js'));
})

```

If you compile JavaScript in your project, your build tasks will already include
something similar to the above task - in that case, you will just need to pipe
`rollup` to it.

### Importing assets

In order to import GOV.UK Frontend images and fonts to your project, you should configure your application to reference or copy the relevant GOV.UK Frontend assets.

Follow either [Recommended solution](#recommended-solution) or [Alternative solution](#alternative-solution).

#### Recommended solution

Make `/node_modules/govuk-frontend/assets` available to your project by routing
requests for your assets folder there.

For example, if your project uses [express.js](https://expressjs.com/), below is
a code sample you could add to your configuration:

```JS
app.use('/assets', express.static(path.join(__dirname, '/node_modules/govuk-frontend/assets')))
```
#### Alternative solution

Manually copy the images and fonts from `/node_modules/govuk-frontend/assets` into a public facing directory in your project. Ideally copying the files to your project should be an automated task or part of your build pipeline to ensure that the GOV.UK Frontend assets stay up-to-date.

The default paths used for assets are `assets/images` and `assets/fonts`. **If your asset folders follow this structure, you will not need to complete the following steps.**

To use different asset paths, also complete the below step(s).

1. Set `$govuk-assets-path`, `$govuk-images-path` and `$govuk-fonts-path` in your project Sass file to point to the relevant directories in your project (this will override the defaults set in `/node_modules/govuk-frontend/settings/_assets.scss`). Make sure you do this in Sass before importing `govuk-frontend` into your project - see [Importing styles](#importing-styles).

  Example 1:

  ``` SCSS
  // Include images from /application/assets/images and fonts from /application/assets/fonts
  $govuk-assets-path: ‘/application/assets’;

  @import “govuk-frontend/all”;
  ```

  Example 2:

  ``` SCSS
  // Include images from /images/govuk-frontend and fonts from /fonts
  $govuk-images-path: “/images/govuk-frontend”;
  $govuk-fonts-path: “/fonts”;

  @import “govuk-frontend/all”;
  ```

2. Optional: You can also override the helpers used to generate the asset urls, for example if you are using sass-rails' asset-pipeline functionality. You can do this by setting `$govuk-image-url-function` to the name of the function(s) you wish to use. See `src/settings/_assets.scss` for more information and examples.

### Include CSS and JavaScript

Add the CSS and JavaScript code to your HTML template:

```html
<!DOCTYPE html>
  <head>
    <title>Example</title>
    <link rel="stylesheet" href="assets/application.css">
  </head>
  <body>
    <!-- Copy and paste component HTML-->
    <button class="govuk-button">This is a button component</button>
    <script src="assets/application.js"></script>
  </body>
</html>
```

If your service supports Internet Explorer 8, you will need to [generate and
include a separate stylesheet](supporting-internet-explorer-8.md) as well.
