# List

## Introduction

Breadcrumb navigation, showing page hierarchy.

[Preview the list component.](http://govuk-frontend-review.herokuapp.com/components/list/preview)

## Guidance

More information about when to use list can be found on [GOV.UK Design System](http://www.linktodesignsystem.com/list "Link to read guidance on the use of list on Gov.uk Design system website")

## Quick start examples

    <ul class="govuk-c-list ">

      <li>

          <a href="/ ">
            Related link
          </a>

      </li>

      <li>

          <a href="/ ">
            Related link
          </a>

      </li>

      <li>

          <a href="/ ">
            Related link
          </a>

      </li>

    </ul>

    <ul class="govuk-c-list govuk-c-list--bullet ">

      <li>

            here is a bulleted list

      </li>

      <li>

            here is the second bulleted list item

      </li>

      <li>

            here is the third bulleted list item

      </li>

    </ul>

    <ol class="govuk-c-list govuk-c-list--number ">

      <li>

            This is a numbered list.

      </li>

      <li>

            This is the second step in a numbered list.

      </li>

      <li>

            The third step is to make sure each item is a full sentence ending with a full stop.

      </li>

    </ol>

    <ol class="govuk-c-list govuk-c-list--icon ">

      <li>

          <span class="govuk-c-list__icon govuk-u-circle ">1</span>
          Step 1

      </li>

      <li>

          <span class="govuk-c-list__icon govuk-u-circle ">2</span>
          Step 2

      </li>

      <li>

          <span class="govuk-c-list__icon govuk-u-circle ">3</span>
          Step 3

      </li>

    </ol>

    <ol class="govuk-c-list govuk-c-list--icon ">

      <li>

          <span class="govuk-c-list__icon govuk-u-circle govuk-c-list__icon--large">1</span>
          Step 1 Large icon

      </li>

      <li>

          <span class="govuk-c-list__icon govuk-u-circle govuk-c-list__icon--large">2</span>
          Step 2 Large icon

      </li>

      <li>

          <span class="govuk-c-list__icon govuk-u-circle govuk-c-list__icon--large">3</span>
          Step 3 Large icon

      </li>

    </ol>

## Variants

## Dependencies

To consume the list component you must be running npm version 5 or above.

## Installation

    npm install --save @govuk-frontend/list

## Requirements

### Build tool configuration

When compiling the Sass files you'll need to define includePaths to reference the node_modules directory. Below is a sample configuration using gulp

      .pipe(sass({
          includePaths: 'node_modules/'
      }))

### Static asset path configuration

To show the button image you need to configure your app to show these assets. Below is a sample configuration using Express js:

    app.use('/public', express.static(path.join(__dirname, '/node_modules/@govuk-frontend/icons')))

## If you are using Nunjucks

To use a macro, follow the below code example:

    {% from "list/macro.njk" import govukList %}

    {{ govukList(
      classes='',
      [
        {
          text: 'Related link',
          url: '/'
        },
        {
          text: 'Related link',
          url: '/'
        },
        {
          text: 'Related link',
          url: '/'
        }
      ]
    ) }}

    {{ govukList(
      classes='',
      [
        {
          text: 'here is a bulleted list'
        },
        {
          text: 'here is the second bulleted list item'
        },
        {
          text: 'here is the third bulleted list item'
        }
      ],
      options = {
        'isBullet': 'true'
      }
    ) }}

    {{ govukList(
      classes='',
      [
        {
          text: 'This is a numbered list.'
        },
        {
          text: 'This is the second step in a numbered list.'
        },
        {
          text: 'The third step is to make sure each item is a full sentence ending with a full stop.'
        }
      ],
      options = {
        'isNumber': 'true'
      }
    ) }}

    {{ govukList(
      classes='',
      [
        {
          text: 'Step 1'
        },
        {
          text: 'Step 2'
        },
        {
          text: 'Step 3'
        }
      ],
      options = {
        'isStep': 'true'
      }
    ) }}

    {{ govukList(
      classes='',
      [
        {
          text: 'Step 1 Large icon'
        },
        {
          text: 'Step 2 Large icon'
        },
        {
          text: 'Step 3 Large icon'
        }
      ],
      options = {
        'isStepLarge': 'true'
      }
    ) }}

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

<th class="govuk-c-table__header" scope="row">listItems</th>

<td class="govuk-c-table__cell ">array</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">List items array with url and text keys</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">url</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">List item url</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">text</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">List item text</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">options</th>

<td class="govuk-c-table__cell ">object</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Options object</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">options.isBullet</th>

<td class="govuk-c-table__cell "></td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Creates bulleted list</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">options.isNumber</th>

<td class="govuk-c-table__cell "></td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Creates numbered list</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">options.isStep</th>

<td class="govuk-c-table__cell "></td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Creates list of steps</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">options.isStepLarge</th>

<td class="govuk-c-table__cell "></td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Creates list of steps with large icons</td>

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

    npm outdated @govuk-frontend/list

To update the latest version run:

    npm update @govuk-frontend/list

## Contribution

Guidelines can be found at [on our Github repository.](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md "link to contributing guidelines on our github repository")

## Acknowledgements/credits

*   GDS developers
*   Jani Kraner
*   Gemma Leigh

## License

MIT