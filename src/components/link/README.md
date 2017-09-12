# Link

## Introduction

Link component, with four variants:

*   back link - a black underlined link with a left pointing arrow
*   muted link - used for the “anything wrong with this page?” links
*   download link - with download icon
*   skip link - skip to the main page content

[Preview the link component.](http://govuk-frontend-review.herokuapp.com/components/link/preview)

## Guidance

More information about when to use link can be found on [GOV.UK Design System](http://www.linktodesignsystem.com/link "Link to read guidance on the use of link on Gov.uk Design system website")

## Dependencies

To consume the link component you must be running npm version 5 or above.

## Installation

    npm install --save @govuk-frontend/link

## Requirements

### Build tool configuration

When compiling the Sass files you'll need to define includePaths to reference the node_modules directory. Below is a sample configuration using gulp

      .pipe(sass({
          includePaths: 'node_modules/'
      }))

### Static asset path configuration

To show the button image you need to configure your app to show these assets. Below is a sample configuration using Express js:

    app.use('/public', express.static(path.join(__dirname, '/node_modules/@govuk-frontend/icons')))

## Quick start examples

    <a href="" class="govuk-c-link govuk-c-link--back">Back</a>

    <a href="" class="govuk-c-link govuk-c-link--muted">Is there anything wrong with this page?</a>

    <a href="" class="govuk-c-link govuk-c-link--download"></a>

    <a href="" class="govuk-c-link govuk-c-link--skip">Skip to main content</a>

## If you are using Nunjucks

To use a macro, follow the below code examples:

    {% from "link/macro.njk" import govukLink %}

    {{ govukLink(
      classes='govuk-c-link--back',
      linkHref='',
      linkText='Back')
    }}

    {{ govukLink(
      classes='govuk-c-link--muted',
      linkHref='',
      linkText='Is there anything wrong with this page?')
    }}

    {{ govukLink(
      classes='govuk-c-link--download',
      linkHref='',
      tagText='Download')
    }}

    {{ govukLink(
      classes='govuk-c-link--skip',
      linkHref='',
      linkText='Skip to main content')
    }}

Where the macros take the following arguments

## Component arguments

<div>| Name | Type | Default | Required | Description |--- |--- |--- |--- |--- | linkHref | string | | Yes | The value of the link href attribute | linkText | string | | Yes | The link text | classes | string | | Yes | The modifier required for the link type | --back | --muted | --download | --skip</div>

### Setting up Nunjucks views and paths

Below is an example setup using express configure views:

    nunjucks.configure('node_modules/@govuk-frontend`, {
      autoescape: true,
      cache: false,
      express: app
    })

## Getting updates

To check whether you have the latest version of the button run:

    npm outdated @govuk-frontend/link

To update the latest version run:

    npm update @govuk-frontend/link

## Contribution

Guidelines can be found at [on our Github repository.](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md "link to contributing guidelines on our github repository")

## Acknowledgements/credits

*   GDS developers
*   Jani Kraner
*   Gemma Leigh

## License

MIT