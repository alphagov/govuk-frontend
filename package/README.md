# GOV.UK Frontend

GOV.UK Frontend contains the code you need to start building a user interface
for government platforms and services.

See live examples of GOV.UK Frontend components, and guidance on when to use
them in your service, in the [GOV.UK Design System](https://www.gov.uk/design-system).

## Contact the team

GOV.UK Frontend is maintained by a team at Government Digital Service. If you want to know more about GOV.UK Frontend, please email the [Design System
team](mailto:govuk-design-system-support@digital.cabinet-office.gov.uk) or get in touch with them on [Slack](https://ukgovernmentdigital.slack.com/messages/govuk-design-system).

## Quick start

There are 2 ways to start using GOV.UK Frontend in your app.

Once installed, you will be able to use the code from the examples in the
[GOV.UK Design System](https://www.gov.uk/design-system) in your service.

### 1. Install with npm (recommended)

We recommend [installing GOV.UK Frontend using node package manager
(npm)](https://github.com/alphagov/govuk-frontend/blob/master/docs/installation/installing-with-npm.md).

### 2. Install by using compiled files

You can also [download the compiled and minified assets (CSS, JavaScript) from
GitHub](https://github.com/alphagov/govuk-frontend/blob/master/docs/installation/installing-from-dist.md).

## Importing styles

You need to import the GOV.UK Frontend styles into the main Sass file in your
project. You should place the below code before your own Sass rules (or Sass
imports) if you want to override GOV.UK Frontend with your own styles.

To import add the below to your Sass file:

  ```scss
  @import "node_modules/govuk-frontend/all";
  ```

[More details on importing styles](https://github.com/alphagov/govuk-frontend/blob/master/docs/installation/installing-with-npm.md#importing-styles)

## Importing JavaScript

Some of the JavaScript included in GOV.UK Frontend improves the usability and
accessibility of the components. You should make sure that you are importing and
initialising Javascript in your application to ensure that all users can use it successfully.

You can include Javascript for all components either by copying the `all.js` from `node_modules/govuk-frontend` into your application or referencing the file directly:

```html
<script src="<path-to-govuk-frontend-all-file>/all.js"></script>
```
Next you need to initialise the script by adding:

```html
<script>window.GOVUKFrontend.initAll()</script>
```

[More details on importing Javascript and advanced options](https://github.com/alphagov/govuk-frontend/blob/master/docs/installation/installing-with-npm.md#importing-javascript)


## Importing assets

In order to import GOV.UK Frontend images and fonts to your project, you should configure your application to reference or copy the relevant GOV.UK Frontend assets.

[More details on importing assets](https://github.com/alphagov/govuk-frontend/blob/master/docs/installation/installing-with-npm.md#import-assets)


## Getting updates

To check whether you have the latest version of GOV.UK Frontend, run:

```
npm outdated govuk-frontend
```

To update to the latest version, run:

```
npm update govuk-frontend
```

## Licence

Unless stated otherwise, the codebase is released under the MIT License. This
covers both the codebase and any sample code in the documentation. The
documentation is &copy; Crown copyright and available under the terms of the
Open Government 3.0 licence.

## Contribution guidelines

If you want to help us build GOV.UK Frontend, view our [contribution
guidelines](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md).
