# Publishing a preview of GOV.UK Frontend

This preview guidance is aimed at Design System team members. If you're an external contributor who needs to create a preview, please [contact the Design System team](https://design-system.service.gov.uk/get-in-touch/) and we'll do it for you.

Before you publish a preview, you need to have committed a code change to GOV.UK Frontend. Then follow these instructions.

Use previews when you:

- [work on developing a component or pattern](https://design-system.service.gov.uk/community/develop-a-component-or-pattern/) for the GOV.UK Design System
- want to trial an experimental feature (guidance on trialing experimental features is in development)

> **Warning** Your projects should never depend on a preview GOV.UK Frontend package. This is because someone could remove the GitHub branch containing the preview package at any time. For this reason, never use a preview package in a production setting.

## What happens when you preview GOV.UK Frontend

When you preview GOV.UK Frontend, this creates a GitHub branch. This branch contains the GOV.UK Frontend [`/packages/govuk-frontend`](/packages/govuk-frontend) directory with your trial changes.

Projects can point to this branch in their package.json, instead of to the published [GOV.UK Frontend npm package](https://www.npmjs.com/package/govuk-frontend). No changes are published to the GOV.UK Frontend npm package as part of this process.

## Publish a preview

1. Run `git checkout -b BRANCH-NAME` to check out a new branch you want to preview, or `git checkout BRANCH-NAME` to check out an existing branch.

2. Make any required changes and commit them.

3. Run `nvm use` to make sure you’re using the right version of Node.js and npm.

4. Run `npm ci` to make sure you have the exact dependencies installed.

5. Run `npm run preview` to create and push a new branch that contains your changes. This process may take a few moments and will display a `Success!` message.

## Preview your changes

1. If you need to update an existing project to use the preview, copy the command that displays after the `Success!` message.

2. Navigate to the project in the command line and run the success notification command. Running this command makes the project point to the preview branch, instead of to the published [GOV.UK Frontend npm package](https://www.npmjs.com/package/govuk-frontend). You can now preview your trial changes to GOV.UK Frontend.

## Update a preview

1. Check out the Git branch you previously previewed (this is the branch you work on, not the branch the script created).

2. Make the required changes and commit them.

3. Follow steps 3-5 in [Publish a preview](#publish-a-preview).

4. Follow the steps in [Preview your changes](#preview-your-changes).
