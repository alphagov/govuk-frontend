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

## Quick start

There are 2 ways to start using GOV.UK Frontend:

* we recommend [installing GOV.UK Frontend using node package manager
  (npm)](docs/installation/installing-with-npm.md)
* you can also [download the assets (CSS, JavaScript) from
  GitHub](docs/installation/installing-by-copying-assets.md)

#### Global Styles

[Global styles](src/core/_global-styles.scss) are not included by default.

This is to avoid the risk of these globals conflicting with any pre-existing globals, for example in GOV.UK Elements or GOV.UK Template.

Hovever, we do include them in the [GOV.UK Prototype Kit](https://github.com/alphagov/govuk-prototype-kit-private-beta) to speed up prototyping.

To include global styles, you can set `$govuk-global-styles` variable to `true`.
```
// application.scss

$govuk-global-styles: true;

@import "govuk-frontend/frontend/all";
```

#### Polyfills
A JavaScript polyfill provides functionality on older browsers or assistive technology that do not natively support it.

The polyfills provided with GOV.UK Frontend aim to fix usability and accessibility issues. If there is a JavaScript included in the component directory, it is important to import and initialise it in your project to ensure that all users can properly use the component (see [Import Javscript](#import-javascript)).  

Examples of GOV.UK Frontend polyfills:
1. Links styled to look like buttons lack button behaviour. The polyfill script will allow them to be triggered with a space key after they’ve been focused, to match standard buttons.
2. Details component polyfill includes accessibility enhancements to ensure that the user is given appropriate information about the state (collapsed/expanded) of the component. The polyfill also makes the component behave correctly on IE8.

#### Bundling JavaScript
The JavaScript included in GOV.UK Frontend components are in [UMD (Universal Module Definition)](https://github.com/umdjs/umd) format which makes it compatible with AMD (Asynchronous module definition) and CommonJS.

### Usage

Copy and paste code from the examples in the
[GOV.UK Design System](https://govuk-design-system-production.cloudapps.digital/)
to use GOV.UK Frontend in your service.


## Browser support

GOV.UK Frontend will allow you to build services that comply with the [guidance
in the Service Manual][service-manual-browsers].

Currently, GOV.UK Frontend officially supports the following browsers:

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
they do in other modern browsers.

'Functional' means the components may not look perfect in the given browser, but
must still be usable without errors and without 'looking broken'.

If you are including GOV.UK Frontend as part of a stylesheet that you are
generating in your application's build pipeline, you will need to [generate and
include a separate stylesheet in order to support Internet Explorer
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
