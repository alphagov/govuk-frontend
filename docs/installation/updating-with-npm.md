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
'gov-uk frontend': ‘2.11.0’
````

## Update

You can check the [release
notes](https://github.com/alphagov/frontend/releases) in the GOV.UK Frontend Github repository to find out the latest version of GOV.UK Frontend.

You can update to any version.

You'll need to make code changes to make sure GOV.UK Frontend keeps working in your project, if you’re updating either:

- to a major version - for example you’re updating to 2.0.0
- past a major version - for example you’re updating from 1.2.0 to 2.3.0

A version is major ('breaking') if there's a 'Breaking changes' section in that version's release notes.

To update to the most recent version, run:

```shell
npm install govuk-frontend@latest
```

If you want to install a specific version, replace `@latest` with the version that you want to update to. For example `2.13.0`.
