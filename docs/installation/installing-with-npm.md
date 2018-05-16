### Requirements

To use GOV.UK Frontend with NPM you must:

1. Install the long-term support (LTS) version of
   [Node.js](https://nodejs.org/en/), which includes NPM. The minimum version of
   Node required is 8.6.0.

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

GOV.UK Frontend is currently in private beta. You will need to log in to NPM
using credentials provided by the Design System team.

Run the following command to log in:
```
npm login
```

Enter the username, password and email address you were provided with, when
prompted.

You can install all components or one or more individual components depending on
your needs.

To install all components, run:

```
npm install --save @govuk-frontend/all
```

After you have installed GOV.UK Frontend the `@govuk-frontend` package will
appear in your `node_modules` folder.

### Import styles

You need to import the GOV.UK Frontend styles into the main Sass file in your
project. You should place the below code before your own Sass rules (or Sass
imports) if you want to override GOV.UK Frontend with your own styles.

1. To import all components, add the below to your Sass file:

  ```CSS
  @import "node_modules/@govuk-frontend/all/all";
  ```

2. To import an individual component (for example a button), add the below to
your Sass file:

  ```CSS
  @import "node_modules/@govuk-frontend/button/button";
  ```

#### Optional: Resolve import paths

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

(If you compile Sass to CSS in your project, your build tasks will already
include something similar to the above task - in that case, you will just need
to include add `includePaths` to it.)

After resolving the import paths you can import GOV.UK Frontend by using:

```CSS
@import "@govuk-frontend/button/button";
```

### Import JavaScript

You need to import the GOV.UK Frontend scripts into the main JavaScript file in your project.

To import and initialise all components that require JavaScript, add the below to your main JavaScript file:
```JS
import All from '@govuk-frontend/all/all'
```

To import an individual component (for example a button), add the below to your main JavaScript file:
```JS
import Button from '@govuk-frontend/button/button'
```

Use the following to initialise the button component:

```JS
new Button().init()
```

Note: The import syntax you should use depends on the JavaScript module format used by your bundler. For example, if it is using `CommonJS`, use

```JS
require('@govuk-frontend/all/all')
```

##### Include with Webpack 4
Here's an example of setting up [`webpack.config.js`](examples/webpack/webpack.config.js) in your project

##### Include with Gulp and Rollup
You can configure Gulp and Rollup as part of your build process using the [gulp-better-rollup](https://www.npmjs.com/package/gulp-better-rollup) plugin. Below is an example:

```JS
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
(If you compile JavaScript in your project, your build tasks will already include something similar to the above task - in that case, you will just need to pipe `rollup` to it.)

### Import images

In order to import GOV.UK Frontend images to your project, you should configure
your application to reference or copy the relevant GOV.UK Frontend assets.

1. Follow either [Recommended solution](#recommended-solution) or [Alternative
   solution](#alternative-solution).

2. Set `$govuk-global-images` variable in your project Sass file to point to the
   images folder in your project. Make sure you do this in Sass before importing
  `@govuk-frontend` into your project - see [Import styles](#import-styles).
  (`$govuk-global-images` is defined by default in
  `/node_modules/frontend/global/settings/_paths.scss`.)

#### Recommended solution:

Make `/node_modules/@govuk-frontend/assets` available to your project by routing
requests for your assets folder there.

For example, if your project uses [express.js](https://expressjs.com/), below is
a code sample you could add to your configuration:

```JS
app.use('/assets', express.static(path.join(__dirname, '/node_modules/@govuk-frontend/assets')))
```

#### Alternative solution:

Manually copy the images from `/node_modules/@govuk-frontend/assets` into a
public facing directory in your project. Ideally copying the files to your
project should be an automated task or part of your build pipeline to ensure
that the GOV.UK Frontend images stay up-to-date.

### Include assets

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
