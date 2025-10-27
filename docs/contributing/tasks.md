# npm and Gulp tasks

This document describes the npm scripts that run the Express.js review app, and the Gulp tasks they trigger to build files, update the package, copy assets and watch for changes.

To run the Express.js review app without any tasks being triggered, see [Review app only](#review-app-only).

## npm script aliases

npm scripts are defined in `package.json`. These trigger a number of Gulp tasks.

**`npm start` will trigger `npm run dev` that will:**

- runs `npm run build`
- starts the review app, restarting when `.mjs`, `.json` or `.yaml` files change
- compile again when frontend `.mjs` and `.scss` files change
- lint the JavaScript and Sass files of the project when they change

  The linting can be disabled using the `GOVUK_DS_FRONTEND_NO_LINTING` environment variable.
  It accepts a comma separated list of values with the types of linting you want to disable (`scss` and/or `js`).
  For example:

  ```sh
  GOVUK_DS_FRONTEND_NO_LINTING=scss,js npm start
  ```

  By default, the local development environment will reject external connection requests. To test changes with other devices, or the local testing features of [Browserstack](https://www.browserstack.com/) and [AssistivLabs](https://assistivlabs.com/), external connections must be enabled using the `ALLOW_EXTERNAL_CONNECTIONS` environment variable.

  ```sh
  ALLOW_EXTERNAL_CONNECTIONS=true npm start
  ```

**`npm test` will do the following:**

- run Nunjucks macros tests
- run JavaScript tests on the review app
- run accessibility and HTML validation tests

**`npm run build` will do the following:**

- run tasks from `npm run build:package`
- run tasks from `npm run build:app`

**`npm run clean` will do the following:**

- clean the `./dist` folder from all workspaces

**`npm run build:app` will trigger `npm run build --workspace @govuk-frontend/review` that will:**

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
- compile Sass to CSS
- compile JavaScript to ECMAScript (ES) modules
- compile JavaScript to Universal Module Definition (UMD) bundles
- compile Rollup build stats into `./shared/stats/dist`
- runs `npm run postbuild:package` (which will test the output is correct)

**`npm run build:release` will do the following:**

- clean the `./dist` folder
- output files into `./dist`
- copy fonts and images
- compile JavaScript and Sass
- append version number from `packages/govuk-frontend/package.json` to compiled JavaScript and CSS files
- runs `npm run postbuild:release` (which will test the output is correct)

**`npm run build:types` will do the following:**

- run the [TypeScript compiler](https://www.typescriptlang.org/docs/handbook/compiler-options.html) to build type declarations for the GOV.UK Frontend package

To verify the types in all our JavaScript files, run `npm run lint:types`

## Gulp tasks

Project Gulp tasks are defined in [`gulpfile.mjs`](/gulpfile.mjs) and the [`tasks/`](/shared/tasks) folder.

Gulp tasks from npm workspaces (such as the review app) can be run as shown:

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

## Bundler integration

After building the project with `npm run build`, you can verify that the `govuk-frontend` package will be consumed correctly by mainstream bundlers with `npm run <BUNDLER_NAME> --workspace @govuk-frontend/bundler-integrations` (where bundler name is one of `rollup`, `webpack` or `vite`).

This will use the specified bundler to compile both `shared/bundler-integrations/src/default.mjs` which is only importing one component, and `shared/bundler-integrations/src/initAll.mjs` which is importing and initialising all components via `initAll`. This helps us verify that [tree shaking] works as intended. The build output for both files is `shared/bundler-integrations/dist/<BUNDLER_NAME>/[name].js`. `default.js` should not contain the code of other components whilst `initAll.js` should contain the code for all the components.

You can also run `npm run build:all --workspace @govuk-frontend/bundler-integrations` to run all three bundlers in one go.

[tree shaking]: https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking
