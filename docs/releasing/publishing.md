# Publishing GOV.UK Frontend

## Steps you must complete before you release a new version of GOV.UK Frontend

1. Raise new issues in the team GitHub repositories to:

  - Create release notes for the new release (example card: [#1986](https://github.com/alphagov/govuk-frontend/issues/1986))
  - Create release notes for the new version of GOV.UK Prototype Kit (example card: [#958](https://github.com/alphagov/govuk-prototype-kit/issues/958))
  - Release the new version (example card: [#1987](https://github.com/alphagov/govuk-frontend/issues/1987))
  - Update the GOV.UK Design System to use the new release (example card: [#1347](https://github.com/alphagov/govuk-design-system/issues/1347))
  - Update the GOV.UK Frontend Docs to use the new release (example card: [#75](https://github.com/alphagov/govuk-frontend-docs/issues/75))
  - Update the GOV.UK Prototype Kit to use the new release (example card: [#923](https://github.com/alphagov/govuk-prototype-kit/issues/923))
  - Release the new version of GOV.UK Prototype Kit (example card: [#917](https://github.com/alphagov/govuk-prototype-kit/issues/917))

2. Add the issues to the **Design System Sprint Board**.

3. Confirm that any related content for the Design System or Frontend docs is ready to publish.

4. Write a summary of the release for the cross-government and GDS #govuk-design-system Slack channels. For example:

    🚀 We’ve just released GOV.‌UK Frontend v3.7.0. It's now easier and faster to use our Sass. We've also made improvements to back links, breadcrumbs, lists and the header. Thanks to @<SLACK-NAME> and @<SLACK-NAME> for helping with this release. [https://github.com/alphagov/govuk-frontend/releases/tag/v3.7.0](https://github.com/alphagov/govuk-frontend/releases/tag/v3.7.0)

5. Ask a tech writer or a content writer to review the summary.

## Release a new version of GOV.UK Frontend

1. Checkout **master** and pull latest changes.

2. Run `nvm use` to ensure you are using the right version of Node.js and npm.

3. Run `npm install` to ensure you have the latest dependencies installed.

4. Create and checkout a new branch (`release-[version-number]`).
  The version number is determined by looking at the [current "Unreleased" CHANGELOG](../../CHANGELOG.md) changes and updating the previous release number depending on the kind of entries:

  - `Breaking changes` corresponds to a `major` (1.X.X) change.
  - `New features` corresponds to a `minor` (X.1.X) change.
  - `Fixes` corresponds to a `patch` (X.X.1) change.

  For example if the previous version is `2.3.0` and there are entries for `Breaking changes` then the new release should be `3.0.0`.

  See the [versioning documentation](/docs/contributing/versioning.md) for more information.

5. Update [`CHANGELOG.md`](../../CHANGELOG.md) "Unreleased" heading with the new version number. Add a new "Unreleased" heading above this, so people raising new PRs know where to add these to the Changelog.

6. Update [`package/package.json`](../../package/package.json) version with the new version number.

7. Save the changes. Do not commit.

8. Run `npm run build-release`, you will be prompted to continue or cancel.

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

13. Log into npm (`npm login`), using team [credentials](https://github.com/alphagov/design-system-team-credentials/tree/master/npm/govuk-patterns-and-tools).

14. Run `npm run publish-release`, you will be prompted to continue or cancel.

15. View the created tag in the [Github interface](https://github.com/alphagov/govuk-frontend/releases)
  - select the latest tag
  - press 'Edit tag'
  - set "GOV.UK Frontend v[version-number]" as the title
  - add release notes from changelog
  - attach the generated ZIP that has been generated at the root of this project
  - publish release

16. Log out from npm
```bash
npm logout
```

## Steps you must complete after you release a new version of GOV.UK Frontend

1. Update the GOV.UK Design System, Prototype Kit, and Frontend Docs and release a new version of the Prototype Kit (as in step 1 of [Steps you must complete before you release a new version of GOV.UK Frontend](#steps-you-must-complete-before-you-release-a-new-version-of-govuk-frontend)).

2. Post your summary of the release in the cross-government and GDS #govuk-design-system Slack channels.

3. Move cards on the [Sprint board](https://github.com/orgs/alphagov/projects/4) from the **Ready to Release** column to **Done**. Close any associated milestones.
