# Footer

## Introduction

The footer component is used at the bottom of every GOV.UK page, to help users navigate.

## Guidance

Find out when to use the Footer component in your service in the [GOV.UK Design System](https://govuk-design-system-production.cloudapps.digital/components/footer).

## Quick start examples

### Component default

[Preview the footer component](http://govuk-frontend-review.herokuapp.com/components/footer/preview)

#### Markup

    <footer class="govuk-c-footer " role="contentinfo">
      <div class="govuk-o-width-container ">

        <div class="govuk-c-footer__meta">
          <div class="govuk-c-footer__meta-item govuk-c-footer__meta-item--grow">

            <svg
              role="presentation"
              class="govuk-c-footer__licence-logo"
              xmlns="http://www.w3.org/2000/svg"
              viewbox="0 0 483.2 195.7"
              height="17"
              width="41"
            >
              <path
                fill="currentColor"
                d="M421.5 142.8V.1l-50.7 32.3v161.1h112.4v-50.7zm-122.3-9.6A47.12 47.12 0 0 1 221 97.8c0-26 21.1-47.1 47.1-47.1 16.7 0 31.4 8.7 39.7 21.8l42.7-27.2A97.63 97.63 0 0 0 268.1 0c-36.5 0-68.3 20.1-85.1 49.7A98 98 0 0 0 97.8 0C43.9 0 0 43.9 0 97.8s43.9 97.8 97.8 97.8c36.5 0 68.3-20.1 85.1-49.7a97.76 97.76 0 0 0 149.6 25.4l19.4 22.2h3v-87.8h-80l24.3 27.5zM97.8 145c-26 0-47.1-21.1-47.1-47.1s21.1-47.1 47.1-47.1 47.2 21 47.2 47S123.8 145 97.8 145"
              />
            </svg>
            <span class="govuk-c-footer__licence-description">
              All content is available under the
              <a
                class="govuk-c-footer__link"
                href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
                rel="license"
              >Open Government Licence v3.0</a>, except where otherwise stated
            </span>
          </div>
          <div class="govuk-c-footer__meta-item">
            <a
              class="govuk-c-footer__link govuk-c-footer__copyright-logo"
              href="http://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/copyright-and-re-use/crown-copyright/"
            >© Crown copyright</a>
          </div>
        </div>
      </div>
    </footer>

#### Macro

    {% from 'footer/macro.njk' import govukFooter %}

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

<tbody class="govuk-c-table__body">

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">meta</th>

<td class="govuk-c-table__cell ">object</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Object containing parameters for the meta navigation</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">meta.items[]</th>

<td class="govuk-c-table__cell ">array</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Array of items for use in the meta section of the footer</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">navigation</th>

<td class="govuk-c-table__cell ">array</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Array of items for use in the navigation section of the footer</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">navigation[].title</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Title for a section</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">navigation[].columns</th>

<td class="govuk-c-table__cell ">integer</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Amount of columns to display items in</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">navigation[].items</th>

<td class="govuk-c-table__cell ">array</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Array of items to display in the list</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">attributes</th>

<td class="govuk-c-table__cell ">object</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Will add attributes to the footer component root</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">classes</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Will add classes to the footer component root</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">containerClasses</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Classes that can be added to the container, useful if you want to make the footer full width.</td>

</tr>

</tbody>

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