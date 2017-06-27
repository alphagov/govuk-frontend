# Gulp tasks

This application used a number of gulp tasks for building, updating, publishing and previewing components.

## `gulp default` or just `gulp`
This task will:
- list out all available tasks

## `gulp dev`

This task will:
- run javascript & scss lint checker and an accessibility test on `src/` folder
- create a list of all available components with a link to each in `preview/index.html` and wrap the files in `src/component-list-template.html` template
- compile the README.md file to html in `preview/components/component-name` folder and wrap each file in `src/component-view-template.html` template
- inject the markup html snippet into the README code example section
- concatenate all javascript files to `preview/js` folder
- compile sass files to css and move to `preview/css` folder with vendor prefixes and normalize
- serve `preview/` folder in `http://localhost:9999`

## `gulp build:packages`

This task is made up of `gulp test`, `gulp prepare:files`, `gulp packages:update` and will:

- run javascript & scss lint checker and an accessibility test on `src/` folder
- apply vendor prefixes via postcss and add them to `tmp/` folder
- inject component example markup into it's README.md file and add it to `tmp/` folder
- copy all other files to respective folders in `tmp/`
- comment in the "npm installation" section in README.md files and copies them to `packages/` folder
- copy all other files from `tmp/` to `packages`
- replace path in scss import to reflect npm installation procedure e.g `../globals/..` or `../components/..` to `@govuk-frontend`

## `gulp build:dist`

This task is made up of `gulp dist:prepare`, `dist:docs` and will:

- add vendor prefixes to scss files, minimize them and compile them to `dist/css/govuk-frontend.css` file
- add vendor prefixes to scss files, minimize them strip or replace legacy IE properties and compile them to `dist/css/govuk-frontend-oldie.css` file
- concatenate all javascript files and minimize them to `dist/js/govuk-frontend.js` file
- create a list of all available components with a link to each in `dist/index.html` and wrap the files in a `src/component-list-template.html` template
- compile all README.md files to html, wrap them in `src/component-view-template.html` template and move them to respective folders in `dist/components/component-name`
- creates a `VERSION.TXT` with the version, read from `packages/all/package.json`

## `gulp build:demo`

This task will:
- grab minified js and css files from `dist`, append version numbers from `packages/all/package.json` and move them to respective folders in `demo`
- copy all index.html files from components' folders and replace link to assets to include the version number
- copies all images to `demo/images`


## Other tasks

Smaller tasks, some of which are part of larger ones

### `gulp test`

This task will:
- run javascript & scss lint checker and an accessibility test on `src/` folder

### `gulp serve:demo`

This task will:
- serve `demo/` folder on `http://localhost:8888`
