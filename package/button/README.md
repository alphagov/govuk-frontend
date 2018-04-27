# Button

## Introduction

A button is an element that allows users to carry out an action on a GOV.UK page. Common use cases include allowing a user to **Start** an application or **Save and continue** their progress. A button should have a short text snippet that describes what it will do.

## Guidance

Find out when to use the Button component in your service in the [GOV.UK Design System](https://govuk-design-system-production.cloudapps.digital/components/button).

## Quick start examples

Buttons are configured to perform an action and they can have a different look. For example, they can be disabled until a valid action has been performed by the user.

### Component default

[Preview the button component](http://govuk-frontend-review.herokuapp.com/components/button/preview)

#### Markup

    <input value="Save and continue" type="submit" class="govuk-c-button">

#### Macro

    {% from 'button/macro.njk' import govukButton %}

    {{ govukButton({
      "text": "Save and continue"
    }) }}

### Button--disabled

[Preview the button--disabled example](http://govuk-frontend-review.herokuapp.com/components/button/disabled/preview)

#### Markup

    <input value="Disabled button" type="submit" disabled="disabled" aria-disabled="true" class="govuk-c-button govuk-c-button--disabled">

#### Macro

    {% from 'button/macro.njk' import govukButton %}

    {{ govukButton({
      "text": "Disabled button",
      "disabled": true
    }) }}

### Button--link

[Preview the button--link example](http://govuk-frontend-review.herokuapp.com/components/button/link/preview)

#### Markup

    <a href="/" role="button" class="govuk-c-button">
      Link button
    </a>

#### Macro

    {% from 'button/macro.njk' import govukButton %}

    {{ govukButton({
      "text": "Link button",
      "href": "/"
    }) }}

### Button--disabled-link

[Preview the button--disabled-link example](http://govuk-frontend-review.herokuapp.com/components/button/disabled-link/preview)

#### Markup

    <a href="/" role="button" class="govuk-c-button govuk-c-button--disabled">
      Disabled link button
    </a>

#### Macro

    {% from 'button/macro.njk' import govukButton %}

    {{ govukButton({
      "text": "Disabled link button",
      "href": "/",
      "disabled": true
    }) }}

### Button--start-link

[Preview the button--start-link example](http://govuk-frontend-review.herokuapp.com/components/button/start-link/preview)

#### Markup

    <a href="/" role="button" class="govuk-c-button govuk-c-button--start">
      Start now link button
    </a>

#### Macro

    {% from 'button/macro.njk' import govukButton %}

    {{ govukButton({
      "text": "Start now link button",
      "href": "/",
      "classes": "govuk-c-button--start"
    }) }}

### Button--explicit-button

[Preview the button--explicit-button example](http://govuk-frontend-review.herokuapp.com/components/button/explicit-button/preview)

#### Markup

    <button name="start-now" type="submit" class="govuk-c-button">
      Start now
    </button>

#### Macro

    {% from 'button/macro.njk' import govukButton %}

    {{ govukButton({
      "element": "button",
      "name": "start-now",
      "text": "Start now"
    }) }}

### Button--explicit-button-disabled

[Preview the button--explicit-button-disabled example](http://govuk-frontend-review.herokuapp.com/components/button/explicit-button-disabled/preview)

#### Markup

    <button type="submit" disabled="disabled" aria-disabled="true" class="govuk-c-button govuk-c-button--disabled">
      Explicit button disabled
    </button>

#### Macro

    {% from 'button/macro.njk' import govukButton %}

    {{ govukButton({
      "element": "button",
      "text": "Explicit button disabled",
      "disabled": true
    }) }}

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

<th class="govuk-c-table__header" scope="row">element</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">Whether to use an `input`, `button` or `a` element to create the button. In most cases you will not need to set this as it will be configured automatically if you use `href` or `html`.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">text</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">Text for the button</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">html</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">HTML for the button or link. If this is provided, the `text` argument will be ignored and `element` will be automatically set to `button` unless `href` is also set, or it has already been defined. This argument has no effect if `element` is set to `input`.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">name</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">Name for the `input` or `button`. This has no effect on `a` elements.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">type</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">Type of `input` or `button` – `button`, `submit` or `reset`. Defaults to `submit`. This has no effect on `a` elements.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">value</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">Value for the `button` tag. This has no effect on `a` or `input` elements.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">disabled</th>

<td class="govuk-c-table__cell ">boolean</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Whether the button should be disabled. For button and input elements, `disabled` and `aria-disabled` attributes will be set automatically.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">href</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">The URL that the button should link to. If this is set, `element` will be automatically set to `a` if it has not already been defined.</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">classes</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Optional additional classes</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">attributes</th>

<td class="govuk-c-table__cell ">object</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Any extra HTML attributes (for example data attributes) to add to the error message span tag</td>

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

    npm outdated @govuk-frontend/button

To update the latest version run:

    npm update @govuk-frontend/button

## Contribution

Guidelines can be found at [on our Github repository.](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md "link to contributing guidelines on our github repository")

## License

MIT