# After publishing a new release of GOV.UK Frontend

After we've published a new release of GOV.UK Frontend, there are things we still need to do, such as inform our community and update our own repos.

## Update our repos to use the new release

We should update [govuk-design-system](https://github.com/alphagov/govuk-design-system) and [govuk-frontend-docs](https://github.com/alphagov/govuk-frontend-docs) to use the new release. When updating the Design System, we should also check that:

- any guidance updates are published and show as expected
- any updates coming from GOV.UK Frontend macro options show as expected

## Send an email to mailing list subscribers

We usually send out an email with the release comms, except for releases with minor fixes.

This email should:

- give a summary of the update
- explain why teams should update
- say which components or styles are affected (if applicable)
- thank any major contributors using their GitHub usernames

A release email will typically end with a link to the version's [release notes](https://github.com/alphagov/govuk-frontend/releases), and a call-to-action button to the [update npm how-to page](https://frontend.design-system.service.gov.uk/updating-with-npm/#update-using-node-js-package-manager-npm).

For example, see the [release email for GOV.UK Frontend 5.11.0](https://mailchi.mp/c877961d1db5/feature-release-govuk-frontend-v590-improved-file-upload-component-10977163?e=[UNIQID]).

## Send Slack messages to relevant channels

We should update both internal and cross-government Slack channels:

- [GDS: govuk-design-system](https://gds.slack.com/archives/CAF8JA25U)
- [GDS: digital-service-platforms](https://gds.slack.com/archives/C01E20X06JK)
- [x-gov: govuk-design-system](https://ukgovernmentdigital.slack.com/archives/C6DMEH5R6)

The message we send on Slack is usually a shorter version of the email.

We should also review the GOV.UK Design System overview canvases we have on each support channel, updating the version number of GOV.UK Frontend in [GDS: #govuk-design-system](https://gds.slack.com/docs/T8GT9416G/F08UG2X7BFD) and [x-gov: #govuk-design-system](https://ukgovernmentdigital.slack.com/docs/T04V6EBTR/F058W5T94ET).

## Update the Design System website

We should decide whether we need to update the following places on the website:

- the "What's New" section on the homepage of the website - the content for this section can be found in [/views/partials/\_whats-new.njk](https://github.com/alphagov/govuk-design-system/blob/main/views/partials/_whats-new.njk)
- the aliases section in the metadata of the [Upcoming components and patterns page](https://github.com/alphagov/govuk-design-system/blob/main/src/community/upcoming-components-patterns/index.md?plain=1) to make sure that searches on the website for a new component no longer point at that page

## Tidy up our issue list and sprint board

Finally, we should tidy up our issue list and sprint board by making sure:

- issues created for this release are all complete, closed and moved into the **Done** column on the [Design System cycle board](https://github.com/orgs/alphagov/projects/53)
- all the issues on the cycle board that were closed in this release have been moved from the **Ready to Release** column to **Done**
- any associated milestones are closed
