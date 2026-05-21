# Publishing a new version of GOV.UK Frontend

Read the documentation on [what to do before publishing a release](/docs/releasing/before-publishing-a-release.md) to make sure you’re prepared to publish.

All releases and pre-releases are public, but we distinguish between:

- `internal` pre-releases aimed at internal users
- `beta` pre-releases aimed at external users

See the [documentation on support branches](https://team-playbook.design-system.service.gov.uk/guides/version-control/support-branches/#support-branches) if you need to:

- publish a new release of previous major versions of GOV.UK Frontend
- release fixes that cannot wait until the next planned release of GOV.UK Frontend without including other unreleased changes on the `main` branch

Developers must pair on releases, so do not publish on your own. You should create a calendar event for the release so other team members can also be present.

## Build the release

1. Before running the build release workflow, make sure the [changelog](/CHANGELOG.md) is up to date with the latest release notes under the **Unreleased** heading - if it is not up to date, update it in a separate pull request before proceeding.

2. Open the [**Actions** tab](https://github.com/alphagov/govuk-frontend/actions) on the `alphagov/govuk-frontend` repo.

3. Select the [RELEASE: Build release workflow](https://github.com/alphagov/govuk-frontend/actions/workflows/build-release.yml) and run the workflow:
   1. Set the **Use workflow from** select field to `main` or the `support/*` branch you're releasing from.
   2. Set the **Release Type** select field to the version change, for example `major`.
   3. For pre-releases, set the **Prerelease label** input field, for example `beta`.
   4. Select **Run workflow**.

4. Ask a second developer to review the pull request, checking that the version numbers are correct and that the compiled assets are using this version number.

5. Once a reviewer approves the pull request, merge it.

## Publish a release to npm

1. Once you’ve merged the release pull request, open the **Actions** tab on the `alphagov/govuk-frontend` repo.

2. Select the [RELEASE: npm publish workflow](https://github.com/alphagov/govuk-frontend/actions/workflows/publish-to-npm.yaml) and run the workflow:
   1. Set the **Use workflow from** select field to `main` or the `support/*` branch you're releasing from.
   2. Set the **Environment** select field to `production`.
   3. Select **Run workflow**.

3. Ask a second developer to [review and approve the workflow run](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/review-deployments) - this will build the release and generate a pull request to review the new build.

4. Verify the presence of the release and its tag on [npm](https://www.npmjs.com/package/govuk-frontend?activeTab=versions) - refresh npm if you do not see the published release there once the Action is complete.

5. Compare the diff of the new package with the previous one:

   ```txt
   https://npmdiff.dev/govuk-frontend/<PREVIOUS_VERSION_NUMBER>/<RELEASED_VERSION_NUMBER>
   ```

## Create a release on GitHub

1. Open the [RELEASE: GitHub release workflow](https://github.com/alphagov/govuk-frontend/actions/workflows/publish-release-to-github.yaml) and run the workflow:
   1. Set the **Use workflow from** select field to `main` or the `support/*` branch you're releasing from.
   2. Set the **Environment** select field to `production`.
   3. Select **Run workflow**.

   This will generate a GitHub tag and release. If the workflow fails after creating a tag, or after creating a release, you'll need to manually delete these using [the GitHub tags UI](https://github.com/alphagov/govuk-frontend/tags) before running the workflow again.

2. [Verify the release](https://github.com/alphagov/govuk-frontend/releases) and check that its description looks correct and its assets include a zip file named "release-[release version].zip".

If you're publishing a pre-release, make sure the pre-release label is set correctly on the release page.

Once you’ve published the release, read the documentation on [what to do after publishing a release](/docs/releasing/after-publishing-a-release.md).
