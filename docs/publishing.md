# Publishing components

We are using [lerna.js](https://lernajs.io/) to manage our packages and publish
to npm.

Lerna is a tool that optimizes the workflow around managing multi-package
repositories with git and npm.

It manages dependencies between our components so that if the version number of
`globals` is bumped, all components dependent on `globals` will also have their
version bumped.

### Publishing components manually (while in Alpha/Private beta)

1. Checkout **master** and pull latest changes.

2. Create and checkout a new branch (`release-[version-number]`).

3. Update [`CHANGELOG.md`](../CHANGELOG.md) "Unreleased" heading with the new version number.
   This should be incremented based on [Semantic versioning](https://semver.org/) from the unreleased changes listed.

4. Save the changes. Do not commit.

5. Run `npm run pre-release`.

This will:
  - copy components from `src/` to `packages/` and run tests
  - add [vendor prefixes](https://github.com/postcss/autoprefixer) to CSS in `packages/`
  - build "all" Sass and JavaScript files into `dist/`
  - copy components from `src/` to `dist/components/` and run tests

Note: If a previously unreleased component is found, then you will be prompted to make changes before continuing.

6. For each package specify a new version number, based on changelog updates (Step 3.).
  ![Select version in Lerna](./img/lerna-select-version.png)

7. Review proposed version number updates.
  ![Confirm publishing of changes in Lerna](./img/lerna-confirm-publish.png)

  Once you publish changes, all files are automatically pushed to the remote origin branch.

8. (Optional) Test in [GOV.UK Design System](git@github.com:alphagov/govuk-design-system.git)

  If you want to test your changes work correctly when used in the GOV.UK Design System you can use [npm link](https://docs.npmjs.com/cli/link) to test before publishing.

  ```bash
  cd ../govuk-design-system
  npm link ../govuk-frontend/packages/all
  ```

  When you have finished you need to unlink the package

  ```bash
  npm unlink ../govuk-frontend/packages/all
  ```

9. Create a pull request and copy the changelog text.
   When reviewing the PR, check that the version numbers have been updated and that the compiled assets use this version number.

10. Once the pull request is approved, merge to **master**.

11. Checkout **master** and pull the latest changes.

12. Log into npm, using team [credentials](https://github.com/alphagov/design-system-team-credentials/tree/master/npm/govuk-patterns-and-tools).

13. Run `npm run release`.

  This will:
  - check that you're logged in to npm as the correct user.
  - publish each package if the package has not been published yet
  - create a new tag if the current git tag does not match the latest published tag
  - push the tag to remote origin
  - create a zip file of the `dist` directory

14. Create a release in the [Github interface](https://github.com/alphagov/govuk-frontend/releases/new)
  - select the latest tag version
  - set "GOV.UK Frontend release v[version-number]" as the title
  - add release notes from changelog
  - attach the generated ZIP that is located at the root of the project
  - publish release

15. (Required for private beta) Grant "test" user access to any newly published package(s).
```bash
npm access grant read-only govuk-frontend:test @govuk-frontend/[component-name]
```
16. Log out from npm
```bash
npm logout
```

17. Add Trello cards to "This Sprint" column for
  - Update the GOV.UK Design System to use the latest release
  - Update the GOV.UK Prototype Kit to use the latest release
