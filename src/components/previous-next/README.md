# Previous next

## Introduction

Navigational links that allow users navigate within a series of pages.

## Guidance

More information about when to use previous-next can be found on [GOV.UK Design System](http://www.linktodesignsystem.com/previous-next "Link to read guidance on the use of previous-next on Gov.uk Design system website")

## Quick start examples

### Component default

[Preview the previous-next component](http://govuk-frontend-review.herokuapp.com/components/previous-next/preview)

#### Markup

    <nav class="govuk-c-previous-next" role="navigation" aria-label="Pagination">
      <ul class="govuk-c-previous-next__list">

        <li class="govuk-c-previous-next__item govuk-c-previous-next__item--previous">
          <a class="govuk-c-previous-next__link" href="/previous-page" rel="prev">
            <span class="govuk-c-previous-next__link-title">
              <svg class="govuk-c-previous-next__link-icon" xmlns="http://www.w3.org/2000/svg" height="13" width="17" viewBox="0 0 17 13">
                <path fill="currentColor" d="m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z"></path>
              </svg>
              Previous page
            </span>

            <span class="govuk-c-previous-next__link-label">1 of 3</span>

          </a>
        </li>

        <li class="govuk-c-previous-next__item govuk-c-previous-next__item--next">
          <a class="govuk-c-previous-next__link" href="/next-page" rel="next">
            <span class="govuk-c-previous-next__link-title">
              Next page
              <svg class="govuk-c-previous-next__link-icon" xmlns="http://www.w3.org/2000/svg" height="13" width="17" viewBox="0 0 17 13">
                <path fill="currentColor" d="m10.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z"></path>
              </svg>
            </span>

            <span class="govuk-c-previous-next__link-label">3 of 3</span>

          </a>
        </li>

      </ul>
    </nav>

#### Macro

    {{ govukPreviousNext({
      "previous": {
        "href": "/previous-page",
        "text": "Previous page",
        "labelText": "1 of 3"
      },
      "next": {
        "href": "/next-page",
        "text": "Next page",
        "labelText": "3 of 3"
      }
    }) }}

### Previous-next--no-next-page

[Preview the previous-next--no-next-page example](http://govuk-frontend-review.herokuapp.com/components/previous-next/no-next-page/preview)

#### Markup

    <nav class="govuk-c-previous-next extra-dummy-example-class" role="navigation" aria-label="Pagination">
      <ul class="govuk-c-previous-next__list">

        <li class="govuk-c-previous-next__item govuk-c-previous-next__item--previous">
          <a class="govuk-c-previous-next__link" href="/previous-page" rel="prev">
            <span class="govuk-c-previous-next__link-title">
              <svg class="govuk-c-previous-next__link-icon" xmlns="http://www.w3.org/2000/svg" height="13" width="17" viewBox="0 0 17 13">
                <path fill="currentColor" d="m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z"></path>
              </svg>
              Previous page
            </span>

            <span class="govuk-c-previous-next__link-label">1 of 3</span>

          </a>
        </li>

      </ul>
    </nav>

#### Macro

    {{ govukPreviousNext({
      "classes": "extra-dummy-example-class",
      "previous": {
        "href": "/previous-page",
        "text": "Previous page",
        "labelText": "1 of 3"
      }
    }) }}

## Dependencies

To consume the previous-next component you must be running npm version 5 or above.

## Installation

      npm install --save @govuk-frontend/previous-next

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

<th class="govuk-c-table__header" scope="row">classes</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Optional additional classes.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">previous</th>

<td class="govuk-c-table__cell ">bbject</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Object containing data for the previous page item.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">next</th>

<td class="govuk-c-table__cell ">object</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Object containing data for the next page item.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">text</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Text to use within the next or previous object.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">html</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">HTML to use within within the next or previous object. If this is provided, the text argument will be ignored.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">labelText</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Text to use for the label within the next or previous object.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">labelHtml</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">HTML to use for the label within within the next or previous object. If this is provided, the labelText argument will be ignored.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">attributes</th>

<td class="govuk-c-table__cell ">object</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Any extra HTML attributes (for example data attributes) to add to the previous-next container.</td>

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

      npm outdated @govuk-frontend/previous-next

To update the latest version run:

      npm update @govuk-frontend/previous-next

## Contribution

Guidelines can be found at [on our Github repository.](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md "link to contributing guidelines on our github repository")

## License

MIT