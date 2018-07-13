# Publishing GOV.UK Frontend

1. Checkout **master** and pull latest changes.

2. Run `nvm use` to ensure you are using the right version of Node.js and npm.

3. Run `npm install` to ensure you have the latest dependencies installed.

4. Create and checkout a new branch (`release-[version-number]`).

5. Update [`CHANGELOG.md`](../../CHANGELOG.md) "Unreleased" heading with the new version number.
   This should be incremented based on [Semantic versioning](https://semver.org/) from the unreleased changes listed.

  Copy the [`CHANGELOG_TEMPLATE.md`](./CHANGELOG_TEMPLATE.md), above the new release to make it easy for new contributors.

6. Update [`package/package.json`](../../package/package.json) version with the new version number.
This should be incremented based on [Semantic versioning](https://semver.org/) from the unreleased changes listed.

7. Save the changes. Do not commit.

8. Run `npm run pre-release`.

This will:
  - copy files from `src/` to `package/` and run tests
  - add [vendor prefixes](https://github.com/postcss/autoprefixer) to CSS in `package/`
  - build "govuk-frontend" Sass and JavaScript files into `dist/`
  - commit all changes and push the branch to remote

9. (Optional) Test in [GOV.UK Design System](git@github.com:alphagov/govuk-design-system.git)

  If you want to test your changes work correctly when used in the GOV.UK Design System you can use [npm link](https://docs.npmjs.com/cli/link) to test before publishing.

  ```bash
  cd ../govuk-design-system
  git checkout master
  git pull
  npm install # note running `npm install` after `npm link` will destroy the link.
  npm link ../govuk-frontend/package/
  ```

  When you have finished you need to unlink the package

  ```bash
  npm unlink ../govuk-frontend/package/
  ```

10. Create a pull request and copy the changelog text.
   When reviewing the PR, check that the version numbers have been updated and that the compiled assets use this version number.

11. Once the pull request is approved, merge to **master**.

12. Checkout **master** and pull the latest changes.

13. Log into npm, using team [credentials](https://github.com/alphagov/design-system-team-credentials/tree/master/npm/govuk-patterns-and-tools).

14. Run `npm run release`.

  This will:
  - check that you're logged in to npm as the correct user.
  - publish the package has not been published yet
  - create a new tag if the current git tag does not match the latest published tag
  - push the tag to remote origin
  - create a zip file of the `dist` directory

15. Create a release in the [Github interface](https://github.com/alphagov/govuk-frontend/releases/new)
  - select the latest tag version
  - set "GOV.UK Frontend release v[version-number]" as the title
  - add release notes from changelog
  - add a summary of highlights (this will be used when sending comms out)
  - attach the generated ZIP that has been generated at the root of the project
  - publish release

16. Log out from npm
```bash
npm logout
```

17. Send a message to our users in both the X-GOV and GDS #govuk-design-system slack channels that indicates
there's a new release with a short summary.

18. Move Trello cards from "Next Frontend release" column to "Done".

19. Add Trello cards to "This Sprint" column for
  - Update the GOV.UK Design System to use the latest release
  - Update the GOV.UK Prototype Kit to use the latest release
