# Error summary

Component to show an error summary box - used at the top of the page, to summarise validation errors.

## Guidance

Guidance and documentation can be found on [GOV.UK Design System](linkgoeshere).

## Demo

Error summary [demo](error-summary.html).

## Usage

Code example(s)

```
@@include('error-summary.html')
```


<!--
## Installation

```
npm install --save @govuk-frontend/error-summary
```
-->

## Implementation

When an error occurs:

* show an error summary at the top of the page
* move keyboard focus to the start of the summary

> to move keyboard focus, put tabindex="-1" on the containing div and use obj.focus()

* indicate to screenreaders that the summary represents a collection of information

> add the ARIA role="group" to the containing div

* use a heading at the top of the summary
* associate the heading with the summary box

> use the ARIA attribute aria-labelledby on the containing div, so that screen readers will automatically announce the
> heading as soon as focus is moved to the div

* link from the error list in the summary to the fields with errors
