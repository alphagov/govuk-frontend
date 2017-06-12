# GOV.UK Frontend

## Coding standards

Coding standards for [CSS](coding-standards/css.md) and [JavaScript](coding-standards/js.md).

Support for [older versions of IE](legacy-ie.md).

## Directory structure

## /config

Config files for scss lint and for the govuk-frontend application.

## /dist

Standalone builds of govuk-frontend. Provides a way to consume govuk-frontend without having to use npm.

## /docs

Project documentation.

## /packages

npm packages of globals and components.

## /packages/all  

Consume all of govuk-frontend through a single package.

## /packages/globals

All packages depend on this package, it contains shared dependencies of all components - colours, font-face, media queries, typography and vars.

## /packages/<package-name>

Individual packages - these depend on each other (dependencies are listed in package.json) and also the globals package.

### /packages/<package-name>/CHANGELOG.md 

Changes made to a package listed per version.

### /packages/<package-name>/LICENSE

Package license.

### /packages/<package-name>/README.md

Package README showing the basic API and usage instructions.

### /packages/<package-name>/package.json 

npm package definition for a package.
States package dependencies.
Package version is managed by Lerna.js

## /src

The development area for govuk-frontend.

### /src/globals

Images

Scss source files.

### /src/components

Component source files.

[Component documentation](compoenents.md)
