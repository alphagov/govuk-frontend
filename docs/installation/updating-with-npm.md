# Updating GOV.UK Frontend using node package manager (NPM)

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
'govuk-frontend': ‘2.11.0’
```

## Update

You can check the [release
notes](https://github.com/alphagov/govuk-frontend/releases) in the GOV.UK Frontend GitHub repository to find out the latest version of GOV.UK Frontend.

You may need to make code changes to keep GOV.UK Frontend working in your project, if the major version number will change when you update. The major version number is the first digit in the version number.

To update to the most recent version, run:

```shell
npm install govuk-frontend@latest
```

If you want to install an earlier version, replace `latest` with the version that you want to update to. For example `2.13.0`.
