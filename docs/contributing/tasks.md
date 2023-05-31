# npm and Gulp tasks

This document describes the npm scripts that run the Express.js review app, and the Gulp tasks they trigger to build files, update the package, copy assets and watch for changes.

To run the Express.js review app without any tasks being triggered, see [Review app only](#review-app-only).

## npm script aliases

npm scripts are defined in `package.json`. These trigger a number of Gulp tasks.

**`npm start` will trigger `npm run dev` that will:**

- runs tasks from `npm run build:package`
- runs tasks from `npm run build:app`
- starts the review app, restarting when `.mjs`, `.json` or `.yaml` files change
- compile again when frontend `.mjs` and `.scss` files change

**`npm test` will do the following:**

- run Nunjucks macros tests
- run JavaScript tests on the review app
- run accessibility and HTML validation tests

**`npm run serve --workspace govuk-frontend-review` will do the following:**

- start the review app, restarting when `.mjs`, `.json` or `.yaml` files change

**`npm run build:app` will trigger `npm run build --workspace govuk-frontend-review` that will:**

- clean the `./packages/govuk-frontend-review/dist` folder
- output files into `./packages/govuk-frontend-review/dist`
- copy fonts and images
- compile JavaScript and Sass, including documentation

**`npm run build:package` will do the following:**

- clean the `./packages/govuk-frontend/dist` folder
- output files into `./packages/govuk-frontend/dist`
- copy Sass files, applying Autoprefixer via PostCSS
- copy Nunjucks component template/macro files, including JSON configs
- copy GOV.UK Prototype Kit config files
- compile JavaScript to ECMAScript Modules (ESM)
- compile JavaScript to Universal Module Definition (UMD)
- runs `npm run postbuild:package` (which will test the output is correct)

**`npm run build:release` will do the following:**

- clean the `./dist` folder
- output files into `./dist`
- copy fonts and images
- compile JavaScript and Sass
- append version number from `packages/govuk-frontend/package.json` to compiled JavaScript and CSS files
- runs `npm run postbuild:release` (which will test the output is correct)

## Gulp tasks

Project Gulp tasks are defined in [`gulpfile.mjs`](/gulpfile.mjs) and the [`tasks/`](/shared/tasks) folder.

**`gulp --tasks`**

This task will:

- list out all available tasks

Review app Gulp tasks are defined in [`app/gulpfile.mjs`](/app/gulpfile.mjs) and the [`app/tasks/`](/app/tasks) folder.

Gulp tasks from npm workspaces (such as the review app) can be run as shown:

**`npx --workspace govuk-frontend-review -- gulp --tasks`**

This will list out all available tasks for the GOV.UK Frontend package.

GOV.UK Frontend package build Gulp tasks are defined in [`packages/govuk-frontend/gulpfile.mjs`](/packages/govuk-frontend/gulpfile.mjs) and the [`packages/govuk-frontend/tasks/`](/packages/govuk-frontend/tasks) folder.

**`npx --workspace govuk-frontend -- gulp --tasks`**

This will list out all available tasks for the review app.

Review app Gulp tasks are defined in [`packages/govuk-frontend-review/gulpfile.mjs`](/packages/govuk-frontend-review/gulpfile.mjs) and the [`packages/govuk-frontend-review/tasks/`](/packages/govuk-frontend-review/tasks) folder.

**`npx --workspace govuk-frontend-review -- gulp styles`**

This task will:

- check Sass code quality via Stylelint (`npm run lint:scss`)
- compile Sass to CSS into `./packages/govuk-frontend-review/dist/stylesheets`
- compile Sass documentation into `./packages/govuk-frontend-review/dist/docs/sassdoc`

**`npx --workspace govuk-frontend-review -- gulp scripts`**

This task will:

- check JavaScript code quality via ESLint (`npm run lint:js`) (using JavaScript Standard Style)
- compile JavaScript to Universal Module Definition (UMD) into `./packages/govuk-frontend-review/dist/javascripts`
- compile JavaScript documentation into `./packages/govuk-frontend-review/dist/docs/jsdoc`

## Review app only

To start the Express.js review app without Gulp tasks being triggered, run `npm run serve`.
