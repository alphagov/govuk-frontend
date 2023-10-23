# Publishing a pre-release of GOV.UK Frontend

This pre-release guidance is aimed at Design System team members. If you're an external contributor who needs to create a pre-release, please [contact the Design System team](https://design-system.service.gov.uk/get-in-touch/) and we'll do it for you.

Before you publish a pre-release, you need to have committed a code change to GOV.UK Frontend. Then follow these instructions.

Use pre-releases when you:

- [work on developing a component or pattern](https://design-system.service.gov.uk/community/develop-a-component-or-pattern/) for the GOV.UK Design System
- want to trial an experimental feature (guidance on trialing experimental features is in development)

> **Warning** Never use a pre-release GOV.UK Frontend package in a production setting.

## What happens when you pre-release GOV.UK Frontend

When you pre-release GOV.UK Frontend, this publishes a package to npm with the `@beta` tag. This package contains the GOV.UK Frontend [`/packages/govuk-frontend`](/packages/govuk-frontend) directory with your trial changes.

Projects can install `govuk-frontend@beta` in their package.json alongside other [GOV.UK Frontend npm package](https://www.npmjs.com/package/govuk-frontend) releases.

## Publish a pre-release

1. Run `git checkout -b BRANCH-NAME` to check out a new branch you want to pre-release, or `git checkout BRANCH-NAME` to check out an existing branch.

2. Make any required changes and commit them.

3. Run `nvm use` to make sure you’re using the right version of Node.js and npm.

4. Run `npm ci` to make sure you have the exact dependencies installed.

5. Determine the pre-release npm tag

   All pre-releases are public:

   - Use `internal` for internal use
   - Use `beta` for wider testing

6. Determine the pre-release version type

   Given the `beta` npm tag:

   - Use `premajor` to bump from `v4.7.0` to `v5.0.0-beta.0`
   - Use `preminor` to bump from `v4.7.0` to `v4.8.0-beta.0`
   - Use `prepatch` to bump from `v4.7.0` to `v4.7.1-beta.0`

   Alternatively, when publishing an update to an existing pre-release:

   - Use `prerelease` to bump from `v5.0.0-beta.0` to `v5.0.0-beta.1`

7. Apply the new pre-release version number by running:

   ```shell
   npm version <PRE-RELEASE TYPE> --preid <PRE-RELEASE TAG> --no-git-tag-version --workspace govuk-frontend
   ```

   This step will update the [`package.json`](/package.json) and project [`package-lock.json`](/package-lock.json) files.

   Do not commit the changes.

8. Run `npm run pre-release` to create and push a new branch that contains your changes. This process may take a few moments and will display a `Success!` message.

## Preview your changes

1. If you need to update an existing project to use the pre-release, copy the command that displays after the `Success!` message.

2. Navigate to the project in the command line and run the success notification command. Running this command makes the project point to the pre-release branch, instead of to the published [GOV.UK Frontend npm package](https://www.npmjs.com/package/govuk-frontend). You can now preview your trial changes to GOV.UK Frontend.
