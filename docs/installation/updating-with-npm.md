# Updating GOV.UK Frontend with node package manager (NPM)

Follow these instructions if you have previously installed the GOV.UK Frontend npm package following the [installation instructions](https://github.com/alphagov/govuk-frontend/blob/master/docs/installation/installing-with-npm.md#requirements), and want to update to a more recent version.

## Steps to update

### 1. Find out changes introduced in recent versions.

To do this, view `package.json` at the root of your project to find out the version of govuk-frontend that your app is currently running, for instance "2.11.0". See [example](https://github.com/alphagov/govuk-design-system/blob/master/package.json#L34) for where this information lives in GOV.UK Design System.

Review [Release notes](https://github.com/alphagov/govuk-frontend/releases) to see what changes were introduced since this version was released.

### 2. Choose the version to update to.

You can update to the latest release, or to an earlier version.

If you update to the last non-breaking version of GOV.UK Frontend, you shouldn't need to make any changes to your app. If you update to a breaking release, you might need to make changes to your app to make it work correctly with GOV.UK Frontend. [Release notes](https://github.com/alphagov/govuk-frontend/releases) will have information in the "Breaking changes" section of that release about the changes you might need to make.

### 3. Update the version

Run

```
npm install govuk-frontend@2.13.0
```

where 2.13.0 is the version you require.

## Find out about new releases

You can watch [govuk-frontend](https://github.com/alphagov/govuk-frontend) for "Releases only" to get notified of new releases.
