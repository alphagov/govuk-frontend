# Before you publish GOV.UK Frontend

1. At stand up, person leading the release to tell the GOV.UK Design System team we are close to releasing so we can coordinate the final cutoff date. Once the cutoff date passes, do not add any further major changes to the release. We can still add small fixes before step 7 as long as we notify the content designer and technical writer. However, we should try to avoid adding too many fixes in this way, as it requires us to repeat some of steps 4-6.

2. (optional step) Let the prototype kit know that we are coordinating a release. The prototype kit team have [their own release process](https://github.com/alphagov/govuk-prototype-kit/tree/main/internal_docs) and we don't need to run releases synchronously.

3. Developers to raise new issues in the team GitHub repositories ([govuk-frontend](https://github.com/alphagov/govuk-frontend), [govuk-design-system](https://github.com/alphagov/govuk-design-system/issues/2024), [govuk-frontend-docs](https://github.com/alphagov/govuk-frontend-docs) to:
  - draft comms for the new release (example issue: [#2507](https://github.com/alphagov/govuk-frontend/issues/2507))
  - create release notes for the new release (example issue: [#2508](https://github.com/alphagov/govuk-frontend/issues/2508))
  - release the new version of GOV.UK Frontend to npm (example issue: [#2509](https://github.com/alphagov/govuk-frontend/issues/2509))
  - update the GOV.UK Design System to use the new release of GOV.UK Frontend (example issue: [#2024](https://github.com/alphagov/govuk-design-system/issues/2024)):
    - bump the version of `govuk-frontend`
    - update the "What's new" section on the home page
    - update the "Recently shipped" section of the roadmap
    - merge any other documentation PRs specific to the release
  - update the GOV.UK Frontend Docs to use the new release of GOV.UK Frontend (example issue: [#184](https://github.com/alphagov/govuk-frontend-docs/issues/184)):
    - bump the version of `govuk-frontend`
    - update the "Updating with npm" example for `package.json` with the current number
    - merge any other documentation PRs specific to the release
  - post the comms and do tidy-up tasks (example issue: [#2510](https://github.com/alphagov/govuk-frontend/issues/2510))

  Once the developers have created these issues, the person leading the release should add them to an epic (example issue: [#2511](https://github.com/alphagov/govuk-frontend/issues/2511)).

4. Person leading the release to add the issues to the [Design System kanban board](https://github.com/orgs/alphagov/projects/4).

5. Content designer to:
  - write announcements to post on Slack after we release GOV.UK Frontend (for example, [draft comms for the cookie banner component](https://docs.google.com/document/d/1jVyMB7i94NOeflWaf3kE4Q4APMXGfluK3rOh74IHO08/edit))
  - check who the release’s contributors are and if we have consent to include their name

6. Technical writer to finalise draft of release notes and get 2i on them. If the technical writer is unavailable, ask for help in the [gds-technical-writing Slack channel](https://gds.slack.com/archives/CAD0R2NQG).

7. Content designer or designer to update community backlog with rationale for any decisions we made.

8. Person leading the release to coordinate the sign-off when they are ready to do the release. Once the team agrees, this confirms a code and content freeze. Use the [#design-system-team-channel](https://gds.slack.com/app_redirect?channel=design-system-team-channel) to confirm sign-off from:
  - content designer, technical writer and designers for guidance, examples and community backlog decision rationale
  - technical writer and developers for Nunjucks macros
  - developers for changes to GOV.UK Frontend
  - technical writer for release notes
  - content designer, community manager and technical writer for announcements and engagement activities

> **Note:** Before you go on leave, tell the delivery manager who will be looking after your work. This will help us to complete sign-off without fuss.

# Publish a new version of GOV.UK Frontend

Developers should pair on releases. When remote working, it can be useful to be on a call together.

1. Check out the **main** branch and pull the latest changes.

2. Run `nvm use` to make sure you're using the right version of Node.js and npm.

3. Run `npm install` to make sure you have the latest dependencies installed.

4. Create and check out a new branch (`release-[version-number]`). See the [versioning documentation](/docs/contributing/versioning.md) for more information.

5. Update the [`CHANGELOG.md`](../../CHANGELOG.md) by:
  - changing the 'Unreleased' heading to the new version-number and release-type - for example, '3.11.0 (Feature release)'
  - adding a new 'Unreleased' heading above the new version-number and release-type, so users will know where to add PRs to the changelog

6. Update [`package/package.json`](../../package/package.json) version with the new version-number.

7. Save the changes. Do not commit.

8. Run `npm run build-release` to:

- build GOV.UK Frontend into the `/package` and `/dist` directories
- commit the changes
- push a branch to GitHub

  You will now be prompted to continue or cancel.

9. Create a pull request and copy the changelog text.
   When reviewing the PR, check that the version-numbers have been updated and that the compiled assets use this version-number.

10. Once a reviewer approves the pull request, merge it to **main**.

## Publish a release to npm

1. Check out the **main** branch and pull the latest changes.

2. Sign in to npm (`npm login`), using the npm/govuk-patterns-and-tools team [credentials](https://github.com/alphagov/design-system-team-credentials/tree/main/npm/govuk-patterns-and-tools).

3. Run `npm run publish-release`, which will prompt you to check whether the npm tag looks as expected.

  If you're following these instructions, you're probably doing a sequential release, meaning
  the tag should be 'latest'.

4. Enter `y` to continue. If you think the tag should be different, enter `N` to have the option to set your own npm tag.

5. You will now be prompted to continue or cancel the release. Check the details and enter `y` to continue. If something does not look right, press `N` to cancel the release.
  
  This step will create a ZIP file containing the release in the root of your govuk-frontend git directory. You will need this file when creating the GitHub release.

  It will also automatically create a tag in Github which you can use to create a Github release in the following section.
  
6. Run `npm logout` to log out from npm.

## Create a release on Github

You can view the tag created during step 10 of creating the new version in the [Github interface](https://github.com/alphagov/govuk-frontend/tags). To create a new Github release, do the following:

1. Select the latest tag
2. Press **Create release from tag**
3. Set 'GOV.UK Frontend v[version-number]' as the title
4. Add release notes from changelog
5. Attach the ZIP file that has been generated at the root of this project during the npm publishing phase
6. Publish release

# After you publish the new release

1. Update the GOV.UK Design System and Frontend Docs to use a new release of GOV.UK Frontend

2. Post announcements of the release to:
  - GOV.UK Frontend in the govuk-design-system channels on [GDS Slack](https://gds.slack.com/app_redirect?channel=govuk-design-system) and [x-gov Slack](https://ukgovernmentdigital.slack.com/app_redirect?channel=govuk-design-system)
  - let the team know they can post social comms
  - let stakeholders know the release is live

3. Move issues on the [Design System Kanban board](https://github.com/orgs/alphagov/projects/4) from the **Ready to Release** column to **Done**.

4. Close any associated milestones.
