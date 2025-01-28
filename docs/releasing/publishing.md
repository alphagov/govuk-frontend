# Before you publish GOV.UK Frontend

Read the docs for [what to do before publishing a release](/docs/releasing/before-publishing-a-release.md) to ensure you are prepared to publish.

See the [documentation on support branches](https://team-playbook.design-system.service.gov.uk/guides/version-control/support-branches/#support-branches) if you need to:

- publish a new release of previous major versions of GOV.UK Frontend
- publish a ‘hotfix’ release of GOV.UK Frontend without including other unreleased changes on the `main` branch

# Publish a new version of GOV.UK Frontend

Developers should pair on releases. When remote working, it can be useful to be on a call together.

## Build the release

1. Before running the build release workflow, make sure that the [`CHANGELOG`](/CHANGELOG.md) is up to date with the latest release notes under the 'Unreleased' heading. If it isn't, do so in a separate pull request before proceeding.

2. Open the actions tab on the `alphagov/govuk-frontend` repo.

3. Select the ["RELEASE: Build release" workflow](https://github.com/alphagov/govuk-frontend/actions/workflows/build-release.yml), provide the new version of GOV.UK Frontend you are releasing and run the workflow on the `main` branch. This will build the release and generate a pull request to review the new build.

4. When reviewing the PR, check that the version numbers have been updated and that the compiled assets use this version number.

5. Once a reviewer approves the pull request, merge it to **main**.

## Publish a release to npm

1. Once the release pull request has been merged, open the Actions tab on the `alphagov/govuk-frontend` repo.

2. Select the ["RELEASE: Publish to npm" workflow](https://github.com/alphagov/govuk-frontend/actions/workflows/publish-to-npm.yaml) and run the workflow on the `main` branch. This will publish the release to npm.

3. Verify the presence of the release and its tag on [npm](https://www.npmjs.com/package/govuk-frontend?activeTab=versions)

4. Have a quick look at the diff of the new package with the previous one at:

   ```txt
   https://npmdiff.dev/govuk-frontend/<PREVIOUS_VERSION_NUMBER>/<RELEASED_VERSION_NUMBER>
   ```

## Create a release on Github

To create a new GitHub release, do the following:

1. Select the tag corresponding to the release in [the list of tags on GitHub](https://github.com/alphagov/govuk-frontend/tags)
2. Press **Create release from tag**
3. Set 'GOV.UK Frontend v[version]' as the title
4. Add release notes from [`CHANGELOG.md`](/CHANGELOG.md)
5. Attach as release binary the ZIP file that has been generated at the root of this project during the npm publishing phase
6. Publish release

# After you publish the new release

Read the docs for [what to do after publishing a release](/docs/releasing/after-publishing-a-release.md).
