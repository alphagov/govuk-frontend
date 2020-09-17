# Publishing GOV.UK Frontend

1. Make sure you have cards in the "Backlog" column to:
  - Update the GOV.UK Design System to use the latest release
  - Update the GOV.UK Prototype Kit to use the latest release
  - Update the GOV.UK Frontend Docs to use the latest release

2. Checkout **master** and pull latest changes.

3. Run `nvm use` to ensure you are using the right version of Node.js and npm.

4. Run `npm install` to ensure you have the latest dependencies installed.

5. Create and checkout a new branch (`release-[version-number]`).
  The version number is determined by looking at the [current "Unreleased" CHANGELOG](../../CHANGELOG.md) changes and updating the previous release number depending on the kind of entries:

  - `Breaking changes` corresponds to a `major` (1.X.X) change.
  - `New features` corresponds to a `minor` (X.1.X) change.
  - `Fixes` corresponds to a `patch` (X.X.1) change.

  For example if the previous version is `2.3.0` and there are entries for `Breaking changes` then the new release should be `3.0.0`.

  See the [versioning documentation](versioning.md) for more information.

6. Update [`CHANGELOG.md`](../../CHANGELOG.md) "Unreleased" heading with the new version number. Add a new "Unreleased" heading above this, so people raising new PRs know where to add these to the Changelog.

7. Update [`package/package.json`](../../package/package.json) version with the new version number.

8. Save the changes. Do not commit.

9. Run `npm run build-release`, you will be prompted to continue or cancel.

10. (Optional) Test in [GOV.UK Design System](git@github.com:alphagov/govuk-design-system.git)

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

11. Create a pull request and copy the changelog text.
   When reviewing the PR, check that the version numbers have been updated and that the compiled assets use this version number.

12. Once the pull request is approved, merge to **master**.

13. Checkout **master** and pull the latest changes.

14. Log into npm (`npm login`), using team [credentials](https://github.com/alphagov/design-system-team-credentials/tree/master/npm/govuk-patterns-and-tools).

15. Run `npm run publish-release`, you will be prompted to continue or cancel.

16. View the created tag in the [Github interface](https://github.com/alphagov/govuk-frontend/releases)
  - select the latest tag
  - press 'Edit tag'
  - set "GOV.UK Frontend v[version-number]" as the title
  - add release notes from changelog
  - attach the generated ZIP that has been generated at the root of this project
  - publish release

17. Log out from npm
```bash
npm logout
```

18. Once you've updated the GOV.UK Design System, Prototype Kit, and Frontend Docs, post a short summary of the release in the cross-government and GDS #govuk-design-system Slack channels. For example:

    🚀 We’ve just released GOV.‌UK Frontend v3.7.0. It's now easier and faster to use our Sass. We've also made improvements to back links, breadcrumbs, lists and the header. Thanks to @<SLACK-NAME> and @<SLACK-NAME> for helping with this release. [https://github.com/alphagov/govuk-frontend/releases/tag/v3.7.0](https://github.com/alphagov/govuk-frontend/releases/tag/v3.7.0)

19. Move cards on the [Sprint board](https://github.com/orgs/alphagov/projects/4) from "Ready to Release" column to "Done". Close any associated milestones.
