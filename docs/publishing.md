## Publishing components

We are using [lerna.js](https://lernajs.io/) to manage our packages and publish to npm.

Lerna is a tool that optimizes the workflow around managing multi-package repositories with git and npm.

It manages dependencies between our components so that if the version number of `globals` is bumped, all components dependent on `globals` will also have their version bumped.

### Publishing components manually (while in Alpha/Private beta)

In a new branch that is up to date with the master branch:

1. Update `CHANGELOG` with the new version number and the changes made.

2. Run the `npm run build:packages` task. This copies any changes from `src/components/component-name` to `packages/component-name`.

3. Ensure that the new packages work correctly by doing the following in the Design System:
  - Delete `node-modules/@govuk-frontend`
  - Run `ln -s ~/[Your code folder]/govuk-frontend/packages @govuk-frontend` inside `node-modules` to temporarily link the package styles.
  - Run `npm start` and verify the site is rendering correctly with the new packages. Note: You might need to fix issues caused by breaking changes in the new packages before you can run `npm start`.
  - To undo the linking, just delete the new symlink for `@govuk-frontend` inside `node_modules` and run `npm install`
  - Note: * This process only verifies that the current packages work, it doesn't mean that all of the changes have been copied. *

4. In Frontend, for any new components inside `/packages`, add a `package.json` inside `packages/component-name`:
```
{
    "name": "@govuk-frontend/component-name",
    "version": "",
    "dependencies": {
      "@govuk-frontend/globals": "version-number"
    }
}
```
Here, leave the version number blank to allow Lerna to complete it as part of `lerna publish`. Include any dependencies, such as the `icons` package, that the new component requires. Use the current version number of any packages that you include here, Lerna will update the version number if necessary as part of `lerna publish`.

5. Include new components in `packages/all/package.json` with blank version numbers. Do not update the version numbers of existing packages manually here, Lerna will do this as part of `lerna publish`.

6. In the console, log in to `npm` as user who has permission to publish to the `govuk-frontend` scope. You can use `npm whoami` to check your current user.

7. Run
```
lerna bootstrap
```
You should see `lerna success Bootstrapped [number of] packages`. This will install all package dependencies and link any cross-dependencies.

8. Run
```
lerna updated
```
This will display the packages that have changed.

9. Run
```
lerna publish -m "chore(release): update packages and publish"
```
Here, Lerna will prompt you to select the new version for each package. If you select
`minor`/`major` etc., Lerna will complete the version number for you. In private beta, we have selected `custom` and specified the new version number manually for each package
(see below):
![Select version in Lerna](./img/lerna-select-version.png)

10. Once you have updated all the package versions, confirm you want to publish the changes (see below).
![Confirm publishing of changes in Lerna](./img/lerna-confirm-publish.png)

11. If your changes included new packages, you need to grant the test user access to them:
```
npm access grant read-only govuk-frontend:test @govuk-frontend/button`
```
If you removed any packages, revoke the test user's access to them:
```
npm access revoke govuk-frontend:test @govuk-frontend/button`
```
Note: If you rename a package as part of the release, npm will consider it to be a new package. You will need to grant test user access to the new package and revoke access to the old package.

12. Commit the changes to the updated packages
```
git add packages/*
git commit -m "chore(packages): copy changes to packages"
git push --set-upstream origin [branch name] --tags
```
Note: Specifying `--tags` here will push the release tags to origin.

12. Open a PR for these changes.


Once the PR has been merged into master, in a new branch that is up to date with the master:

1. Update `dist` folder with the latest versions
```
npm run build:dist
```
```
git add dist/*
git commit -m "chore(dist): update dist to version x.x.x-alpha"
```

2. Open a pull request for these changes.
