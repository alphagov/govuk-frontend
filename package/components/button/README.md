# Button

## Introduction

A button is an element that allows users to carry out an action on a GOV.UK page. Common use cases include allowing a user to **Start** an application or **Save and continue** their progress. A button should have a short text snippet that describes what it will do.

## Guidance

Find out when to use the button component in your service in the [GOV.UK Design System](https://design-system.service.gov.uk/components/button).

## Quick start examples

Buttons are configured to perform an action and they can have a different look. For example, they can be disabled until a valid action has been performed by the user.

### Button

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/button/preview)

#### Markup

    <button type="submit" class="govuk-button">
      Save and continue
    </button>

#### Macro

    {% from "button/macro.njk" import govukButton %}

    {{ govukButton({
      "text": "Save and continue"
    }) }}

### Button disabled

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/button/disabled/preview)

#### Markup

    <button type="submit" disabled="disabled" aria-disabled="true" class="govuk-button govuk-button--disabled">
      Disabled button
    </button>

#### Macro

    {% from "button/macro.njk" import govukButton %}

    {{ govukButton({
      "text": "Disabled button",
      "disabled": true
    }) }}

### Button link

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/button/link/preview)

#### Markup

    <a href="/" role="button" draggable="false" class="govuk-button">
      Link button
    </a>

#### Macro

    {% from "button/macro.njk" import govukButton %}

    {{ govukButton({
      "text": "Link button",
      "href": "/"
    }) }}

### Button link disabled

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/button/link-disabled/preview)

#### Markup

    <a href="/" role="button" draggable="false" class="govuk-button govuk-button--disabled">
      Disabled link button
    </a>

#### Macro

    {% from "button/macro.njk" import govukButton %}

    {{ govukButton({
      "text": "Disabled link button",
      "href": "/",
      "disabled": true
    }) }}

### Button start link

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/button/start-link/preview)

#### Markup

    <a href="/" role="button" draggable="false" class="govuk-button govuk-button--start">
      Start now link button
    </a>

#### Macro

    {% from "button/macro.njk" import govukButton %}

    {{ govukButton({
      "text": "Start now link button",
      "href": "/",
      "classes": "govuk-button--start"
    }) }}

### Button input

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/button/input/preview)

#### Markup

    <input value="Start now" name="start-now" type="submit" class="govuk-button">

#### Macro

    {% from "button/macro.njk" import govukButton %}

    {{ govukButton({
      "element": "input",
      "name": "start-now",
      "text": "Start now"
    }) }}

### Button input disabled

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/button/input-disabled/preview)

#### Markup

    <input value="Explicit input button disabled" type="submit" disabled="disabled" aria-disabled="true" class="govuk-button govuk-button--disabled">

#### Macro

    {% from "button/macro.njk" import govukButton %}

    {{ govukButton({
      "element": "input",
      "text": "Explicit input button disabled",
      "disabled": true
    }) }}

## Requirements

### Build tool configuration

When compiling the Sass files you'll need to define includePaths to reference the node_modules directory. Below is a sample configuration using gulp

    .pipe(sass({
      includePaths: 'node_modules/'
    }))

### Static asset path configuration

In order to include the images used in the components, you need to configure your app to show these assets. Below is a sample configuration using Express js:

    app.use('/assets', express.static(path.join(__dirname, '/node_modules/govuk-frontend/assets')))

## Component options

Use options to customise the appearance, content and behaviour of a component when using a macro, for example, changing the text.

See [options table](https://design-system.service.gov.uk/components/button/#options-example-default) for details.

### Setting up Nunjucks views and paths

Below is an example setup using express configure views:

    nunjucks.configure('node_modules/govuk-frontend/components', {
      autoescape: true,
      cache: false,
      express: app
    })

## Contribution

Guidelines can be found at [on our Github repository.](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md "link to contributing guidelines on our github repository")

## License

MIT