# npm and Gulp tasks

This document describes the npm scripts that run the application, and the Gulp tasks they trigger to build files, update the package, copy assets and watch for changes.

To run the application without any tasks being triggered, see [Express app only](#express-app-only).

## npm script aliases

npm scripts are defined in `package.json`. These trigger a number of Gulp tasks.

**`npm start` will trigger `npm run dev --workspace app` that will:**

- runs tasks from `npm run build:app`
- starts up Express, restarting when `.mjs`, `.json` or `.yaml` files change
- compile again when frontend `.mjs` and `.scss` files change

**`npm test` will do the following:**

- run Nunjucks macros tests
- run JavaScript tests on the review application
- run accessibility and HTML validation tests

**`npm run serve --workspace app` will do the following:**

- start up Express, restarting when `.mjs`, `.json` or `.yaml` files change

**`npm run build:app` will trigger `npm run build --workspace app` that will:**

- clean the `./app/dist` folder
- output files into `./app/dist`
- copy fonts and images
- compile JavaScript and Sass, including documentation

**`npm run build:package` will do the following:**

- clean the `./package/dist` folder
- output files into `./package/dist`
- copy Sass files, applying Autoprefixer via PostCSS
- copy Nunjucks component template/macro files, including JSON configs
- copy GOV.UK Prototype Kit config files
- compile JavaScript to ECMAScript Modules (ESM)
- compile JavaScript to Universal Module Definition (UMD)
- runs `npm run postbuild:package` (which will test the output is correct)

**`npm run build:dist` will do the following:**

- clean the `./dist` folder
- output files into `./dist`
- copy fonts and images
- compile JavaScript and Sass
- append version number from `package/dist/package.json` to compiled JavaScript and CSS files
- runs `npm run postbuild:dist` (which will test the output is correct)

## Gulp tasks

Project Gulp tasks are defined in [`gulpfile.mjs`](../../gulpfile.mjs) and the [`tasks/`](../../shared/tasks) folder.

**`gulp --tasks`**

This task will:

- list out all available tasks

Review app Gulp tasks are defined in [`app/gulpfile.mjs`](../../app/gulpfile.mjs) and the [`app/tasks/`](../../app/tasks) folder.

Gulp tasks from npm workspaces (such as the review app) can be run as shown:

**`npx --workspace app -- gulp styles`**

This task will:

- check Sass code quality via Stylelint (`npm run lint:scss`)
- compile Sass to CSS into `./app/dist/stylesheets`
- compile Sass documentation into `./app/dist/docs/sassdoc`

**`npx --workspace app -- gulp scripts`**

This task will:

- check JavaScript code quality via ESLint (`npm run lint:js`) (using JavaScript Standard Style)
- compile JavaScript to Universal Module Definition (UMD) into `./app/dist/javascripts`
- compile JavaScript documentation into `./app/dist/docs/jsdoc`

## Express app only

To start the Express app without Gulp tasks being triggered, run `npm run serve`.
