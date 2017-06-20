# Error summary

Component to show an error summary box - used at the top of the page, to summarise validation errors.

## Guidance

Guidance and documentation can be found on [GOV.UK Design System](linkgoeshere).

## Demo

Error summary [demo](error-summary.html).

## Usage

Code example(s)

```
<div class="govuk-c-error-summary" aria-labelledby="error-summary-title" role="group" tabindex="-1">

  <h1 class="govuk-c-error-summary__title" id="error-summary-title">
    Message to alert the user to a problem goes here
  </h1>

  <div class="govuk-c-error-summary__body">
    <p>
      Optional description of the errors and how to correct them
    </p>

    <ul class="govuk-c-list govuk-c-error-summary__list">
      <li><a href="#example-personal-details">Descriptive link to the question with an error</a></li>
    </ul>
  </div>

</div>

```



## Installation

```
npm install --save @govuk-frontend/error-summary
```


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
