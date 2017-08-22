# Link

Link component, with the following modifiers:

`--back`
Back link - a black underlined link with a left pointing arrow. To sit at the top left of a page

`--muted`
Muted link - used for is "anything wrong with this page?" links

`--download`
Download Link - with download icon

`--skip`
Skiplink - skip to the main page content


## Guidance

Guidance and documentation can be found on [GOV.UK Design System](linkgoeshere).

## Demo

Link [demo](link.html).

## Usage

Code example(s)

```
@@include('link-example.html')
```

## Nunjucks

```
@@include('link.njk')
```

## Arguments

| Name      | Type    | Default | Required  | Description
|---        |---      |---      |---        |---
| linkHref  | string  |         | Yes       | The value of the link href attribute
| linkText  | string  |         | Yes       | The link text
| classes   | string  |         | Yes       | The modifier required for the link type
                                            | --back
                                            | --muted
                                            | --download
                                            | --skip


<!--
## Installation

```
npm install --save @govuk-frontend/link
```
-->
