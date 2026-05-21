# Publishing a preview of GOV.UK Frontend

This preview guidance is aimed at Design System team members. If you're an external contributor who needs to create a preview, [contact the Design System team](https://design-system.service.gov.uk/contact/), and we'll do it for you.

To publish a preview, you must first commit a change to GOV.UK Frontend.

Use previews when you:

- [work on developing a component or pattern](https://design-system.service.gov.uk/community/develop-a-component-or-pattern/) for the GOV.UK Design System
- want to trial an experimental feature (guidance on trialing experimental features is in development)

> [!WARNING]
> Your projects should never depend on a preview GOV.UK Frontend package. This is because someone could remove the GitHub branch containing the preview package at any time. For this reason, never use a preview package in a production setting.

## What happens when you preview GOV.UK Frontend

Previewing GOV.UK Frontend creates a GitHub branch. This branch contains the GOV.UK Frontend [`/packages/govuk-frontend`](/packages/govuk-frontend) directory with your trial changes.

Projects can point to this branch in their package.json, instead of to the published [GOV.UK Frontend npm package](https://www.npmjs.com/package/govuk-frontend). No changes are published to the GOV.UK Frontend npm package as part of this process.

## Publish a preview

1. Run `git checkout -b BRANCH-NAME` to check out a new branch you want to preview, or `git checkout BRANCH-NAME` to check out an existing branch.

2. Make any required changes and commit them.

3. Make sure you're running the version of Node.js matching [`.nvmrc`](/.nvmrc).
   - If you use NVM, run `nvm use` to set up the correct version
   - If you use another management system (like [`asdf`](https://asdf-vm.com/guide/getting-started.html)), compare the output of `node --version` and install the correct one if necessary

4. Run `npm run publish-preview` to create and push a new branch that contains your changes - this process may take a few moments and will display a `Success!` message.

## Preview your changes

1. If you need to update an existing project to use the preview, copy the command that displays after the `Success!` message.

2. Navigate to the project in the command line and run the success notification command - running this command makes the project point to the preview branch, instead of to the published [GOV.UK Frontend npm package](https://www.npmjs.com/package/govuk-frontend).

3. You can now preview your trial changes to GOV.UK Frontend.

## Update a preview

1. Check out the Git branch you previewed earlier (this is the branch you work on, not the branch the script created).

2. Make the required changes and commit them.

3. Follow steps 3 to 4 in [Publish a preview](#publish-a-preview).

4. Follow the steps in [Preview your changes](#preview-your-changes).
