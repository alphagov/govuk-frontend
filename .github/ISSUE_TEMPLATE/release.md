---
name: "\U0001F680 Release"
about: For internal use only - issue template for release tasks
title: Release vX.Y.Z
labels: "epic, \U0001F680 release"
assignees: ''

---

<!--

  This is a template for issues tracking the tasks we need to go through when releasing
  a new version of GOV.UK Template. Feel free to amend the content in the different sections,
  especially the task lists as there may be extra tasks specific to the release at hand.

-->

## What

Release a new version of GOV.UK Frontend with the latest changes we've built.

## Why

So people can use this new version

## Who needs to work on this

Technical writers, Developers

## Who needs to review this

Technical writers, Developers

## Done when

```[tasklist]
## Comms preparation
- [ ] Draft release notes
- [ ] Draft comms
```

```[tasklist]
## GOV.UK Frontend
- [ ] Follow [our process to release GOV.UK Frontend to npm and GitHub](https://github.com/alphagov/govuk-frontend/blob/main/docs/releasing/publishing.md)
```

```[tasklist]
## Design System site
- [ ] [Run dependabot](https://github.com/alphagov/govuk-design-system/network/updates/194539/jobs) to bump the version of `govuk-frontend`
- [ ] Update [the "What's new" section on the homepage](https://github.com/alphagov/govuk-design-system/blob/main/views/partials/_whats-new.njk)
- [ ] Update [the "Recently shipped" section of the roadmap](https://github.com/alphagov/govuk-design-system/blob/main/src/community/roadmap/index.md#recently-shipped)
```

```[tasklist]
## Frontend docs
- [ ] [Run dependabot](https://github.com/alphagov/govuk-frontend-docs/network/updates/4008122/jobs) to bump the version of `govuk-frontend`
```

```[tasklist]
## Comms
- [ ] Send comms on Slack channels
- [ ] Send comms to mailing list
```

```[tasklist]
## Logistics
- [ ] Ensure issues published in the release are gathered in a [GitHub milestone](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/about-milestones)
- [ ] Verify that decisions are appropriately documented (in code/issues/pull request comments or in separate documents linked from issues/pull requests)
- [ ] 🔑 Ensure that [relevant access tokens are up to date](https://github.com/alphagov/govuk-frontend/blob/main/docs/releasing/before-publishing-a-release.md#make-sure-access-tokens-are-up-to-date)
- [ ] Update state of published issues on project board
- [ ] Close published issues when appropriate
- [ ] Open any follow-up issues if necessary
```
