# File upload

A control that lets the user select a file.

## Guidance

Guidance and documentation can be found on [GOV.UK Design System](linkgoeshere).

## Demo

File upload [demo](http://govuk-frontend.herokuapp.com/components/file-upload/index.html).

## Usage

Code example(s)

```
<label class="govuk-c-label" for="file-upload-a">
  Upload a file
</label>
<input class="govuk-c-file-upload" type="file" id="file-upload-a">

<label class="govuk-c-label" for="file-upload-b">
  Upload a file
  <span class="govuk-c-error-message">
    Error message goes here
  </span>
</label>
<input class="govuk-c-file-upload govuk-c-file-upload--error" type="file" id="file-upload-b">

```



## Installation

```
npm install --save @govuk-frontend/file-upload
```


## Implementation

We recommend using a native input using `type="file"`, rather than a custom implementation.

This is so:
* the control gains focus when tabbing through the page
* the control functions using a keyboard
* the control functions using assistive technology
* the control functions when javascript is not available

A custom implementation of this control would need to meet the criteria above.
