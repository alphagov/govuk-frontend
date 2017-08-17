# Button

Button intro.

## Guidance

Guidance and documentation can be found on [GOV.UK Design System](linkgoeshere).

## Demo

Button [demo](button.html).

## Usage

Code example(s)

```
@@include('button.html')
```

## Nunjucks

{% from "button/macro.njk" import govukButton %}
{{ govukButton(classes="", value="Save and continue", type="submit") }}

{% from "button/macro.njk" import govukButtonLink %}
{{ govukButtonLink(classes="govuk-c-button--start", url="#", text="Start now") }}

## Arguments

Button (Input)

| Name       | Type    | Default | Required | Description
|---         |---      |---      |---       |---
| classes    | string  |         | No       | Optional additional classes
| value      | string  |         | Yes      | Value of the button
| type       | string  |         | No       | Type of the input, type="submit" is the default if the attribute is not specified
| isDisabled | boolean |         | No       | Disables the button, using disabled="disabled" and aria-disabled="true"

Button (Link)

| Name       | Type   | Default | Required | Description
|---         |---     |---      |---       |---
| classes    | string |         | No       | Use govuk-c-button--start for a "Start now" button
| url        | string |         | Yes      | Url that the hyperlink points to
| text       | string |         | Yes      | Link text

<!--
## Installation

```
npm install --save @govuk-frontend/button
```
-->
