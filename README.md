GOV.UK Frontend ·
[![Build Status](https://travis-ci.org/alphagov/govuk-frontend.svg?branch=master)](https://travis-ci.org/alphagov/govuk-frontend)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
=====================

:rotating_light: **GOV.UK Frontend is in private beta and these instructions are subject to change. If you want to know more about how you can use GOV.UK Frontend, please get in touch with the [Design System team](mailto:govuk-design-system-support@digital.cabinet-office.gov.uk) at GDS.** :rotating_light:

## What is GOV.UK Frontend?

GOV.UK Frontend contains the code you need to start building a user interface for government platforms and services. 

## Before using GOV.UK Frontend

You should start by familiarising yourself with the [GOV.UK Design System](https://govuk-design-system-production.cloudapps.digital/), which contains guidance and examples of components, styles and patterns you can use to design  government platforms and services. 

## How to use GOV.UK Frontend 

There are 2 ways to use GOV.UK Frontend:
* we recommend using <a href="#option1">option 1</a>, which requires using node package manager (NPM) 
* you can also use <a href="#option2">option 2</a>, which requires you to download the assets (CSS, JavaScript) from GitHub

<a id="option1"></a>

# Option 1: Use NPM

## Requirements
To use GOV.UK Frontend with NPM you must:

1. Install the long-term support (LTS) version of [Node.js](https://nodejs.org/en/), which includes NPM.
2. Create a [package.json file](https://docs.npmjs.com/files/package.json) if you don’t already have one. You can create a default `package.json` file by running `npm init` from the root of your application.

## Installation
GOV.UK Frontend is currently in private beta. You will need to log in to NPM using credentials provided by the Design System team.

Run the following command to log in:
```
npm login
```

Enter the username, password and email address you were provided with, when prompted. 

You can install all components or one or more individual components depending on your needs.

To install all components, run:
```
npm install --save @govuk-frontend/all
```


To install individual components (for example, a button), run:
```
npm install --save @govuk-frontend/button
```
You can find a list of all components in the [packages directory](https://github.com/alphagov/govuk-frontend/tree/master/packages). Each component has a README with installation and usage instructions.

After you have installed GOV.UK Frontend the `@govuk-frontend` package will appear in your `node_modules` folder.

## Import assets

Import styles into your main Sass file.

To import all components, add the line:
```CSS
@import "@govuk-frontend/all/all";
```

To import an individual component (for example, a button), add the line:
```CSS
@import "@govuk-frontend/button/button";
```


To resolve your `@import` declarations you should add `node_modules` to your [Sass include paths](https://github.com/sass/node-sass#includepaths) or [load paths](url here) in Ruby.

Below is a code sample you can add to your gulp configuration file using the gulp-sass package:
```JS
.pipe(sass({ includePaths: 'node_modules/' }))
```

To import images, configure your application to reference or copy the icons assets.

Below is a code sample you can add to your [express.js](https://expressjs.com/) configuration:
```JS
app.use('/public', express.static(path.join(__dirname, '/node_modules/@govuk-frontend/icons')))
```

## Usage

Copy and paste code from the examples in the [GOV.UK Design System](https://govuk-design-system-production.cloudapps.digital/) to use GOV.UK Frontend in your service.

<a id="option2"></a> 

# Option 2: Add assets manually

## Download assets

Download the latest versions of the following assets and include them in your project:

- [govuk-frontend/tree/master/dist/css](https://github.com/alphagov/govuk-frontend/tree/master/dist/css)
- [govuk-frontend/tree/master/dist/js](https://github.com/alphagov/govuk-frontend/tree/master/dist/js)
- [icons](https://github.com/alphagov/govuk-frontend/tree/master/dist/icons)

## Include assets

Add the CSS and JavaScript code to your HTML template:

```html
<!DOCTYPE html>
  <head>
    <title>Example</title>
    <link rel="stylesheet" href="assets/govuk-frontend-[latest version].min.css">
    <!--[if IE 8]>
      <link rel="stylesheet" href="assets/govuk-frontend-oldie-[latest version].min.css">
    <![endif]-->
  </head>
  <body>
    <!-- Copy and paste component HTML-->
    <button class="govuk-c-button">This is a button component</button>
    <script src="assets/govuk-frontend-[latest version].min.js"></script>
  </body>
</html>
```

## Usage 

Copy and paste code from the examples in the [GOV.UK Design System](https://govuk-design-system-production.cloudapps.digital/) to use GOV.UK Frontend in your service.


## Licence

This project is licensed under the [MIT License](https://github.com/TechPunk316/govuk-frontend/blob/master/LICENSE.txt).

## Contribution

If you want to help us build GOV.UK Frontend, view our [contribution guidelines](CONTRIBUTING.md).

