# Before you publish a pre-release of GOV.UK Frontend

Decide the kind of pre-release you're publishing. All pre-releases are public, but we distinguish:

- `internal` pre-releases for internal use
- `beta` pre-releases aimed at external users

We'll use the kind of pre-release as [the pre-release identifier](https://docs.npmjs.com/cli/v8/commands/npm-version#preid) in the package version.

## If you're publishing a beta pre-release

Besides publishing the code itself, beta releases will likely involve
documentation updates linked to the code, as well as communications, similarly to an actual release.

Review the docs for [what to do before publishing a release](/docs/releasing/before-publishing-a-release.md) to assess which steps you need to follow for your specific pre-release and ensure you are prepared to publish.

See the [documentation on support branches](https://govuk-design-system-team-docs.netlify.app/how-we-work/version-control/support-branches.html#support-branches) if you need to publish a new pre-release of previous major versions of GOV.UK Frontend.

# Publish a new version of GOV.UK Frontend

Developers should pair on pre-releases. When remote working, it can be useful to be on a call together.

1. Check out the **main** branch and pull the latest changes.

2. Ensure you're running the version of NodeJS matching [`.nvmrc`](/.nvmrc).

   - If you use NVM, run `nvm use` to set up the right version
   - If you use another management system (like [`asdf`](https://asdf-vm.com/guide/getting-started.html)), compare the output of `node --version` and install the right one if necessary

3. Run `npm ci` to make sure you have the exact dependencies installed.

4. Determine the pre-release identifier

   - Use `internal` for internal pre-releases
   - Use `beta` for beta pre-releases

5. Determine the pre-release version type

   Given the `beta` pre-release identifier:

   - Use `premajor` to bump from `v4.7.0` to `v5.0.0-beta.0`
   - Use `preminor` to bump from `v4.7.0` to `v4.8.0-beta.0`
   - Use `prepatch` to bump from `v4.7.0` to `v4.7.1-beta.0`

   See the [versioning documentation](/docs/contributing/versioning.md) for more information.

   Alternatively, when publishing an update to an existing pre-release:

   - Use `prerelease` to bump from `v5.0.0-beta.0` to `v5.0.0-beta.1`
   - Use `prerelease` to move from `v5.0.0-internal.X` to `v5.0.0-beta.0`.
     Note that this resets the final number to `.0`, so prefer setting the version manually if a pre-release of the kind you're running has already gone through.

6. Apply the new pre-release version number by running:

   ```shell
   npm version <PRE-RELEASE TYPE> --preid <PRE-RELEASE IDENTIFIER> --no-git-tag-version --workspace govuk-frontend
   ```

   This step will update [`govuk-frontend`'s `package.json`](/packages/govuk-frontend/package.json) and project [`package-lock.json`](/package-lock.json) files.

   Do not commit the changes.

7. Create and check out a new branch (`release-[version-number]`)

   ```shell
   git switch -c "release-$(npm run version --silent --workspace govuk-frontend)"
   ```

8. If you're publishing a beta pre-release, update the [`CHANGELOG.md`](/CHANGELOG.md) by:

   - changing the 'Unreleased' heading to the new version number and release type. For example, '5.0.0-beta.0 (Pre-release)'
   - adding a new 'Unreleased' heading above the new version number and release type, so users will know where to add PRs to the changelog
   - saving your changes

9. Run `npm run build-release` to:

   - build GOV.UK Frontend into [the package's `/dist`](/packages/govuk-frontend/dist) and [root `/dist`](/dist) directories
   - commit the changes
   - push a branch to GitHub

   You will now be prompted to continue or cancel.

10. Create a pull request.
    When reviewing the PR, check that the version numbers have been updated and that the compiled assets use this version number.

11. Once a reviewer approves the pull request, merge it to **main**.

## Publish a release to npm

1. Check out the **main** branch and pull the latest changes.

2. Sign in to npm (`npm login`), using the credentials for the govuk-patterns-and-tools npm user from Bitwarden.

3. Run `npm run publish-release`, which will prompt you to check whether the npm tag looks as expected.

4. Enter `N` to continue to set the npm tag corresponding to the kind of release you're publishing:

   - `internal` for internal pre-releases
   - `next` for beta pre-releases

5. You will now be prompted to continue or cancel the release. Check the details and enter `y` to continue. If something does not look right, press `N` to cancel the release.

   This step will create a ZIP file containing the release in the root of your govuk-frontend git directory. You will need this file when creating the GitHub release.

   It will also automatically create a tag in Github which you can use to create a Github release in the following section.

6. Verify the presence of the pre-release and its tag on [npm](https://www.npmjs.com/package/govuk-frontend?activeTab=versions)

   If the pre-release has been assigned the wrong tag (mistakes happen),
   you can use [`npm dist-tag`](https://docs.npmjs.com/cli/v8/commands/npm-dist-tag) to quickly correct.

7. Run `npm logout` to log out from npm. If you've logged in through your browser, remember to log out from <https://npmjs.com> there as well.

## If publishing a beta pre-release, create a release on Github

You can view the tag created during step 10 of creating the new version in the [Github interface](https://github.com/alphagov/govuk-frontend/tags). To create a new Github release, do the following:

1. Select the latest tag
2. Press **Create release from tag**
3. Set 'GOV.UK Frontend v[version-number]' as the title
4. Add release notes from changelog
5. Attach the ZIP file that has been generated at the root of this project during the npm publishing phase
6. [Select "This is a pre-release"](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository) to mark the release as a pre-release
7. Publish release

# After you publish the new pre-release

If you're publishing a beta pre-release, read the docs for [what to do after publishing a release](/docs/releasing/after-publishing-a-release.md) and assess which parts may be relevant to your pre-release.
