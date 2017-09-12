# Pagination

## Introduction

Navigational links that allow users navigate within a series of pages.

[Preview the pagination component.](http://govuk-frontend-review.herokuapp.com/components/pagination/preview)

## Guidance

More information about when to use pagination can be found on [GOV.UK Design System](http://www.linktodesignsystem.com/pagination "Link to read guidance on the use of pagination on Gov.uk Design system website")

## Dependencies

To consume the pagination component you must be running npm version 5 or above.

## Installation

    npm install --save @govuk-frontend/pagination

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

    <nav class="govuk-c-pagination " role="navigation" aria-label="Pagination">
      <ul class="govuk-c-pagination__list">
        <li class="govuk-c-pagination__item govuk-c-pagination__item--previous">
          <a class="govuk-c-pagination__link" href="previous-page" rel="prev">
            <span class="govuk-c-pagination__link-title">
              <svg class="govuk-c-pagination__link-icon" xmlns="http://www.w3.org/2000/svg" height="13" width="17" viewBox="0 0 17 13">
                <path fill="currentColor" d="m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z"></path>
              </svg>
              Previous page
            </span>
              <span class="govuk-c-pagination__link-label">1 of 3</span>
          </a>
        </li>

      </ul>
    </nav>

    <nav class="govuk-c-pagination " role="navigation" aria-label="Pagination">
      <ul class="govuk-c-pagination__list">

        <li class="govuk-c-pagination__item govuk-c-pagination__item--next">
          <a class="govuk-c-pagination__link" href="next-page" rel="next">
            <span class="govuk-c-pagination__link-title">
              Next page
              <svg class="govuk-c-pagination__link-icon" xmlns="http://www.w3.org/2000/svg" height="13" width="17" viewBox="0 0 17 13">
                <path fill="currentColor" d="m10.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z"></path>
              </svg>
            </span>
              <span class="govuk-c-pagination__link-label">Tax disc</span>
          </a>
        </li>
      </ul>
    </nav>

    <nav class="govuk-c-pagination " role="navigation" aria-label="Pagination">
      <ul class="govuk-c-pagination__list">
        <li class="govuk-c-pagination__item govuk-c-pagination__item--previous">
          <a class="govuk-c-pagination__link" href="previous-page" rel="prev">
            <span class="govuk-c-pagination__link-title">
              <svg class="govuk-c-pagination__link-icon" xmlns="http://www.w3.org/2000/svg" height="13" width="17" viewBox="0 0 17 13">
                <path fill="currentColor" d="m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z"></path>
              </svg>
              Previous page
            </span>
              <span class="govuk-c-pagination__link-label">1 of 3</span>
          </a>
        </li>

        <li class="govuk-c-pagination__item govuk-c-pagination__item--next">
          <a class="govuk-c-pagination__link" href="next-page" rel="next">
            <span class="govuk-c-pagination__link-title">
              Next page
              <svg class="govuk-c-pagination__link-icon" xmlns="http://www.w3.org/2000/svg" height="13" width="17" viewBox="0 0 17 13">
                <path fill="currentColor" d="m10.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z"></path>
              </svg>
            </span>
              <span class="govuk-c-pagination__link-label">2 of 3</span>
          </a>
        </li>
      </ul>
    </nav>

    <nav class="govuk-c-pagination " role="navigation" aria-label="Pagination">
      <ul class="govuk-c-pagination__list">
        <li class="govuk-c-pagination__item govuk-c-pagination__item--previous">
          <a class="govuk-c-pagination__link" href="previous-page" rel="prev">
            <span class="govuk-c-pagination__link-title">
              <svg class="govuk-c-pagination__link-icon" xmlns="http://www.w3.org/2000/svg" height="13" width="17" viewBox="0 0 17 13">
                <path fill="currentColor" d="m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z"></path>
              </svg>
              Previous page
            </span>
          </a>
        </li>

        <li class="govuk-c-pagination__item govuk-c-pagination__item--next">
          <a class="govuk-c-pagination__link" href="next-page" rel="next">
            <span class="govuk-c-pagination__link-title">
              Next page
              <svg class="govuk-c-pagination__link-icon" xmlns="http://www.w3.org/2000/svg" height="13" width="17" viewBox="0 0 17 13">
                <path fill="currentColor" d="m10.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z"></path>
              </svg>
            </span>
          </a>
        </li>
      </ul>
    </nav>

## If you are using Nunjucks

To use a macro, follow the below code examples:

    {% from "pagination/macro.njk" import govukPagination %}

    {{ govukPagination(
      classes='',
      previousPage=[
       {
          url: 'previous-page',
          title: 'Previous page',
          label: '1 of 3'
        }
      ]
      )
    }}

    {{ govukPagination(
      classes='',
      nextPage=[
       {
          url: 'next-page',
          title: 'Next page',
          label: 'Tax disc'
        }
      ]
      )
    }}

    {{ govukPagination(
      classes='',
      previousPage=[
       {
          url: 'previous-page',
          title: 'Previous page',
          label: '1 of 3'
        }
      ],
      nextPage=[
       {
          url: 'next-page',
          title: 'Next page',
          label: '2 of 3'
        }
      ]
      )
    }}

    {{ govukPagination(
      classes='',
      previousPage=[
       {
          url: 'previous-page',
          title: 'Previous page'
        }
      ],
      nextPage=[
       {
          url: 'next-page',
          title: 'Next page'
        }
      ]
      )
    }}

Where the macros take the following arguments

## Component arguments

<div>

<table class="govuk-c-table ">

<thead class="govuk-c-table__head">

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header " scope="col">Name</th>

<th class="govuk-c-table__header " scope="col">Type</th>

<th class="govuk-c-table__header " scope="col">Required</th>

<th class="govuk-c-table__header " scope="col">Description</th>

</tr>

</thead>

<tbody class="govuk-c-table__body">

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">classes</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Optional additional classes</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">previousPage</th>

<td class="govuk-c-table__cell ">array</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Previous page array with url, title and label keys</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">nextPage</th>

<td class="govuk-c-table__cell ">array</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Next page array with url, title and label keys</td>

</tr>

</tbody>

</table>

</div>

### Setting up Nunjucks views and paths

Below is an example setup using express configure views:

    nunjucks.configure('node_modules/@govuk-frontend`, {
      autoescape: true,
      cache: false,
      express: app
    })

## Getting updates

To check whether you have the latest version of the button run:

    npm outdated @govuk-frontend/pagination

To update the latest version run:

    npm update @govuk-frontend/pagination

## Contribution

Guidelines can be found at [on our Github repository.](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md "link to contributing guidelines on our github repository")

## Acknowledgements/credits

*   GDS developers
*   Jani Kraner
*   Gemma Leigh

## License

MIT