# Testing and linting

The CI lints SASS and JavaScript, and runs unit and functional tests with Node.

## Running all tests locally

To check the whole codebase, run:

```
npm test
```

This will trigger [standard](https://github.com/standard/standard) and [sass-lint](https://github.com/sasstools/sass-lint) for linting, and [Jest](https://github.com/facebook/jest) for unit and functional tests.

See [Tasks](tasks.md) for details of what `npm test` does.

## SASS linting

See [CSS Coding Standards](coding-standards/css.md#linting) for details.

## Javascript linting

See [JavaScript Coding Standards](coding-standards/js.md#formatting-and-linting) for details.

## Unit and functional tests with Node.js

We use [Jest](https://github.com/facebook/jest) for testing individual Components (see `[component-name].test.js` inside component directory) and global Sass files.

### Running individual tests
You can run a subset of the test suite that only tests components by running:

    `npm test -- src/components/button`

Note: There's a watch mode that keeps a testing session open waiting for changes that can be used with:

    `npm test -- --watch src/components/button`

### Updating component snapshots
[Snapshot tests](https://facebook.github.io/jest/docs/en/snapshot-testing.html) are used for preventing unintended changes - when the snapshot test runs, it  compares the previously captured snapshot to the current markup. For components, the snapshots are stored in `[component-name directory]/_snapshots_`.

If a snapshot test fails, review the difference in the console. If the change is the correct change to make, run:

`npm test -- -u src/components/button`

This will update the snapshot file. Commit this file separately with a commit message that explains you're updating the snapshot file and an explanation of what caused the change.
