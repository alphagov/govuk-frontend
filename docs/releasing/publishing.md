# Before you publish GOV.UK Frontend

1. At stand up, person leading the release to tell the GOV.UK Design System team we are close to releasing so we can coordinate the final cutoff date. Once the cutoff date passes, do not add any further major changes to the release. We can still add small fixes before step 7 as long as we notify the content designer and technical writer. However, we should try to avoid adding too many fixes in this way, as it requires us to repeat some of steps 4-6.

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

5. Technical writer to finalise draft of release notes and get 2i on them. If the technical writer is unavailable, ask for help in the [gds-technical-writing Slack channel](https://gds.slack.com/archives/CAD0R2NQG).

6. Content designer or designer to update community backlog with rationale for any decisions we made.

7. Person leading the release to coordinate the sign-off when they are ready to do the release. Once the team agrees, this confirms a code and content freeze. Use the [#design-system-team-channel](https://gds.slack.com/app_redirect?channel=design-system-team-channel) to confirm sign-off from:
  - content designer, technical writer and designers for guidance, examples and community backlog decision rationale
  - technical writer and developers for Nunjucks macros
  - developers for changes to GOV.UK Frontend
  - technical writer for release notes
  - content designer, community manager and technical writer for announcements and engagement activities

> **Note:** Before you go on leave, tell the delivery manager who will be looking after your work. This will help us to complete sign-off without fuss.

# Publish a new version of GOV.UK Frontend

Developers should pair on releases. When remote working, it can be useful to be on a call together. Likewise, to help align releases, members of the Design System and Prototype Kit teams should both join the release call.

1. Check out the **main** branch and pull the latest changes.

2. Run `nvm use` to make sure you're using the right version of Node.js and npm.

3. Run `npm install` to make sure you have the latest dependencies installed.

4. Create and check out a new branch (`release-[version-number]`). See the [versioning documentation](/docs/contributing/versioning.md) for more information.

5. Update the [`CHANGELOG.md`](../../CHANGELOG.md) by:
  - changing the 'Unreleased' heading to the new version-number and release-type - for example, '3.11.0 (Feature release)'
  - adding a new 'Unreleased' heading above the new version-number and release-type, so users will know where to add PRs to the changelog

6. Update [`package/package.json`](../../package/package.json) version with the new version-number.

7. Save the changes. Do not commit.

8. Run `npm run build-release`. You will be now be prompted to continue or cancel.

9. (Optional) Test in [GOV.UK Design System](git@github.com:alphagov/govuk-design-system.git)

  If you want to test that your changes work in the GOV.UK Design System, you can use [npm link](https://docs.npmjs.com/cli/link) to test before publishing.

  ```bash
  cd ../govuk-design-system
  git checkout main
  git pull
  npm install # note running `npm install` after `npm link` will destroy the link.
  npm link ../govuk-frontend/package/
  ```

  When you have finished, you need to unlink the package.

  ```bash
  npm unlink ../govuk-frontend/package/
  ```

10. Create a pull request and copy the changelog text.
   When reviewing the PR, check that the version-numbers have been updated and that the compiled assets use this version-number.

11. Once a reviewer approves the pull request, merge it to **main**.

## Publish a release to npm

1. Check out the **main** branch and pull the latest changes.

2. Sign in to npm (`npm login`), using the npm/govuk-patterns-and-tools team [credentials](https://github.com/alphagov/design-system-team-credentials/tree/main/npm/govuk-patterns-and-tools).

3. Run `npm run publish-release`, which will prompt you to either continue or cancel. Enter `y` to continue.

4. View the created tag in the [Github interface](https://github.com/alphagov/govuk-frontend/releases) as follows:
  - select the latest tag
  - press **Edit tag**
  - set 'GOV.UK Frontend v[version-number]' as the title
  - add release notes from changelog
  - attach the generated ZIP that has been generated at the root of this project
  - publish release

5. Run `npm logout` to log out from npm.

# After you publish the new release

1. Update the GOV.UK Design System, Prototype Kit and Frontend Docs to:
  - use a new release of GOV.UK Frontend
  - release a new version of the Prototype Kit

2. Post announcements of the release to:
  - GOV.UK Frontend in the govuk-design-system channels on [GDS Slack](https://gds.slack.com/app_redirect?channel=govuk-design-system) and [x-gov Slack](https://ukgovernmentdigital.slack.com/app_redirect?channel=govuk-design-system)
  - Prototype kit in the [prototype-kit channel](https://ukgovernmentdigital.slack.com/app_redirect?channel=prototype-kit) on x-gov Slack
  - let the team know they can post social comms
  - let stakeholders know the release is live

3. Move cards on the [Design System Kanban board](https://github.com/orgs/alphagov/projects/4) from the **Ready to Release** column to **Done**.

4. Close any associated milestones.
