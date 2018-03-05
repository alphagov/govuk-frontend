# Publishing components

We are using [lerna.js](https://lernajs.io/) to manage our packages and publish
to npm.

Lerna is a tool that optimizes the workflow around managing multi-package
repositories with git and npm.

It manages dependencies between our components so that if the version number of
`globals` is bumped, all components dependent on `globals` will also have their
version bumped.

### Publishing components manually (while in Alpha/Private beta)

*First time only: Shell scripts will require permission to run.
Run `chmod u+x **/*.sh` which will give the permission to all shell
scripts in the current directory.*

1. Create a new branch that's up to date with master and:

2. Update `CHANGELOG` version heading with the next version number.

3. Run `npm run pre-release` task.
  This will:
  - run `npm build:packages` that copies any changes from`src/component-name` to `packages/component-name` and runs `after-build-packages.test.js` test 
  to ensure the contents of `packages` matches `src`.


If you have a new component was added to `src` and copied over to `packages` in the above task, then then script will detect those components, notify the developer, create a sample `package.json` file for each.

It will reminnd the developer to check the version number, dependencies and add new components to `all/package.json` dependencies.

It will also prompt the develoeper to signal to the scipt once changes have been made, so that the rest of the `npm run pre-release` tasks can run.**
![New component added](./img/new-component-prompt.png)


  - run `lerna publish --skip-git --skip-npm` which will check for updated packages and
  suggest a version for each as seen below.
  Lerna will prompt you to select the new version for each package. If you
  select `minor`/`major` etc., Lerna will complete the version number for you. In
  private beta, we have selected `custom` and specified the new version number
  manually for each package (see below). Also see step 3 regarding the versioning
  of new components:
  ![Select version in Lerna](./img/lerna-select-version.png)
  Once you confirm changes, all files are automatically added and commited with 
  the commit message `Release <version number>` and pushed to origin.
  ![Confirm publishing of changes in Lerna](./img/lerna-confirm-publish.png)

  - run `npm build:dist` that copies any changes from`src/component-name` to `dist/components/component-name` and runs `after-build-dist.test.js` test 
    to ensure the contents of `dist/componenents` matches `src`. 
    It compiles and minifies CSS and JavaScript and applies version number 
    (taken from `all/package.json` file), e.g `govuk-frontend-<version>-alpha.min`.
    Finally it copies all icons from the `src/icons`.

4. Create a pull request for these changes. When reviewing the PR check version of compile assets and check release notes for the changes made.

5. Once the pull request is approved, merge to **master** and run `npm run release` in **master**. 

  This will:
  - check if you're logged in to NPM as the correct user. If not, it will abort.
  - run `npm publish` for each package if the package hasn't been published yet
    (check that the currect version matches the version on NPM)
  - run `git tag v<version>` to create a new tag if current git tag doesn't match latest published tag 
  - push the tag to remote with `git push --tags`
  - create a zip file of the `dist` directory with
    `git archive -o ./release-<version>.zip HEAD:dist`

6. Create a release in Github interface, ddd release notes to and attach the ZIP. 

7. Add Trello cards to "This Sprint" column for
  - updating GOV.UK Design System to use the latest releasex
  - updating the Prototype Kit to use the latest release 

```
#### Test published packages

1. To test the packages have published correctly, in console login as the test
user. In the Design System, run `npm install` and then `npm start`. Check that
the changes have taken effect.

## Updating other repos that consume `govuk-frontend`

If you need to update `govuk-frontend` to the latest release on another repo
that consumes it, make sure you are logged in as the npm test user to ensure that
the permissions of `govuk-frontend` packages have been correctly set.

You can use `npm whoami` to check your current user.
