# Before you publish GOV.UK Frontend

Read the docs for [what to do before publishing a release](/docs/releasing/before-publishing-a-release.md) to ensure you are prepared to publish.

# Publish a new version of GOV.UK Frontend

Developers should pair on releases. When remote working, it can be useful to be on a call together.

1. Check out the **main** branch and pull the latest changes.

2. Run `nvm use` to make sure you're using the right version of Node.js and npm.

3. Run `npm install` to make sure you have the latest dependencies installed.

4. Create and check out a new branch (`release-[version-number]`). See the [versioning documentation](/docs/contributing/versioning.md) for more information.

5. Update the [`CHANGELOG.md`](../../CHANGELOG.md) by:

- changing the 'Unreleased' heading to the new version-number and release-type - for example, '3.11.0 (Feature release)'
- adding a new 'Unreleased' heading above the new version-number and release-type, so users will know where to add PRs to the changelog

6. Update [`package/package.json`](../../package/package.json) version with the new version-number.

7. Save the changes. Do not commit.

8. Run `npm run build-release` to:

- build GOV.UK Frontend into the `/package` and `/dist` directories
- commit the changes
- push a branch to GitHub

  You will now be prompted to continue or cancel.

9. Create a pull request and copy the changelog text.
   When reviewing the PR, check that the version-numbers have been updated and that the compiled assets use this version-number.

10. Once a reviewer approves the pull request, merge it to **main**.

## Publish a release to npm

1. Check out the **main** branch and pull the latest changes.

2. Sign in to npm (`npm login`), using the credentials for the govuk-patterns-and-tools npm user from Bitwarden.

3. Run `npm run publish-release`, which will prompt you to check whether the npm tag looks as expected.

If you're following these instructions, you're probably doing a sequential release, meaning
the tag should be 'latest'.

4. Enter `y` to continue. If you think the tag should be different, enter `N` to have the option to set your own npm tag.

5. You will now be prompted to continue or cancel the release. Check the details and enter `y` to continue. If something does not look right, press `N` to cancel the release.

This step will create a ZIP file containing the release in the root of your govuk-frontend git directory. You will need this file when creating the GitHub release.

It will also automatically create a tag in Github which you can use to create a Github release in the following section.

6. Run `npm logout` to log out from npm.

## Create a release on Github

You can view the tag created during step 10 of creating the new version in the [Github interface](https://github.com/alphagov/govuk-frontend/tags). To create a new Github release, do the following:

1. Select the latest tag
2. Press **Create release from tag**
3. Set 'GOV.UK Frontend v[version-number]' as the title
4. Add release notes from changelog
5. Attach the ZIP file that has been generated at the root of this project during the npm publishing phase
6. Publish release

# After you publish the new release

Read the docs for [what to do after publishing a release](/docs/releasing/after-publishing-a-release.md).
