# Tasks before publishing a new release of GOV.UK Frontend

When preparing to publish a release of GOV.UK Frontend we need to ensure we are following proper procedure to effectively track our work and are prepared to publish our new release.

## Kick off the release

Both squads should coordinate when either wants to publish a new release. Choose a team member to lead on the release, typically a developer.

We next need to define a cutoff date for this release. Once the cutoff date passes, do not add any further major changes. We can still add small fixes before we publish as long as we notify the team. However, we should try to avoid adding too many fixes in this way, as it requires us to have to repeat steps of the release process.

Optionally, we can also let the prototype kit know that we are coordinating a release. The prototype kit team have [their own release process](https://github.com/alphagov/govuk-prototype-kit/tree/main/internal_docs) and we don't need to run releases synchronously.

## Raise release issues

Those leading on the release should then raise new issues in the team GitHub repositories ([govuk-frontend](https://github.com/alphagov/govuk-frontend), [govuk-design-system](https://github.com/alphagov/govuk-design-system/issues/2024), [govuk-frontend-docs](https://github.com/alphagov/govuk-frontend-docs) to track the following:

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

Once the developers have created these issues, the person leading the release should add them to an epic (example issue: [#2511](https://github.com/alphagov/govuk-frontend/issues/2511)). All these issues should be added to the [Design System sprint board](https://github.com/orgs/alphagov/projects/4).

## Draft comms and release notes for the community

A content designer and/or tech writer should do the following:

- write announcements for slack posts, email and to go on the design system website after we release GOV.UK Frontend (for example, [draft comms for the cookie banner component](https://docs.google.com/document/d/1jVyMB7i94NOeflWaf3kE4Q4APMXGfluK3rOh74IHO08/edit))
- check who the release’s contributors are and if we have consent to include their name

A technical writer should finalise draft of release notes. Release notes will require a 2i review by another technical writer, make sure the technical writer has time to coordinate this. When ready, open a pull request to update the [CHANGELOG.md](https://github.com/alphagov/govuk-frontend/blob/main/CHANGELOG.md) file with the updated release notes.

If the technical writer is unavailable, ask for help in the [gds-technical-writing Slack channel](https://gds.slack.com/archives/CAD0R2NQG) or confer with a content designer.

The team should also post a message on any relevant [issue discussions](https://github.com/orgs/alphagov/projects/43/views/1) with rationale for any decisions we've made.

## Finalise the release

At this stage, the person leading the release should agree the publishing date. Once the team agrees, this confirms a code and content freeze. Use the [#design-system-team-channel](https://gds.slack.com/app_redirect?channel=design-system-team-channel) to confirm sign-off from:

- content designer, technical writer and designers for guidance, examples and community backlog decision rationale
- technical writer and developers for Nunjucks macros
- developers for changes to GOV.UK Frontend
- technical writer for release notes
- content designer, community manager and technical writer for announcements and engagement activities
