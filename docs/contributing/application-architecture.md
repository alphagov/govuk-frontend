## Application architecture

- `app/`

  [Express](https://github.com/expressjs/express) application to preview components; also referred to as the _review app_.

- `bin/`

  Binary/executable files (i.e. bash scripts) mainly used in the [publishing process](/docs/releasing/publishing.md).

- `config/`

  Configuration files for the review app and [Jest](https://github.com/facebook/jest).

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

  Source files. See README.md in the src directory for details.

- `tasks/`

  Application modules and helpers. See [tasks](tasks.md) for more information about the tasks.
