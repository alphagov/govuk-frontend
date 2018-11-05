# File upload

## Introduction

The HTML `<input>` element with type="file" lets a user pick one or more files, to upload to a server.

## Guidance

Find out when to use the file upload component in your service in the [GOV.UK Design System](https://design-system.service.gov.uk/components/file-upload).

## Quick start examples

### File upload

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/file-upload/preview)

#### Markup

    <div class="govuk-form-group">
      <label class="govuk-label" for="file-upload-1">
        Upload a file
      </label>

      <input class="govuk-file-upload" id="file-upload-1" name="file-upload-1" type="file">
    </div>

#### Macro

    {% from "file-upload/macro.njk" import govukFileUpload %}

    {{ govukFileUpload({
      "id": "file-upload-1",
      "name": "file-upload-1",
      "label": {
        "text": "Upload a file"
      }
    }) }}

### File upload with hint text

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/file-upload/with-hint-text/preview)

#### Markup

    <div class="govuk-form-group">
      <label class="govuk-label" for="file-upload-2">
        Upload your photo
      </label>

      <span id="file-upload-2-hint" class="govuk-hint">
        Your photo may be in your Pictures, Photos, Downloads or Desktop folder. Or in an app like iPhoto.
      </span>

      <input class="govuk-file-upload" id="file-upload-2" name="file-upload-2" type="file" aria-describedby="file-upload-2-hint">
    </div>

#### Macro

    {% from "file-upload/macro.njk" import govukFileUpload %}

    {{ govukFileUpload({
      "id": "file-upload-2",
      "name": "file-upload-2",
      "label": {
        "text": "Upload your photo"
      },
      "hint": {
        "text": "Your photo may be in your Pictures, Photos, Downloads or Desktop folder. Or in an app like iPhoto."
      }
    }) }}

### File upload with error message

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/file-upload/with-error-message/preview)

#### Markup

    <div class="govuk-form-group govuk-form-group--error">
      <label class="govuk-label" for="file-upload-3">
        Upload a file
      </label>

      <span id="file-upload-3-hint" class="govuk-hint">
        Your photo may be in your Pictures, Photos, Downloads or Desktop folder. Or in an app like iPhoto.
      </span>

      <span id="file-upload-3-error" class="govuk-error-message">
        Error message goes here
      </span>

      <input class="govuk-file-upload govuk-file-upload--error" id="file-upload-3" name="file-upload-3" type="file" aria-describedby="file-upload-3-hint file-upload-3-error">
    </div>

#### Macro

    {% from "file-upload/macro.njk" import govukFileUpload %}

    {{ govukFileUpload({
      "id": "file-upload-3",
      "name": "file-upload-3",
      "label": {
        "text": "Upload a file"
      },
      "hint": {
        "text": "Your photo may be in your Pictures, Photos, Downloads or Desktop folder. Or in an app like iPhoto."
      },
      "errorMessage": {
        "text": "Error message goes here"
      }
    }) }}

### File upload with value and attributes

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/file-upload/with-value-and-attributes/preview)

#### Markup

    <div class="govuk-form-group">
      <label class="govuk-label" for="file-upload-4">
        Upload a photo
      </label>

      <input class="govuk-file-upload" id="file-upload-4" name="file-upload-4" type="file" value="C:\fakepath\myphoto.jpg" accept=".jpg, .jpeg, .png">
    </div>

#### Macro

    {% from "file-upload/macro.njk" import govukFileUpload %}

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

### File upload with label as page heading

[Preview this example in the Frontend review app](http://govuk-frontend-review.herokuapp.com/components/file-upload/with-label-as-page-heading/preview)

#### Markup

    <div class="govuk-form-group">
      <h1 class="govuk-label-wrapper">
        <label class="govuk-label" for="file-upload-1">
          Upload a file
        </label>

      </h1>

      <input class="govuk-file-upload" id="file-upload-1" name="file-upload-1" type="file">
    </div>

#### Macro

    {% from "file-upload/macro.njk" import govukFileUpload %}

    {{ govukFileUpload({
      "id": "file-upload-1",
      "name": "file-upload-1",
      "label": {
        "text": "Upload a file",
        "isPageHeading": true
      }
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

See [options table](https://design-system.service.gov.uk/components/file-upload/#options-example-default) for details.

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