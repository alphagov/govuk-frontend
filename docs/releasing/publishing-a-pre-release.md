# Publish pre-release of GOV.UK Frontend

This pre-release guidance is aimed at Design System team members. If you're an external contributor who needs to create a pre-release, please [contact the Design System team](https://design-system.service.gov.uk/get-in-touch/) and we'll do it for you.

Before you publish a pre-release, you need to have committed a code change to GOV.UK Frontend. Then follow these instructions.

Use pre-releases when you:
- [work on developing a component or pattern](https://design-system.service.gov.uk/community/develop-a-component-or-pattern/) for the GOV.UK Design System
- want to trial an experimental feature (guidance on trialling experimental features is in development)

> :warning:Your projects should never depend on a pre-released GOV.UK Frontend package. This is because someone could remove the GitHub branch containing the pre-release package at any time. For this reason, never use a pre-released package in a production setting.

## What happens when you pre-release GOV.UK Frontend

When you pre-release GOV.UK Frontend, this creates a GitHub branch. This branch contains the GOV.UK Frontend `/package` directory with your trial changes.

Projects can point to this branch in their package.json, instead of to the published [GOV.UK Frontend npm package](https://www.npmjs.com/package/govuk-frontend). No changes are published to the GOV.UK Frontend npm package as part of this process.

## Publish a pre-release

1. Run `git checkout -b BRANCH-NAME` to check out a new branch you want to pre-release, or `git checkout BRANCH-NAME` to check out an existing branch.

2. Make any required changes and commit them.

3. Run `nvm use` to make sure you’re using the right version of Node.js and npm.

4. Run `npm ci` to make sure you have the correct dependencies installed.

5. Run `npm run pre-release` to create and push a new branch that contains your changes. This process may take a few moments and will display a `Success!` message.

## Preview your changes

1. If you need to update an existing project to use the pre-release, copy the command that displays after the `Success!`message.

2. Navigate to the project in the command line and run the success notification command. Running this command makes the project point to the pre-release branch, instead of to the published [GOV.UK Frontend npm package](https://www.npmjs.com/package/govuk-frontend). You can now preview your trial changes to GOV.UK Frontend.

## Update a pre-release

1. Check out the Git branch you previously pre-released (this is the branch you work on, not the branch the script created).

2. Make the required changes and commit them.

3. Follow steps 3-5 in [Publish a pre-release](#publish-a-pre-release).

4. Follow the steps in [Preview your changes](#preview-your-changes).
