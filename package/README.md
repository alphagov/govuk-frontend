# Navody.Digital Frontend

⚠ **Warning** This package is currently under heavy development and thus not recommended for general use. Feel free to [reach out](https://slovensko-digital.slack.com/messages/CEGR9AZT5) to us if you're thinking about using it.

## Quick start

There are 2 ways to start using Navody.Digital Frontend in your app.

Once installed, you will be able to use the code from the examples from
[frontend.navody.digital](https://frontend.navody.digital) in your service.

### 1. Install with npm (recommended)

We recommend [installing Navody.Digital Frontend using node package manager
(npm)](https://github.com/slovensko-digital/navody-frontend/blob/master/docs/installation/installing-with-npm.md).

### 2. Install by using compiled files

You can also [download the compiled and minified assets (CSS, JavaScript) from
GitHub](https://github.com/slovensko-digital/navody-frontend/blob/master/docs/installation/installing-from-dist.md).

## Importing styles

You need to import the Navody.Digital Frontend styles into the main Sass file in your
project. You should place the below code before your own Sass rules (or Sass
imports) if you want to override Navody.Digital Frontend with your own styles.

To import add the below to your Sass file:

  ```scss
  @import "node_modules/navody-digital-frontend/all";
  ```

[More details on importing styles](https://github.com/slovensko-digital/navody-frontend/blob/master/docs/installation/installing-with-npm.md#importing-styles)

## Importing JavaScript

Some of the JavaScript included in Navody.Digital Frontend improves the usability and
accessibility of the components. You should make sure that you are importing and
initialising Javascript in your application to ensure that all users can use it successfully.

You can include Javascript for all components either by copying the `all.js` from `node_modules/navody-digital-frontend` into your application or referencing the file directly:

```html
<script src="<path-to-navody-digital-frontend-all-file>/all.js"></script>
```
Next you need to initialise the script by adding:

```html
<script>window.navodyDigitalFrontend.initAll()</script>
```

[More details on importing Javascript and advanced options](https://github.com/slovensko-digital/navody-frontend/blob/master/docs/installation/installing-with-npm.md#importing-javascript)


## Importing assets

In order to import Navody.Digital Frontend images and fonts to your project, you should configure your application to reference or copy the relevant Navody.Digital Frontend assets.

[More details on importing assets](https://github.com/slovensko-digital/navody-frontend/blob/master/docs/installation/installing-with-npm.md#import-assets)


## Getting updates

To check whether you have the latest version of Navody.Digital Frontend, run:

```
npm outdated navody-digital-frontend
```

To update to the latest version, run:

```
npm update navody-digital-frontend
```

## Licence

Unless stated otherwise, the codebase is released under the MIT License. This
covers both the codebase and any sample code in the documentation. The
documentation is &copy; Crown copyright and available under the terms of the
Open Government 3.0 licence.

## Contribution guidelines

If you want to help us build Navody.Digital Frontend, view our [contribution
guidelines](https://github.com/slovensko-digital/navody-frontend/blob/master/CONTRIBUTING.md).
