GOV.UK Frontend ·
[![Build Status](https://travis-ci.org/alphagov/govuk-frontend.svg?branch=master)](https://travis-ci.org/alphagov/govuk-frontend)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
=====================

:rotating_light: **GOV.UK Frontend is in private beta and these instructions are
subject to change. If you want to know more about how you can use GOV.UK
Frontend, please get in touch with the [Design System
team](mailto:govuk-design-system-support@digital.cabinet-office.gov.uk) at
GDS.** :rotating_light:

## What is GOV.UK Frontend?

GOV.UK Frontend contains the code you need to start building a user interface
for government platforms and services.

See live examples of GOV.UK Frontend components, and guidance on when to use
them in your service, in the [GOV.UK Design
System](https://govuk-design-system-production.cloudapps.digital/).

## How to use GOV.UK Frontend

There are 2 ways to use GOV.UK Frontend:

* we recommend using <a href="#option-1-use-npm">option 1</a>, which requires
  using node package manager (NPM)
* you can also use <a href="#option-2-add-assets-manually">option 2</a>, which
  requires you to download the assets (CSS, JavaScript) from GitHub

## Option 1: Use NPM

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

To install individual components (for example, a button), run:

```
npm install --save @govuk-frontend/button
```

You can find a list of all components in the [packages
directory](https://github.com/alphagov/govuk-frontend/tree/master/packages).
Each component has a README with installation and usage instructions.

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

### Import images and icons

In order to import GOV.UK Frontend images and icons to your project, you should
configure your application to reference or copy the relevant GOV.UK Frontend
assets.

1. Follow either [Recommended solution](#recommended-solution) or [Alternative
   solution](#alternative-solution).

2. Set `$govuk-global-images` variable in your project Sass file to point to the
   images folder in your project. Make sure you do this in Sass before importing
  `@govuk-frontend` into your project - see [Import styles](#import-styles).
  (`$govuk-global-images` is defined by default in
  `/node_modules/frontend/global/settings/_paths.scss`.)

#### Recommended solution:

Make `/node_modules/@govuk-frontend/icons` available to your project by routing
requests for your images folder there.

For example, if your project uses [express.js](https://expressjs.com/), below is
a code sample you could add to your configuration:

```JS
app.use('/icons', express.static(path.join(__dirname, '/node_modules/@govuk-frontend/icons')))
```

#### Alternative solution:

Manually copy the images from `/node_modules/@govuk-frontend/icons` into a
public facing directory in your project. Ideally copying the files to your
project should be an automated task or part of your build pipeline to ensure
that the GOV.UK Frontend images and icons stay up-to-date.

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
include a separate stylesheet](docs/supporting-internet-explorer-8.md) as well.

### Usage

Copy and paste code from the examples in the
[GOV.UK Design System](https://govuk-design-system-production.cloudapps.digital/)
to use GOV.UK Frontend in your service.

## Option 2: Add assets manually

### Download assets

Download the latest versions of the following assets and include them in your
project:

- [dist/css](https://github.com/alphagov/govuk-frontend/tree/master/dist/css)
- [dist/js](https://github.com/alphagov/govuk-frontend/tree/master/dist/js)
- [dist/icons](https://github.com/alphagov/govuk-frontend/tree/master/dist/icons)

### Include assets

Add the CSS and JavaScript code to your HTML template:

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

### Usage

Copy and paste HTML code from the examples in the
[GOV.UK Design System](https://govuk-design-system-production.cloudapps.digital/)
to use GOV.UK Frontend in your service.

Nunjucks templates are only available when installing GOV.UK Frontend using npm.

## Browser support

As a minimum, GOV.UK Frontend will allow you to build services that
comply with the [guidance in the service manual][service-manual-browsers].

At the minute, GOV.UK Frontend officially supports the following browsers:

| Operating system | Browser                                | Support     |
|----------------- |----------------------------------------|-------------|
| Windows          | Internet Explorer 8                    | functional  |
| Windows          | Internet Explorer 9-11                 | compliant   |
| Windows          | Edge (latest 2 versions)               | compliant   |
| Windows          | Google Chrome (latest 2 versions)      | compliant   |
| Windows          | Mozilla Firefox (latest 2 versions)    | compliant   |
| macOS            | Safari 9+                              | compliant   |
| macOS            | Google Chrome (latest 2 versions)      | compliant   |
| macOS            | Mozilla Firefox (latest 2 versions)    | compliant   |
| iOS              | Safari for iOS 9.3+                    | compliant   |
| iOS              | Google Chrome (latest 2 versions)      | compliant   |
| Android          | Google Chrome (latest 2 versions)      | compliant   |
| Android          | Samsung Internet (latest 2 versions)   | compliant   |
| Windows Phone    | Internet Explorer (latest 2 versions)  | compliant   |

‘Compliant’ means that the components must look as good and function as well as
it does in other modern browsers.

'Functional' means the components may not look perfect in the given browser, but
must still be usable without errors and without 'looking broken'.

If you are including GOV.UK Frontend as part of a stylesheet you are generating
in your application's build pipeline, you will need to [generate and include a
separate stylesheet in order to support Internet Explorer
8](docs/supporting-internet-explorer-8.md).

[service-manual-browsers]: https://www.gov.uk/service-manual/technology/designing-for-different-browsers-and-devices#browsers-to-test-in


## Licence

Unless stated otherwise, the codebase is released under the MIT License. This
covers both the codebase and any sample code in the documentation. The
documentation is &copy; Crown copyright and available under the terms of the
Open Government 3.0 licence.

## Contribution guidelines

If you want to help us build GOV.UK Frontend, view our [contribution
guidelines](CONTRIBUTING.md).
