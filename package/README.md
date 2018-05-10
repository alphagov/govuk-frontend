# GOV.UK Frontend - All components

All of the components in GOV.UK Frontend, in a single package.

## Guidance

Find out when to use the Back link component in your service in the [GOV.UK Design System](https://govuk-design-system-production.cloudapps.digital).

## Dependencies

To consume all components you must be running npm version 5 or above.

## Installation

    npm install --save @govuk-frontend/govuk-frontend-placeholder

## Requirements

### Build tool configuration

When compiling the Sass files you'll need to define includePaths to reference the node_modules directory. Below is a sample configuration using gulp

    .pipe(sass({
      includePaths: 'node_modules/'
    }))

### Static asset path configuration

To show the button image you need to configure your app to show these assets. Below is a sample configuration using Express js:

    app.use('/icons', express.static(path.join(__dirname, '/node_modules/@govuk-frontend/icons')))

### Setting up Nunjucks views and paths

Below is an example setup using express configure views:

    nunjucks.configure('node_modules/@govuk-frontend', {
      autoescape: true,
      cache: false,
      express: app
    })

## Getting updates

To check whether you have the latest version of the button run:

    npm outdated @govuk-frontend/govuk-frontend-placeholder

To update the latest version run:

    npm update @govuk-frontend/govuk-frontend-placeholder


## Contribution

Guidelines can be found at [on our Github repository.](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md "link to contributing guidelines on our github repository")

## License

MIT
