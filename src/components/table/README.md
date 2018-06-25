# Table

## Introduction

Table description.

## Guidance

Find out when to use the table component in your service in the [GOV.UK Design System](https://design-system.service.gov.uk/components/table).

## Quick start examples

## Requirements

### Build tool configuration

When compiling the Sass files you'll need to define includePaths to reference the node_modules directory. Below is a sample configuration using gulp

    .pipe(sass({
      includePaths: 'node_modules/'
    }))

### Static asset path configuration

In order to include the images used in the components, you need to configure your app to show these assets. Below is a sample configuration using Express js:

    app.use('/assets', express.static(path.join(__dirname, '/node_modules/govuk-frontend/assets')))

## Component arguments

If you are using Nunjucks,then macros take the following arguments

**If you’re using Nunjucks macros in production be aware that using `html` arguments, or ones ending with `Html` can be a [security risk](https://en.wikipedia.org/wiki/Cross-site_scripting). More about it in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).**

<table class="govuk-table">

<thead class="govuk-table__head">

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="col">Name</th>

<th class="govuk-table__header" scope="col">format</th>

<th class="govuk-table__header" scope="col">Required</th>

<th class="govuk-table__header" scope="col">Description</th>

</tr>

</thead>

<tbody class="govuk-table__body">

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">rows</th>

<td class="govuk-table__cell ">array</td>

<td class="govuk-table__cell ">Yes</td>

<td class="govuk-table__cell ">Array of table rows and cells.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">rows.[].text (or) rows.[].html</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">Yes</td>

<td class="govuk-table__cell ">Text or HTML for cells in table rows. If `html` is specified, the `text` argument will be ignored.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">rows.[].format</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Specify format of a cell. Currently we only use "numeric".</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">rows.[].colspan</th>

<td class="govuk-table__cell ">number</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Specify how many columns a cell extends.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">rows.[].rowspan</th>

<td class="govuk-table__cell ">number</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Specify how many rows a cell extends.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">head</th>

<td class="govuk-table__cell ">array</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional array of table head cells.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">head.[].text or head.[].html</th>

<td class="govuk-table__cell ">array</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional array of table head cells. If `html` is specified, the `text` argument will be ignored.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">head.[].colspan</th>

<td class="govuk-table__cell ">number</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Specify how many columns a cell extends.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">head.[].rowspan</th>

<td class="govuk-table__cell ">number</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Specify how many rows a cell extends.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">head.[].format</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Specify format of a cell. Currently we only use "numeric".</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">caption</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional caption text.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">captionClasses</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional classes for caption text size. Class should correspond to the available typography heading classes.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">firstCellIsHeader</th>

<td class="govuk-table__cell ">boolean</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">If set to true, first cell in table row will be a TH instead of a TD.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">classes</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional additional classes to add to the table container.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">attributes</th>

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Any extra HTML attributes (for example data attributes) to add to the table container.</td>

</tr>

</tbody>

</table>

**If you’re using Nunjucks macros in production be aware that using `html` arguments, or ones ending with `Html` can be a [security risk](https://en.wikipedia.org/wiki/Cross-site_scripting). More about it in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).**

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