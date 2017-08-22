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

```
{% from "button/macro.njk" import govukButton %}

{{ govukButton(classes='', text='Save and continue') }}

{{ govukButton(classes='', text='Save and continue', isDisabled='true') }}

{{ govukButton(classes='', text='Start now', url='/', isStart='true') }}
```

## Arguments

Button

| Name       | Type    | Default | Required | Description
|---         |---      |---      |---       |---
| classes    | string  |         | No       | Optional additional classes
| text       | string  |         | Yes      | Button or link text
| isStart    | boolean |         | No       | Adds the class govuk-c-button--start for a "Start now" button
| isDisabled | boolean |         | No       | Disables the button - adds the class govuk-c-button--disabled and sets disabled="disabled" and aria-disabled="true"
| url        | string  |         | No       | Url that the hyperlink points to


<!--
## Installation

```
npm install --save @govuk-frontend/button
```
-->
