# Footer

## Introduction

The footer component is used at the bottom of every GOV.UK page, to help users navigate.

## Guidance

Find out when to use the Footer component in your service in the [GOV.UK Design System](https://govuk-design-system-production.cloudapps.digital/components/footer).

## Quick start examples

### Component default

[Preview the footer component](http://govuk-frontend-review.herokuapp.com/components/footer/preview)

#### Markup

    <div class="govuk-c-footer"></div>

#### Macro

    {{ govukFooter({}) }}

## Dependencies

To consume the footer component you must be running npm version 5 or above.

## Installation

    npm install --save @govuk-frontend/footer

## Requirements

### Build tool configuration

When compiling the Sass files you'll need to define includePaths to reference the node_modules directory. Below is a sample configuration using gulp

    .pipe(sass({
      includePaths: 'node_modules/'
    }))

### Static asset path configuration

To show the button image you need to configure your app to show these assets. Below is a sample configuration using Express js:

    app.use('/public', express.static(path.join(__dirname, '/node_modules/@govuk-frontend/icons')))

## Component arguments

If you are using Nunjucks,then macros take the following arguments

<table class="govuk-c-table">

<thead class="govuk-c-table__head">

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="col">Name</th>

<th class="govuk-c-table__header" scope="col">Type</th>

<th class="govuk-c-table__header" scope="col">Required</th>

<th class="govuk-c-table__header" scope="col">Description</th>

</tr>

</thead>

</table>

### Setting up Nunjucks views and paths

Below is an example setup using express configure views:

    nunjucks.configure('node_modules/@govuk-frontend', {
      autoescape: true,
      cache: false,
      express: app
    })

## Getting updates

To check whether you have the latest version of the button run:

    npm outdated @govuk-frontend/footer

To update the latest version run:

    npm update @govuk-frontend/footer

## Contribution

Guidelines can be found at [on our Github repository.](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md "link to contributing guidelines on our github repository")

## License

MIT