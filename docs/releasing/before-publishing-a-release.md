# Before publishing a new release of GOV.UK Frontend

When preparing to publish a release of GOV.UK Frontend, we need to make sure we’re:

- following proper procedures to effectively track our work
- ready to publish our new release

## Kick off the release

The whole team should decide whether to publish a new release, then choose a developer to lead on the release.

We then need to set a cutoff date for this release. Once the cutoff date passes, do not add any further major changes. We can still add small fixes before we publish as long as we notify the team. However, we should try to avoid adding too many fixes in this way, as it would mean redoing steps of the release process.

## Raise an issue for the release

Use the '🚀 Release' issue template to [create an issue in the govuk-frontend repository](https://github.com/alphagov/govuk-frontend/issues/new/choose) to track the tasks for this release.

The template lists the main tasks we do for every release. If the release needs some specific tasks, make sure to add items to the lists for each of them, especially:

- merging [documentation PRs on govuk-design-system](https://github.com/alphagov/govuk-design-system/pulls?q=sort%3Aupdated-desc+is%3Apr+is%3Aopen)
- merging [documentation PRs on govuk-frontend-docs](https://github.com/alphagov/govuk-frontend-docs/pulls?q=sort%3Aupdated-desc+is%3Apr+is%3Aopen)

Add this release issue to:

- the [Design System cycle board](https://github.com/orgs/alphagov/projects/53) backlog
- the release's milestone, if it exists

## Draft comms and release notes for the community

A content designer and/or technical writer should do the following:

- write announcements for Slack posts and email, including which channels to use
- write content to go on the Design System website after we release GOV.UK Frontend (for example, [draft comms for the Cookie banner component](https://docs.google.com/document/d/1jVyMB7i94NOeflWaf3kE4Q4APMXGfluK3rOh74IHO08/edit))
- gather the list of contributors to the release and make sure we thank them in the comms and release notes, tagging their GitHub username

## Get release notes ready to publish

A technical writer should finalise the draft of the release notes. Release notes will need a 2i review, so make sure the technical writer has time to coordinate this. When ready, open a pull request to update the [CHANGELOG.md](https://github.com/alphagov/govuk-frontend/blob/main/CHANGELOG.md) file with the updated release notes.

If a technical writer is unavailable, ask a content designer for help. If a content designer is unavailable, request help in the [gds-technical-writing Slack channel](https://gds.slack.com/archives/CAD0R2NQG).

The team should also post a message on any relevant [issue discussions](https://github.com/orgs/alphagov/projects/43/views/1) with rationale for any decisions we've made.

## Finalise the release

At this stage, the developer leading the release should agree on the publishing date with the rest of the team, then confirm a date for a code freeze. Use the [#design-system-team-channel](https://gds.slack.com/app_redirect?channel=design-system-team-channel) to confirm sign-off from the:

- content designer, technical writer and designers for guidance, examples and community backlog decision rationale
- technical writer and developers for Nunjucks macros
- developers for changes to GOV.UK Frontend
- technical writer for release notes
- content designer, community manager and technical writer for announcements and engagement activities

Once you’re ready to publish the release, read the documentation on [publishing a new version of GOV.UK Frontend](/docs/releasing/publishing.md).
