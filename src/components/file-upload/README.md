# File upload

A control that lets the user select a file.

## Guidance

Guidance and documentation can be found on [GOV.UK Design System](linkgoeshere).

## Demo

File upload [demo](file-upload.html).

## Usage

Code example(s)

```
@@include('file-upload.html')
```

## Nunjucks

{% from "file-upload/macro.njk" import govukFileUpload %}

{{ govukFileUpload(
  classes='',
  id='file-upload',
  fileUploadText='Upload a file'
  )
}}

## Arguments

| Name            | Type    | Default | Required  | Description
|---              |---      |---      |---        |---
| classes         | string  |         | No        | Optional additional classes
| id              | string  |         | Yes       | The ID of the file upload input
| fileUploadText  | string  |         | Yes       | Label text

<!--
## Installation

```
npm install --save @govuk-frontend/file-upload
```
-->

## Implementation

We recommend using a native input using `type="file"`, rather than a custom implementation.

This is so:
* the control gains focus when tabbing through the page
* the control functions using a keyboard
* the control functions using assistive technology
* the control functions when javascript is not available

A custom implementation of this control would need to meet the criteria above.
