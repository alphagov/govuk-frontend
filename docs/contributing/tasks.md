# npm and Gulp tasks

This document describes the npm scripts that run the application, and the Gulp tasks they trigger to build files, update the package, copy assets and watch for changes.

To run the application without any tasks being triggered, see [Express app only](#express-app-only).

## npm script aliases

npm scripts are defined in `package.json`. These trigger a number of Gulp tasks.

**`npm run start` will trigger `gulp dev` that will:**
- clean the `./public` folder
- compile JavaScript and Sass, including Sass documentation (`gulp compile`)
- compile again when `.scss` and `.mjs` files change (`gulp watch`)
- start up Express, restarting when `.js`, `.mjs`, and `.json` files change

**`npm run test` will do the following:**
- run Nunjucks macros tests
- run JavaScript tests on the review application
- run accessibility and HTML validation tests

**`npm run heroku` runs on Heroku build/PR and it will:**
- run `npm run build:compile`
- start up Express

**`npm run build:compile` will do the following:**
- output files into `./public`, or another location via the `--destination` flag
- compile JavaScript and Sass, including Sass documentation (`gulp compile`)

**`npm run build:package` will do the following:**
- output files into `./package`, or another location via the `--destination` flag
- clean the `./package` folder
- copy Sass files, applying Autoprefixer via PostCSS
- copy Nunjucks component template/macro files, including JSON configs
- copy JavaScript ESM source files
- compile JavaScript ESM to CommonJS (`gulp js:compile`)
- runs `npm run test:build:package` (which will test the output is correct)

**`npm run build:dist` will do the following:**
- output files into `./dist`, or another location via the `--destination` flag
- clean the `./dist` folder
- compile JavaScript and Sass, including Sass documentation (`gulp compile`)
- copy fonts and images (`gulp copy:assets`)
- append version number from `package/package.json` to compiled JavaScript and CSS files
- runs `npm run test:build:dist` (which will test the output is correct)


## Gulp tasks

Gulp tasks are defined in `gulpfile.js` and .`/tasks/gulp/` folder.

**`gulp default` or just `gulp`**

This task will:
- list out all available tasks

**`gulp watch`**

This task will:
- run `gulp styles` when `.scss` files change
- run `gulp scripts` when `.mjs` files change

**`gulp styles`**

This task will:
 - check Sass code quality via Stylelint (`npm run lint:scss`)
 - compile Sass to CSS (`gulp scss:compile`) into `./public`, or another location via the `--destination` flag

**`gulp scripts`**

This task will:
 - check JavaScript code quality via ESLint (`npm run lint:js`) (using JavaScript Standard Style)
 - compile JavaScript ESM to CommonJS (`gulp js:compile`) into `./public`, or another location via the `--destination` flag

**`gulp compile`**

This task will:
- run `gulp styles`
- run `gulp scripts`
- compile Sass documentation into `./sassdoc`

## Express app only

To start the Express app without Gulp tasks being triggered, run `node app/start.js`.
