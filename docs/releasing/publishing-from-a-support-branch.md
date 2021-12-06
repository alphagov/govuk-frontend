# Publishing from a support branch

This document is for GOV.UK Design System developers who need to publish a support branch of GOV.UK Frontend when the `main` branch contains unreleasable changes. For example, you might need to release a fix as part of a:

- patch release, after the team has started to merge changes for a new feature release into the `main` branch - for example, a 3.14.x release once we've started merging changes for 3.15.0
- release, after the team has started to merge changes for a new breaking release into the `main` branch - for example, a 3x.x release once we've started merging changes for 4.0.0

Do not use this document to release changes for previous major releases. We have not tested the document in this scenario, and extra work would be needed to tell npm not to mark the release as the 'latest'.

If you want to publish the `main` branch for GOV.UK Frontend, [follow the steps in Publishing GOV.UK Frontend](/docs/releasing/publishing.md).

If the `main` branch only has a few unreleasable changes, you can temporarily revert these changes.

1. Revert the unreleasable changes on the `main` branch.
2. Publish GOV.UK Frontend.
3. Add the reverted changes back into the `main` branch.

However, this approach has risks. For example, it creates a messy commit history on the `main` branch.

## Before you publish GOV.UK Frontend

1. At stand-up, person leading the release (usually a developer) to tell the GOV.UK Design System team we are close to releasing.

2. Developers to raise new issues in the team GitHub repositories ([govuk-frontend](https://github.com/alphagov/govuk-frontend), [govuk-frontend-docs](https://github.com/alphagov/govuk-frontend-docs), [govuk-prototype-kit](https://github.com/alphagov/govuk-prototype-kit)) to:
    - create announcement draft for the new release (example card: [#2108](https://github.com/alphagov/govuk-frontend/issues/2108))
    - create release notes for the new release (example card: [#1986](https://github.com/alphagov/govuk-frontend/issues/1986))
    - create release notes for the new release of GOV.UK Prototype Kit (example card: [#958](https://github.com/alphagov/govuk-prototype-kit/issues/958))
    - create a card for the new release of GOV.UK Frontend (example card: [#1987](https://github.com/alphagov/govuk-frontend/issues/1987))
    - update the GOV.UK Design System to use the new release of GOV.UK Frontend (example card: [#1347](https://github.com/alphagov/govuk-design-system/issues/1347))
    - create a card for the new release of GOV.UK Prototype Kit (example card: [#917](https://github.com/alphagov/govuk-prototype-kit/issues/917))
    - update the GOV.UK Prototype Kit to use the new release (example card: [#923](https://github.com/alphagov/govuk-prototype-kit/issues/923))

3. Person leading the release to add the issues to the [Design System sprint board](https://github.com/orgs/alphagov/projects/4).

4. Content designer to:
    - write announcements to post on Slack after we release:
      - GOV.UK Frontend (for example, [draft comms for the cookie banner component](https://docs.google.com/document/d/1jVyMB7i94NOeflWaf3kE4Q4APMXGfluK3rOh74IHO08/edit))
      - GOV.UK Prototype kit
    - check who the release’s contributors are and if we have consent to include their name

5. Technical writer to finalise draft of release notes and get 2i on them.

6. Content designer or designer to update community backlog with rationale for any decisions we made.

7. Person leading the release to coordinate the sign-off when they are ready to do the release. Once the team agrees, this confirms a code and content freeze. Use the [#design-system-team-channel](https://gds.slack.com/app_redirect?channel=design-system-team-channel) to confirm sign-off from:
    - content designer, technical writer and designers for guidance, examples and community backlog decision rationale
    - technical writer and developers for Nunjucks macros
    - developers for changes to GOV.UK Frontend
    - technical writer for release notes
    - content designer, community manager or technical writer for announcements and engagement activities

Note: Before you go on annual leave, tell the delivery manager who will be looking after your work. This will help us to complete sign-off.

## Publish a new version of GOV.UK Frontend from the support branch

### Change the code

1. To check out the support branch for the current major release, run `git checkout support/<CURRENT MAJOR VERSION NUMBER>.x`. If the branch does not exist, follow these steps to create it:

    - make sure you have all tags locally by running `git fetch --all --tags --prune`
    - run `git checkout tags/v<LAST RELEASED VERSION NUMBER> -b support/<CURRENT MAJOR VERSION NUMBER>.x` - for example, `git checkout tags/v3.9.1 -b support/3.x`

2. Run `nvm use` to make sure you’re using the right version of Node.js and npm.

3. Push the support branch to GitHub. The branch will automatically have branch protection rules applied.

4. To fix the issue, create a new branch (for example, `git checkout -b fix-the-thing`) from the `support/<CURRENT MAJOR VERSION NUMBER>.x` branch.

5. Run `npm install` to make sure you have the latest dependencies installed.

6. Make your code changes, and test them following our [standard testing requirements](/docs/contributing/testing.md).

7. Update the changelog with details of the fix.

8. Commit your changes, then push your new branch (see step 4) to GitHub and raise a pull request, with `support/<CURRENT MAJOR VERSION NUMBER>.x` as the base branch to merge into.

9. Once a developer approves the pull request, merge it into `support/<CURRENT MAJOR VERSION NUMBER>.x`. It’s usually a developer who reviews the pull request, but sometimes pull requests need an extra review from another role. For example, if the pull request involves a design change, you may need a review from a designer.

### Build a new release

1. Check out `support/<CURRENT MAJOR VERSION NUMBER>.x`.

2. Create and check out a new branch, `support-release-[version-number]`. The version number of the new release depends on the type of release. New features correspond to a minor (X.1.X) change - for example, '3.14.0 (Feature release)'. Fixes correspond to a patch (X.X.1) change - for example, '3.13.1 (Patch release)'. In either case, refer to the previous release of that kind, and give the new release the logical next number. To learn more about our versioning, see our [guidance on updating the changelog](/docs/contributing/versioning.md#updating-changelog).

3. Run `nvm use` to make sure you’re using the right version of Node.js and npm.

4. Run `npm install` to make sure you have the latest dependencies installed.

5. In the CHANGELOG.md, replace the 'Unreleased' heading with the new version number and its release type. For example, '3.14.1 (Fix release)'. Also add a new 'Unreleased' heading above this new heading, so people raising new pull requests know where to add them in the changelog.

6. Update the `package/package.json` version with the new version number.

7. Save the changes. Do not commit.

8. Run `npm run build-release`, which will prompt you to either continue or cancel. Enter `y` to continue.

9. If you want to make sure your changes work when used in the GOV.UK Design System, use [`npm-link`](https://docs.npmjs.com/cli/v7/commands/npm-link) to test before publishing:

  ```bash
  cd ../govuk-design-system
  git checkout main
  git pull
  npm install # note running `npm install` after `npm link` will destroy the link.
  npm link ../govuk-frontend/package/
  ```

10. When you finish testing, run `npm unlink ../govuk-frontend/package/` to unlink the package.

11. Raise a pull request, with `support/<CURRENT MAJOR VERSION NUMBER>.x` as the base branch to merge into.

12. Once a developer approves the pull request, merge it into `support/<CURRENT MAJOR VERSION NUMBER>.x`.

### Publish the release to npm

1. Check out `support/<CURRENT MAJOR VERSION NUMBER>.x` and pull the latest changes.

2. Sign in to npm using the npm/govuk-patterns-and-tools [access token](https://github.com/alphagov/design-system-team-credentials/tree/main/npm/govuk-patterns-and-tools): `export NPM_TOKEN="$(ds-pass npm/govuk-patterns-and-tools/token)"`.

3. Run `npm run publish-release`, which will prompt you to either continue or cancel. Enter `y` to continue.

4. View the created tag in the [GitHub interface](https://github.com/alphagov/govuk-frontend/releases) as follows:

    - select the latest tag
    - press **Edit tag**
    - set ‘GOV.UK Frontend v[version-number]’ as the title
    - add release notes from changelog
    - attach the generated ZIP that has been generated at the root of this project
    - publish release

5. Run `unset NPM_TOKEN` to log out from npm (do not use `npm logout`, as this will revoke the token).

## After you publish the new release

1. Once you've updated the GOV.UK Design System, Prototype Kit and Frontend Docs, [post a short summary of the release in the cross-government and GDS #govuk-design-system Slack channels](https://github.com/alphagov/govuk-frontend/issues/2363).

2. On the [Design System Kanban Board](https://github.com/orgs/alphagov/projects/4):

    - move any relevant cards from the 'Ready to Release' column to 'Done'
    - close any associated milestones

## Update the `main` branch

1. Check out the `main` branch and pull the latest changes.

2. Run `nvm use` and `npm install` to make sure you have the latest dependencies installed.

3. Make the same changes as in the patch fix pull request, and test them using our [standard testing requirements](/docs/contributing/testing.md). Remember that `main` will contain changes the support branch did not have, which might affect the code changes you’ll need to make.

4. Also update the [CHANGELOG.md](/CHANGELOG.md) with this change. Add a new ‘Unreleased’ heading above the change, so people raising new pull requests know where to add them in the changelog. Remember that the pull request links in the changelog notes will need to link to the pull requests against the `main` branch.

5. Commit your changes.

6. Push your branch to GitHub and raise a pull request, with `main` as the base branch to merge into.

7. Once a developer approves the pull request, merge it into the `main` branch.
