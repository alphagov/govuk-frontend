# Tasks before publishing a new release of GOV.UK Frontend

When preparing to publish a release of GOV.UK Frontend we need to ensure we are following proper procedure to effectively track our work and are prepared to publish our new release.

## Kick off the release

The whole team should coordinate whether to publish a new release. Choose a team member to lead on the release, typically a developer.

We next need to define a cutoff date for this release. Once the cutoff date passes, do not add any further major changes. We can still add small fixes before we publish as long as we notify the team. However, we should try to avoid adding too many fixes in this way, as it requires us to have to repeat steps of the release process.

## Raise an issue for the release

Use the '🚀 Release' issue template to [create an issue in the govuk-frontend repository](https://github.com/alphagov/govuk-frontend/issues/new/choose) tracking the tasks for this release.

The template lists the main tasks that happen for every release. If the release at hand needs some specific steps, make sure to add items to the lists for each of them, especially:

- merging documentation [PRs on govuk-design-system](https://github.com/alphagov/govuk-design-system/pulls?q=sort%3Aupdated-desc+is%3Apr+is%3Aopen)
- merging documentation [PRs on govuk-frontend-docs](https://github.com/alphagov/govuk-frontend-docs/pulls?q=sort%3Aupdated-desc+is%3Apr+is%3Aopen)

This issue should be:

- added to the [Design System cycle board](https://github.com/orgs/alphagov/projects/53) backlog
- added to that release's milestone if there's one

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
