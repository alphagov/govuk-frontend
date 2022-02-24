# Testing and linting

The CI lints SASS and JavaScript, runs unit and functional tests with Node, and generates snapshots for [visual regression testing](https://www.browserstack.com/percy/visual-testing).

## Running all tests locally

To check the whole codebase, run:

```
npm test
```

This will trigger [standard](https://github.com/standard/standard) and [stylelint](https://github.com/stylelint/stylelint) for linting, and [Jest](https://github.com/facebook/jest) for unit and functional tests.

See [Tasks](tasks.md) for details of what `npm test` does.

## SASS linting

See [CSS Coding Standards](/docs/contributing/coding-standards/css.md#linting) for details.

## Javascript linting

See [JavaScript Coding Standards](/docs/contributing/coding-standards/js.md#formatting-and-linting) for details.

## Unit and functional tests with Node.js

We use [Jest](https://jestjs.io/), an automated testing platform with an assertion library, and [Puppeteer](https://pptr.dev/) that is used to control [headless Chrome](https://developers.google.com/web/updates/2017/04/headless-chrome).

We test individual components and for instance global Sass files. See [all.test.js](../../src/govuk/all.test.js). for examples of global tests we run, and  [checkboxes.test.js](../../src/govuk/components/checkboxes/checkboxes.test.js) for an example of component tests.

We aim to write the description of our tests in as "natural language" as possible, for instance "back-link component fails to render if the required fields are not included".

### Running individual tests
You can run a subset of the test suite that only tests components by running:

    `npm test -- src/govuk/components/button`

Note: There's a watch mode that keeps a testing session open waiting for changes that can be used with:

    `npm test -- --watch src/govuk/components/button`

### Updating component snapshots
[Snapshot tests](https://facebook.github.io/jest/docs/en/snapshot-testing.html) are used for preventing unintended changes - when the snapshot test runs, it  compares the previously captured snapshot to the current markup. For components, the snapshots are stored in `[component-name directory]/_snapshots_`.

If a snapshot test fails, review the difference in the console. If the change is the correct change to make, run:

`npm test -- -u src/govuk/components/button`

This will update the snapshot file. Commit this file separately with a commit message that explains you're updating the snapshot file and an explanation of what caused the change.

## Visual regression testing with Percy

[Percy](https://percy.io/) is a visual regression testing tool. We use it to generate and store screenshots of our components to help us check for any unintended visual changes.

We generate 2 screenshots for each default example of every component. One example has JavaScript enabled, the other has JavaScript disabled. Screenshots are not taken for all the different variations of each component. This tool is not a replacement for manual testing.

The screenshots are public, so you can check them without logging in. A BrowserStack account is needed to approve or reject any changes (if you don't have access, ask your tech lead for help). If you're the reviewer of the pull request code, it's your responsibility to approve or request changes for any visual changes Percy highlights.

When you run the tests locally (for example, using `npm test`), Percy commands are ignored and Percy does not generate any screenshots. You will see the following message in your command line output: `[percy] Percy is not running, disabling snapshots`.

### PRs from forks
When Github Actions is running against a PR from a fork, the Percy secret is not available and Percy does not generate any screenshots. Other tests will continue to run as normal. You will see the following messages in the output:

```
[percy] Skipping visual tests
[percy] Error: Missing Percy token
```

Being unable to run Percy on PRs from forks is the reason we're unable to make Percy a required check for this repo. However, we should continue to act as if a Percy check is required. If the Percy build fails, do not merge the pull request even though GitHub would let you. Continue to review the changes, and approve or reject them as you would normally.
