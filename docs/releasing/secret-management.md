# Managing secrets

In order to build a `govuk-frontend` release and publish it, we make use of a fine-grained GitHub Personal Access Token and an `npm` granular access token.

These tokens expire at regular intervals and need to be replaced by new ones.

Whoever is leading the release should check these tokens. If they are due to expire within 31 days, they should be replaced.

All credentials are stored centrally by the Design System team - ask a team lead for access.

## Creating an npm access token

1. [Login to npm](https://www.npmjs.com) using the `govuk-patterns-and-tools` account
2. Click the profile picture in the top right and select "Access tokens" from the dropdown
3. Check the expiry date for the `github-action-publish-release` token

### If the token is due to expire within 31 days

1. Click "Generate New Token" and select "Granular Access Token"
2. Set its name to "github-action-publish-release"
3. Set its description to "This token is used by alphagov/govuk-frontend to publish releases to npm via GitHub Actions."
4. Set its expiration for 365 days
5. Under "Packages and scopes", give the token "Read and Write" access to the `govuk-frontend` package. Make sure you only give it access to the package, not the `@govuk-frontend` scope
6. Click "generate token" and copy the generated token
7. Go to the [govuk-frontend GitHub repo's secrets page](https://github.com/alphagov/govuk-frontend/settings/secrets/actions) and add the new token with the name `NPM_TOKEN`. You'll need to delete the previous token first

## Creating a GitHub Personal Access Token (PAT)

1. Login to GitHub using our machine account (`govuk-design-system-ci`)
2. Follow [steps 1 - 4](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token) to check the access tokens.
3. Check the existing `govuk-frontend-ci-build-release` token's expiry

### If the token is due to expire within 31 days

1. Click "generate new token"
2. Give the token a name: "govuk-frontend-ci-build-release"
3. Set the resource owner to `alphagov`
4. Set the expiration to 365 days
5. Set the description to "Allows the build release workflow to run on govuk-frontend"
6. Set Repository access to "only select repositories" and select `alphagov/govuk-frontend`
7. In Repository permissions, set `Contents: Read and Write`
8. In Repository permissions, set `Pull requests: Read and Write`
9. Click "generate token" and copy it
10. Go to the [govuk-frontend repo's secrets page](https://github.com/alphagov/govuk-frontend/settings/secrets/actions) and add the new token with the name `CI_PAT`. You'll need to delete the previous token first

## If the tokens are not set to expire within 31 days

You can [continue with the release process](/docs/releasing/publishing.md) if the tokens are up to date.
