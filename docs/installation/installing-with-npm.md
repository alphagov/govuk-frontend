# Install GOV.UK Frontend using Node.js package manager (npm)

## Requirements

1. Install [Node.js](https://nodejs.org/en/).

    If you have not already installed version 4.2.0 or later of Node.js, install the latest Long Term Support (LTS) version.

2. `cd` to the root of your project and check if you have a [`package.json` file](https://docs.npmjs.com/files/package.json). If you do not have the file, create it by running:

    ```
    npm init
    ```

3. Install either:

    - [LibSass](https://sass-lang.com/libsass) - version 3.3.0 or higher
    - [Dart Sass](https://www.npmjs.com/package/sass) - version 1.0.0 or higher

    GOV.UK Frontend also works with Ruby Sass version 3.4.0 or higher, but we recommend you do not use Ruby Sass because it's been deprecated.

You can also [install Nunjucks v3.0.0 or later](https://www.npmjs.com/package/nunjucks) if you want to [use GOV.UK Frontend's Nunjucks macros](https://design-system.service.gov.uk/get-started/production/#using-nunjucks-macros).

## Install GOV.UK Frontend

Run:

```
npm install govuk-frontend --save
```

When the installation finishes, the `govuk-frontend` package will be in your `node_modules` folder.

You should now get started by [getting the CSS, assets and JavaScript working](/docs/installation/get-started.md) with one GOV.UK Frontend component.
