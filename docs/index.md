# GOV.UK Frontend

## Coding standards

- [Component API](component-api.md)
- [Components](components.md)
- [CSS](coding-standards/css.md)
- [IE8 support](legacy-ie.md)
- [JavaScript](coding-standards/js.md)

## Installing

Clone the repository

```
git clone git@github.com:alphagov/govuk-frontend.git
```

Install dependencies

```
npm install
```

## Running

```
npm start
```
By default the app runs on port 3000, so the app will be available at: http://localhost:3000

See [development and publishing tasks](development-and-publish-tasks.md) for more information about the npm scripts.

## Application architecture

- `app/`

  [Express](https://github.com/expressjs/express) application to preview components; also referred to as _preview app_.

  - `assets/`

    App-specific assets.

  - `views/`

    [Nunjucks](https://github.com/mozilla/nunjucks) template files.

    - `examples/`

      Examples of components usage in various contexts. You can access these examples from the home page of the preview app.

    - `layouts/`

      Generic layout templates used to render preview app pages.

    - `partials/`

      Reusable blocks of template code.

- `bin/`

  Binary/executable files (i.e. bash scripts) mainly used in the [publishing process]((publishing.md)).

- `config/`

  Configuration files for the preview app, [sass-lint](https://github.com/sasstools/sass-lint) and [Jest](https://github.com/facebook/jest).


- `dist/` **contains auto-generated files**

  Standalone builds of govuk-frontend. Provides a way to consume govuk-frontend without using npm.

- `docs/`

  Documentation files.

- `lib/`

  Application modules and helpers.

- `package/` **contains auto-generated files**

  package published on npm.
  Consume all of govuk-frontend through a single package.

- `src/`

  Source files.

  - `globals/`

    Generic scripts, style definitions and mixins.

  - `icons/`

    Image assets.

  - `[component-name]/`

    Component-specific source files.
  
  - `CHANGELOG.md`

    Changes made to a package listed per release version.

  - `LICENSE`

    Package license.

  - `README.md`

    Package README showing the basic API and usage instructions.

  - `package.json`

    npm definition for a package; states package dependencies.

  - `govuk-frontend.scss`

    Main Sass file that imports all partials

  - `govuk-frontend-ie8.scss`

    Internet Explorer 8 specific Sass file that imports `govuk-frontend.scss`

   - `govuk-frontend.js`

    Main Javascript file that imports all component specific .js files

- `tasks/`

  Application modules and helpers.


### Auto-generated directories  

- `aXeReports/`

  Output of [aXe](https://github.com/dequelabs/axe-core) tests.

- `public/`

  Assets built for the preview app.

## Testing and linting

```
npm test
```

Running all tests will trigger [standard](https://github.com/standard/standard) and [sass-lint](https://github.com/sasstools/sass-lint) for lint and [Jest](https://github.com/facebook/jest) for unit and functional tests.

## Deploying
You can [run the preview app locally](#running) or deploy it straight to a Heroku instance.

An existing Heroku instance can be found at: [http://govuk-frontend-review.herokuapp.com/](http://govuk-frontend-review.herokuapp.com/)

## Publishing
You need npm credentials to publish a new release. For the detailed publishing process see the [publishing  documentation](publishing.md).
