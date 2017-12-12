# List

## Introduction

A list of items, list variants are bulleted or numbered.

## Guidance

More information about when to use list can be found on [GOV.UK Design System](http://www.linktodesignsystem.com/list "Link to read guidance on the use of list on Gov.uk Design system website")

## Quick start examples

### Component default

[Preview the list component](http://govuk-frontend-review.herokuapp.com/components/list/preview)

#### Markup

    <ul class="govuk-c-list">

      <li>

        Related link

      </li>

      <li>

        Related link

      </li>

      <li>

        <strong>Not</strong> a link

      </li>
    </ul>

#### Macro

    {{ govukList({
      "items": [
        {
          "text": "Related link",
          "href": null
        },
        {
          "text": "Related link",
          "href": null
        },
        {
          "html": "<strong>Not</strong> a link"
        }
      ]
    }) }}

### List--bulleted-list

[Preview the list--bulleted-list variant](http://govuk-frontend-review.herokuapp.com/components/list/bulleted-list/preview)

#### Markup

    <ul class="govuk-c-list govuk-c-list--bullet">

      <li>

        here is a bulleted list

      </li>

      <li>

        vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor

      </li>

      <li>

        vestibulum id ligula porta felis euismod semper

      </li>

      <li>

        integer posuere erat a ante venenatis dapibus posuere velit aliquet

      </li>
    </ul>

#### Macro

    {{ govukList({
      "type": "bullet",
      "items": [
        {
          "text": "here is a bulleted list"
        },
        {
          "text": "vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor"
        },
        {
          "text": "vestibulum id ligula porta felis euismod semper"
        },
        {
          "text": "integer posuere erat a ante venenatis dapibus posuere velit aliquet"
        }
      ]
    }) }}

### List--numbered-list

[Preview the list--numbered-list variant](http://govuk-frontend-review.herokuapp.com/components/list/numbered-list/preview)

#### Markup

    <ol class="govuk-c-list govuk-c-list--number">

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

#### Macro

    {{ govukList({
      "type": "number",
      "items": [
        {
          "text": "This is a numbered list."
        },
        {
          "text": "This is the second step in a numbered list."
        },
        {
          "text": "The third step is to make sure each item is a full sentence ending with a full stop."
        }
      ]
    }) }}

### List--steps-icon-list

[Preview the list--steps-icon-list variant](http://govuk-frontend-review.herokuapp.com/components/list/steps-icon-list/preview)

#### Markup

    <ol class="govuk-c-list govuk-c-list--icon">

      <li>

        <span class="govuk-c-list__icon govuk-o-circle">1</span>

        Step 1

      </li>

      <li>

        <span class="govuk-c-list__icon govuk-o-circle">2</span>

        Step 2

      </li>

      <li>

        <span class="govuk-c-list__icon govuk-o-circle">3</span>

        Step 3

      </li>

      <li>

        <span class="govuk-c-list__icon govuk-o-circle">4</span>

        Step 4

      </li>

      <li>

        <span class="govuk-c-list__icon govuk-o-circle">5</span>

        Step 5

      </li>

      <li>

        <span class="govuk-c-list__icon govuk-o-circle">6</span>

        Step 6

      </li>

      <li>

        <span class="govuk-c-list__icon govuk-o-circle">7</span>

        Step 7

      </li>

      <li>

        <span class="govuk-c-list__icon govuk-o-circle">8</span>

        Step 8

      </li>

      <li>

        <span class="govuk-c-list__icon govuk-o-circle">9</span>

        Step 9

      </li>

      <li>

        <span class="govuk-c-list__icon govuk-o-circle">10</span>

        Step 10

      </li>

      <li>

        <span class="govuk-c-list__icon govuk-o-circle">11</span>

        Step 11

      </li>

      <li>

        <span class="govuk-c-list__icon govuk-o-circle">12</span>

        Step 12

      </li>

      <li>

        <span class="govuk-c-list__icon govuk-o-circle">13</span>

        Step 13

      </li>

      <li>

        <span class="govuk-c-list__icon govuk-o-circle">14</span>

        Step 14

      </li>
    </ol>

#### Macro

    {{ govukList({
      "type": "step",
      "items": [
        {
          "text": "Step 1"
        },
        {
          "text": "Step 2"
        },
        {
          "text": "Step 3"
        },
        {
          "text": "Step 4"
        },
        {
          "text": "Step 5"
        },
        {
          "text": "Step 6"
        },
        {
          "text": "Step 7"
        },
        {
          "text": "Step 8"
        },
        {
          "text": "Step 9"
        },
        {
          "text": "Step 10"
        },
        {
          "text": "Step 11"
        },
        {
          "text": "Step 12"
        },
        {
          "text": "Step 13"
        },
        {
          "text": "Step 14"
        }
      ]
    }) }}

### List--steps-large-icon-list

[Preview the list--steps-large-icon-list variant](http://govuk-frontend-review.herokuapp.com/components/list/steps-large-icon-list/preview)

#### Markup

    <ol class="govuk-c-list govuk-c-list--icon">

      <li>

        <span class="govuk-c-list__icon govuk-c-list__icon--large govuk-o-circle">1</span>

        Step 1

      </li>

      <li>

        <span class="govuk-c-list__icon govuk-c-list__icon--large govuk-o-circle">2</span>

        Step 2

      </li>

      <li>

        <span class="govuk-c-list__icon govuk-c-list__icon--large govuk-o-circle">3</span>

        Step 3

      </li>

      <li>

        <span class="govuk-c-list__icon govuk-c-list__icon--large govuk-o-circle">4</span>

        Step 4

      </li>

      <li>

        <span class="govuk-c-list__icon govuk-c-list__icon--large govuk-o-circle">5</span>

        Step 5

      </li>

      <li>

        <span class="govuk-c-list__icon govuk-c-list__icon--large govuk-o-circle">6</span>

        Step 6

      </li>

      <li>

        <span class="govuk-c-list__icon govuk-c-list__icon--large govuk-o-circle">7</span>

        Step 7

      </li>

      <li>

        <span class="govuk-c-list__icon govuk-c-list__icon--large govuk-o-circle">8</span>

        Step 8

      </li>

      <li>

        <span class="govuk-c-list__icon govuk-c-list__icon--large govuk-o-circle">9</span>

        Step 9

      </li>

      <li>

        <span class="govuk-c-list__icon govuk-c-list__icon--large govuk-o-circle">10</span>

        Step 10

      </li>

      <li>

        <span class="govuk-c-list__icon govuk-c-list__icon--large govuk-o-circle">11</span>

        Step 11

      </li>

      <li>

        <span class="govuk-c-list__icon govuk-c-list__icon--large govuk-o-circle">12</span>

        Step 12

      </li>

      <li>

        <span class="govuk-c-list__icon govuk-c-list__icon--large govuk-o-circle">13</span>

        Step 13

      </li>

      <li>

        <span class="govuk-c-list__icon govuk-c-list__icon--large govuk-o-circle">14</span>

        Step 14

      </li>
    </ol>

#### Macro

    {{ govukList({
      "type": "step-large",
      "items": [
        {
          "text": "Step 1"
        },
        {
          "text": "Step 2"
        },
        {
          "text": "Step 3"
        },
        {
          "text": "Step 4"
        },
        {
          "text": "Step 5"
        },
        {
          "text": "Step 6"
        },
        {
          "text": "Step 7"
        },
        {
          "text": "Step 8"
        },
        {
          "text": "Step 9"
        },
        {
          "text": "Step 10"
        },
        {
          "text": "Step 11"
        },
        {
          "text": "Step 12"
        },
        {
          "text": "Step 13"
        },
        {
          "text": "Step 14"
        }
      ]
    }) }}

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

## Component arguments

If you are using Nunjucks,then macros take the following arguments

<div>

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

<th class="govuk-c-table__header" scope="row">type</th>

<td class="govuk-c-table__cell ">String</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Type of list to create: "bullet", "number", "step" or "step-large", or omit for an unordered list without bullets.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">items</th>

<td class="govuk-c-table__cell ">array</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">Items for the list. An array of objects with text or html and optional href attributes</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">href</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Link target for the list item</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">text</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Text content for the list item</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">html</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">HTML content for the list item. If this is specified, the text argument will be ignored.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">classes</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Optional additional classes for the list tag</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">attributes</th>

<td class="govuk-c-table__cell ">object</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Any extra HTML attributes (for example data attributes) to add to the list tag</td>

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

## License

MIT