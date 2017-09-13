# File upload

## Introduction

Breadcrumb navigation, showing page hierarchy.

[Preview the file-upload component.](http://govuk-frontend-review.herokuapp.com/components/file-upload/preview)

## Guidance

More information about when to use file-upload can be found on [GOV.UK Design System](http://www.linktodesignsystem.com/file-upload "Link to read guidance on the use of file-upload on Gov.uk Design system website")

## Dependencies

To consume the file-upload component you must be running npm version 5 or above.

## Installation

    npm install --save @govuk-frontend/file-upload

## Requirements

### Build tool configuration

When compiling the Sass files you'll need to define includePaths to reference the node_modules directory. Below is a sample configuration using gulp

      .pipe(sass({
          includePaths: 'node_modules/'
      }))

### Static asset path configuration

To show the button image you need to configure your app to show these assets. Below is a sample configuration using Express js:

    app.use('/public', express.static(path.join(__dirname, '/node_modules/@govuk-frontend/icons')))

## Quick start examples

## If you are using Nunjucks

To use a macro, follow the below code examples:

Where the macros take the following arguments

## Component arguments

<div>| Name | Type | Default | Required | Description |--- |--- |--- |--- |--- | classes | string | | No | Optional additional classes | breadcrumbs | array | | Yes | Breadcrumbs array with title and url keys | title | string | | Yes | Title of the breadcrumb item | url | string | | Yes | Url of the breadcrumb item</div>

### Setting up Nunjucks views and paths

Below is an example setup using express configure views:

    nunjucks.configure('node_modules/@govuk-frontend`, {
      autoescape: true,
      cache: false,
      express: app
    })

## Getting updates

To check whether you have the latest version of the button run:

    npm outdated @govuk-frontend/file-upload

To update the latest version run:

    npm update @govuk-frontend/file-upload

## Contribution

Guidelines can be found at [on our Github repository.](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md "link to contributing guidelines on our github repository")

## Acknowledgements/credits

*   GDS developers
*   Jani Kraner
*   Gemma Leigh

## License

MIT