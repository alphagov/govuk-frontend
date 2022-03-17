---
name: "Build a component"
about: Everything we need to do when we build a component
title: ''
labels: "contribution or major iteration, design, epic"
assignees: ''

---

## What
<!-- Add name of component, plus any relevant links (for example, community backlog issues and comments, pull requests for the component and its guidance) -->

## Why
<!-- Add reason for building the component -->

## Who needs to know about this
<!-- Add team roles involved in building the component -->

## Acceptance criteria
<!-- Customise, and add component-specific checklist items to, this list of criteria all components need to meet -->
### Accessibility
In general, the component must:
- [ ] work with [assistive technologies listed in the service manual(https://www.gov.uk/service-manual/technology/designing-for-different-browsers-and-devices)
- [ ] pass tests on tools like axe and HTML validator
- [ ] works when zoomed at high resolution
- [ ] work in high contrast mode
- [ ] follow [focus state guidance](https://design-system.service.gov.uk/get-started/focus-states/)

For more information on accessibility testing, [read our documentation on testing components](https://github.com/alphagov/govuk-frontend/blob/main/docs/contributing/test-components-using-accessibility-acceptance-criteria.md).

### Coding standards
The component's guidance must include these sections:
- [ ] have [Nunjucks options that are consistent with other Design System components](https://github.com/alphagov/govuk-frontend/blob/main/docs/contributing/coding-standards/nunjucks-api.md)
- [ ] have commonly available Nunjucks options
- [ ] follow GOV.UK Frontend coding conventions

### Content
The component must:
- [ ] include Nunjucks documentation, which the technical writing community has 2i'd
- [ ] have PR commits with [commit messages that are easy to understand](https://github.com/alphagov/design-system-team-docs/blob/main/development/commit-messages.md)

### Reviews
The component must:
- [ ] be reviewed by the working group at the development stage
- [ ] in its final version, receive a design crit from the wider community, to see if we've balanced any trade-offs correctly

### Tests
The component must:
- [ ] avoid a breaking change
- [ ] work with Javascript disabled
- [ ] work with CSS disabled
- [ ] work and look as expected at different breakpoints
- [ ] have a macro the user can use to pass data into the component
- [ ] have unit tests which each macro option passes
- [ ] have JavaScript tests, if the component uses JavaScript
- [ ] support the [browsers listed in the Service Manual](https://www.gov.uk/service-manual/technology/designing-for-different-browsers-and-devices), and have semantic markup
- [ ] work on devices listed in the Service Manual
- [ ] pass linter and tests
