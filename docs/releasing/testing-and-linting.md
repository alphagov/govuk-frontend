# Testing and linting

The CI lints SASS and JavaScript, runs unit and functional tests with Node, and generates snapshots for [visual regression testing](https://www.browserstack.com/percy/visual-testing).

## Testing terminology

We use different types of tests to check different areas of our code are working as expected.

Unit tests are small, modular tests that verify a "unit" of code. We write unit tests to check our JavaScript logic, particularly 'background logic' that does not heavily rely on [Document Object Model (DOM)](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction) interaction (where functional tests may be better suited).

Functional tests verify the output of an action and do not check the intermediate states of the system when performing that action. We write functional tests to check component interactions have the expected results, so we also refer to these as component tests. We also write functional tests to check that our Nunjucks code outputs expected HTML, and we refer to these as our Nunjucks tests.

[Snapshot tests](https://facebook.github.io/jest/docs/en/snapshot-testing.html) are used for preventing unintended changes to our component markup. When the snapshot test runs, it  compares the previously captured snapshot to the current markup.

Visual regression tests help us check for any unintended visual changes to our components. We use [Percy](https://percy.io/) to generate and store screenshots of our components.

## Running linting and tests

### Running all tests locally

To check the whole codebase, run:

```
npm test
```

This will trigger [standard](https://github.com/standard/standard) and [stylelint](https://github.com/stylelint/stylelint) for linting, and [Jest](https://github.com/facebook/jest) for our testing.

See [Tasks](tasks.md) for details of what `npm test` does.

### Running individual tests
You can run a subset of the test suite that only tests components by running:

    `npm test -- --testPathPattern=src/govuk/components/button`

Note: There's a watch mode that keeps a testing session open waiting for changes that can be used with:

    `npm test -- --watch src/govuk/components/button`

### Running only SASS linting

```
npm run lint:scss
```

See [CSS Coding Standards](/docs/contributing/coding-standards/css.md#linting) for details.

### Running only JavaScript linting

```
npm run lint:js
```

See [JavaScript Coding Standards](/docs/contributing/coding-standards/js.md#formatting-and-linting) for details.

## Unit and functional tests with Node.js

We use [Jest](https://jestjs.io/), an automated testing platform with an assertion library, and [Puppeteer](https://pptr.dev/) that is used to control [headless Chrome](https://developers.google.com/web/updates/2017/04/headless-chrome).

### Component tests
We write functional tests for every component to check the output of our Nunjucks code. These are found in `template.test.js` files in each component directory. These Nunjucks tests render the component examples defined in the component yaml files, and assert that the HTML tags, attributes and classes are as expected. For example: checking that when you pass in an `id` to the component using the Nunjucks macro, it outputs the component with an `id` attribute equal to that value.

If a component uses JavaScript, we also write functional tests in a `[component name].test.js` file, for example [checkboxes.test.js](../../src/govuk/components/checkboxes/checkboxes.test.js). These component tests check that interactions, such as a mouse click, have the expected result.

You should also test component Javascript logic with unit tests, in a `[component name].unit.test.mjs` file. These tests are better suited for testing behind-the-scenes logic, or in cases where the final output of some logic is not a change to the component markup.

### Global tests
We write functional tests for checking our JavaScript exports and our global sass variables - see [all.test.js](../../src/govuk/all.test.js) for examples of global tests we run.

### Conventions
We aim to write the test descriptions in everyday language. For example, "back-link component fails to render if the required fields are not included".

Keep all tests separate from each other. It should not matter the order or amount of tests you run from a test suite.

Try and keep assertions small, so each test only checks for one thing. This makes tests more readable and makes it easier to see what's happening if a test is failing.

## Updating component snapshots
For components, the snapshots are stored in `[component-name directory]/_snapshots_`.

If a snapshot test fails, review the difference in the console. If the change is the correct change to make, run:

`npm test -- -u src/govuk/components/button`

This will update the snapshot file. Commit this file separately with a commit message that explains you're updating the snapshot file and an explanation of what caused the change.

## Visual regression testing with [Percy](https://percy.io/)

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
