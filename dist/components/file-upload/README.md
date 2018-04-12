# File upload

## Introduction

The HTML `<input>` element with type="file" lets a user pick one or more files, to upload to a server.

## Guidance

Find out when to use the File upload component in your service in the [GOV.UK Design System](https://govuk-design-system-production.cloudapps.digital/components/file-upload).

## Quick start examples

### Component default

[Preview the file-upload component](http://govuk-frontend-review.herokuapp.com/components/file-upload/preview)

#### Markup

    <div class="govuk-o-form-group"><label class="govuk-c-label" for="file-upload-1">
      Upload a file

    </label>
    <input type="file" id="file-upload-1" name="file-upload-1" class="govuk-c-file-upload">
    </div>

#### Macro

    {% from 'file-upload/macro.njk' import govukFileUpload %}

    {{ govukFileUpload({
      "id": "file-upload-1",
      "name": "file-upload-1",
      "label": {
        "text": "Upload a file"
      }
    }) }}

### File-upload--with-hint-text

[Preview the file-upload--with-hint-text example](http://govuk-frontend-review.herokuapp.com/components/file-upload/with-hint-text/preview)

#### Markup

    <div class="govuk-o-form-group"><label class="govuk-c-label" for="file-upload-2">
      Upload your photo

      <span class="govuk-c-label__hint">
        Your photo may be in your Pictures, Photos, Downloads or Desktop folder. Or in an app like iPhoto.
      </span>

    </label>
    <input type="file" id="file-upload-2" name="file-upload-2" class="govuk-c-file-upload">
    </div>

#### Macro

    {% from 'file-upload/macro.njk' import govukFileUpload %}

    {{ govukFileUpload({
      "id": "file-upload-2",
      "name": "file-upload-2",
      "label": {
        "text": "Upload your photo",
        "hintText": "Your photo may be in your Pictures, Photos, Downloads or Desktop folder. Or in an app like iPhoto."
      }
    }) }}

### File-upload--with-error-message

[Preview the file-upload--with-error-message example](http://govuk-frontend-review.herokuapp.com/components/file-upload/with-error-message/preview)

#### Markup

    <div class="govuk-o-form-group govuk-o-form-group--error"><label class="govuk-c-label" for="file-upload-3">
      Upload a file

      <span class="govuk-c-label__hint">
        Your photo may be in your Pictures, Photos, Downloads or Desktop folder. Or in an app like iPhoto.
      </span>

      <span class="govuk-c-error-message">
      Error message goes here
    </span>

    </label>
    <input type="file" id="file-upload-3" name="file-upload-3" class="govuk-c-file-upload govuk-c-file-upload--error">
    </div>

#### Macro

    {% from 'file-upload/macro.njk' import govukFileUpload %}

    {{ govukFileUpload({
      "id": "file-upload-3",
      "name": "file-upload-3",
      "label": {
        "text": "Upload a file",
        "hintText": "Your photo may be in your Pictures, Photos, Downloads or Desktop folder. Or in an app like iPhoto."
      },
      "errorMessage": {
        "text": "Error message goes here"
      }
    }) }}

### File-upload--with-value-and-attributes

[Preview the file-upload--with-value-and-attributes example](http://govuk-frontend-review.herokuapp.com/components/file-upload/with-value-and-attributes/preview)

#### Markup

    <div class="govuk-o-form-group"><label class="govuk-c-label" for="file-upload-4">
      Upload a photo

    </label>
    <input type="file" id="file-upload-4" name="file-upload-4" value="C:\fakepath\myphoto.jpg" class="govuk-c-file-upload" accept=".jpg, .jpeg, .png">
    </div>

#### Macro

    {% from 'file-upload/macro.njk' import govukFileUpload %}

    {{ govukFileUpload({
      "id": "file-upload-4",
      "name": "file-upload-4",
      "value": "C:\\fakepath\\myphoto.jpg",
      "label": {
        "text": "Upload a photo"
      },
      "attributes": {
        "accept": ".jpg, .jpeg, .png"
      }
    }) }}

## Dependencies

To consume the file-upload component you must be running npm version 5 or above.

## Installation

    npm install --save @govuk-frontend/file-upload

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

<th class="govuk-c-table__header" scope="row">id</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">The id of the input</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">name</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">The name of the input, which is submitted with the form data</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">value</th>

<td class="govuk-c-table__cell ">string</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Optional initial value of the input</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">label</th>

<td class="govuk-c-table__cell ">object</td>

<td class="govuk-c-table__cell ">Yes</td>

<td class="govuk-c-table__cell ">Arguments for the label component</td>

</tr>

<tr class="govuk-c-table__row">

<th class="govuk-c-table__header" scope="row">errorMessage</th>

<td class="govuk-c-table__cell ">object</td>

<td class="govuk-c-table__cell ">No</td>

<td class="govuk-c-table__cell ">Arguments for the error message component</td>

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

<td class="govuk-c-table__cell ">Any extra HTML attributes (for example accept or data attributes) to add to the input tag</td>

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

    npm outdated @govuk-frontend/file-upload

To update the latest version run:

    npm update @govuk-frontend/file-upload

## Contribution

Guidelines can be found at [on our Github repository.](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md "link to contributing guidelines on our github repository")

## License

MIT