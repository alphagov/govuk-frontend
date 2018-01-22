# Publishing components

We are using [lerna.js](https://lernajs.io/) to manage our packages and publish
to npm.

Lerna is a tool that optimizes the workflow around managing multi-package
repositories with git and npm.

It manages dependencies between our components so that if the version number of
`globals` is bumped, all components dependent on `globals` will also have their
version bumped.

### Publishing components manually (while in Alpha/Private beta)

In a new branch that is up to date with the master branch:

1. Update `CHANGELOG` with the new version number and the changes made.

2. Run the `npm run build:packages` task. This copies any changes from
`src/components/component-name` to `packages/component-name`.

3. In Frontend, for any new components inside `/packages`, add a `package.json` inside `packages/component-name`:
```
{
    "name": "@govuk-frontend/component-name",
    "version": "0.0.21-alpha",
    "dependencies": {
      "@govuk-frontend/globals": "version-number"
    }
}
```
 - Here, the version number must be completed for new components (leaving it blank throws an error when running `lerna bootstrap`). Use the new version number of component. (Lerna will ask you to enter the new version number again as part of `lerna publish` in step 11 so you'll effectively be "updating" to the same version number - this part of the publishing process needs some work.)
 - Include any dependencies, such as the `icons` package, that the new component requires. Use the current version number of any packages that you include here, Lerna will update the version number if necessary as part of `lerna publish`.

4. Include new components in `packages/all/package.json` with blank version numbers. Do not update the version numbers of existing packages manually here, Lerna will do this as part of `lerna publish`.

5. Commit changes made so far
```
git add packages/* -f
git commit -m "chore(packages): copy changes to packages"
```

6. Ensure that the new packages work correctly by doing the following in the
Design System:
  - Delete `node_modules/@govuk-frontend`
  - Run `ln -s ~/[Your code folder]/govuk-frontend/packages @govuk-frontend`
  inside `node_modules` to temporarily link the package styles.
  - Run `npm start` and verify the site is rendering correctly with the new
  packages. Note: You might need to fix issues caused by breaking changes in the
  new packages before you can run `npm start`.
  - To undo the linking, in `node_modules` run:
```
unlink @govuk-frontend
```
and reset `package-lock.json` (if it changed as result of linking to the new
packages) and then run `npm install`.
  - ** Important ** : Don't run `npm install` in the Design System before you have unlinked the symlink; linking the directories effectively permits changes made in the Design System to take effect in `govuk-frontend`.
  - Note: * This process only verifies that the current packages work, it doesn't
  mean that all of the changes have been copied. *

7. At this point, run `git status` to make sure no changes have been introduced
since the commit in step 5. (Any contents of the `packages` folder will get pushed to npm in step 11.)

8. In the console, log in to npm as user who has permission to publish to the `govuk-frontend` scope. You can use `npm whoami` to check your current user.

9. Run
```
lerna bootstrap
```
You should see `lerna success Bootstrapped [number of] packages`. This will
install all package dependencies and link any cross-dependencies.

10. Run
```
lerna updated
```
This will display the packages that have changed.

11. Run
```
lerna publish -m "chore(release): update packages and publish"
```
Here, Lerna will prompt you to select the new version for each package. If you
select `minor`/`major` etc., Lerna will complete the version number for you. In
private beta, we have selected `custom` and specified the new version number
manually for each package (see below). Also see step 3 regarding the versioning of new components:
![Select version in Lerna](./img/lerna-select-version.png)

12. Once you have updated all the package versions, confirm you want to publish
the changes (see below).
![Confirm publishing of changes in Lerna](./img/lerna-confirm-publish.png)

13. If your changes included new packages, you need to grant npm test user access to them:
```
npm access grant read-only govuk-frontend:test @govuk-frontend/warning-text
```
Note: If you rename a package as part of the release, npm will consider it to be
a new package. You will need to grant test user access to the new package.

14. OPTIONAL: Login at `https://www.npmjs/login` as the test user to check which packages the user has now access to.

15. To test the packages have published correctly, in console login as the test user. In the Design System, run `npm install` and then `npm start`. Check that the changes have taken effect.

16. Update `dist` folder with the latest versions
```
npm run build:dist
```
```
git add dist/*
git commit -m "chore(dist): update dist to version x.x.x-alpha"
git push --tags
```
Note: Specifying `--tags` here will push the release tags to origin.

12. Open a PR for these changes.

## Updating other repos that consume `govuk-frontend`

If you need to update `govuk-frontend` to the latest release on another repo that consumes it, make sure you are logged in as the npm test user to ensure that the permissions of `govuk-frontend` packages have been correctly set.

You can use `npm whoami` to check your current user.
