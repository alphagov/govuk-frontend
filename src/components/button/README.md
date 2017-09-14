# Button

## Introduction

A button is an element that allows users to carry out an action on a GOV.UK page. Common use cases include allowing a user to **Start** an application or **Save and continue** their progress. A button should have a short text snippet that describes what it will do.

[Preview the button component.](http://govuk-frontend-review.herokuapp.com/components/button/preview)

## Guidance

More information about when to use button can be found on [GOV.UK Design System](http://www.linktodesignsystem.com/button "Link to read guidance on the use of button on Gov.uk Design system website")

## Quick start examples

Buttons are configured to perform an action and they can have a different look. For example, they can be disabled until a valid action has been performed by the user.

    <input class="govuk-c-button  " value="Save and continue" >

## Variants

### Button--disabled

[Preview button--disabled variant.](/components/button/button--disabled/preview)

Markup

    <input class="govuk-c-button  " value="Save and continue" >

Macro

    {% from "button/macro.njk" import govukButton %}

    {{ govukButton(classes='', text='Save and continue', isDisabled='true') }}

### Button--start

[Preview button--start variant.](/components/button/button--start/preview)

Markup

    <input class="govuk-c-button  " value="Save and continue" >

Macro

    {% from "button/macro.njk" import govukButton %}

    {{ govukButton(classes='', text='Start now', url='/', isStart='true') }}

## Dependencies

To consume the button component you must be running npm version 5 or above.

Please note, this component depends on @govuk-frontend/globals and @govuk-frontend/icons, which will automatically be installed with the package.

## Installation

    npm install --save @govuk-frontend/button

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

    {% from "button/macro.njk" import govukButton %}

    {{ govukButton(classes='', text='Save and continue') }}

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

<th class="govuk-c-table__header" scope="row">text</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">Button or link text</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">isStart</th>

<td class="govuk-c-table__cell ">boolean</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Adds the class govuk-c-button--start for a "Start now" button</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">isDisabled</th>

<td class="govuk-c-table__cell ">boolean</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Disables the button - adds the class govuk-c-button--disabled and sets disabled="disabled" and aria-disabled="true"</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">url</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Url that the hyperlink points to</td>

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

    npm outdated @govuk-frontend/button

To update the latest version run:

    npm update @govuk-frontend/button

## Contribution

Guidelines can be found at [on our Github repository.](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md "link to contributing guidelines on our github repository")

## Acknowledgements/credits

*   GDS developers
*   Jani Kraner
*   Gemma Leigh

## License

MIT