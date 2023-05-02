## Application architecture

- `app/`

  [Express](https://github.com/expressjs/express) application to preview components; also referred to as the _review app_.

- `bin/`

  Binary/executable files (i.e. bash scripts) mainly used in the [publishing process](/docs/releasing/publishing.md).

- `dist/` **contains auto-generated files**

  Standalone builds of govuk-frontend. Provides a way to consume govuk-frontend without using npm.

- `docs/`

  Documentation files.

- `package/` **contains auto-generated files**

  Package published on npm.
  Consume all of govuk-frontend through a single package.

- `shared/`

  Shared packages used by tests, build tools and the [review app](../../app).

  - `config/`

    Configuration files for common paths and port numbers.

  - `helpers/`

    [Jest](https://github.com/facebook/jest) and development helpers.

  - `lib/`

    Shared libraries for directory listings, component data, naming conventions.

  - `tasks/`

    See [tasks](tasks.md) for more information about the tasks.

- `src/`

  Source files. See [README.md](/src/govuk/README.md) in the src directory for details.
