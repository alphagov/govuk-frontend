# Pagination

Previous/next page links. Example [page](https://www.gov.uk/voting-in-the-uk/polling-stations)

## Guidance

Guidance and documentation can be found on [GOV.UK Design System](linkgoeshere).

## Demo

Component name [demo](pagination.html).

## Usage

Code example(s)

```
@@include('pagination.html')
```

## Nunjucks

```
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
```

## Arguments

| Name          | Type    | Default | Required | Description
|---            |---      |---      |---       |---
| classes       | string  |         | No       | Optional additional classes
| name          | string  |         | Yes      | Name of the group of checkboxes
| id            | string  |         | Yes      | ID is prefixed to the ID of each checkbox
| previousPage  | array   |         | No       | previousPage array with url, title and label keys
| nextPage      | array   |         | No       | nextPage array with url, title and label keys

<!--
## Installation

```
npm install --save @govuk-frontend/component-name
```
-->
