# Updating GOV.UK Frontend with node package manager (NPM)

You can update with node package manager (NPM) if you [originally installed
GOV.UK Frontend with NPM](https://github.com/alphagov/govuk-frontend/blob/master/docs/installation/installing-with-npm.md#requirements).

## Find out which version you're using

You can find out which version of GOV.UK Frontend your project is using with:

```shell
npm list govuk-frontend
```

If you do not have command line access, you can see the version number in the
`package.json` file in the root of your project directory. For example:

```json
'gov-uk frontend': ‘2.11.0’
````

## Update

You can check the [release
notes](https://github.com/alphagov/frontend/releases) in the GOV.UK Frontend Github repository to find out the latest version of GOV.UK Frontend.

You can update to any version.

You'll need to progressively update to each version following your current
version. You will not need to make code changes for GOV.UK Frontend to keep working in
your project, unless the release note for the version has a ‘Breaking changes’
section.

To update, run:

```shell
npm install govuk-frontend@2.13.0
```

Replace `2.13.0` with the version you want to update to.
