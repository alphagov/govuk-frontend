# npm and Gulp tasks

This document describes the npm scripts that run the application, and the Gulp tasks they trigger to build files, update the package, copy assets and watch for changes.

To run the application without any tasks being triggered, see [Express app only](#express-app-only).

## npm script aliases

npm scripts are defined in `package.json`. These trigger a number of Gulp tasks.

**`npm start` will trigger `gulp dev` that will:**

- clean the `./public` folder
- copy fonts and images
- compile JavaScript and Sass, including documentation
- compile again when `.scss` and `.mjs` files change
- runs `npm run serve`

**`npm test` will do the following:**

- run Nunjucks macros tests
- run JavaScript tests on the review application
- run accessibility and HTML validation tests

**`npm run serve` will do the following:**

- start up Express, restarting when `.js` files change

**`npm run heroku` runs on Heroku build/PR and it will:**

- run `npm run build:compile`
- start up Express

**`npm run build:compile` will do the following:**

- output files into `./public`, or another location via the `--destination` flag
- copy fonts and images
- compile JavaScript and Sass, including documentation

**`npm run build:package` will do the following:**

- output files into `./package`, or another location via the `--destination` flag
- clean the `./package` folder
- copy Sass files, applying Autoprefixer via PostCSS
- copy Nunjucks component template/macro files, including JSON configs
- copy GOV.UK Prototype Kit config files
- copy JavaScript ESM source files
- compile JavaScript ESM to CommonJS
- runs `npm run test:build:package` (which will test the output is correct)

**`npm run build:dist` will do the following:**

- output files into `./dist`, or another location via the `--destination` flag
- clean the `./dist` folder
- copy fonts and images
- compile JavaScript and Sass, including documentation
- append version number from `package/package.json` to compiled JavaScript and CSS files
- runs `npm run test:build:dist` (which will test the output is correct)

## Gulp tasks

Gulp tasks are defined in `gulpfile.js` and .`/tasks/gulp/` folder.

**`gulp default` or just `gulp`**

This task will:

- list out all available tasks

**`gulp styles`**

This task will:

- check Sass code quality via Stylelint (`npm run lint:scss`)
- compile Sass to CSS into `./public`, or another location via the `--destination` flag
- compile Sass documentation into `./sassdoc`

**`gulp scripts`**

This task will:

- check JavaScript code quality via ESLint (`npm run lint:js`) (using JavaScript Standard Style)
- compile JavaScript ESM to CommonJS into `./public`, or another location via the `--destination` flag
- compile JavaScript documentation into `./jsdoc`

**`gulp compile`**

This task will:

- copy fonts and images
- run sub tasks from `gulp styles` without ESLint code quality checks
- run sub tasks from `gulp scripts` without StyleLint code quality checks
- compile Sass documentation into `./sassdoc`
- compile JavaScript documentation into `./jsdoc`

## Express app only

To start the Express app without Gulp tasks being triggered, run `npm run serve`.
