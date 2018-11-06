# Publishing pre-release of GOV.UK Frontend

We use pre-releases when:
- We are working on a new contribution and want to see it in the Design System website
- We want to try an experimental feature as if it's pushed to npm.

This is done by pushing a release to a new branch which can be installed by npm.

1. Checkout the branch you want to pre-release and pull latest changes.

2. Run `nvm use` to ensure you are using the right version of Node.js and npm.

3. Run `npm install` to ensure you have the latest dependencies installed.

4. Run `npm run release-to-branch`.

There should now be a branch `pre-release-[your-branch-name-here]` pushed to remote, which you can install with:

```bash
npm install --save alphagov/govuk-frontend#pre-release-[your-branch-name-here]
```