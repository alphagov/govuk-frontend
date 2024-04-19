# npm and Gulp Tasks for GOV.UK Frontend

This document describes the npm scripts that run the Express.js review app and the Gulp tasks they trigger for building files, updating the package, copying assets, and watching for changes.

## Running the Express.js Review App

To run the Express.js review app without triggering any tasks, follow the instructions under [Review app only](#review-app-only).

## npm Script Aliases

These npm scripts are defined in `package.json` and trigger various Gulp tasks.

### npm start

Running `npm start` will trigger `npm run dev`, which:

- Runs `npm run build`
- Starts the review app, restarting when `.mjs`, `.json`, or `.yaml` files change
- Compiles again when frontend `.mjs` and `.scss` files change

### npm test

Running `npm test` performs the following tasks:

- Runs Nunjucks macros tests
- Runs JavaScript tests on the review app
- Runs accessibility and HTML validation tests

### npm run build

Running `npm run build` performs the following tasks:

- Runs tasks from `npm run build:package`
- Runs tasks from `npm run build:app`

### npm run clean

Running `npm run clean` cleans the `./dist` folder from all workspaces.

### npm run build:app

Running `npm run build:app` triggers `npm run build --workspace @govuk-frontend/review`, which:

- Cleans the `./packages/govuk-frontend-review/dist` folder
- Outputs files into `./packages/govuk-frontend-review/dist`
- Copies fonts and images
- Compiles JavaScript and Sass, including documentation

### npm run build:package

Running `npm run build:package` performs the following tasks:

- Cleans the `./packages/govuk-frontend/dist` folder
- Outputs files into `./packages/govuk-frontend/dist`
- Copies Sass files, applying Autoprefixer via PostCSS
- Copies Nunjucks component template/macro files, including JSON configs
- Copies GOV.UK Prototype Kit config files
- Compiles Sass to CSS
- Compiles JavaScript to ECMAScript (ES) modules
- Compiles JavaScript to Universal Module Definition (UMD) bundles
- Compiles Rollup build stats into `./shared/stats/dist`
- Runs `npm run postbuild:package` (which will test the output is correct)

### npm run build:release

Running `npm run build:release` performs the following tasks:

- Cleans the `./dist` folder
- Outputs files into `./dist`
- Copies fonts and images
- Compiles JavaScript and Sass
- Appends the version number from `packages/govuk-frontend/package.json` to compiled JavaScript and CSS files
- Runs `npm run postbuild:release` (which will test the output is correct)

### npm run build:types

Running `npm run build:types` uses the TypeScript compiler to build type declarations for the GOV.UK Frontend package.

To verify the types in all JavaScript files, run `npm run lint:types`.

## Gulp Tasks

Project Gulp tasks are defined in [`gulpfile.mjs`](/gulpfile.mjs) and the [`tasks/`](/shared/tasks) folder.

Gulp tasks from npm workspaces (such as the review app) can be run with the following command:

**`npx --workspace @govuk-frontend/review -- gulp --tasks`**

This will list out all available tasks for the review app.

GOV.UK Frontend package build Gulp tasks are defined in [`packages/govuk-frontend/gulpfile.mjs`](/packages/govuk-frontend/gulpfile.mjs) and the [`packages/govuk-frontend/tasks/`](/packages/govuk-frontend/tasks) folder.

**`npx --workspace govuk-frontend -- gulp --tasks`**

This will list out all available tasks for the GOV.UK Frontend package.

Review app Gulp tasks are defined in [`packages/govuk-frontend-review/gulpfile.mjs`](/packages/govuk-frontend-review/gulpfile.mjs) and the [`packages/govuk-frontend-review/tasks/`](/packages/govuk-frontend-review/tasks) folder.

**`npx --workspace @govuk-frontend/review -- gulp scripts`**

This task will:

- check JavaScript code quality via ESLint (`npm run lint:js`) (using JavaScript Standard Style)
- bundle JavaScript using Rollup into `./packages/govuk-frontend-review/dist/javascripts`

**`npx --workspace @govuk-frontend/review -- gulp styles`**

This task will:

- check Sass code quality via Stylelint (`npm run lint:scss`)
- compile Sass to CSS into `./packages/govuk-frontend-review/dist/stylesheets`

## Review app only

After building the project with `npm run build` the Express.js review app can be started with `npm start --workspace @govuk-frontend/review`. This prevents the Gulp tasks triggered by `npm start` from running.
